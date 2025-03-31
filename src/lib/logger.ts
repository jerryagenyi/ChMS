 type LogLevel = 'info' | 'error' | 'warn' | 'debug';

const log = (level: LogLevel, message: string, meta?: unknown) => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta);
};

export const logger = {
  info: (message: string, meta?: unknown) => log('info', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  debug: (message: string, meta?: unknown) => log('debug', message, meta),
};