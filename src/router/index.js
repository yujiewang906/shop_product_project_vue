import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      redirect: '/test',
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/test',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Test.vue'),
          meta: { title: '系统首页' }
        },{
          path: '/Type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '分类管理' }
        },{
          path: '/Brand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Brand.vue'),
          meta: { title: '品牌管理' }
        },{
          path: '/Attribute',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Attribute.vue'),
          meta: { title: '属性管理' }
        }

      ]
    }
  ]
})
