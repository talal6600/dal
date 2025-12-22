import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.'
        },
        {
          src: 'sw.js',
          dest: '.'
        },
        {
          src: '_redirects',
          dest: '.'
        },
        {
          src: '_headers',
          dest: '.'
        }
      ]
    })
  ],
  // Base must be './' for relative hosting to work correctly on sub-paths
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});