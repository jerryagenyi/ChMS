
export const themeConfig = {
  colors: {
    purple: {
      50: '#F8F6FD',
      100: '#E9E4F9',
      200: '#D5CBF3',
      300: '#BFB0ED',
      400: '#A894E6',
      500: '#8E75DF',
      600: '#553C9A', // Primary purple
      700: '#4C3690',
      800: '#442F86',
      900: '#382873',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'purple',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
};

