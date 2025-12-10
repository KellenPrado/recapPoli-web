import r2wc from "@r2wc/react-to-web-component";
import App from "./App.tsx";
import indexStyle from "./index.css?inline";

const Widget = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{indexStyle}</style>
      <div className="w-full h-full bg-background text-foreground antialiased font-sans">
        <App />
      </div>
    </>
  );
};

const WebComponent = r2wc(Widget, {
  shadow: "open",
});

customElements.define("recap-poli-widget", WebComponent);
