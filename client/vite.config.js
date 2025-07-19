import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['localhost', '127.0.0.1','7679096cc6a0.ngrok-free.app'],
  },
  scripts:{
    "dev": "vite --host",
  },
  plugins: [react()
    , tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
