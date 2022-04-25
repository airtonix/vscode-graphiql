/* eslint-disable no-console */
import * as cp from 'child_process';
import * as path from 'path';

import { ExecutorContext } from '@nrwl/devkit';
import chalk from 'chalk';

import CLIOptions from './schema';

async function getVsixFileName(opts: Options) {
  const outPathRel = path.relative(__dirname, opts.outputPath);
  const pkgRel = path.join(outPathRel, 'package.json');
  const { name, version } = await import(pkgRel);
  return `"${name}-${version}.vsix"`;
}

function vsceCli(opts: Options, ...args: string[]) {
  return new Promise<void>((resolve, reject) => {
    cp.spawn('npx vsce', args, {
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

function vscodeCli(opts: Options, ...args: string[]) {
  return new Promise<void>((resolve, reject) => {
    cp.spawn('code', args, {
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

interface Options extends CLIOptions {
  projectRoot: string;
}

export default async function (opts: CLIOptions, ctx: ExecutorContext) {
  try {
    const options = normalizeOptions(opts, ctx);
    await vsceCli(options, 'package');

    if (options.install) {
      const vsix = await getVsixFileName(options);
      return await vscodeCli(options, '--install-extension', vsix);
    }

    if (options.publish) {
      await vsceCli(options, 'verify-pat');
      await vsceCli(options, 'publish');
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
