export const STORE_CONFIG = {
  PERSISTENCE: {
    ENABLED_STORES: ['attendance', 'members', 'services'],
    TTL: 24 * 60 * 60 * 1000, // 24 hours
    STORAGE_KEY: 'app_store',
  },
  CACHE: {
    ENABLED: true,
    MAX_ITEMS: 100,
    TTL: 5 * 60 * 1000, // 5 minutes
  },
} as const;