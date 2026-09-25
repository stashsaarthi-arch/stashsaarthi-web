// TanStack Start Vite configuration
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env["VERCEL"] ? "vercel" : process.env["NITRO_PRESET"] || "node-server",
    // @ts-expect-error: externals is a valid nitro property but missing from the wrapper's type definition
    externals: {
      external: [
        "firebase-admin",
        "firebase-admin/app",
        "firebase-admin/auth",
        "firebase-admin/firestore",
        "@google-cloud/firestore",
        "@google-cloud/storage",
        "cloudinary",
        "google-gax",
      ],
    },
  },
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    ssr: {
      external: [
        "firebase-admin",
        "firebase-admin/app",
        "firebase-admin/auth",
        "firebase-admin/firestore",
        "cloudinary",
        "@google-cloud/firestore",
        "@google-cloud/storage",
      ],
    },
    build: {
      modulePreload: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-dom") || id.includes("react/")) {
                return "vendor-react";
              }
              if (id.includes("@tanstack")) {
                return "vendor-tanstack";
              }
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              if (id.includes("framer-motion") || id.includes("motion")) {
                return "vendor-framer";
              }
              if (id.includes("@supabase")) {
                return "vendor-supabase";
              }
              if (id.includes("gsap")) {
                return "vendor-gsap";
              }
              if (id.includes("lenis")) {
                return "vendor-lenis";
              }
              if (id.includes("sonner")) {
                return "vendor-sonner";
              }
            }
            return undefined;
          },
        },
      },
    },
  },
});
