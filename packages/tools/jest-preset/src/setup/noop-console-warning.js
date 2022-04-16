const errorWarningsToSkip = ['Warning:'];
const error = console.error;
console.error = function (...args) {
  const isString = typeof args[0] === 'string';
  const shouldSkip = errorWarningsToSkip.filter(function (warning) {
    return args[0].startsWith(warning);
  });

  if (!isString || !shouldSkip) {
    error(...args);
  }
};
console.warn = function () {};
