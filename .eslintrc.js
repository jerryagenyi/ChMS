module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['@typescript-eslint', 'jsx-a11y'],
  rules: {
    // TypeScript and React rules from .eslintrc.json
    'no-unused-vars': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Disable rules that conflict with Chakra UI
    'jsx-a11y/aria-props': 'off',
    'jsx-a11y/aria-proptypes': 'off',
    'jsx-a11y/aria-unsupported-elements': 'off',
    'jsx-a11y/role-has-required-aria-props': 'off',
    'jsx-a11y/role-supports-aria-props': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': 'off',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
    'jsx-a11y/aria-role': 'off',
  },
};
