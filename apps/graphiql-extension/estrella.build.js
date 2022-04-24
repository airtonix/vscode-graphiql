#!/usr/bin/env node
const { build, cliopts, file, stdoutStyle } = require("estrella")

const fs = require('fs');
const path = require('path');



const [ opts, args ] = cliopts.parse(
  ["outputPath"   , "compileDestination", "<file>"],
)

if (!opts.outputPath)
  throw new Error('Missing outputPath')

fs.mkdirSync(opts.outputPath, { recursive: true });

build({
  entry: `${__dirname}/src/index.ts`,
  outfile: `${opts.outputPath}/extension.js`,
  bundle: true,
  target: 'node16',
  external: ['vscode', 'fs', 'path'],
  async onEnd() {
    ['README.md', 'LICENSE.md'].forEach((filename) => {
      fs.copyFileSync(`${__dirname}/${filename}`, `${opts.outputPath}/${filename}`);
    });

    const pkg = require(`${__dirname}/package.json`);
    fs.writeFileSync(
      `${opts.outputPath}/package.json`,
      JSON.stringify({ ...pkg, main: './extension.js' }, null, 2)
    );
  },
});
