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

// 导入字体图标
import './assets/iconfont/iconfont.js'
import './assets/iconfont/iconfont.css'

const app = createApp(App)

// 全局注册@iconify/vue图标库
// 比较常用，可以在项目中任意地方使用
import { IconifyIconOffline, IconifyIconOnline, FontIcon } from './components/ReIcon'
app.component('IconifyIconOffline', IconifyIconOffline)
app.component('IconifyIconOnline', IconifyIconOnline)
app.component('FontIcon', FontIcon)

setupStore(app)
app.use(router)

app.use(MotionPlugin)
app.mount('#app')
