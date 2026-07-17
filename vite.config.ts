import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [...(mode === 'development' ? [inspectAttr()] : []), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router/')) return 'react-vendor';
          if (id.includes('/@supabase/')) return 'supabase-vendor';
          if (id.includes('/framer-motion/')) return 'motion-vendor';
          if (id.includes('/recharts/')) return 'charts-vendor';
          if (id.includes('/lucide-react/')) return 'icons-vendor';
          return undefined;
        },
      },
    },
  },
}));
