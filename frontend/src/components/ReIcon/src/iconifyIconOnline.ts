import { h, defineComponent } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'

// Iconify Icon在Vue里在线使用（用于外网环境）
export default defineComponent({
  name: 'IconifyIconOnline',
  // 注册子组件（render函数中需使用）
  components: { IconifyIcon },
  props: {
    // 类型为字符串，对应 Iconify 图标 ID（如 mdi:home、fa:user，需提前在 Iconify 官网确认图标 ID）
    icon: {
      type: String,
      default: '',
    },
  },
  render() {
    const attrs = this.$attrs // 获取父组件传入的「非Props属性」
    // 通过 h 函数创建 IconifyIcon 组件的虚拟 DOM，并做个性化配置
    return h(
      IconifyIcon, // 要渲染的目标组件（Iconify官方组件）
      {
        icon: `${this.icon}`, // 绑定父组件传入的图标ID
        'aria-hidden': false, // 无障碍配置：允许屏幕阅读器识别图标
        // 合并样式：优先保留父组件传入的style，强制添加 outline: none（去掉聚焦轮廓）
        style: attrs?.style ? Object.assign(attrs.style, { outline: 'none' }) : { outline: 'none' },
        // 透传所有非Props属性（如class、size、color、@click等）
        ...attrs,
      },
      {
        // 插槽配置（此处无额外插槽内容，传空数组）
        default: () => [],
      },
    )
  },
})
