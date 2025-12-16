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

  globalIgnores(['**/.*', 'dist/*', '*.d.ts', 'public/*', 'src/assets/**', 'src/**/iconfont/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,

  // 自定义 TS 规则
  {
    // 继承 ESLint 官方 TypeScript 推荐规则集
    // tseslint.configs.recommended 包含了 TypeScript 项目常用的基础规范（如语法错误检查、类型相关基础约束）
    extends: [...tseslint.configs.recommended],
    // 指定当前配置生效的文件范围（仅对 TypeScript 相关文件生效）
    files: ['**/*.?([cm])ts', '**/*.?([cm])tsx', '**/*.vue'],
    // 自定义规则配置（优先级高于继承的推荐规则，可覆盖或新增规则）
    rules: {
      // 禁止变量/函数重复声明（如同一作用域内两次声明 let a = 1）
      // 设为 "error" 级别：强制规范，避免命名冲突
      '@typescript-eslint/no-redeclare': 'error',

      // 禁止使用 // @ts-ignore、// @ts-expect-error 等 TypeScript 注释
      // 设为 "off"：开发中可能需要临时忽略类型检查（如兼容第三方库无类型定义），允许使用
      '@typescript-eslint/ban-ts-comment': 'off',

      // 禁止显式使用 any 类型（TypeScript 核心约束之一）
      // 设为 "off"：某些场景（如处理动态数据、旧代码兼容）需使用 any，暂时关闭限制
      '@typescript-eslint/no-explicit-any': 'off',

      // 推荐使用 as const 断言（增强类型推断精度，如将字面量转为只读类型）
      // 设为 "warn"：仅提醒优化，不强制（非致命性规范）
      '@typescript-eslint/prefer-as-const': 'warn',

      // 禁止空函数（如 () => {} 无逻辑的空函数）
      // 设为 "off"：允许空函数（如接口实现占位、回调函数默认值）
      '@typescript-eslint/no-empty-function': 'off',

      // 禁止非空断言（! 符号，如 const a = obj!.prop）
      // 设为 "off"：某些场景可确定值非空时，允许使用非空断言简化代码（需开发者自行保证安全性）
      '@typescript-eslint/no-non-null-assertion': 'off',

      // 禁止未使用的表达式（如单独写 1 + 2; 无实际作用的表达式）
      // 设为 "off"：允许某些合法场景（如函数调用表达式 void func()、条件表达式短路逻辑）
      '@typescript-eslint/no-unused-expressions': 'off',

      // 禁止不安全的函数类型（如 Function 类型，无法约束参数和返回值）
      // 设为 "off"：兼容旧代码或动态函数场景（如需接收任意函数作为参数）
      '@typescript-eslint/no-unsafe-function-type': 'off',

      // 禁止 import type 产生副作用（如 import type { T } from './a' 中，a.ts 有顶层执行代码）
      // 设为 "error"：强制 type 导入仅用于类型引用，避免类型导入影响运行时逻辑
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // 强制模块边界函数显式声明返回类型（如导出函数必须写 return type）
      // 设为 "off"：TypeScript 可自动推断返回类型，减少冗余代码，不强制声明
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // 统一类型导入的语法规范（区分类型导入和值导入）
      '@typescript-eslint/consistent-type-imports': [
        'error', // 设为 error 级别，强制规范
        {
          disallowTypeAnnotations: false, // 允许在类型注解中使用导入的类型（如 const a: ImportedType = {}）
          fixStyle: 'inline-type-imports', // 自动修复为内联类型导入语法（import { type T } from './a' 而非 import type { T } from './a'）
        },
      ],

      // 推荐枚举成员使用字面量值（而非计算值，如 enum E { A = 1 } 而非 enum E { A = 1 + 1 }）
      '@typescript-eslint/prefer-literal-enum-member': [
        'error', // 强制规范，提升枚举可读性和稳定性
        { allowBitwiseExpressions: true }, // 例外：允许位运算表达式（如 enum Flags { A = 1 << 0, B = 1 << 1 }，适合权限位掩码场景）
      ],

      // 禁止未使用的变量/参数
      '@typescript-eslint/no-unused-vars': [
        'error', // 强制规范，避免冗余代码
        {
          argsIgnorePattern: '^_', // 忽略下划线开头的参数（如 (_param: string) => {}，表示刻意不使用的参数）
          varsIgnorePattern: '^_', // 忽略下划线开头的变量（如 const _temp = 1;，表示临时变量或占位变量）
        },
      ],
    },
  },

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
      // 禁止未使用的变量/参数
      '@typescript-eslint/no-unused-vars': [
        'error', // 强制规范，避免冗余代码
        {
          argsIgnorePattern: '^_', // 忽略下划线开头的参数（如 (_param: string) => {}，表示刻意不使用的参数）
          varsIgnorePattern: '^_', // 忽略下划线开头的变量（如 const _temp = 1;，表示临时变量或占位变量）
        },
      ],
    },
  },
)
