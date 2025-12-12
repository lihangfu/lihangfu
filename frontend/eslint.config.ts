import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import * as parserVue from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  // 默认配置
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,

  // 自定义 vue 规则
  {
    // 检查范围，所有 .vue 文件
    files: ['**/*.vue'],
    // 语言环境配置：用于定义代码的解析规则、全局变量、语法特性
    languageOptions: {
      // 全局变量声明，避免 ESLint 误判这些 Vue 内置宏为「未定义变量」（no-undef 错误）
      // readonly 表示这些全局变量不可修改
      globals: {
        $: 'readonly',
        $$: 'readonly',
        $computed: 'readonly',
        $customRef: 'readonly',
        $ref: 'readonly',
        $shallowRef: 'readonly',
        $toRef: 'readonly',
      },
      // 解析器：指定 .vue 文件的专用解析器
      // 解析 .vue 文件的三部分（<template>/<script>/<style>），将其拆分为 ESLint 可识别的代码块，分别应用对应规则
      parser: parserVue,
      // 解析器选项
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // 支持 JSX 语法（Vue 3 支持 JSX/TSX）
        },
        extraFileExtensions: ['.vue'], // 声明额外的文件扩展名（ESLint 默认不识别 .vue）
        parser: tseslint.parser, // 即 @typescript-eslint/parser
        sourceType: 'module', // 代码使用 ES 模块规范（import/export）
      },
    },
    // 插件配置：插件本身不直接生效，需配合 rules 配置启用具体规则
    plugins: {
      '@typescript-eslint': tseslint.plugin, // 提供 TypeScript 专属规则（如类型定义规范、TS 语法错误检查等）
      vue: pluginVue, // 提供 Vue 专属规则（如 template 语法规范、Vue 生命周期 / API 使用规范等）
    },
    // 处理器配置：没有该配置，ESLint 无法正确解析 .vue 的多部分结构，会直接报错
    processor: pluginVue.processors['.vue'],
    rules: {
      ...pluginVue.configs.base.rules, // Vue 基础规则（无风格约束，仅语法正确性）
      ...pluginVue.configs.essential.rules, // Vue 核心规则（防错误、强制关键最佳实践，如禁止 v-for 无 key）
      ...pluginVue.configs.recommended.rules, // Vue 推荐规则（代码风格、可读性，如属性顺序）
      // 以下规则被设为 off（关闭），通常是为了适配项目开发习惯，避免过度严格的约束
      'no-undef': 'off', // 禁止使用未定义的变量
      'no-unused-vars': 'off', // 禁止未使用的变量
      'vue/no-v-html': 'off', // 禁止使用 v-html 指令
      'vue/require-default-prop': 'off', // 要求 props 必须设置默认值
      'vue/require-explicit-emits': 'off', // 要求组件显式声明 emits 选项
      'vue/multi-word-component-names': 'off', // 要求组件名必须是多单词
      'vue/no-setup-props-reactivity-loss': 'off', // 禁止在 setup 中解构 props（会丢失响应式）
      // 自定义强制规则
      'vue/html-self-closing': [
        // 级别：error（违反则报错，阻断提交 / 构建）所有标签必须自闭合
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
)
