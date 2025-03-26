import { AppError } from './errors';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: AppError;
  details?: unknown;
  context?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, error, details, context } = entry;
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    if (error) {
      logMessage += `\nError: ${error.message}`;
      if (error.code) logMessage += `\nCode: ${error.code}`;
      if (error.details) logMessage += `\nDetails: ${JSON.stringify(error.details)}`;
    }

    if (details) {
      logMessage += `\nDetails: ${JSON.stringify(details)}`;
    }

    if (context) {
      logMessage += `\nContext: ${JSON.stringify(context)}`;
    }

    return logMessage;
  }

  private log(level: LogLevel, message: string, error?: AppError, details?: unknown, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error,
      details,
      context,
    };

    const formattedMessage = this.formatLogEntry(entry);

    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
      default:
        console.log(formattedMessage);
    }

    // TODO: Send to error reporting service in production
    if (level === 'error' && !this.isDevelopment) {
      // Implement error reporting service integration
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, undefined, undefined, context);
  }

  warn(message: string, error?: AppError, context?: Record<string, unknown>) {
    this.log('warn', message, error, undefined, context);
  }

  error(message: string, error?: AppError, details?: unknown, context?: Record<string, unknown>) {
    this.log('error', message, error, details, context);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, undefined, undefined, context);
  }
}

export const logger = Logger.getInstance(); 