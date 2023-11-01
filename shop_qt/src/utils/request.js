import axios from "axios";
import { Message } from "element-ui";
import NProgress from "nprogress"; // 导入 nprogress模块
import "nprogress/nprogress.css"; // 导入样式，否则看不到效果
NProgress.configure({ showSpinner: false }); // 显示右上角螺旋加载提示

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    NProgress.start() // 设置加载进度条(开始..)
    // 处理post请求参数, 进行参数序列化
    if (config.method.toLowerCase() == "post") {
      // 序列化post请求参数
      let paramsString = "";
      for (let key in config.data) {
        paramsString += `${key}=${config.data[key]}&`;
      }

      // 重新赋值config.data
      config.data = paramsString.slice(0, -1);
    }

    // 必须返回config
    return config;
  },

  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    NProgress.done() // 设置加载进度条(结束..)
    return response
  },

  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
