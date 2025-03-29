import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OfflineFallback } from './OfflineFallback';

describe('OfflineFallback', () => {
  it('renders children when online', () => {
    render(
      <OfflineFallback isOffline={false}>
        <div>Test content</div>
      </OfflineFallback>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders offline message when offline', () => {
    render(
      <OfflineFallback isOffline={true}>
        <div>Test content</div>
      </OfflineFallback>
    );
    expect(screen.getByText("You're offline")).toBeInTheDocument();
    expect(
      screen.getByText('Please check your internet connection and try again.')
    ).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <OfflineFallback isOffline={true} fallback={<div>Custom offline message</div>}>
        <div>Test content</div>
      </OfflineFallback>
    );
    expect(screen.getByText('Custom offline message')).toBeInTheDocument();
  });

  it('reloads page when retry button is clicked', () => {
    const reloadSpy = vi.spyOn(window.location, 'reload');

    render(
      <OfflineFallback isOffline={true}>
        <div>Test content</div>
      </OfflineFallback>
    );

    fireEvent.click(screen.getByText('Retry'));
    expect(reloadSpy).toHaveBeenCalled();

    reloadSpy.mockRestore();
  });
});
