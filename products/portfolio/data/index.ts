/**
 * Environment-aware test data resolver.
 * Resolves to qa.data.ts for the portfolio product (single public environment).
 */
const envName = process.env.TEST_ENV || 'qa';

// Use dynamic require so that we do not bundle all envs
export const portfolioData = require(`./${envName}.data`).default;
