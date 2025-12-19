import { h, defineComponent } from 'vue'
// 离线版本
import { Icon as IconifyIcon, addIcon } from '@iconify/vue/dist/offline'

// Iconify Icon在Vue里本地使用（用于内网环境）
export default defineComponent({
  name: 'IconifyIconOffline',
  // 注册离线版图标组件
  components: { IconifyIcon },
  props: {
    // 默认值为null（兼容字符串/对象两种类型）
    // 字符串：已通过 addIcon 注册的「本地图标 ID」（如 mdi:home，但需提前本地注册数据）；
    // 对象：图标原始数据对象（如从 Iconify 下载的 JSON 图标数据），组件内会自动注册。
    icon: {
      default: null,
    },
  },
  render() {
    // 若传入的是图标数据对象，自动注册到离线Iconify中
    if (typeof this.icon === 'object') addIcon(this.icon, this.icon)
    const attrs = this.$attrs
    // 图标为字符串（已注册的本地图标ID）
    if (typeof this.icon === 'string') {
      return h(
        IconifyIcon, // 渲染离线版Iconify组件
        {
          icon: this.icon, // 绑定本地图标ID（必须已注册）
          'aria-hidden': false, // 无障碍配置（同外网版）
          // // 样式合并：强制outline: none + 保留父组件自定义样式
          style: attrs?.style
            ? Object.assign(attrs.style, { outline: 'none' })
            : { outline: 'none' },
          ...attrs,
        },
        {
          default: () => [], // 空插槽（同外网版）
        },
      )
      // 图标为对象（未注册的图标数据）
    } else {
      return h(
        this.icon, // 直接渲染图标数据对象（注册后可视为组件）
        {
          'aria-hidden': false,
          style: attrs?.style
            ? Object.assign(attrs.style, { outline: 'none' })
            : { outline: 'none' },
          ...attrs,
        },
        {
          default: () => [],
        },
      )
    }
  },
})
