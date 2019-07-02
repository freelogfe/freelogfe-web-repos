const path = require('path')

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  settings: {
    '@': { path: path.resolve('./src') }
  },
  rules: {
    'global-require': 'off',
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': [2, { code: 1e3 }],
    'no-param-reassign': 0,
    'no-bitwise': ['warn', { allow: ['&', '|'] }],
    'no-underscore-dangle': 'off',
    'no-extra-semi': 'warn',
    'comma-dangle': 'off',
    semi: ['error', 'never'],
    'prefer-destructuring': ['error', {
      VariableDeclarator: {
        object: false
      },
      AssignmentExpression: {
        object: false
      }
    }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
