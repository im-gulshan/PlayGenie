module.exports = {
  saucedemo: {
    requireModule: ['tsx/cjs'],
    // 1. Where are the feature files?
    paths: [
      "products/saucedemo/features/**/*.feature"
    ],
    // 2. Where are the step definitions and setup files?
    require: [
      "core/browser/**/*.ts",
      "core/utils/**/*.ts",
      "products/saucedemo/steps/**/*.ts",
      "products/saucedemo/support/**/*.ts"
    ],

    // 3. How should the output look?
    format: [
      "progress",
      "json:reports/saucedemo-report.json"
    ]
  }
};
