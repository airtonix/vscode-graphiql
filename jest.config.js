module.exports = {
  preset: '@vscodegraphqlexplorer/tools-jest-preset',
  projects: [
    '<rootDir>/apps/vscode-graphql-explorer-view',
    '<rootDir>/packages/test',
    '<rootDir>/packages/message-states',
    '<rootDir>/packages/message-types',
    '<rootDir>/apps/graphiql-webview',
    '<rootDir>/packages/graphiql-extension',
    '<rootDir>/packages/vite',
    '<rootDir>/apps/vite-e2e',
    '<rootDir>/packages/nx-vscode',
    '<rootDir>/apps/nx-vscode-e2e',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/mocks/**',
    '!**/index.{ts,tsx}',
    '!**/*.stories.tsx',
    '!**/__generated__/**',
  ],
};
