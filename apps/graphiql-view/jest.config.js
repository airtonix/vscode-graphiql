module.exports = {
  verbose: true,
  preset: 'ts-jest',
  displayName: 'App/VsCodeGraphqlExplorerView',
  setupFilesAfterEnv: ['jest-extended'],

  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.spec.json`,
      diagnostics: { pretty: true },
      isolatedModules: false,
    },
  },
};
