import { resolve } from 'path';

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @type {import('vite').UserConfig}
 */
const config = defineConfig(() => {
  return {
    plugins: [
      tsconfigPaths({
        root: '../..',
      }),
    ],

    build: {
      rollupOptions: {
        external: ['vscode', 'path'],
      },
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'GraphiQLExtension',
        fileName: (format: string) => `graphiql-extension.${format}.js`,
      },
      outDir: './dist',
    },
  };
});

// eslint-disable-next-line import/no-default-export
export default config;
