module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    indent: ['warn', 4],
    'linebreak-style': ['warn', 'windows'],
    'max-len': ['warn', { code: 120 }],
    'no-underscore-dangle': ['warn'],
    quotes: ['warn'],
  },
};
