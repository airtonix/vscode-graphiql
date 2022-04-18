import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config = defineConfig(({ command }) => {
  const baseUrl = 'http://localhost:3000';

  return {
    plugins: [tsconfigPaths(), react()],
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
