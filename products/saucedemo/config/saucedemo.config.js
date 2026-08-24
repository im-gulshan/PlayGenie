const globalConfig = require('../../../config/global.config');

// In a robust implementation, this dynamically loads based on process.env.TEST_ENV
const envName = process.env.TEST_ENV || 'qa';
const envConfig = require(`../../../config/env/${envName}`);

module.exports = {
  ...globalConfig,
  ...envConfig,
  productName: 'SauceDemo',
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/',
};
