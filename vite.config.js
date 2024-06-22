import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: {
      origin: '*', // Allows all cross-origin requests
    },
  },
  define: {
    'process.env': process.env,
  },
  base: './', // Ensure the base is set to deploy the directory correctly on Vercel
  build: {
    outDir: 'dist', // Makes sure to compile all files to the 'dist' directory
    rollupOptions: {
      input: 'dist/index.html', // Adjusted to the correct path to your index.html
    },
  },
});
