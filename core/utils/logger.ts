import winston from 'winston';
import * as path from 'path';

/**
 * Industry-standard logger built on Winston.
 *
 * Features:
 * - Levels: error, warn, info, http, debug
 * - Timestamps in YYYY-MM-DD HH:mm:ss format
 * - Colorized console output for local development
 * - File output: logs/error.log (errors only) + logs/combined.log (all)
 * - Context label (e.g., scenario name) for traceability
 * - Environment-aware: debug in dev, info in CI
 */

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan',
  },
};

winston.addColors(customLevels.colors);

const logsDir = path.resolve(process.cwd(), 'logs');

/** Determine log level based on environment */
function getLogLevel(): string {
  if (process.env.LOG_LEVEL) return process.env.LOG_LEVEL;
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

/**
 * Logger class wrapping Winston.
 * Instantiate with a context string (e.g., scenario name) for traceability.
 */
export class Logger {
  private winstonLogger: winston.Logger;
  private context: string;

  constructor(context: string = 'Global') {
    this.context = context;
    this.winstonLogger = winston.createLogger({
      level: getLogLevel(),
      levels: customLevels.levels,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          const base = `${timestamp} [${level.toUpperCase()}] [${this.context}] ${message}`;
          return stack ? `${base}\n${stack}` : base;
        }),
      ),
      transports: [
        // Console — colorized for readability
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message }) => {
              return `${timestamp} ${level} [${this.context}] ${message}`;
            }),
          ),
        }),
        // File — errors only
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // File — all levels
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });
  }

  info(msg: string): void {
    this.winstonLogger.info(msg);
  }

  error(msg: string, err?: Error): void {
    if (err) {
      this.winstonLogger.error(`${msg} — ${err.message}`, { stack: err.stack });
    } else {
      this.winstonLogger.error(msg);
    }
  }

  warn(msg: string): void {
    this.winstonLogger.warn(msg);
  }

  debug(msg: string): void {
    this.winstonLogger.debug(msg);
  }

  http(msg: string): void {
    this.winstonLogger.http(msg);
  }
}
