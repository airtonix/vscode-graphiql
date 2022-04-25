/* eslint-disable no-console */
import * as cp from 'child_process';
import * as path from 'path';

import { ExecutorContext } from '@nrwl/devkit';
import chalk from 'chalk';

import CLIOptions from './schema';

interface Options extends CLIOptions {
  projectRoot: string;
}

export default async function (opts: CLIOptions, ctx: ExecutorContext) {
  try {
    const options = normalizeOptions(opts, ctx);
    await packageExtension(options);
    if (options.install) {
      await installExtension(options);
    }

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.stack || err.message : 'Unknown error';

    console.log(chalk.bold.redBright(message));
    return {
      success: false,
      reason: message,
    };
  }
}

function normalizeOptions(opts: CLIOptions, ctx: ExecutorContext): Options {
  if (!ctx.projectName) {
    throw new Error('Expected project name to be non-null');
  }
  const projectRoot = ctx.workspace.projects[ctx.projectName].root;
  const outputPath = path.join(ctx.root, opts.outputPath);

  return {
    ...opts,
    projectRoot,
    outputPath,
  };
}

function packageExtension(opts: Options) {
  return new Promise<void>((resolve, reject) => {
    cp.spawn('npx vsce', ['package'], {
      cwd: opts.outputPath,
      shell: true,
      stdio: 'inherit',
    })
      .on('error', (error) => {
        console.error(error.message);
        reject(error);
      })
      .on('close', (code) => {
        if (code) reject();
        else resolve();
      });
  });
}

async function installExtension(opts: Options) {
  const outPathRel = path.relative(__dirname, opts.outputPath);
  const pkgRel = path.join(outPathRel, 'package.json');
  const { name, version } = await import(pkgRel);
  const vsix = `"${name}-${version}.vsix"`;

  return new Promise<void>((resolve, reject) => {
    cp.spawn('code', ['--install-extension', vsix], {
      cwd: opts.outputPath,
      shell: true,
      stdio: 'inherit',
    })
      .on('error', reject)
      .on('close', (code) => {
        if (code) reject();
        else resolve();
      });
  });
}
