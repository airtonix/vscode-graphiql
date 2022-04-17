const globby = require('globby');
const { camelCase } = require('lodash');
const {
  Gatherer,
  PackageJson,
  options,
} = require('@vscodegraphqlexplorer/tools-hygen-prompts');

async function getNamespacedDirectories(namspace, root) {
  const items = await globby([`${root}/*`], {
    onlyDirectories: true,
    absolute: false,
    objectMode: true,
  });

  return items.map((item) => ({ namspace, name: item.name }));
}

module.exports = {
  prompt: async ({ prompter, args }) => {
    const domains = await getNamespacedDirectories(
      'Packages',
      `${process.cwd()}/packages`
    );
    const { domain } = await Gatherer([
      {
        type: 'select',
        choices: domains.map((item) => item.name),
        name: 'domain',
        message: 'Package Group?',
      },
    ])({ prompter, args });

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
