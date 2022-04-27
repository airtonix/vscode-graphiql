import { promises as fs } from 'fs';
import * as path from 'path';

import { ExecutorContext } from '@nrwl/devkit';
import * as esbuild from 'esbuild';
import { JsonObject, TMGrammar } from '@vscode-devkit/grammar';

import CLIOptions from './schema';

interface Options extends CLIOptions {
  projectRoot: string;
  grammarModulePath: string;
  grammarJsonPath: string;
}

export default async function (opts: CLIOptions, ctx: ExecutorContext) {
  try {
    const options = await normalizeOptions(opts, ctx);
    const jsonContent = await compile(options);
    await writeOutput(jsonContent, options);

    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.stack || err.message : 'Unknown error';

    return {
      success: false,
      reason: message,
    };
  }
}

async function normalizeOptions(
  opts: CLIOptions,
  ctx: ExecutorContext
): Promise<Options> {
  if (!ctx.projectName) {
    throw new Error('Expected project name to be non-null');
  }
  const project = ctx.workspace.projects[ctx.projectName];
  const projectRoot = path.join(ctx.root, project.root);

  const entryPoint = path.join(ctx.root, opts.entryPoint);
  const outputPath = path.join(ctx.root, opts.outputPath);
  const grammarModulePath = path.join(outputPath, `${opts.name}.tmLanguage.js`);
  const grammarJsonPath = path.join(outputPath, `${opts.name}.tmLanguage.json`);

  return {
    ...opts,
    entryPoint,
    outputPath,
    projectRoot,
    grammarModulePath,
    grammarJsonPath,
  };
}

async function compile(opts: Options) {
  await compileSrcModule(opts);
  const src = (await import(opts.grammarModulePath)).default as TMGrammar;
  const json = toJson(src);

  return JSON.stringify(json, null, '\t');
}

async function writeOutput(content: string, opts: Options) {
  try {
    await fs.stat(opts.outputPath);
  } catch {
    await fs.mkdir(opts.outputPath, { recursive: true });
  }
  await fs.writeFile(opts.grammarJsonPath, content);
  await fs.rm(opts.grammarModulePath);
}

async function compileSrcModule(opts: Options) {
  await esbuild.build({
    entryPoints: [opts.entryPoint],
    bundle: true,
    platform: 'node',
    target: ['node14.14'],
    outfile: opts.grammarModulePath,
  });
}

function toJson(grammar: TMGrammar): JsonObject {
  const result: JsonObject = {};

  Object.entries(grammar).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result[key] = value;
    } else if (value instanceof RegExp) {
      result[key] = value.toString().replace(/^\/|\/$/g, '');
    } else if (Array.isArray(value)) {
      result[key] = value.map(toJson);
    } else {
      result[key] = toJson(value);
    }
  });

  return result;
}
