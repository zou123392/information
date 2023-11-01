import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./routes";
import store from "@/store";

Vue.use(VueRouter);

// 
let originPush = VueRouter.prototype.push;  //备份原push方法
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {    //如果传了回调函数，直接使用
    originPush.call(this, location, resolve, reject);
  } else {                     //如果没有传回调函数，手动添加
    originPush.call(this, location, () => { }, () => { });
  }
}

const router = new VueRouter({
  routes,
});

// 全局路由守卫 （访问不到 this ,只能通过next(vm =>{})）
router.beforeEach((to, from, next) => {
  const isLogin = store.state.user.isLogin
  const { name } = to;
  const isLoginOrRegister =
    store.state.routeArr.includes(name) || name == "404";
  console.log('路由判断：', isLogin || isLoginOrRegister);
  console.log('1', isLoginOrRegister);
  console.log('2', isLogin);
  if (isLogin || isLoginOrRegister) {
    next()
  } else {
    alert('请先登录')
  }
});

export default router;
