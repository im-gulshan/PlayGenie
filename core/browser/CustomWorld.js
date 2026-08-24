const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { Logger } = require('../utils/logger');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.logger = new Logger('Scenario');
    this.browser = null;
    this.context = null;
    this.page = null;
    this.request = null;
  }

  async init(scenarioName) {
    this.logger = new Logger(scenarioName);
    this.logger.debug('Initializing Playwright context variables...');
  }
}

setWorldConstructor(CustomWorld);
