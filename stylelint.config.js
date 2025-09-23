module.exports = {
  customSyntax: 'postcss-html',
  root: true,
  plugins: ['stylelint-order'],
  extends: ['stylelint-config-standard', 'stylelint-config-prettier', 'stylelint-config-recommended-vue'],
  rules: {
    // Custom rules added by Gemini
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+(?:-[a-z0-9]+)*$|^n-[a-z0-9-]+(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?|^\.[a-z0-9]+$|^\!?[a-z0-9-]+$', // Allow kebab-case, camelCase, n- prefixed, and Tailwind !
    'keyframes-name-pattern': '^[a-z][a-zA-Z0-9]+(?:-[a-z0-9]+)*$', // Allow kebab-case and camelCase
    'declaration-block-no-shorthand-property-overrides': null, // Disable this rule
    'function-no-unknown': [true, { ignoreFunctions: ['v-bind'] }], // Allow Vue's v-bind in CSS
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep'], // Allow Vue's :deep
      },
    ],
    // Original rules
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'function',
          'if',
          'each',
          'include',
          'mixin',
        ],
      },
    ],
    'no-empty-source': null,
    'named-grid-areas-no-invalid': null,
    'unicode-bom': 'never',
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    // 'declaration-block-trailing-semicolon': 'always',
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports',
        },
        {
          type: 'at-rule',
          name: 'media',
        },
        'rules',
      ],
      { severity: 'warning' },
    ],
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};