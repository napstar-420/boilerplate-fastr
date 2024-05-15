module.exports = {
  extends: ['next/core-web-vitals', 'prettier', 'plugin:tailwindcss/recommended'],
  plugins: ['tailwindcss'],
  settings: {
    tailwindcss: {
      callees: ['cn'],
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'off',
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/no-anonymous-default-export': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    '@next/next/no-img-element': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/classnames-order': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
};
