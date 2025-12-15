/** @type {import("stylelint").Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-scss', 'stylelint-order', 'stylelint-prettier'],
  // 忽略的文件
  ignoreFiles: ['dist/**/*', 'node_modules/**/*', 'public/**/*', 'src/style/reset.scss'],
  // 按文件类型 / 路径，覆盖部分配置（和合并全局配置，但是优先级更高）
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
