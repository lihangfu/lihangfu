import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { setupStore } from './stores'
import { MotionPlugin } from '@vueuse/motion'

// 引入重置样式
import './style/reset.scss'
// 导入公共样式
import './style/index.scss'
import './style/tailwind.css'

const app = createApp(App)

setupStore(app)
app.use(router)

app.use(MotionPlugin)
app.mount('#app')
