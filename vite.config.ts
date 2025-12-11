// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "..",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // =========================================================
  // Seção 'build' para fixar o nome do arquivo
  build: {
    outDir: 'dist', // Pasta de saída
    rollupOptions: {
      output: {
        // Define o nome de arquivo fixo para o chunk principal
        // O arquivo será 'dist/assets/recap-widget.js'
        entryFileNames: `assets/recap-widget.js`,

        // As demais configurações de saída podem permanecer como o padrão
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },
  // =========================================================
}));