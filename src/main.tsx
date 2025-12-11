import React, { useState, useEffect } from "react";
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

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{indexStyle}</style>

      <div className="antialiased font-sans">
        {/* Widget Overlay (Open State) */}
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex flex-col bg-background/95 backdrop-blur-sm sm:flex-row sm:justify-end">
            {/* Backdrop click to close (optional, maybe just on the side for desktop) */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

            <div className="relative w-full h-full sm:max-w-[450px] sm:border-l sm:shadow-2xl bg-background z-10 animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
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
  shadow: "open",
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

