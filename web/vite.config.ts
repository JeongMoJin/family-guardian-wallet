import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 개발 시 프론트는 /api 로만 호출하면 되도록 Express 로 프록시.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
