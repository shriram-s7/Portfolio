/// <reference types="vite/client" />

declare module "virtual:proof-manifest" {
  const manifest: Record<string, { cert?: string; pdf?: string; badge?: string; photos: string[] }>;
  export default manifest;
}

declare module "virtual:project-media" {
  const media: Record<string, { cover?: string; gallery: string[] }>;
  export default media;
}
