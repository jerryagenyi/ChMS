import { vi } from 'vitest';

export const mockPush = vi.fn();
export const mockReplace = vi.fn();
export const mockBack = vi.fn();

const useRouter = vi.fn(() => ({
  push: mockPush,
  replace: mockReplace,
  back: mockBack,
  pathname: '/protected-route',
  query: {},
  asPath: '/protected-route',
  events: {
    on: vi.fn(),
    off: vi.fn(),
  },
}));

export { useRouter };

export default {
  useRouter,
}; 