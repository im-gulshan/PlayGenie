import globalConfig from '@config/global.config';

/**
 * SauceDemo product configuration.
 *
 * Merges: global config ← environment config ← product overrides.
 * The environment config is loaded dynamically based on TEST_ENV.
 */
const envName = process.env.TEST_ENV || 'qa';

// Dynamic require to load the correct env config at runtime
// eslint-disable-next-line @typescript-eslint/no-require-imports
const envConfig = require(`@config/env/${envName}`).default;

const saucedemoConfig = {
  ...globalConfig,
  ...envConfig,
  productName: 'SauceDemo',
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/',
};

export default saucedemoConfig;
