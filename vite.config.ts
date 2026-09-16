
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Deploy target: build a Vercel SSR bundle instead of the Lovable/Cloudflare
  // default. The Lovable config forces output into dist/server + dist/client,
  // which breaks Vercel; restore Nitro's native vercel-preset output layout
  // (.vercel/output Build Output API) so Vercel serves the app instead of 404ing.
  nitro: {
    preset: "vercel",
    output: {
      dir: "{{ rootDir }}/.vercel/output",
      serverDir: "{{ output.dir }}/functions/__server.func",
      publicDir: "{{ output.dir }}/static/{{ baseURL }}",
    },
  },
  vite: {
    server: {
      proxy: {
        "/v1": {
          target: process.env.VITE_API_PROXY_TARGET || "http://localhost:6001",
          changeOrigin: true,
        },
      },
    },
  },
});
