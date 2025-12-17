import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import r2wc from "@r2wc/react-to-web-component";
import App from "./App";
import "./api/registerResponse";
import indexStyle from "./index.css?inline";

declare global {
  interface Window {
    RecapPoli: {
      open: (options?: { customerId?: number; userId?: number }) => void;
      close: () => void;
      toggle: () => void;
    };
  }
}

const Widget = ({
  "customer-id": customerId,
  "user-id": userId,
}: {
  "customer-id"?: string;
  "user-id"?: string;
}) => {
  const parsedCustomerId = customerId ? Number(customerId) : undefined;
  const parsedUserId = userId ? Number(userId) : undefined;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener("RECAP_POLI_OPENED", () => {
      console.log("RECAP_POLI_OPENED");
      handleOpen();
    });
    window.addEventListener("RECAP_POLI_CLOSE", () => {
      console.log("RECAP_POLI_CLOSE");
      handleClose();
    });

    return () => {
      window.removeEventListener("RECAP_POLI_OPENED", handleOpen);
      window.removeEventListener("RECAP_POLI_CLOSE", handleClose);
    };
  }, []);


  const backdrop = isOpen
    ? createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />,
        document.body,
      )
    : null;

  return (
    <>
      <style>{indexStyle}</style>

      {backdrop}

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto relative w-full max-w-3xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden">
            <App id={parsedCustomerId} userId={parsedUserId} />
          </div>
        </div>
      )}
    </>
  );
};

const WebComponent = r2wc(Widget, {
  shadow: "open",
  props: {
    "customer-id": "string",
    "user-id": "string",
  },
});

if (!customElements.get("recap-poli-widget")) {
  customElements.define("recap-poli-widget", WebComponent);
}

/* ===================== API GLOBAL ===================== */

window.RecapPoli = {
  open: (options) => {
    let widget = document.querySelector("recap-poli-widget");

    if (!widget) {
      widget = document.createElement("recap-poli-widget");
      document.body.appendChild(widget);
    }

    if (options?.customerId)
      widget.setAttribute("customer-id", options.customerId.toString());

    if (options?.userId)
      widget.setAttribute("user-id", options.userId.toString());

    window.dispatchEvent(
      new CustomEvent("RECAP_POLI_REQUEST_OPEN", {
        detail: { auto: false },
      }),
    );
  },

  close: () => {
    window.dispatchEvent(new Event("RECAP_POLI_CLOSE"));
  },

  toggle: () => {
    window.dispatchEvent(
      new CustomEvent("RECAP_POLI_REQUEST_OPEN", {
        detail: { auto: false },
      }),
    );
  },
};

/* ===================== AUTO OPEN NA CARGA ===================== */

document.addEventListener("DOMContentLoaded", () => {
  window.dispatchEvent(
    new CustomEvent("RECAP_POLI_REQUEST_OPEN", {
      detail: { auto: true },
    }),
  );
});
