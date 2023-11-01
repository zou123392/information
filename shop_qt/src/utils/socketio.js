// import VueSocketIO from "vue-socket.io";

// export default new VueSocketIO({
//   debug: true,
//   connection: "/socket", // socket 服务器所在地址
// });

import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";

export default new VueSocketIO({
  debug: true,
  connection: SocketIO(process.env.VUE_APP_BASE_API, {
    // query: { token: document.cookie },
    autoConnect: true, // 取消自动连接
  }),
  extraHeaders: { "Access-Control-Allow-Origin": "*" },
});
