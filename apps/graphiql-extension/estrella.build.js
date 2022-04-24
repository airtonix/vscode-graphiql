#!/usr/bin/env node
const { build } = require('estrella');
const fs = require('fs');
const path = require('path');

const TARGET_ROOT = path.resolve(__dirname, `../../dist/apps/vscodegraphiql`);
fs.mkdirSync(TARGET_ROOT, { recursive: true });

build({
  entry: `${__dirname}/src/index.ts`,
  outfile: `${TARGET_ROOT}/extension.js`,
  bundle: true,
  target: 'node16',
  external: ['vscode', 'fs', 'path'],
  async onEnd() {
    ['README.md', 'LICENSE.md'].forEach((filename) => {
      fs.copyFileSync(`${__dirname}/${filename}`, `${TARGET_ROOT}/${filename}`);
    });

    const pkg = require(`${__dirname}/package.json`);
    fs.writeFileSync(
      `${TARGET_ROOT}/package.json`,
      JSON.stringify({ ...pkg, main: './extension.js' }, null, 2)
    );
  },
});
