const lodash = require('lodash');

const options = require('./options');

exports.Gatherer = function Gatherer(questions = []) {
  return async ({ prompter, args = {} }) => {
    const flags = { ...args, ...options };

    const result = await questions.reduce(async (resultsPromise, question) => {
      const results = await resultsPromise;

      question.initial = question.initial || lodash.get(flags, question.name);

      const answer = await prompter.prompt(question);

      const nestedQuestions =
        typeof question.questions === 'function'
          ? await question.questions({ ...results, ...answer, ...options })
          : question.questions;

      const nestedAnswers = Array.isArray(nestedQuestions)
        ? await Gatherer(nestedQuestions)({ prompter, args })
        : {};

      return {
        ...results,
        ...answer,
        ...nestedAnswers,
      };
    }, Promise.resolve({}));
    return result;
  };
};
