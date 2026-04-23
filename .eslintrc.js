module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'boundaries'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  settings: {
    'boundaries/elements': [
      {
        type: 'app',
        pattern: 'apps/*',
        capture: ['app'],
      },
      {
        type: 'lib',
        pattern: 'libs/*',
        capture: ['lib'],
      },
    ],
  },
  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'allow',
        rules: [
          {
            from: ['app'],
            allow: ['lib'], // Apps can import libs
            disallow: ['app'], // Apps CANNOT import other apps
          },
          {
            from: ['lib'],
            disallow: ['app'], // Libs cannot import apps
          },
        ],
      },
    ],
  },
};
