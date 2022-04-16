const path = require('path');

const minimatch = require('minimatch');
const { getPackages } = require('@manypkg/get-packages');

const { Gatherer } = require('./gatherer');

exports.PickPackagePath = async function PickPackagePath({
  filter = '**/*',
  prompter,
  args = {},
}) {
  const { root, packages } = await getPackages();
  const choices = packages.filter(({ dir }) => {
    const where = dir.replace(`${root.dir}/`, '');
    const output = minimatch(where, filter);
    return output;
  });
  const selections = Gatherer([
    {
      type: 'select',
      name: 'packagePath',
      message: 'Pick a package',
      choices: choices.map(({ dir, packageJson }) => {
        const code = dir.split(path.sep).pop();
        const { name } = packageJson;
        return {
          message: `${code} [${name}]`,
          value: dir,
        };
      }),
    },
  ]);

  return selections({ prompter, args });
};
