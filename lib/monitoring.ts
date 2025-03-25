import { Sentry } from '@sentry/nextjs';
import pino from 'pino';

// Configure structured logging
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
});

// Custom performance monitoring
export const performanceMonitor = {
  start: (label: string) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      logger.info({ type: 'performance', label, duration });
      return duration;
    };
  }
};

// Error tracking
export const trackError = (error: Error, context: Record<string, any> = {}) => {
  // Log locally
  logger.error({
    error: {
      message: error.message,
      stack: error.stack,
      ...context,
    },
  });

  // Send to Sentry
  Sentry.captureException(error, {
    extra: context,
  });
};

// Usage tracking
export const trackEvent = (
  eventName: string,
  properties: Record<string, any> = {}
) => {
  logger.info({
    type: 'event',
    event: eventName,
    ...properties,
  });
};