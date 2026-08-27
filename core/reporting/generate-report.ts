import { generate } from 'multiple-cucumber-html-reporter';
import * as path from 'path';

/**
 * Report generator using multiple-cucumber-html-reporter.
 *
 * Automatically discovers all *-report.json files in the reports/ directory,
 * making it product-agnostic. Generates a modern, interactive HTML report
 * with metadata about the execution environment.
 *
 * Usage: npm run report
 */
generate({
  jsonDir: path.resolve(__dirname, '../../reports'),
  reportPath: path.resolve(__dirname, '../../reports/html-report'),
  metadata: {
    browser: {
      name: process.env.BROWSER || 'chromium',
      version: 'latest',
    },
    device: 'Local Test Machine',
    platform: {
      name: process.platform,
      version: process.version,
    },
  },
  customData: {
    title: 'PlayGenie Execution Report',
    data: [
      { label: 'Project', value: 'PlayGenie' },
      { label: 'Environment', value: process.env.TEST_ENV || 'qa' },
      { label: 'Browser', value: process.env.BROWSER || 'chromium' },
      { label: 'Execution Date', value: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' }) },
    ],
  },
});
