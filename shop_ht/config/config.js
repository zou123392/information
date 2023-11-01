/**
 * @module 基础配置
 * @author : zou
 * */

/**
 * @description 服务器配置
 */
exports.serverOptions = {
  host: "http://127.0.0.1", // 本地开发
  // port: 10001,

  // host: "http://xx.xx.xx.xxx", // 腾讯云服务器
  port: 10001, // 端口

  baseUrl: "/static/file/", // 伪造路径
};

/**
 * @description 随机昵称
 */
exports.nickNameOptions = ["彩虹", "白云", "森林", "蓝天", "大海", "领悟", "实诚", "飞鸟", "老鹰", "白兔", "绿竹"];

/**
 * @description 加盐配置, 用于加强加密
 */
exports.saltOptions = {
  pwd: "?pwd_", // 密码加盐
};

/**
 * @description 数据库配置
 */
exports.mysqlOptions = {
    database: "", // 数据库名称
    username: "", // 用户名
    password: "", // 登录密码
    host: "localhost", // 数据库地址ip
    dialect: "mysql", // 数据库类型
    timezone: "+08:00", // 时区
    underscored: true, // 字段以_命名
    forceRemove: false, // 是否强制删除表
};


/**
 * @description 邮件配置, 验证码
 */
exports.emailOptions = {
  host: "smtp.qq.com", // 邮件服务器地址
  port: 465, // 端口, 25端口在阿里云服务器被禁止的, 建议使用465
  secure: true, // 如果端口为465, 此项需要设置true, 其他端口需要修改为false
  user: "3217202945@qq.com", // 用户名，发件地址
  pass: "qxduufjlnuejdedd", // 邮箱授权码
  expires: 5 * 60 * 1000, // 验证码有效时间, 单位：毫秒
};

/**
 * @description 允许请求(白名单)
 */
exports.hostOptions = [
  "http://www.shabby.work",
  "http://81.68.88.115:80",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:8082",
  "http://127.0.0.1:9000",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:9000",
  "http://192.168.31.157:8080",
  "http://192.168.2.187:8080",
  "http://192.168.31.158:8080",
  "http://192.168.71.59:8080",
];

/**
 * @description 验证验证码请求路径
 */
exports.codeUrlOptions = ["/register"];

/**
 * @description 管理员验证请求路径
 */
exports.adminOptions = [
  "/admin",
  "/getAdminInfo",
  "/adminRemove",
  "/adminPostProduct",
  "/adminSearch",
  "/updown",
  "/adminFindOrderBySome",
  "/adminUpdateOrder",
  "/getUserList",
  "/changeUser",
  "/deleteUser",
];

/**
 * @description token配置
 */
exports.tokenOptions = {
  salt: "_t_k", // token加盐
  expires: "1d", // 有效时间
  // 需要验证token的请求路径
  tokenUrls: [
    "/getUserInfo",
    "/postProduct",
    "/search",
    "/count",
    "/updown",
    "/probyid",
    "/updateProduct",
    "/remove",
    "/like",
    "/removeLike",
    "/findLike",
    "/likeCount",
    "/addShopcart",
    "/removeShopcart",
    "/shopcartProducts",
    "/shopcartCount",
    "updateShopcartCount",
    "/updateShopcartCheck",
    "/addAddress",
    "/findAddress",
    "/updateAddress",
    "/deleteAddress",
    "/addOrder",
    "/findOrder",
    "/findOrderBySome",
    "/findNoPayOrder",
    "/updateOrder",
    "/payOrder",
    "/paySuccess",
    "/confirmReceipt",
    "/sendComment",
    "/updateComment",
    "/getCommentList",
    "/getCommentedOrderP",
    "/getUserInfoByUserId",
    "/initTalk",
    "/createTalk",
    "/updateTalk",
    "/addTalkMessage",
    "/updateTalkMessage",
    "/findTalkMessage",
    "/findUnTalkCount",
    "/findOneUnTalkCount",

    // 管理员端 接口
    "/getAdminInfo",
    "/adminRemove",
    "/adminPostProduct",
    "/adminSearch",
    "/adminFindOrderBySome",
    "/adminUpdateOrder",
    "/getUserList",
    "/changeUser",
    "/deleteUser",
  ],
};

/**
 * @description 文件存放配置
 */
exports.filePathOptions = {
  falsePath: "/static/file", // 伪路径
  imgPath: "/upload", // 图片存储路径
};
