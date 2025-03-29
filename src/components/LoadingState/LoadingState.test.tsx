import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('renders children when not loading', () => {
    render(
      <LoadingState isLoading={false}>
        <div>Test content</div>
      </LoadingState>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders loading spinner when loading', () => {
    render(
      <LoadingState isLoading={true}>
        <div>Test content</div>
      </LoadingState>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <LoadingState isLoading={true} fallback={<div>Custom loading message</div>}>
        <div>Test content</div>
      </LoadingState>
    );
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });
});
