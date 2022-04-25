import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @type {import('vite').UserConfig}
 */
const config = defineConfig(({ command, mode }) => {
  const isLocalDev = command === 'serve';
  const baseUrl = isLocalDev ? 'http://localhost:3000' : '/';

  return {
    plugins: [
      tsconfigPaths({
        root: '../..',
      }),
      react(),
    ],
    base: baseUrl,
    root: './',
    server: isLocalDev
      ? {
          origin: baseUrl,
          hmr: {
            host: 'localhost',
          },
        }
      : undefined,

    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },

    build: {
      outDir: '../../dist/apps/graphiql-extension',
      emptyOutDir: false,
    },
  };
});

export default config;
