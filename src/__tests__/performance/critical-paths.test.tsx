import { test, expect } from '@playwright/test';

test.describe('Performance Testing - Critical Paths', () => {
  test.describe('Attendance Operations', () => {
    test('QR check-in performance', async ({ page }) => {
      // Measure initial page load
      const startNavigation = await page.goto('/attendance');
      expect(startNavigation?.request().timing().responseEnd).toBeLessThan(2000); // 2s threshold

      // Measure QR code generation
      const qrStartTime = Date.now();
      await page.click('[data-testid="create-event-qr"]');
      await page.fill('[data-testid="event-name"]', 'Sunday Service');
      await page.click('[data-testid="generate-qr"]');
      await page.waitForSelector('[data-testid="qr-code"]');
      expect(Date.now() - qrStartTime).toBeLessThan(1000); // 1s threshold

      // Measure check-in response time
      const checkInStartTime = Date.now();
      await page.evaluate(() => {
        window.postMessage({ type: 'QR_SCAN_SUCCESS', data: 'event_123' }, '*');
      });
      await page.waitForSelector('[data-testid="check-in-success"]');
      expect(Date.now() - checkInStartTime).toBeLessThan(500); // 500ms threshold
    });

    test('batch check-in performance', async ({ page }) => {
      // Measure bulk operation performance
      await page.goto('/attendance/bulk');
      const bulkStartTime = Date.now();

      // Simulate bulk check-in of 100 members
      await page.click('[data-testid="bulk-check-in"]');
      await page.waitForSelector('[data-testid="bulk-success"]');

      expect(Date.now() - bulkStartTime).toBeLessThan(5000); // 5s threshold for bulk operation
    });
  });

  test.describe('Authentication Flows', () => {
    test('login response time', async ({ page }) => {
      await page.goto('/login');

      const loginStartTime = Date.now();
      await page.fill('[data-testid="email-input"]', 'admin@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');

      // Wait for dashboard redirect
      await page.waitForURL('/dashboard');
      expect(Date.now() - loginStartTime).toBeLessThan(1000); // 1s threshold
    });

    test('session validation performance', async ({ page }) => {
      // Test session validation speed
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'admin@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');

      // Measure protected route access time
      const routeStartTime = Date.now();
      await page.goto('/settings');
      await page.waitForSelector('[data-testid="settings-page"]');
      expect(Date.now() - routeStartTime).toBeLessThan(300); // 300ms threshold
    });
  });

  test.describe('Data Operations', () => {
    test('member data CRUD performance', async ({ page }) => {
      await page.goto('/members');

      // Create operation
      const createStartTime = Date.now();
      await page.click('[data-testid="add-member"]');
      await page.fill('[data-testid="member-name"]', 'Performance Test');
      await page.fill('[data-testid="member-email"]', 'perf@test.com');
      await page.click('[data-testid="save-member"]');
      await page.waitForSelector('[data-testid="success-toast"]');
      expect(Date.now() - createStartTime).toBeLessThan(1000); // 1s threshold

      // Read operation (search and filter)
      const searchStartTime = Date.now();
      await page.fill('[data-testid="search-input"]', 'Performance');
      await page.waitForSelector('[data-testid="members-table"]');
      expect(Date.now() - searchStartTime).toBeLessThan(500); // 500ms threshold

      // Update operation
      const updateStartTime = Date.now();
      await page.click('[data-testid="edit-member-Performance Test"]');
      await page.fill('[data-testid="member-name"]', 'Performance Test Updated');
      await page.click('[data-testid="save-member"]');
      await page.waitForSelector('[data-testid="success-toast"]');
      expect(Date.now() - updateStartTime).toBeLessThan(1000); // 1s threshold
    });

    test('data synchronization performance', async ({ page }) => {
      await page.goto('/dashboard');

      // Measure initial data load
      const syncStartTime = Date.now();
      await page.click('[data-testid="sync-data"]');
      await page.waitForSelector('[data-testid="sync-complete"]');
      expect(Date.now() - syncStartTime).toBeLessThan(3000); // 3s threshold for full sync

      // Measure incremental sync
      const incrementalStartTime = Date.now();
      await page.click('[data-testid="sync-data"]');
      await page.waitForSelector('[data-testid="sync-complete"]');
      expect(Date.now() - incrementalStartTime).toBeLessThan(1000); // 1s threshold for incremental sync
    });
  });
});

test.describe('Supporting Features Performance', () => {
  test.describe('Search Response Times', () => {
    test('global search performance', async ({ page }) => {
      await page.goto('/dashboard');

      // Test global search response
      const globalSearchTime = Date.now();
      await page.fill('[data-testid="global-search"]', 'John');
      await page.waitForSelector('[data-testid="search-results"]');
      expect(Date.now() - globalSearchTime).toBeLessThan(300); // 300ms threshold

      // Test search with filters
      const filteredSearchTime = Date.now();
      await page.click('[data-testid="search-filters"]');
      await page.selectOption('[data-testid="member-type"]', 'active');
      await page.click('[data-testid="apply-filters"]');
      await page.waitForSelector('[data-testid="filtered-results"]');
      expect(Date.now() - filteredSearchTime).toBeLessThan(500); // 500ms threshold
    });

    test('typeahead search performance', async ({ page }) => {
      await page.goto('/members');

      // Test typeahead response time
      const typeaheadTime = Date.now();
      await page.type('[data-testid="member-search"]', 'Smi');
      await page.waitForSelector('[data-testid="typeahead-results"]');
      expect(Date.now() - typeaheadTime).toBeLessThan(150); // 150ms threshold for good UX
    });
  });

  test.describe('Report Generation', () => {
    test('basic report generation time', async ({ page }) => {
      await page.goto('/reports');

      // Test basic attendance report
      const basicReportTime = Date.now();
      await page.click('[data-testid="generate-basic-report"]');
      await page.waitForSelector('[data-testid="report-ready"]');
      expect(Date.now() - basicReportTime).toBeLessThan(2000); // 2s threshold
    });

    test('complex report with filters', async ({ page }) => {
      await page.goto('/reports/advanced');

      // Set up complex report parameters
      await page.selectOption('[data-testid="date-range"]', 'last-month');
      await page.selectOption('[data-testid="group-by"]', 'department');
      await page.click('[data-testid="include-demographics"]');

      // Generate and measure complex report time
      const complexReportTime = Date.now();
      await page.click('[data-testid="generate-report"]');
      await page.waitForSelector('[data-testid="report-complete"]');
      expect(Date.now() - complexReportTime).toBeLessThan(5000); // 5s threshold for complex reports
    });

    test('export performance', async ({ page }) => {
      await page.goto('/reports');

      // Test export generation time
      const exportTime = Date.now();
      await page.click('[data-testid="export-excel"]');
      await page.waitForSelector('[data-testid="export-ready"]');
      expect(Date.now() - exportTime).toBeLessThan(3000); // 3s threshold for exports
    });
  });

  test.describe('Batch Operations', () => {
    test('bulk member update performance', async ({ page }) => {
      await page.goto('/members');

      // Select multiple members
      await page.click('[data-testid="select-all"]');

      // Test bulk update performance
      const bulkUpdateTime = Date.now();
      await page.click('[data-testid="bulk-edit"]');
      await page.selectOption('[data-testid="bulk-status"]', 'active');
      await page.click('[data-testid="apply-bulk-update"]');
      await page.waitForSelector('[data-testid="bulk-update-complete"]');
      expect(Date.now() - bulkUpdateTime).toBeLessThan(3000); // 3s threshold
    });

    test('mass communication performance', async ({ page }) => {
      await page.goto('/communications');

      // Test mass email performance
      const massEmailTime = Date.now();
      await page.click('[data-testid="new-mass-email"]');
      await page.fill('[data-testid="email-subject"]', 'Test Mass Email');
      await page.fill('[data-testid="email-content"]', 'Test content');
      await page.click('[data-testid="send-mass-email"]');
      await page.waitForSelector('[data-testid="email-queued"]');
      expect(Date.now() - massEmailTime).toBeLessThan(2000); // 2s threshold
    });

    test('data import performance', async ({ page }) => {
      await page.goto('/import');

      // Test CSV import performance
      const importTime = Date.now();
      await page.setInputFiles('[data-testid="csv-input"]', 'test-data.csv');
      await page.click('[data-testid="start-import"]');
      await page.waitForSelector('[data-testid="import-complete"]');
      expect(Date.now() - importTime).toBeLessThan(10000); // 10s threshold for large imports
    });
  });
});
