import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'OPENROUTER_', 'ZEBU_'],
  server: {
    port: 3000,
    host: true
  }
});
