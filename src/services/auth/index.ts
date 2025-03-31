// Export all auth-related functionality
export * from './auth';
export * from './auth-options';
export * from './permissions';
export * from './roles';
export * from './tokens';

// Re-export the loginUser function that was previously here
export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  // Implementation will come later
  throw new Error('Not implemented');
};
