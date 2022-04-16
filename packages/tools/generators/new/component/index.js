const { camelCase } = require('lodash');
const {
  PackageJson,
  options,
} = require('@vscodegraphqlexplorer/tools-hygen-prompts');
module.exports = {
  prompt: async ({ prompter, args }) => {
    const domain = 'component';
    const package = await PackageJson({ prompter, args: { domain, ...args } });
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
