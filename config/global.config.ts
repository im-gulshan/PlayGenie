import 'dotenv/config';
import * as path from 'path';

export interface GlobalConfig {
  browser: string;
  headless: boolean;
  defaultTimeout: number;
  navigationTimeout: number;
  apiTimeout: number;
  recordVideo: boolean;
  trace: 'on' | 'off' | 'retain-on-failure';
  screenshot: 'on' | 'off' | 'only-on-failure';
  artifactsDir: string;
  stateDir: string;
}

/** Environment-level config overrides (partial GlobalConfig + env metadata) */
export interface EnvironmentConfig extends Partial<GlobalConfig> {
  envName: string;
}

/** Base shape for all product configs — extends GlobalConfig with product-specific fields */
export interface ProductConfigBase extends GlobalConfig {
  productName: string;
  baseUrl: string;
  envName: string;
}

const config: GlobalConfig = {
  // Browser settings
  browser: process.env.BROWSER || 'chromium',
  headless: process.env.HEADLESS === 'true',

  // Timeouts
  defaultTimeout: 30000,
  navigationTimeout: 15000,
  apiTimeout: 10000,

  // Diagnostics
  recordVideo: process.env.RECORD_VIDEO === 'true',
  trace: (process.env.TRACE as GlobalConfig['trace']) || 'retain-on-failure',
  screenshot: (process.env.SCREENSHOT as GlobalConfig['screenshot']) || 'only-on-failure',

  // Paths
  artifactsDir: path.resolve(__dirname, '../reports/artifacts'),
  stateDir: path.resolve(__dirname, '../.state'),
};

/**
 * Create a fully typed product config by merging:
 *   global defaults ← environment overrides ← product overrides
 *
 * @param envConfig - Environment-specific overrides (loaded from config/env/)
 * @param productOverrides - Product-specific fields (name, baseUrl, etc.)
 * @returns A strongly-typed product configuration object
 *
 * @example
 * ```typescript
 * interface SauceDemoConfig extends ProductConfigBase {
 *   // Add product-specific fields here
 * }
 *
 * const config = createProductConfig<SauceDemoConfig>(envConfig, {
 *   productName: 'SauceDemo',
 *   baseUrl: 'https://www.saucedemo.com/',
 * });
 * ```
 */
export function createProductConfig<T extends ProductConfigBase>(
  envConfig: EnvironmentConfig,
  productOverrides: Omit<T, keyof GlobalConfig | 'envName'> & Partial<GlobalConfig>,
): T {
  return {
    ...config,
    ...envConfig,
    ...productOverrides,
    envName: envConfig.envName,
  } as T;
}

export default config;
