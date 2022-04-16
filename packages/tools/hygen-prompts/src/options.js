const nconf = require('nconf');
const home = require('user-home');

const KEY = 'hygenglobal';
const ENV_SEPARATOR = `__`;
const ENV_PATTERN = new RegExp(`/^${KEY.toUpperCase()}${ENV_SEPARATOR}/`);
const RC_NAME = `.${KEY}rc`;

nconf.env({
  separator: ENV_SEPARATOR,
  match: ENV_PATTERN,
  lowerCase: true,
  parseValues: true,
  transform(obj) {
    obj.key.replace(ENV_PATTERN, '');
    return obj;
  },
});

nconf.argv({
  prefix: {
    describe: 'prefix of all new packages created',
  },
});

nconf
  .file('user', {
    file: `${home}/${RC_NAME}`,
    dir: process.cwd(),
    search: true,
  })
  .file('repo', {
    file: RC_NAME,
    dir: process.cwd(),
    search: true,
  })
  .defaults({
    verbose: false,
  });

const options = nconf.get();

module.exports = {
  nconf,
  options,
};
