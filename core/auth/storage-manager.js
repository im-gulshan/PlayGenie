const fs = require('fs');
const path = require('path');
const config = require('../../config/global.config');

class StorageManager {
  static getStoragePath(product, env, persona) {
    if (!fs.existsSync(config.stateDir)) {
      fs.mkdirSync(config.stateDir, { recursive: true });
    }
    return path.join(config.stateDir, `${product}_${env}_${persona}.json`);
  }

  static hasStorageState(product, env, persona) {
    return fs.existsSync(this.getStoragePath(product, env, persona));
  }
}

module.exports = { StorageManager };
