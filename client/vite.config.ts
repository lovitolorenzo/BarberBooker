import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Detect environment
const isProd = process.env.NODE_ENV === "production";

// Configurazione ottimizzata per Vercel
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // In production (Vercel) use the local copy, in development use the shared folder
      "@shared": isProd 
        ? path.resolve(__dirname, "src/shared-types")
        : path.resolve(__dirname, "../shared"),
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
