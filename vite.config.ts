import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true, // Listen on all local IPs
    open: true, // Open browser on server start
    strictPort: true, // Exit if port is already in use
    watch: {
      usePolling: true, // Enable polling for file changes
    },
  },
});
