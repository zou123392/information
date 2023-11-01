import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/styles/reset.scss";
import "@/styles/comment.scss";
import i18n from "./lang"; //语言包
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

import io from "@/utils/socketio.js";
Vue.use(io);

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/css/swiper.css";
Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  sockets: {
    //用来测试 是否链接成功了
    connecting() {
      console.log("正在连接");
    },
    disconnect() {
      console.log("Socket 断开");
    },
    connect_failed() {
      console.log("连接失败");
    },
    connect() {
      console.log("socket connected");
    },
  },
  i18n, //注入语言包
  render: (h) => h(App),
}).$mount("#app");
