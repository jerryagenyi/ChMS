import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { DataSync } from '@/components/sync/DataSync';
import { ExternalServiceProvider } from '@/components/services/ExternalServiceProvider';
import { WebhookManager } from '@/components/services/WebhookManager';
import { useDataSync } from '@/hooks/useDataSync';
import { useWebhookStore } from '@/store/webhooks';

// Mock fetch for API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock IndexedDB for offline storage
const mockIDBStore = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: {
    open: () => ({
      result: mockIDBStore,
    }),
  },
});

// Test data
const mockData = {
  members: [
    { id: '1', name: 'John Doe', synced: true },
    { id: '2', name: 'Jane Smith', synced: false },
  ],
  events: [
    { id: '1', title: 'Sunday Service', synced: true },
    { id: '2', title: 'Youth Meeting', synced: false },
  ],
};

const mockWebhook = {
  id: '1',
  url: 'https://example.com/webhook',
  events: ['member.created', 'member.updated'],
  active: true,
};

describe('API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useWebhookStore.setState({ webhooks: [] });
  });

  describe('Data Synchronization', () => {
    it('syncs offline data when connection is restored', async () => {
      const online = vi.spyOn(navigator, 'onLine', 'get');
      online.mockReturnValue(false);

      mockIDBStore.getItem.mockResolvedValue(mockData);

      render(<DataSync />);

      // Simulate going online
      online.mockReturnValue(true);
      window.dispatchEvent(new Event('online'));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/sync',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockData),
          })
        );
      });

      online.mockRestore();
    });

    it('handles conflict resolution during sync', async () => {
      const conflictData = {
        ...mockData,
        members: [
          {
            id: '1',
            name: 'John Doe Updated',
            synced: false,
            lastModified: new Date().toISOString(),
          },
        ],
      };

      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 409,
            json: () =>
              Promise.resolve({
                error: 'Conflict',
                serverData: { name: 'John Doe Server' },
              }),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        );

      render(<DataSync onConflict={vi.fn()} />);

      // Trigger sync with conflict data
      fireEvent.click(screen.getByText(/sync now/i));

      await waitFor(() => {
        expect(screen.getByText(/conflict detected/i)).toBeInTheDocument();
      });

      // Resolve conflict by keeping local changes
      fireEvent.click(screen.getByText(/keep local/i));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(screen.getByText(/sync complete/i)).toBeInTheDocument();
      });
    });

    it('implements retry mechanism for failed syncs', async () => {
      mockFetch
        .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
        .mockImplementationOnce(() => Promise.reject(new Error('Network error')))
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        );

      render(<DataSync maxRetries={3} />);

      fireEvent.click(screen.getByText(/sync now/i));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(screen.getByText(/sync complete/i)).toBeInTheDocument();
      });
    });
  });

  describe('External Services', () => {
    it('integrates with external authentication service', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ token: 'external-service-token' }),
        })
      );

      render(
        <ExternalServiceProvider service="auth">
          <button>Connect Service</button>
        </ExternalServiceProvider>
      );

      fireEvent.click(screen.getByText(/connect service/i));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/services/auth/connect', expect.any(Object));
      });
    });

    it('handles external service errors gracefully', async () => {
      mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Service unavailable')));

      render(
        <ExternalServiceProvider service="payment">
          <button>Process Payment</button>
        </ExternalServiceProvider>
      );

      fireEvent.click(screen.getByText(/process payment/i));

      await waitFor(() => {
        expect(screen.getByText(/service unavailable/i)).toBeInTheDocument();
      });
    });

    it('refreshes external service tokens automatically', async () => {
      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ error: 'Token expired' }),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ token: 'new-token' }),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        );

      render(
        <ExternalServiceProvider service="storage">
          <button>Upload File</button>
        </ExternalServiceProvider>
      );

      fireEvent.click(screen.getByText(/upload file/i));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(3);
        expect(screen.getByText(/upload complete/i)).toBeInTheDocument();
      });
    });
  });

  describe('Webhook Handling', () => {
    it('registers and manages webhooks', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockWebhook),
        })
      );

      render(<WebhookManager />);

      // Register new webhook
      fireEvent.change(screen.getByLabelText(/webhook url/i), {
        target: { value: mockWebhook.url },
      });
      fireEvent.click(screen.getByLabelText(/member created/i));
      fireEvent.click(screen.getByLabelText(/member updated/i));
      fireEvent.click(screen.getByText(/register webhook/i));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/webhooks',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              url: mockWebhook.url,
              events: mockWebhook.events,
            }),
          })
        );
      });
    });

    it('validates webhook endpoints', async () => {
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      render(<WebhookManager />);

      // Test webhook endpoint
      fireEvent.click(screen.getByText(/test webhook/i));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          `/api/webhooks/${mockWebhook.id}/test`,
          expect.any(Object)
        );
        expect(screen.getByText(/webhook test successful/i)).toBeInTheDocument();
      });
    });

    it('handles webhook delivery failures', async () => {
      mockFetch
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ error: 'Webhook delivery failed' }),
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
        );

      render(<WebhookManager />);

      // Simulate webhook trigger
      fireEvent.click(screen.getByText(/trigger webhook/i));

      await waitFor(() => {
        expect(screen.getByText(/delivery failed/i)).toBeInTheDocument();
      });

      // Retry webhook delivery
      fireEvent.click(screen.getByText(/retry/i));

      await waitFor(() => {
        expect(screen.getByText(/delivery successful/i)).toBeInTheDocument();
      });
    });

    it('implements webhook security measures', async () => {
      const mockSignature = 'sha256=hash';
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ signature: mockSignature }),
        })
      );

      render(<WebhookManager />);

      // Generate webhook secret
      fireEvent.click(screen.getByText(/generate secret/i));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          `/api/webhooks/${mockWebhook.id}/secret`,
          expect.any(Object)
        );
        expect(screen.getByText(mockSignature)).toBeInTheDocument();
      });
    });
  });
});
