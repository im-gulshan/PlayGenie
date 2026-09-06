/**
 * Environment-aware test data resolver.
 * Merges common data with environment-specific overrides.
 */
const envName = process.env.TEST_ENV || 'qa';

// Use dynamic require so that we don't bundle all envs
export const sauceDemoData = require(`./${envName}.data`).default;
