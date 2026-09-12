import { createProductConfig, ProductConfigBase, EnvironmentConfig } from '@config/global.config';

/**
 * Portfolio product configuration.
 *
 * Merges: global config <- environment config <- product overrides.
 * The environment config is loaded dynamically based on TEST_ENV.
 */

/** Extend ProductConfigBase with any Portfolio-specific config fields */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PortfolioConfig extends ProductConfigBase {
  // Add product-specific fields here as Portfolio grows
}

const envName = process.env.TEST_ENV || 'qa';

// Dynamic require to load the correct env config at runtime
const envConfig: EnvironmentConfig = require(`../../../config/env/${envName}`).default;

const portfolioConfig = createProductConfig<PortfolioConfig>(envConfig, {
  productName: 'Portfolio',
  baseUrl: process.env.PORTFOLIO_URL || 'https://gulshan-sdet.in/',
});

export default portfolioConfig;
