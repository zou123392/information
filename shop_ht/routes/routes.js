/**
 * @module 路由
 * @author : zou
 * */

// 导入路由控制器
let routesController = require(__basename + "/routes_controller/routes_controller.js");
let routesCon = require(__basename + "/routes_controller/routes_con.js");
let routesAdmin = require(__basename + "/routes_controller/routes_admin.js");

// 导出路由函数
module.exports = (app) => {
    // 请求域拦截(白名单)
    app.use(routesController.verfiyHost);

    // 验证码拦截(白名单)
    app.use(routesController.verifyCode);

    // 验证用户登录(白名单)
    app.use(routesController.verifyToken);

    // 用户登录
    app.post("/login", routesController.login);

    // 注册接口
    app.post("/register", routesController.register);

    // 发邮件
    app.post("/email", routesController.email);

    // 验证码校正
    app.post("/jadgeCode", routesController.jadgeCode);

    // 获取用户信息
    app.get("/getUserInfo", routesController.getUserInfo);

    // 获取用户信息
    app.get("/getUserInfoForEmail", routesController.getUserInfoForEmail);

    // 更新用户信息
    app.post("/updateUserInfo", routesController.updateUserInfo);

    // 获取商品类型
    app.get("/type", routesController.getTypeData);

    // 发布商品
    app.post("/postProduct", routesController.postProduct);

    // 搜索 当前用户商品
    app.get("/search", routesController.search);

    // 查询商品数目
    app.get("/count", routesController.count);

    // 上下架
    app.post("/updown", routesController.updownself);

    // 根据商品pid查询商品信息
    app.get("/probyid", routesController.getProductById);

    // 更新商品数据
    app.post("/updateProduct", routesController.updateProduct);

    // 用户删除商品
    app.post("/remove", routesController.remove);

    // 查询客户端首页的推荐商品
    app.get("/clientHomeProduct", routesController.clientHomeProduct);

    // 查询首页类别数据
    app.get("/category", routesController.category);

    // 搜索商品 （弃用）
    app.get("/clientSearch", routesController.clientSearch);

    // 客户端根据商品pid查询商品详情信息
    app.get("/productDetail", routesController.productDetail);

    // 收藏商品
    app.post("/like", routesController.like);

    // 删除收藏商品
    app.post("/removeLike", routesController.removeLike);

    // 查询指定商品是否已收藏
    app.get("/findLike", routesController.findLike);

    // 收藏商品记录数
    app.get("/likeCount", routesController.likeCount);

    // 加入购物车
    app.post("/addShopcart", routesController.addShopcart);

    // 删除购物车商品
    app.post("/removeShopcart", routesController.removeShopcart);

    // 查询购物车商品
    app.get("/shopcartProducts", routesController.shopcartProducts);

    // 查询购物车记录数
    app.get("/shopcartCount", routesController.shopcartCount);

    // 根据商品typeId获取商品
    app.post("/getProductByTypeId", routesCon.getProductByTypeId);

    // 更新购物车商品数目
    app.post("/updateShopcartCount", routesController.updateShopcartCount);

    // 更新购物车商品选择状态
    app.post("/updateShopcartCheck", routesController.updateShopcartCheck);

    // 创建收货地址
    app.post("/addAddress", routesCon.addAddress);

    // 查找收货地址
    app.post("/findAddress", routesCon.findAddress);

    // 更新收货地址
    app.post("/updateAddress", routesCon.updateAddress);

    // 删除收货地址
    app.post("/deleteAddress", routesCon.deleteAddress);

    // 创建订单
    app.post("/addOrder", routesCon.addOrder);

    // 查找订单 通过 订单号
    app.post("/findOrder", routesCon.findOrder);

    // 查找订单 通过 订单状态
    app.post("/findOrderBySome", routesCon.findOrderBySome);

    // 查找用户所有 未支付订单
    app.post("/findNoPayOrder", routesCon.findNoPayOrder);

    // 更新订单 通过 orderNum
    app.post("/updateOrder", routesCon.updateOrder);

    // 支付接口
    app.post("/payOrder", routesCon.payOrder);

    // 支付成功接口
    app.post("/paySuccess", routesCon.paySuccess);

    // 搜索页搜索接口
    app.get("/searchInput", routesCon.searchInput);

    // 确认收货
    app.post("/confirmReceipt", routesCon.confirmReceipt);

    // 发布评价
    app.post("/sendComment", routesCon.sendComment);

    // 更新评价
    app.post("/updateComment", routesCon.updateComment);

    // 分页获取评价列表
    app.post("/getCommentList", routesCon.getCommentList);

    // 分页获取 个人 订单商品 已评价列表
    app.post("/getCommentedOrderP", routesCon.getCommentedOrderP);

    // 通过userId获取用户信息
    app.post("/getUserInfoByUserId", routesController.getUserInfoByUserId);

    // 初始化会话
    app.post("/initTalk", routesCon.initTalk);

    // 创建会话
    app.post("/createTalk", routesCon.createTalk);

    // 更新会话
    app.post("/updateTalk", routesCon.updateTalk);

    // 新增会话消息
    app.post("/addTalkMessage", routesCon.addTalkMessage);

    // 更新会话消息
    app.post("/updateTalkMessage", routesCon.updateTalkMessage);

    // 查找会话消息
    app.post("/findTalkMessage", routesCon.findTalkMessage);

    // 用户查找总的 未读 会话消息数目
    app.post("/findUnTalkCount", routesCon.findUnTalkCount);

    // 用户查找单个会话 未读 消息数目
    app.post("/findOneUnTalkCount", routesCon.findOneUnTalkCount);

    /**
     * 管理员 接口
     */

    // 管理员登录
    app.post("/admin", routesAdmin.adminLogin);

    // 管理员信息
    app.get("/getAdminInfo", routesAdmin.getAdminInfo);

    // 管理员删除商品
    app.post("/adminRemove", routesAdmin.remove);

    // 管员发布商品
    app.post("/adminPostProduct", routesAdmin.postProduct);

    // 管员按条件查询商品
    app.get("/adminSearch", routesAdmin.searchInput);

    // 管员按条件查询订单
    app.get("/adminFindOrderBySome", routesAdmin.findOrderBySome);

    // 管员更新订单
    app.post("/adminUpdateOrder", routesAdmin.updateOrder);

    // 管理员获取所有用户列表
    app.get("/getUserList", routesAdmin.getUserList);

    // 管理员更新 用户 账号状态
    app.post("/changeUser", routesAdmin.changeUser);

    // 管理员 删除 用户
    app.post("/deleteUser", routesAdmin.deleteUser);
};
