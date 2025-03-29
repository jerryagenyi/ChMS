import { logger as winstonLogger } from './logger';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  service?: string;
  operation?: string;
  userId?: string;
  organizationId?: string;
  [key: string]: any;
}

class Logger {
  private static instance: Logger;
  private context: LogContext = {};

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  private formatMessage(level: LogLevel, message: string, context: LogContext = {}) {
    const timestamp = new Date().toISOString();
    const mergedContext = { ...this.context, ...context };
    
    return {
      timestamp,
      level,
      message,
      ...mergedContext,
    };
  }

  info(message: string, context: LogContext = {}) {
    winstonLogger.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context: LogContext = {}) {
    winstonLogger.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context: LogContext = {}) {
    const errorContext = error ? {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    } : context;
    
    winstonLogger.error(this.formatMessage('error', message, errorContext));
  }

  debug(message: string, context: LogContext = {}) {
    winstonLogger.debug(this.formatMessage('debug', message, context));
  }
}

export const logger = Logger.getInstance(); 