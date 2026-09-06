import { createProductConfig, ProductConfigBase, EnvironmentConfig } from '@config/global.config';

/**
 * SauceDemo product configuration.
 *
 * Merges: global config ← environment config ← product overrides.
 * The environment config is loaded dynamically based on TEST_ENV.
 */

/** Extend ProductConfigBase with any SauceDemo-specific config fields */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SauceDemoConfig extends ProductConfigBase {
  // Add product-specific fields here as SauceDemo grows
  // e.g., apiBaseUrl: string;
}

const envName = process.env.TEST_ENV || 'qa';

// Dynamic require to load the correct env config at runtime
const envConfig: EnvironmentConfig = require(`../../../config/env/${envName}`).default;

const saucedemoConfig = createProductConfig<SauceDemoConfig>(envConfig, {
  productName: 'SauceDemo',
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/',
});

export default saucedemoConfig;
