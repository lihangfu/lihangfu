/** @type {import("stylelint").Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
  ],
  ignoreFiles: ['dist/**/*', 'node_modules/**/*', 'public/**/*', 'src/style/reset.scss'],
  rules: {
    'import-notation': null, // Tailwind @import
  },
}
