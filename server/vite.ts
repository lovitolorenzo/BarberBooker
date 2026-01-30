import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";

// Solo le definizioni dei tipi, non importa il modulo effettivo
type ViteServer = any;
type ViteLogger = any;

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Importa vite solo quando necessario
  const { createServer: createViteServer, createLogger } = await import('vite');
  const viteConfig = await import('../vite.config');
  const viteLogger = createLogger();
  
  const serverOptions = {
    middlewareMode: true as const,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig.default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg: string, options: any) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Use Vite middlewares but wrap them to skip API routes
  app.use((req, res, next) => {
    // Skip API routes - let them be handled by our API handlers
    if (req.url.startsWith('/api/')) {
      return next();
    }
    
    // Apply Vite middleware for all other routes
    vite.middlewares(req, res, next);
  });

  // Handle SPA routing for non-API, non-asset GET requests
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Skip API routes - let them be handled by our API handlers
    if (url.startsWith('/api/')) {
      return next();
    }

    // Skip asset requests that Vite should handle
    if (url.startsWith('/@') || url.startsWith('/src/') || url.includes('.')) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In produzione, serviamo i file statici dalla directory public
  // Assumendo che i file frontend siano stati buildati in questa directory
  const distPath = path.resolve(import.meta.dirname, "../dist/public");
  
  // In produzione, potrebbe non essere necessario questo controllo
  // perché in un ambiente API-only non abbiamo bisogno di file statici
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // fall through to index.html if the file doesn't exist
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  } else {
    // Se siamo in produzione e non ci sono file statici,
    // aggiungiamo una route di fallback per le richieste non-API
    app.use("*", (req, res) => {
      if (!req.path.startsWith("/api/")) {
        res.status(404).json({ message: "Frontend not available. This is an API-only server." });
      }
    });
  }
}
