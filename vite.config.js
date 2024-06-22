import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: true, // Enables CORS
  },
  base: '/', // Sets base path for the project
  build: {
    outDir: 'dist', // Output directory for build files
    emptyOutDir: true, // Clears the directory on each build
    rollupOptions: {
      input: 'dist/index.html', // Adjusted to the correct path to your index.html
    },
  },
});
