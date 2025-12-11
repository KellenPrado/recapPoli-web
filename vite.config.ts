import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin customizado para injetar CSS no JS
const cssInjectedByJs = () => {
  return {
    name: 'css-injected-by-js-manual',
    apply: 'build',
    generateBundle(opts, bundle) {
      let cssCode = '';
      // Encontra o arquivo CSS gerado
      const cssFileName = Object.keys(bundle).find(key => key.endsWith('.css'));

      if (cssFileName) {
        cssCode = bundle[cssFileName].source;
        // Remove o arquivo CSS do bundle final para não ser emitido
        delete bundle[cssFileName];
      }

      // Encontra o arquivo JS principal
      const jsFileName = Object.keys(bundle).find(key => key.endsWith('.js'));
      if (jsFileName && cssCode) {
        const jsChunk = bundle[jsFileName];
        // Código para injetar o estilo no head
        const injectionCode = `
(function(){
  try {
    var elementStyle = document.createElement('style');
    elementStyle.innerText = ${JSON.stringify(cssCode)};
    document.head.appendChild(elementStyle);
  } catch(e) {
    console.error('Vite: could not inject styles', e);
  }
})();
`;
        // Prepend o código de injeção ao código original do JS
        jsChunk.code = injectionCode + jsChunk.code;
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    cssInjectedByJs(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: 'dist',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/main.tsx"),
      },
      output: {
        entryFileNames: `recap-widget.js`,
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
}));