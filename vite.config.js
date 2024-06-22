import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: {
      origin: '*', // Permite todas las solicitudes de origen cruzado
    },
  },
  define: {
    'process.env': process.env,
  },
});
