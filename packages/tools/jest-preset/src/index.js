const path = require('path');

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  verbose: true,
  setupFilesAfterEnv: [
    path.resolve(__dirname, 'setup/noop-console-warning.js'),
  ],
};
