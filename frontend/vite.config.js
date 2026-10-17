import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Saat development, request /api dan /uploads diteruskan ke backend (port 4000).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:4000', '/uploads': 'http://localhost:4000' } },
});
