require('dotenv').config();
const path = require('path');

module.exports = {
  // Browser settings
  browser: process.env.BROWSER || 'chromium',
  headless: process.env.HEADLESS === 'true', // Default false for local debugging unless explicit 'true'
  
  // Timeouts
  defaultTimeout: 30000,
  navigationTimeout: 15000,
  apiTimeout: 10000,

  // Diagnostics
  recordVideo: process.env.RECORD_VIDEO === 'true', // false by default to save disk space
  trace: process.env.TRACE || 'retain-on-failure', // 'on', 'off', 'retain-on-failure'
  screenshot: process.env.SCREENSHOT || 'only-on-failure',

  // Paths
  artifactsDir: path.resolve(__dirname, '../../reports/artifacts'),
  stateDir: path.resolve(__dirname, '../../.state')
};
