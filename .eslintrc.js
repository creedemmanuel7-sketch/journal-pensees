module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      plugins: ['@babel/plugin-syntax-jsx', '@babel/plugin-syntax-flow'],
    },
  },
  rules: {
    'prettier/prettier': 'warn',
    // Laissé en warning : corriger ces règles impliquerait de réécrire de la
    // logique (dépendances de hooks, etc.), ce qui pourrait changer le comportement.
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          plugins: ['@babel/plugin-syntax-jsx', '@babel/plugin-syntax-flow'],
        },
      },
    },
    {
      files: ['jest.config.js', 'jest.setup.js', '*.config.js'],
      env: {
        jest: true,
        node: true,
      },
    },
  ],
};
