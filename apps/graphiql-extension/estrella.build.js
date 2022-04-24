#!/usr/bin/env node
const { build } = require('estrella');
const path = require('path');
build({
  entry: `${__dirname}/src/index.ts`,
  outfile: path.resolve(__dirname, `../../dist/apps/vscodegraphiql/index.js`),
  bundle: true,
  target: 'node16',
  external: ['vscode', 'fs', 'path'],
});
