import Vue from 'vue'
import App from './App.vue'
import http from './http'
import router from '../router/index.js'; 

import '../src/common/styles/index.css'//引入全局样式
import '../plugins/elementUi' //引入element-ui插件
import 'animate.css' //第三方库animate.css
import 'default-passive-events' // 解决谷歌浏览器事件捕获机制警告


// 给vue原型上添加一个$axios
Vue.prototype.$axios = http

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
