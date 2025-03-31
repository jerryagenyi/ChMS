import { render, screen } from '@testing-library/react';
import { PageLayout } from '@/layouts/PageLayout';

describe('PageLayout', () => {
  it('renders children with sidebar and header', () => {
    render(
      <PageLayout>
        <div data-testid="content">Content</div>
      </PageLayout>
    );

    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});