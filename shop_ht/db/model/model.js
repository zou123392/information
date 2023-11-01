/**
 * @module 收集所有模型
 * @author : zou
 * */

/******************************* 商家端模型 ************************************/

// 导入用户模型
let User = require(__basename + "/db/model/user.js");

// 导入验证码模型
let Code = require(__basename + "/db/model/code.js");

// 导入商品类型模型
let Type = require(__basename + "/db/model/type.js");

// 导入商品模型
let Product = require(__basename + "/db/model/product.js");

// 导入用户与商品关系模型
let UserProduct = require(__basename + "/db/model/user_product.js");

// 导入商品与商品类型模型
let ProductType = require(__basename + "/db/model/product_type.js");

// 导入收藏商品模型
let Like = require(__basename + "/db/model/like.js");

// 导入购物车模型
let Shopcart = require(__basename + "/db/model/shopcart.js");

// 导入收货地址模型
let Address = require(__basename + "/db/model/address.js");

// 导入轮播图模型
let Banner = require(__basename + "/db/model/banner.js");

// 导入订单模型
let Order = require(__basename + "/db/model/order.js");

// 导入订单模型
let OrderProduct = require(__basename + "/db/model/order_product.js");

// 导入评论模型
let Comment = require(__basename + "/db/model/comment.js");

// 导入用户会话模型
let Talk = require(__basename + "/db/model/talk.js");

// 导入用户会话连接表模型
let TalkUser = require(__basename + "/db/model/talk_user.js");

// 导入管理员模型
let Admin = require(__basename + "/db/model/admin.js");

/**
 * @description 导出所有模型
 */
module.exports = {
    User,
    Code,
    Type,
    Product,
    UserProduct,
    ProductType,
    Like,
    Shopcart,
    Address,
    Banner,
    Order,
    OrderProduct,
    Comment,
    Talk,
    TalkUser,
    Admin,
};
