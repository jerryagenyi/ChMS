import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { Example } from '@/components/Example';

describe('Example Component', () => {
  it('renders correctly', () => {
    render(<Example />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const { user } = render(<Example />);
    const button = screen.getByRole('button');
    
    await user.click(button);
    
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});