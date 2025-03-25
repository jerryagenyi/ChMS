import { render, screen } from '@testing-library/react';

describe('Test Setup', () => {
  it('should work with basic assertions', () => {
    expect(true).toBe(true);
  });

  it('should have access to DOM testing utilities', () => {
    expect(screen).toBeDefined();
    expect(render).toBeDefined();
  });

  it('should have fetch mocked', () => {
    expect(fetch).toBeDefined();
    expect(jest.isMockFunction(fetch)).toBe(true);
  });
});
