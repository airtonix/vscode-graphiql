module.exports = {
  preset: '@vscodegraphqlexplorer/tools-jest-preset',
  projects: ['<rootDir>/apps/vscode-graphql-explorer-view'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/mocks/**',
    '!**/index.{ts,tsx}',
    '!**/*.stories.tsx',
    '!**/__generated__/**',
  ],
};
