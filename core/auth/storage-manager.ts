import * as fs from 'fs';
import * as path from 'path';
import config from '@config/global.config';

/**
 * Manages Playwright storageState files for auth session reuse.
 *
 * Storage state files are saved in .state/ directory with the naming convention:
 *   {product}_{env}_{persona}.json
 *
 * This allows different products, environments, and user personas
 * to maintain separate authentication states.
 */
export class StorageManager {
  static getStoragePath(product: string, env: string, persona: string): string {
    if (!fs.existsSync(config.stateDir)) {
      fs.mkdirSync(config.stateDir, { recursive: true });
    }
    return path.join(config.stateDir, `${product}_${env}_${persona}.json`);
  }

  static hasStorageState(product: string, env: string, persona: string): boolean {
    return fs.existsSync(this.getStoragePath(product, env, persona));
  }
}
