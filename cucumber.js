module.exports = {
  portfolio: {
    parallel: 2,
    requireModule: ['tsx/cjs'],

    // Retry failed scenarios once before marking them as failed
    retry: 0,

    // 1. Where are the feature files?
    paths: ['products/portfolio/features/**/*.feature'],
    // 2. Where are the step definitions and setup files?
    require: [
      'core/browser/**/*.ts',
      'core/utils/**/*.ts',
      'products/portfolio/steps/**/*.ts',
      'products/portfolio/support/**/*.ts',
    ],

    // 3. How should the output look?
    format: ['progress', 'json:reports/portfolio-report.json'],
  },

  saucedemo: {
    parallel: 3,
    requireModule: ['tsx/cjs'],

    // Retry failed scenarios once before marking them as failed
    retry: 0,
    // Uncomment to only retry scenarios tagged @flaky:
    // retryTagFilter: '@flaky',

    // 1. Where are the feature files?
    paths: ['products/saucedemo/features/**/*.feature'],
    // 2. Where are the step definitions and setup files?
    require: [
      'core/browser/**/*.ts',
      'core/utils/**/*.ts',
      'products/saucedemo/steps/**/*.ts',
      'products/saucedemo/support/**/*.ts',
    ],

    // 3. How should the output look?
    format: ['progress', 'json:reports/saucedemo-report.json'],
  },
};
