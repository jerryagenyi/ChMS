import { create } from 'zustand';

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
}

interface WebhookStore {
  webhooks: Webhook[];
  addWebhook: (webhook: Webhook) => void;
  removeWebhook: (id: string) => void;
  updateWebhook: (id: string, updates: Partial<Webhook>) => void;
  setWebhooks: (webhooks: Webhook[]) => void;
}

export const useWebhookStore = create<WebhookStore>((set) => ({
  webhooks: [],
  addWebhook: (webhook) =>
    set((state) => ({
      webhooks: [...state.webhooks, webhook],
    })),
  removeWebhook: (id) =>
    set((state) => ({
      webhooks: state.webhooks.filter((w) => w.id !== id),
    })),
  updateWebhook: (id, updates) =>
    set((state) => ({
      webhooks: state.webhooks.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    })),
  setWebhooks: (webhooks) => set({ webhooks }),
})); 