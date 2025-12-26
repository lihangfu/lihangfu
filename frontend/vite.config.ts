import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Go 后端使用 StaticFS 挂载到根路径，必须使用绝对路径
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
    svgLoader(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'types/auto-imports.d.ts', // 修改生成位置
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'types/components.d.ts', // 修改生成位置
    }),
    // 自动按需加载图标
    Icons({
      compiler: 'vue3',
      scale: 1,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
