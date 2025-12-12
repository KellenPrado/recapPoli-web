import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import r2wc from "@r2wc/react-to-web-component";
import App from "./App.tsx";
import indexStyle from "./index.css?inline";
import { Sparkles } from "lucide-react";

declare global {
  interface Window {
    RecapPoli: {
      open: (options?: { customerId?: number; userId?: number }) => void;
      close: () => void;
      toggle: () => void;
    };
  }
}

const Widget = ({ "customer-id": customerId, "user-id": userId }: { "customer-id"?: string; "user-id"?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const parsedId = customerId ? parseInt(customerId) : undefined;
  const parsedUserId = userId ? parseInt(userId) : undefined;

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const handleToggle = () => setIsOpen((prev) => !prev);

    window.addEventListener("RECAP_POLI_OPEN", handleOpen);
    window.addEventListener("RECAP_POLI_CLOSE", handleClose);
    window.addEventListener("RECAP_POLI_TOGGLE", handleToggle);

    return () => {
      window.removeEventListener("RECAP_POLI_OPEN", handleOpen);
      window.removeEventListener("RECAP_POLI_CLOSE", handleClose);
      window.removeEventListener("RECAP_POLI_TOGGLE", handleToggle);
    };
  }, []);

  // Backdrop component that will be rendered outside Shadow DOM
  const backdropElement = isOpen ? createPortal(
    <div
      style={{
        position: 'fixed',
        inset: '0',
        zIndex: '9998',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={() => setIsOpen(false)}
    />,
    document.body
  ) : null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{indexStyle}</style>

      {/* Render backdrop outside Shadow DOM using Portal */}
      {backdropElement}

      <div className="antialiased font-sans">
        {/* Widget Overlay (Open State) */}
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-stretch sm:justify-end pointer-events-none">
            <div className="relative w-full h-[90vh] sm:h-full sm:max-w-[450px] bg-background rounded-t-3xl sm:rounded-none shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-300 pointer-events-auto">
              <App id={parsedId} userId={parsedUserId} />
            </div>
          </div>
        )}

        {/* Launcher Button (Closed State) */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-[9998] p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)",
            }}
            aria-label="Abrir Retrospectiva"
          >
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        )}
      </div>
    </>
  );
};

const WebComponent = r2wc(Widget, {
  shadow: "open", // Re-enable shadow DOM - required for r2wc to work properly
  props: {
    "customer-id": "string",
    "user-id": "string"
  }
});

customElements.define("recap-poli-widget", WebComponent);

// Inicializa a API Global
window.RecapPoli = {
  open: (options) => {
    // Se o widget não existir, cria (lógica antiga), mas agora o ideal é apenas abrir se já existir
    const widget = document.querySelector("recap-poli-widget");
    if (!widget) {
      const newWidget = document.createElement("recap-poli-widget");
      if (options?.customerId) newWidget.setAttribute("customer-id", options.customerId.toString());
      if (options?.userId) newWidget.setAttribute("user-id", options.userId.toString());
      document.body.appendChild(newWidget);
      // Pequeno delay para garantir que o componente montou e o listener está ativo
      setTimeout(() => window.dispatchEvent(new Event("RECAP_POLI_OPEN")), 100);
    } else {
      if (options?.customerId) widget.setAttribute("customer-id", options.customerId.toString());
      if (options?.userId) widget.setAttribute("user-id", options.userId.toString());
      window.dispatchEvent(new Event("RECAP_POLI_OPEN"));
    }
  },
  close: () => {
    window.dispatchEvent(new Event("RECAP_POLI_CLOSE"));
  },
  toggle: () => {
    window.dispatchEvent(new Event("RECAP_POLI_TOGGLE"));
  }
};

