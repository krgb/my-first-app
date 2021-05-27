module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: ['import'],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  extends: [
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.{js,ts,tsx}'],
      rules: {
        'react/prop-types': [2, { skipUndeclared: true }],
        'react/display-name': [0],
        'import/no-cycle': [2, { maxDepth: 10 }],
        'import/order': [0],
        // note you must disable the base no-shadow rule as it can report incorrect errors
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
      },
    },
    {
      files: ['src/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['error'],
      },
    },
  ],
};
