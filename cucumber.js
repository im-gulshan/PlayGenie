module.exports = {
  default: {
    formatOptions: {
      snippetInterface: 'async-await'
    },
    paths: [
      "products/*/features/**/*.feature"
    ],
    require: [
      "core/browser/**/*.js",
      "core/utils/**/*.js",
      "products/*/steps/**/*.js",
      "products/*/support/**/*.js"
    ],
    format: [
      "progress",
      "json:reports/cucumber-report.json"
    ],
    parallel: 1
  },
  saucedemo: {
    // 1. Where are the feature files?
    paths: [
      "products/saucedemo/features/**/*.feature"
    ],
    // 2. Where are the step definitions and setup files?
    require: [
      "core/browser/**/*.js",
      "core/utils/**/*.js",
      "products/saucedemo/steps/**/*.js",
      "products/saucedemo/support/**/*.js"
    ],

    // 3. How should the output look?
    format: [
      "progress",
      "json:reports/saucedemo-report.json"
    ]
  }
};
