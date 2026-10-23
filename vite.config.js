import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE is set by the deploy pipeline (e.g. "/word-scramble/" for GitHub Pages project sites).
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [react()],
  // NODE_ENV pinned: a machine-wide NODE_ENV=production would load React's production build (no act()) in tests.
  test: { environment: 'jsdom', include: ['tests/**/*.test.{js,jsx}'], env: { NODE_ENV: 'test' } },
});
