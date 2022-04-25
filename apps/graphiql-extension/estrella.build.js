#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');

const glob = require('glob');
const { build, cliopts } = require('estrella');

const [opts, args] = cliopts.parse(
  ['o, outputPath', 'compile destination', '<file>'],
  ['copyAssets', 'copy extra files to <outputPath>']
);

if (!opts.outputPath) throw new Error('Missing outputPath');

fs.mkdirSync(opts.outputPath, { recursive: true });

build({
  entry: `${__dirname}/src/index.ts`,
  outfile: `${opts.outputPath}/extension.js`,
  clear: false,
  bundle: true,
  sourcemap: true,
  platform: 'node',
  external: ['vscode'],
  async onEnd() {
    if (!opts.copyAssets) return;

    ['README.md', 'LICENSE.md'].forEach((filename) => {
      fs.copyFileSync(
        `${__dirname}/${filename}`,
        `${opts.outputPath}/${filename}`
      );
      console.log(`Copied: ${filename}`);
    });

    const pkg = require(`${__dirname}/package.json`);
    fs.writeFileSync(
      `${opts.outputPath}/package.json`,
      JSON.stringify({ ...pkg, main: './extension.js' }, null, 2)
    );
    console.log(`Updated: package.json`);
  },
});
