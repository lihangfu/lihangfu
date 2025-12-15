/** @type {import("stylelint").Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
  ],
  ignoreFiles: ['dist/**/*', 'node_modules/**/*', 'public/**/*', 'src/style/reset.scss'],
  overrides: [
    {
      files: ['**/*.(css|html|vue)'],
      customSyntax: 'postcss-html',
    },
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss',
      extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
    },
  ],
  rules: {
    'import-notation': null, // Tailwind @import
  },
}
