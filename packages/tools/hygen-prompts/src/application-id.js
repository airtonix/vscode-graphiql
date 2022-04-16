const lodash = require('lodash');

const { options } = require('./options');
const { Gatherer } = require('./gatherer');

exports.ApplicationId = async function ApplicationId({ prompter, args }) {
  const flags = { ...options, ...args };
  const id = lodash.camelCase(flags.code).toLowerCase();
  const package = await Gatherer([
    {
      type: 'input',
      name: 'package_id',
      initial: `${flags.applicationPrefix}${id}`,
    },
  ])({ prompter, flags });

  return {
    ...package,
    id,
  };
};
