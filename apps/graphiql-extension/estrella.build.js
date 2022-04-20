#!/usr/bin/env node
const { build } = require('estrella');

build({
  entry: 'src/index.ts',
  outfile: 'dist/extension.js',
  bundle: true,
  sourcemap: true,
  external: ['vscode', 'fs', 'path'],
});
