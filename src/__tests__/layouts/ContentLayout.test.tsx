import { render, screen } from '@testing-library/react';
import { ContentLayout } from '@/layouts/ContentLayout';

describe('ContentLayout', () => {
  it('applies correct width constraints and spacing', () => {
    render(
      <ContentLayout>
        <div data-testid="content">Content</div>
      </ContentLayout>
    );

    const container = screen.getByTestId('content').parentElement;
    expect(container).toHaveStyle({
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem'
    });
  });
});