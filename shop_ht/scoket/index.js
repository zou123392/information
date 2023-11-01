// 导入utils, 调用公共方法
let utils = require(__basename + "/utils/utils.js");
let sql = require("./sql.js");

module.exports = (http) => {
  // 引入Http模块,传入express生成服务器
  const io = require("socket.io")(http, {
    allowEIO3: true,
    cors: {
      // origin: "http://localhost:8080",
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 保存连接数
  let cellent = 0;
  // 保存连接标识
  // let msgUser = {};

  io.on("connect", (socket) => {
    ++cellent;
    console.log("连接", cellent);
  });

  // 会话
  io.on("connection", (socket) => {
    // 初始化会话，标识每个用户的socket
    socket.on("init", (userId) => {
      // 将已登录的用户标识保存到socket中
      socket.talkingId = userId;
    });

    // 监听单个消息数
    // socket.on("unReadCount", (data) => {
    //     console.log(data);
    //     let toId = data.replyUserId; //获取发送方的id;
    //     try {
    //         // 查询消息数
    //         sql.findunReadCount(data.talkUserId, data.createBy).then((result) => {
    //             data.unReadCount = result;

    //             console.log(data);
    //             // 发送到指定用户
    //             msgUser[toId] ? msgUser[toId].emit("recerveMsg", data) : "";
    //         });
    //     } catch (e) {
    //         console.log(e);
    //         console.log(`找不到${toId}`);
    //     }
    // });

    socket.on("chat message", (data) => {
      let toId = data.replyUserId; //获取发送方的id;
      try {
        new Promise((resolve, reject) => {
          // 查询消息数
          let result = sql.findunReadCount(data.talkUserId, data.replyUserId);
          resolve(result);
        }).then((result) => {
          console.log(result);
          data.unReadCount = result;
          // 发送到指定用户
          let talking = {};
          for (let item of io.sockets.sockets) {
            //item : ['id号',Socket{}]
            if (item[1].talkingId === toId) {
              talking = item[1];
              break;
            }
          }

          if (talking !== {}) {
            talking.emit("recerveMsg", data);
            talking.emit("unReadCount", { count: result, talkUserId: data.talkUserId, newText: data.text });

            //   目前还不是所有消息
            talking.emit("allUnReadCount", { count: data.unReadCount });
          }
        });
      } catch (e) {
        console.log(e);
        console.log(`找不到${toId}`);
      }
    });

    socket.on("disconnect", (reason) => {
      if (cellent >= 0) --cellent;
      console.log("有一个用户断开");
      console.log("断开：", cellent);
    });
  });
};
