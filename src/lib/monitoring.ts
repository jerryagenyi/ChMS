import * as Sentry from '@sentry/nextjs';
import type { Logger } from 'pino';
import pino from 'pino';
import winston from 'winston';

// Configure structured logging
export const logger: Logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  redact: ['password', 'token', 'secret'], // Redact sensitive data
});

// Enhanced performance monitoring
export const performanceMonitor = {
  start: (label: string, tags: Record<string, string> = {}) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      logger.info({
        type: 'performance',
        label,
        duration,
        ...tags,
      });
      
      // Send to Sentry performance monitoring
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${label} completed`,
        data: { duration, ...tags },
      });
      
      return duration;
    };
  },
  
  // Track specific metrics
  trackMetric: (name: string, value: number, tags: Record<string, string> = {}) => {
    logger.info({
      type: 'metric',
      name,
      value,
      ...tags,
    });
  }
};

// Enhanced error tracking
export const trackError = (
  error: Error,
  context: Record<string, any> = {},
  severity: 'error' | 'warning' | 'info' = 'error'
) => {
  const errorContext = {
    ...context,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  // Log locally with severity
  logger[severity]({
    error: {
      message: error.message,
      stack: error.stack,
      ...errorContext,
    },
  });

  // Send to Sentry with severity
  Sentry.captureException(error, {
    level: severity,
    extra: errorContext,
  });
};

// Enhanced usage tracking
export const trackEvent = (
  eventName: string,
  properties: Record<string, any> = {},
  tags: string[] = []
) => {
  logger.info({
    type: 'event',
    event: eventName,
    tags,
    ...properties,
  });
};

// Create Winston logger with enhanced configuration
const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors({ stack: true })
  ),
  defaultMeta: { 
    service: 'security-middleware',
    environment: process.env.NODE_ENV 
  },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({ 
      filename: 'logs/security.log',
      maxsize: 10485760, // 10MB
      maxFiles: 7,
    }),
  ],
});

// Add console transport in development with better formatting
if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.padLevels()
    ),
  }));
}

interface SecurityMetric {
  type: 'rate_limit' | 'upload_size' | 'cache';
  status: 'success' | 'failure' | 'hit' | 'miss';
  path: string;
  ip?: string;
  details?: Record<string, any>;
}

export const securityMetrics = {
  logRateLimit(ip: string, path: string, remaining: number, success: boolean) {
    const metric = {
      type: 'rate_limit',
      status: success ? 'success' : 'failure',
      ip,
      path,
      remaining,
      timestamp: new Date().toISOString(),
    };

    winstonLogger.info('Rate limit check', metric);
    performanceMonitor.trackMetric('rate_limit_remaining', remaining, { ip, path });
  },

  logUploadSize(path: string, size: number, success: boolean) {
    const metric = {
      type: 'upload_size',
      status: success ? 'success' : 'failure',
      path,
      size,
      timestamp: new Date().toISOString(),
    };

    winstonLogger.info('Upload size check', metric);
    performanceMonitor.trackMetric('upload_size', size, { path });
  },

  logCache(path: string, hit: boolean) {
    const metric = {
      type: 'cache',
      status: hit ? 'hit' : 'miss',
      path,
      timestamp: new Date().toISOString(),
    };

    winstonLogger.info('Cache access', metric);
    performanceMonitor.trackMetric('cache_hit_rate', hit ? 1 : 0, { path });
  },

  logError(
    type: SecurityMetric['type'],
    error: Error,
    details?: Record<string, any>
  ) {
    const errorContext = {
      type,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...details,
    };

    winstonLogger.error('Security error', errorContext);
    trackError(error, { type, ...details });
  },
};

export default securityMetrics;