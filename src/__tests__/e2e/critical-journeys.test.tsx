import { test, expect, Page } from '@playwright/test';

test.describe('Critical User Journeys', () => {
  test.describe('Attendance Flow', () => {
    test('complete QR check-in process', async ({ page }: { page: Page }) => {
      // Login first
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'admin@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');
      await expect(page).toHaveURL('/dashboard');

      // Navigate to attendance page
      await page.click('[data-testid="nav-attendance"]');
      await expect(page).toHaveURL('/attendance');

      // Generate QR code for an event
      await page.click('[data-testid="create-event-qr"]');
      await page.fill('[data-testid="event-name"]', 'Sunday Service');
      await page.click('[data-testid="generate-qr"]');

      // Verify QR code is generated
      await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();

      // Simulate QR scan
      await page.click('[data-testid="scan-qr"]');
      await expect(page.locator('[data-testid="camera-view"]')).toBeVisible();

      // Mock successful QR scan
      await page.evaluate(() => {
        window.postMessage({ type: 'QR_SCAN_SUCCESS', data: 'event_123' }, '*');
      });

      // Verify check-in success
      await expect(page.locator('[data-testid="check-in-success"]')).toBeVisible();
      await expect(page.locator('[data-testid="attendance-count"]')).toContainText('1');
    });

    test('complete manual check-in process', async ({ page }: { page: Page }) => {
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'admin@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');

      // Navigate to manual check-in
      await page.click('[data-testid="nav-attendance"]');
      await page.click('[data-testid="manual-check-in"]');

      // Fill check-in form
      await page.fill('[data-testid="member-search"]', 'John');
      await page.click('[data-testid="member-select"]');
      await page.fill('[data-testid="check-in-notes"]', 'Manual check-in');
      await page.click('[data-testid="submit-check-in"]');

      // Verify check-in success
      await expect(page.locator('[data-testid="check-in-success"]')).toBeVisible();
    });

    test('generate and view basic attendance report', async ({ page }: { page: Page }) => {
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'admin@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');

      // Navigate to reports
      await page.click('[data-testid="nav-reports"]');

      // Set report parameters
      await page.fill('[data-testid="date-from"]', '2024-01-01');
      await page.fill('[data-testid="date-to"]', '2024-12-31');
      await page.click('[data-testid="generate-report"]');

      // Verify report content
      await expect(page.locator('[data-testid="report-table"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-attendance"]')).toBeVisible();

      // Test export functionality
      await page.click('[data-testid="export-report"]');
      const download = await page.waitForEvent('download');
      expect(download.suggestedFilename()).toContain('attendance-report');
    });
  });

  test.describe('Authentication Flow', () => {
    test('complete login process with session management', async ({ page }: { page: Page }) => {
      await page.goto('/login');

      // Attempt to access protected route before login
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/login');

      // Login
      await page.fill('[data-testid="email-input"]', 'admin@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');

      // Verify successful login and redirection
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

      // Test session persistence
      await page.reload();
      await expect(page).toHaveURL('/dashboard');
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

      // Test protected route access
      await page.goto('/settings');
      await expect(page).toHaveURL('/settings');

      // Test logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      await expect(page).toHaveURL('/login');

      // Verify session is cleared
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/login');
    });

    test('handles invalid login attempts', async ({ page }: { page: Page }) => {
      await page.goto('/login');

      // Test invalid credentials
      await page.fill('[data-testid="email-input"]', 'wrong@example.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');

      // Verify error message
      await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
      await expect(page).toHaveURL('/login');

      // Test empty form validation
      await page.click('[data-testid="login-button"]');
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    });

    test('handles session expiry', async ({ page }: { page: Page }) => {
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'admin@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');

      // Simulate session expiry
      await page.evaluate(() => {
        localStorage.removeItem('session');
        window.dispatchEvent(new Event('storage'));
      });

      // Verify redirect to login
      await expect(page).toHaveURL('/login');
      await expect(page.locator('[data-testid="session-expired"]')).toBeVisible();
    });

    test('respects role-based access control', async ({ page }: { page: Page }) => {
      // Login as regular user
      await page.goto('/login');
      await page.fill('[data-testid="email-input"]', 'user@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');

      // Try to access admin-only route
      await page.goto('/admin/settings');

      // Verify access denied
      await expect(page).toHaveURL('/access-denied');
      await expect(page.locator('[data-testid="access-denied-message"]')).toBeVisible();
    });
  });

  test.describe('Supporting Flows', () => {
    test.describe('Member Management', () => {
      test('complete member lifecycle', async ({ page }: { page: Page }) => {
        // Login
        await page.goto('/login');
        await page.fill('[data-testid="email-input"]', 'admin@example.com');
        await page.fill('[data-testid="password-input"]', 'password123');
        await page.click('[data-testid="login-button"]');

        // Create new member
        await page.click('[data-testid="nav-members"]');
        await page.click('[data-testid="add-member"]');
        await page.fill('[data-testid="member-name"]', 'Jane Smith');
        await page.fill('[data-testid="member-email"]', 'jane@example.com');
        await page.fill('[data-testid="member-phone"]', '+44123456789');
        await page.selectOption('[data-testid="member-status"]', 'active');
        await page.click('[data-testid="save-member"]');

        // Verify member creation
        await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
        await expect(page.locator('[data-testid="members-table"]')).toContainText('Jane Smith');

        // Update member
        await page.click('[data-testid="edit-member-Jane Smith"]');
        await page.fill('[data-testid="member-phone"]', '+44987654321');
        await page.click('[data-testid="save-member"]');
        await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();

        // Delete member
        await page.click('[data-testid="delete-member-Jane Smith"]');
        await page.click('[data-testid="confirm-delete"]');
        await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
        await expect(page.locator('[data-testid="members-table"]')).not.toContainText('Jane Smith');
      });
    });

    test.describe('Search and Filter', () => {
      test('search and filter functionality', async ({ page }: { page: Page }) => {
        // Login and navigate to members
        await page.goto('/login');
        await page.fill('[data-testid="email-input"]', 'admin@example.com');
        await page.fill('[data-testid="password-input"]', 'password123');
        await page.click('[data-testid="login-button"]');
        await page.click('[data-testid="nav-members"]');

        // Test search
        await page.fill('[data-testid="search-input"]', 'John');
        await expect(page.locator('[data-testid="members-table"]')).toContainText('John');
        await expect(page.locator('[data-testid="search-results-count"]')).toBeVisible();

        // Test filters
        await page.click('[data-testid="filter-button"]');
        await page.selectOption('[data-testid="status-filter"]', 'active');
        await page.selectOption('[data-testid="role-filter"]', 'member');
        await page.click('[data-testid="apply-filters"]');

        // Verify filtered results
        await expect(page.locator('[data-testid="filter-chips"]')).toBeVisible();
        await expect(page.locator('[data-testid="filter-chips"]')).toContainText('Status: Active');
        await expect(page.locator('[data-testid="filter-chips"]')).toContainText('Role: Member');

        // Clear filters
        await page.click('[data-testid="clear-filters"]');
        await expect(page.locator('[data-testid="filter-chips"]')).not.toBeVisible();
      });

      test('pagination and sorting', async ({ page }: { page: Page }) => {
        // Login and navigate to members
        await page.goto('/login');
        await page.fill('[data-testid="email-input"]', 'admin@example.com');
        await page.fill('[data-testid="password-input"]', 'password123');
        await page.click('[data-testid="login-button"]');
        await page.click('[data-testid="nav-members"]');

        // Test pagination
        await expect(page.locator('[data-testid="pagination"]')).toBeVisible();
        await page.click('[data-testid="next-page"]');
        await expect(page.locator('[data-testid="page-number"]')).toContainText('2');

        // Test sorting
        await page.click('[data-testid="sort-by-name"]');
        await expect(page.locator('[data-testid="sort-indicator"]')).toBeVisible();
        await page.click('[data-testid="sort-by-name"]');
        await expect(page.locator('[data-testid="sort-indicator"]')).toHaveAttribute(
          'data-sort',
          'desc'
        );
      });
    });
  });
});
