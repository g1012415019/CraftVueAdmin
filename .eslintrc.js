module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    // Vue rules
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/no-dupe-keys': 'off',
    
    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    
    // General rules
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    'no-case-declarations': 'off',
    'no-useless-escape': 'off',
    
    // Disable problematic rules
    'prefer-const': 'off',
    'no-undef': 'off'
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    '*.d.ts'
  ]
}
