import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import r2wc from "@r2wc/react-to-web-component";
import App from "./App";
import "./api/registerResponse";
import indexStyle from "./index.css?inline";
import { Sparkles } from "lucide-react";

/* =====================================================
   TIPAGEM GLOBAL
===================================================== */
declare global {
  interface Window {
    RecapPoli: {
      open: (options?: { customerId?: number; userId?: number }) => void;
      close: () => void;
      toggle: () => void;
    };
  }
}

/* =====================================================
   COMPONENTE DO WIDGET
===================================================== */
const Widget = ({
  "customer-id": customerId,
  "user-id": userId,
}: {
  "customer-id"?: string;
  "user-id"?: string;
}) => {
  const parsedCustomerId = customerId ? parseInt(customerId) : undefined;
  const parsedUserId = userId ? parseInt(userId) : undefined;

  const [isOpen, setIsOpen] = useState(false);

  /* =====================================================
     EVENTOS DE CONTROLE
  ===================================================== */
  useEffect(() => {
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    window.addEventListener("RECAP_POLI_OPENED", open);
    window.addEventListener("RECAP_POLI_CLOSE", close);

    return () => {
      window.removeEventListener("RECAP_POLI_OPENED", open);
      window.removeEventListener("RECAP_POLI_CLOSE", close);
    };
  }, []);

  /* =====================================================
     BACKDROP (FORA DO SHADOW DOM)
  ===================================================== */
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
          onClick={() =>
            window.dispatchEvent(new Event("RECAP_POLI_CLOSE"))
          }
        />,
        document.body
      )
    : null;

  return (
    <>
      <style>{indexStyle}</style>
      {backdrop}

      {/* ================= OVERLAY ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden bg-background animate-in zoom-in duration-300">
            <App id={parsedCustomerId} userId={parsedUserId} />
          </div>
        </div>
      )}

      {/* ================= ÍCONE (SEMPRE VISÍVEL) ================= */}
      {!isOpen && (
        <button
          onClick={() =>
            window.dispatchEvent(
              new Event("RECAP_POLI_REQUEST_OPEN")
            )
          }
          aria-label="Abrir retrospectiva"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9998,
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
            boxShadow:
              "0 10px 25px rgba(59,130,246,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Badge vermelho */}
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "10px",
              height: "10px",
              backgroundColor: "#ef4444",
              borderRadius: "50%",
            }}
          />

          <Sparkles size={28} color="#fff" />
        </button>
      )}
    </>
  );
};

/* =====================================================
   WEB COMPONENT
===================================================== */
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

/* =====================================================
   API GLOBAL (MANTIDA)
===================================================== */
window.RecapPoli = {
  open: (options) => {
    let widget = document.querySelector("recap-poli-widget");

    if (!widget) {
      widget = document.createElement("recap-poli-widget");
      document.body.appendChild(widget);
    }

    if (options?.customerId) {
      widget.setAttribute(
        "customer-id",
        options.customerId.toString()
      );
    }

    if (options?.userId) {
      widget.setAttribute(
        "user-id",
        options.userId.toString()
      );
    }

    window.dispatchEvent(new Event("RECAP_POLI_REQUEST_OPEN"));
  },

  close: () => {
    window.dispatchEvent(new Event("RECAP_POLI_CLOSE"));
  },

  toggle: () => {
    window.dispatchEvent(new Event("RECAP_POLI_REQUEST_OPEN"));
  },
};
