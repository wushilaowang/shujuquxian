import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Home from '../views/Home'


Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: 'loginview'
  },
  {
    path: '/loginview',
    component: Login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '数据曲线'
    }
  }
]

const router = new VueRouter({
  routes,
  mode: 'hash'
})


export default router
