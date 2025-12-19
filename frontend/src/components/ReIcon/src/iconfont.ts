import { h, defineComponent } from 'vue'

// 封装iconfont组件，默认`font-class`引用模式，支持`unicode`引用、`font-class`引用、`symbol`引用 （https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.20&helptype=code）
export default defineComponent({
  name: 'FontIcon',
  props: {
    // 仅暴露一个核心 props：icon，用于传入「图标标识」
    // 类型为字符串，默认值为空，保证组件使用时的容错性
    icon: {
      type: String,
      default: '',
    },
  },
  // 组件通过 render 函数动态生成 DOM（而非模板 <template>），核心是根据父组件传入的「额外属性」（$attrs）判断图标使用方式
  render() {
    // this.$attrs 是 Vue 实例的内置属性，包含父组件传入的所有「非 props 属性」（如 class、style、uni、svg、iconType 等）。
    const attrs = this.$attrs
    // 组件通过判断 $attrs 中是否包含特定标识（uni/svg/iconType），来切换图标渲染方式。
    // Unicode 方式调用（attrs 含 uni 或 iconType="uni"）
    if (Object.keys(attrs).includes('uni') || attrs?.iconType === 'uni') {
      return h(
        'i', // 渲染 <i> 标签（iconfont 基础标签）
        {
          class: 'iconfont', // 必传基础类：定义图标字体属性（font-family 等）
          ...attrs, // 合并父组件传入的额外属性（如 style、class、id 等）
        },
        this.icon, // 标签内容：传入的 Unicode 编码（如 '&#xe601;'）
      )
      // SVG Symbol 方式调用（attrs 含 svg 或 iconType="svg"）
    } else if (Object.keys(attrs).includes('svg') || attrs?.iconType === 'svg') {
      return h(
        'svg', // 渲染 <svg> 标签（SVG Symbol 要求的基础标签）
        {
          class: 'icon-svg', // 自定义 SVG 图标类（用于统一控制 SVG 大小、颜色等）
        },
        {
          default: () => [
            h('use', {
              'xlink:href': `#${this.icon}`, // 关联 SVG Symbol 的 id（格式：#图标id）
            }),
          ],
        },
      )
      // 默认方式（类名调用）
    } else {
      return h('i', {
        class: `iconfont ${this.icon}`, // 基础类 + 图标类名（如 'iconfont icon-search'）
        ...attrs, // 合并父组件额外属性
      })
    }
  },
})
