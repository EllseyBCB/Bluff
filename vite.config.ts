import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative Pfade, damit der Build auch unter einem Unterpfad
  // funktioniert (z. B. GitHub Pages: https://<user>.github.io/Bluff/).
  base: './',
});
