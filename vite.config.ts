import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
// import mkcert from "vite-plugin-mkcert"

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: 'assemble-sitecore.com',
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
