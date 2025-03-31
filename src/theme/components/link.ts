export const Link = {
  baseStyle: {
    color: 'pink.500',
    textDecoration: 'underline',
    _hover: {
      color: 'pink.600'
    }
  },
  variants: {
    nav: {
      textDecoration: 'none',
      _hover: {
        textDecoration: 'underline'
      }
    },
    auth: {
      color: 'pink.500',
      textDecoration: 'underline',
      fontWeight: 'medium'
    }
  }
}