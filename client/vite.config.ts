import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configurazione ottimizzata per Vercel
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  // Configurazione di build per Vercel
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  // Assicurati che le variabili d'ambiente siano disponibili
  envPrefix: "VITE_"
});
