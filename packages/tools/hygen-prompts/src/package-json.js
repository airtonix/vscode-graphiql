const lodash = require('lodash');

const { options } = require('./options');
const { Gatherer } = require('./gatherer');

exports.PackageJson = async function PackageJson({ prompter, args = {} }) {
  const flags = { ...options, ...args };
  const domain = (args.domain && `${args.domain}-`) || '';

  return Gatherer([
    {
      type: 'input',
      name: 'title',
      message: 'Title?',
      questions: ({ title }) => {
        return [
          {
            type: 'input',
            name: 'package_name',
            message: 'Module name',
            initial: [
              flags.prefix,
              domain,
              lodash.kebabCase(title) || 'unknown',
            ].join(''),
          },
          {
            type: 'input',
            name: 'code',
            message: 'Short code',
            initial: lodash.kebabCase(title),
          },
        ];
      },
    },
  ])({ prompter, args });
};
