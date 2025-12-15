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
    __RECAP_POLI_BLOCKED__?: boolean;
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
  const [isBlocked, setIsBlocked] = useState(
    window.__RECAP_POLI_BLOCKED__ === true
  );

  /* =====================================================
     LISTENERS DE CONTROLE
  ===================================================== */
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleBlocked = () => setIsBlocked(true);

    window.addEventListener("RECAP_POLI_OPENED", handleOpen);
    window.addEventListener("RECAP_POLI_CLOSE", handleClose);
    window.addEventListener("RECAP_POLI_BLOCKED", handleBlocked);

    return () => {
      window.removeEventListener("RECAP_POLI_OPENED", handleOpen);
      window.removeEventListener("RECAP_POLI_CLOSE", handleClose);
      window.removeEventListener("RECAP_POLI_BLOCKED", handleBlocked);
    };
  }, []);

  /* =====================================================
     SE BLOQUEADO, NÃO RENDERIZA NADA
  ===================================================== */
  if (isBlocked) return null;

  /* =====================================================
     BACKDROP FORA DO SHADOW DOM
  ===================================================== */
  const backdropElement = isOpen
    ? createPortal(
        <div
          style={{
            position: "fixed",
            inset: "0",
            zIndex: "9998",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={() => setIsOpen(false)}
        />,
        document.body
      )
    : null;

  return (
    <>
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style>{indexStyle}</style>

      {backdropElement}

      <div className="antialiased font-sans">
        {/* ===================== OVERLAY ===================== */}
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 pointer-events-auto">
              <App id={parsedCustomerId} userId={parsedUserId} />
            </div>
          </div>
        )}

        {/* ===================== LAUNCHER ===================== */}
        {!isOpen && (
          <button
            onClick={() =>
              window.dispatchEvent(
                new Event("RECAP_POLI_REQUEST_OPEN")
              )
            }
            className="fixed bottom-4 right-4 z-[9998] p-4 rounded-full shadow-lg hover:scale-110 transition"
            aria-label="Abrir retrospectiva"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
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
   API GLOBAL
===================================================== */
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

    window.dispatchEvent(new Event("RECAP_POLI_REQUEST_OPEN"));
  },

  close: () => {
    window.dispatchEvent(new Event("RECAP_POLI_CLOSE"));
  },

  toggle: () => {
    window.dispatchEvent(new Event("RECAP_POLI_REQUEST_OPEN"));
  },
};
