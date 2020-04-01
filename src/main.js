import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import mdui from "mdui"
import echarts from 'echarts'
import { Button, DatePicker, Select, Option } from 'element-ui';


Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Option)

Vue.config.productionTip = false
Vue.use(mdui)

Vue.prototype.bus = new Vue;

Vue.prototype.$alert = mdui.alert
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})