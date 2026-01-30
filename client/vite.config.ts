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
  // Configurazione di build per Vercel with code splitting optimizations
  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 500, // KB limit before warning
    rollupOptions: {
      output: {
        // Configure chunk splitting strategies
        manualChunks: {
          // Put React and ReactDOM in a vendor chunk
          'vendor-react': ['react', 'react-dom'],
          // Group UI component libraries together
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-tooltip', '@radix-ui/react-label'],
          // Group React Query related dependencies
          'vendor-query': ['@tanstack/react-query'],
          // Utility libraries
          'vendor-utils': ['zod', 'date-fns', 'i18next'],
        },
      },
    },
  },
  // Assicurati che le variabili d'ambiente siano disponibili
  envPrefix: "VITE_"
});
