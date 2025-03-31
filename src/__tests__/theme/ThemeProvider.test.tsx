import { render } from '@testing-library/react';
import { useTheme } from '@chakra-ui/react';
import { ThemeProvider } from '@/theme/ThemeProvider';

describe('ThemeProvider', () => {
  it('provides custom theme correctly', () => {
    const TestComponent = () => {
      const theme = useTheme();
      return <div data-testid="theme-test">{theme.config.initialColorMode}</div>;
    };

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('theme-test')).toHaveTextContent('light');
  });
});