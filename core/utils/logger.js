class Logger {
  constructor(context = 'Global') {
    this.context = context;
  }

  info(msg) {
    console.log(`[INFO] [${this.context}] ${msg}`);
  }

  error(msg, err) {
    console.error(`[ERROR] [${this.context}] ${msg}`);
    if (err) console.error(err);
  }

  debug(msg) {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG] [${this.context}] ${msg}`);
    }
  }
}

module.exports = { Logger };
