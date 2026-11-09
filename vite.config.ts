import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs";

// Scans public/proof/<slug>/ so new certificates and photos appear with no code change.
const PROOF_DIR = path.resolve(__dirname, "public/proof");
const VIRTUAL_ID = "virtual:proof-manifest";
const IMG = /\.(jpe?g|png|webp|avif)$/i;
function buildProofManifest() {
  const out: Record<string, { cert?: string; pdf?: string; badge?: string; photos: string[] }> = {};
  if (!fs.existsSync(PROOF_DIR)) return out;
  for (const slug of fs.readdirSync(PROOF_DIR)) {
    const dir = path.join(PROOF_DIR, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    const has = (f: string) => fs.existsSync(path.join(dir, f));
    const photosDir = path.join(dir, "photos");
    const photos = fs.existsSync(photosDir)
      ? fs.readdirSync(photosDir).filter((f) => IMG.test(f)).sort().map((f) => `/proof/${slug}/photos/${f}`)
      : [];
    out[slug] = {
      cert: has("certificate.webp") ? `/proof/${slug}/certificate.webp` : undefined,
      pdf: has("certificate.pdf") ? `/proof/${slug}/certificate.pdf` : undefined,
      badge: has("badge.webp") ? `/proof/${slug}/badge.webp` : undefined,
      photos,
    };
  }
  return out;
}
const proofManifestPlugin = () => ({
  name: "proof-manifest",
  resolveId(id: string) {
    return id === VIRTUAL_ID ? "\0" + VIRTUAL_ID : null;
  },
  load(id: string) {
    return id === "\0" + VIRTUAL_ID ? `export default ${JSON.stringify(buildProofManifest())}` : null;
  },
  configureServer(server: any) {
    server.watcher.add(PROOF_DIR);
    const refresh = (file: string) => {
      if (!file.replace(/\\/g, "/").includes("/public/proof/")) return;
      const mod = server.moduleGraph.getModuleById("\0" + VIRTUAL_ID);
      if (mod) server.moduleGraph.invalidateModule(mod);
      server.ws.send({ type: "full-reload" });
    };
    server.watcher.on("add", refresh);
    server.watcher.on("unlink", refresh);
  },
});



// Scans public/projects/<slug>/ (cover.webp + optional gallery/) the same way.
const PROJECT_DIR = path.resolve(__dirname, "public/projects");
const PROJECT_ID = "virtual:project-media";
const COVER = /^cover\.(webp|jpe?g|png|avif)$/i;
function buildProjectMedia() {
  const out: Record<string, { cover?: string; gallery: string[] }> = {};
  if (!fs.existsSync(PROJECT_DIR)) return out;
  for (const slug of fs.readdirSync(PROJECT_DIR)) {
    const dir = path.join(PROJECT_DIR, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    const cover = fs.readdirSync(dir).find((f) => COVER.test(f));
    const gdir = path.join(dir, "gallery");
    const gallery = fs.existsSync(gdir)
      ? fs.readdirSync(gdir).filter((f) => IMG.test(f)).sort().map((f) => `/projects/${slug}/gallery/${f}`)
      : [];
    out[slug] = { cover: cover ? `/projects/${slug}/${cover}` : undefined, gallery };
  }
  return out;
}
const projectMediaPlugin = () => ({
  name: "project-media",
  resolveId(id: string) {
    return id === PROJECT_ID ? "\0" + PROJECT_ID : null;
  },
  load(id: string) {
    return id === "\0" + PROJECT_ID ? `export default ${JSON.stringify(buildProjectMedia())}` : null;
  },
  configureServer(server: any) {
    server.watcher.add(PROJECT_DIR);
    const refresh = (file: string) => {
      if (!file.replace(/\\/g, "/").includes("/public/projects/")) return;
      const mod = server.moduleGraph.getModuleById("\0" + PROJECT_ID);
      if (mod) server.moduleGraph.invalidateModule(mod);
      server.ws.send({ type: "full-reload" });
    };
    server.watcher.on("add", refresh);
    server.watcher.on("unlink", refresh);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables so that process.env.GEMINI_API_KEY is available locally
  const env = loadEnv(mode, process.cwd(), '');
  
  // Set the environment variables in process.env so the dynamically imported api/chat.js can access them
  for (const key in env) {
    process.env[key] = env[key];
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      proofManifestPlugin(),
      projectMediaPlugin(),
      {
        // Dev only: serve public/verify/<dir>/ as its index.html (Vercel does this natively in production).
        name: 'verify-static-dirs',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = (req.url || '').split('?')[0];
            if (url === '/verify') {
              res.statusCode = 302;
              res.setHeader('Location', '/verify/');
              return res.end();
            }
            if (url.startsWith('/verify/') && url.endsWith('/')) {
              req.url = url + 'index.html';
            }
            next();
          });
        },
      },
      {
        name: 'api-chat-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/chat' && req.method === 'POST') {
              try {
                // Read chunks of the request body
                const chunks: any[] = [];
                req.on('data', chunk => chunks.push(chunk));
                req.on('end', async () => {
                  try {
                    const bodyText = Buffer.concat(chunks).toString();
                    const body = bodyText ? JSON.parse(bodyText) : {};
                    
                    // Attach body to request object as Vercel does
                    (req as any).body = body;

                    // Mock Vercel response helper functions
                    const responseMock = {
                      statusCode: 200,
                      headers: {} as Record<string, string | string[]>,
                      setHeader(name: string, value: string | string[]) {
                        this.headers[name] = value;
                        res.setHeader(name, value);
                        return this;
                      },
                      status(code: number) {
                        this.statusCode = code;
                        res.statusCode = code;
                        return this;
                      },
                      json(data: any) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(data));
                        return this;
                      },
                      end(data?: any) {
                        res.end(data);
                        return this;
                      }
                    };

                    // Dynamically import the api/chat handler using pathToFileURL to prevent Windows scheme issues
                    const chatModuleUrl = pathToFileURL(path.resolve(process.cwd(), './api/chat.js')).href;
                    const chatModule = await import(chatModuleUrl);
                    await chatModule.default(req, responseMock);
                  } catch (err: any) {
                    console.error('Error handling local /api/chat:', err);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
                  }
                });
              } catch (err: any) {
                console.error('Error starting middleware body parse:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
