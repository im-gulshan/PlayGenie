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

export default config;
