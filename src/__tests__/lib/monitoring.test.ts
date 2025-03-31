import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, performanceMonitor, trackError, trackEvent, securityMetrics } from '../monitoring';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  default: {
    captureException: vi.fn(),
    addBreadcrumb: vi.fn(),
  },
}));

// Mock Winston logger
vi.mock('winston', () => ({
  default: {
    createLogger: vi.fn(() => ({
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    })),
    format: {
      combine: vi.fn(),
      timestamp: vi.fn(),
      json: vi.fn(),
      errors: vi.fn(),
      colorize: vi.fn(),
      simple: vi.fn(),
      padLevels: vi.fn(),
    },
    transports: {
      File: vi.fn(),
      Console: vi.fn(),
    },
  },
}));

describe('Monitoring System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Performance Monitoring', () => {
    it('should track performance metrics', () => {
      const end = performanceMonitor.start('test-operation', { service: 'api' });
      vi.advanceTimersByTime(100);
      const duration = end();
      
      expect(duration).toBeGreaterThan(0);
    });

    it('should track custom metrics', () => {
      const logSpy = vi.spyOn(logger, 'info');
      performanceMonitor.trackMetric('api-latency', 100, { endpoint: '/api/test' });
      
      expect(logSpy).toHaveBeenCalledWith({
        type: 'metric',
        name: 'api-latency',
        value: 100,
        endpoint: '/api/test',
      });
    });
  });

  describe('Error Tracking', () => {
    it('should track errors with context', () => {
      const error = new Error('Test error');
      const context = { userId: '123' };
      
      trackError(error, context);
      
      // Verify error was logged
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('Security Metrics', () => {
    it('should log rate limit checks', () => {
      const logSpy = vi.spyOn(logger, 'info');
      securityMetrics.logRateLimit('127.0.0.1', '/api/test', 5, true);
      
      expect(logSpy).toHaveBeenCalled();
    });

    it('should log upload size checks', () => {
      const logSpy = vi.spyOn(logger, 'info');
      securityMetrics.logUploadSize('/api/upload', 1024, true);
      
      expect(logSpy).toHaveBeenCalled();
    });

    it('should log cache operations', () => {
      const logSpy = vi.spyOn(logger, 'info');
      securityMetrics.logCache('/api/data', true);
      
      expect(logSpy).toHaveBeenCalled();
    });

    it('should log security errors', () => {
      const error = new Error('Security violation');
      securityMetrics.logError('rate_limit', error, { ip: '127.0.0.1' });
      
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('Event Tracking', () => {
    it('should track events with tags', () => {
      const logSpy = vi.spyOn(logger, 'info');
      trackEvent('user_login', { userId: '123' }, ['auth', 'security']);
      
      expect(logSpy).toHaveBeenCalledWith({
        type: 'event',
        event: 'user_login',
        userId: '123',
        tags: ['auth', 'security'],
      });
    });
  });
}); 