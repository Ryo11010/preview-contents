import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const basePath = process.env.BASE_PATH || '/projects/timetime/stg/';

export default defineConfig({
  base: basePath,
  plugins: [react()],
  build: {
    outDir: '../stg',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
