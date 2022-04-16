const { camelCase } = require('lodash');
const {
  Gatherer,
  PackageJson,
  options,
} = require('@vscodegraphqlexplorer/tools-hygen-prompts');

module.exports = {
  prompt: async ({ prompter, args }) => {
    const { domain } = await Gatherer([
      {
        type: 'select',
        choices: ['extensions', 'apps'],
        name: 'domain',
        message: 'Package Group?',
      },
    ])({ prompter, args });
    const package = await PackageJson({ prompter, args });
    const name = camelCase(package.title);
    const componentName = [name[0].toUpperCase(), name.substr(1)].join('');
    const results = {
      ...options,
      ...package,
      domain,
      componentName,
    };
    console.dir(results);
    return results;
  },
};
