import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @type {import('vite').UserConfig}
 */
const config = defineConfig(({ command }) => {
  const baseUrl = 'http://localhost:3000';

  return {
    plugins: [
      tsconfigPaths({
        projects: [`tsconfig.app.json`],
      }),
      react(),
    ],
    root: '.',
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
      outDir: '../../dist/apps/graphiql-webview',
    },
  };
});

export default config;
