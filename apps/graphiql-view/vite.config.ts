import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig(({ command }) => {
  const baseUrl = 'http://localhost:3000';

  return {
    plugins: [react()],
    root: './src',
    base: baseUrl,

    server: {
      origin: baseUrl,
      hmr: {
        host: 'localhost',
      },
    },

    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },

    build: {
      outDir: '../../graphiql-ext/dist',
    },
  };
});

export default config;
