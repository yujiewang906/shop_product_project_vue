// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import axios from 'axios';
import qs from 'qs';


    Vue.prototype.$ajax=axios;
    //设置全局axios相当于全局ajax
    axios.interceptors.request.use(function (config) {
        //在所有发送请求前往请求中加入token
        //获取浏览器中的token
        let  userInfor = window.sessionStorage.getItem("user");
        if (userInfor != null){
          //将请求中加入token参数  将字符串转换为json对象
         let token = JSON.parse(userInfor).token;
          //axios 中设置参数
          if(config.method==='post'){
            config.params = {"token":token}
          }else if (config.data==='get') {
            config.params = {"token":token}
          }
        }
        console.log("拦截一个请求加入了token继续发送");
        return config;
    }),function(error){
        //处理错误的请求
        return  Promise.reject(error);
    }


Vue.prototype.$qs=qs;
Vue.config.productionTip = false




//配置路由守卫
router.beforeEach((to,from,next)=>{
    //debugger;
    if (to.fullPath != "/login"){
      //如果收到请求不是登录请求，先判断是不是已经登录
      let  user = window.sessionStorage.getItem("user");
      if (user != null){
        next();
      }else{
        next({path:"/login"})
      }
    }else{
      next();
    }

})








Vue.use(ElementUI, {
  size: 'small'
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
