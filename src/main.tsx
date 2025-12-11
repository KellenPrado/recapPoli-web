import r2wc from "@r2wc/react-to-web-component";
import App from "./App.tsx";
import indexStyle from "./index.css?inline";

declare global {
  interface Window {
    RecapPoli: {
      open: (options?: { id?: number; userId?: number }) => void;
      close: () => void;
    };
  }
}

const Widget = ({ id, "user-id": userId }: { id?: string; "user-id"?: string }) => {
  const parsedId = id ? parseInt(id) : undefined;
  const parsedUserId = userId ? parseInt(userId) : undefined;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{indexStyle}</style>
      <div className="w-full h-full bg-background text-foreground antialiased font-sans">
        <App id={parsedId} userId={parsedUserId} />
      </div>
    </>
  );
};

const WebComponent = r2wc(Widget, {
  shadow: "open",
  props: {
    id: "string",
    "user-id": "string"
  }
});

customElements.define("recap-poli-widget", WebComponent);

// Inicializa a API Global
window.RecapPoli = {
  open: (options) => {
    // Remove se já existir para evitar duplicação
    const existing = document.querySelector("recap-poli-widget");
    if (existing) existing.remove();

    const widget = document.createElement("recap-poli-widget");
    if (options?.id) widget.setAttribute("id", options.id.toString());
    if (options?.userId) widget.setAttribute("user-id", options.userId.toString());

    document.body.appendChild(widget);
  },
  close: () => {
    const widget = document.querySelector("recap-poli-widget");
    if (widget) widget.remove();
  }
};
