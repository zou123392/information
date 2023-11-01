/**
 * @module 路由控制器2
 * @author : zou
 * */

// 导入API, 操作MySQL数据库
let api = require(__basename + "/api/api.js");

// 导入sequelize的Op模块
let { Op, DataTypes, where, DATE, or } = require("sequelize");
const { transaction } = require("../api/api");

// 导入node-uuid模块
// let uuid = require("node-uuid");

// 导入utils, 调用公共方法
let utils = require(__basename + "/utils/utils.js");

// 支付接口表单
const AlipayFormData = require("alipay-sdk/lib/form").default;

let url = config.serverOptions.host;
if (config.serverOptions.port) {
  url += `:${config.serverOptions.port}`;
}
url += config.serverOptions.baseUrl;

// let selectOrderProduct =
//     "SELECT  `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`rate`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`,`op`.`count`, `u`.`email`,`u`.`nick_name`";
let selectOrderProduct =
  "SELECT  `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`rate`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`,`op`.`count`, `up`.`user_id`,`op`.`is_comment` ";
let product =
  "SELECT sql_calc_found_rows `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`rate`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`, `up`.`user_id` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` AND `p`.`status` = '上架' INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` ";

let pwhere = " WHERE `p`.`is_delete` = 0 AND `pt`.`is_delete` = 0 AND `t`.`is_delete` = 0 AND `up`.`is_delete` = 0 ";
/**
 * @description 路由接口2
 * @class RoutesCon
 */
class RoutesCon {
  /**
   * @description 通过type_id获取商品
   */
  getProductByTypeId(req, res) {
    let sql = product + " where  `pt`.`type_id` = :type_id AND `pt`.`is_delete` = 0";
    let params = {
      type_id: req.body.typeId,
    };
    api
      .query(sql, params)
      .then((result) => {
        res.send({ msg: "查询商品数目成功", status: 200, url, result });
      })
      .catch((err) => {
        console.log("search err ==>", err);
        res.send({ msg: "查询商品数目失败", status: 250 });
      });
  }

  /**
   * @description 根据条件搜索 所有的商品
   * @param {object} req 请求体 必传{offset,count} 传其一{new,recommend,price}
   * @param {object} res 响应体
   */
  searchInput(req, res) {
    // SQL预处理，防止SQL注入
    let sql = product;

    // 条件
    let params = {
      offset: Number(req.query.offset),
      count: Number(req.query.count),
    };

    // 判断是否根据名称搜索
    if (req.query.keyWord) {
      sql +=
        " AND (`p`.`name` LIKE '%" +
        req.query.keyWord +
        "%'  OR `t`.`title` LIKE '%" +
        req.query.keyWord +
        "%' OR `p`.`desc` LIKE '%" +
        req.query.keyWord +
        "%')";
    }

    // 判断是否根据类型搜索
    if (req.query.typeId) {
      params.typeId = req.query.typeId;
      sql += " AND `pt`.`type_id` = :typeId";
    }

    // 判断是否根据状态搜索
    if (req.query.status) {
      params.status = req.query.status;
      sql += " AND `p`.`status` = :status";
    }

    // 是否根据日期搜索
    if (req.query.updated_at) {
      params.start = `${req.query.updated_at} 00:00:00`;
      params.end = `${req.query.updated_at} 23:59:59`;
      sql += " AND `p`.`updated_at` >= :start AND `p`.`updated_at` <= :end";
    }

    // 查询未删除的
    sql += pwhere;

    // 查询 私人 商品
    if (req.query.isSelf) {
      params.isSelf = "0";
      sql += " AND `p`.`is_self` = :isSelf";
    }

    // 查询一天内发布 oneDay: now -24h
    if (req.query.oneDay) {
      params.oneDay = req.query.oneDay;
      sql += " AND  :oneDay <= `p`.`created_at`";
    }

    // 排序
    // 最新发布
    if (req.query.news) {
      sql += " ORDER BY `p`.`created_at` DESC ";
    } else if (req.query.recommend) {
      //推荐
      sql += " ORDER BY `p`.`seals`+ `p`.`like_count` + `p`.`rate` DESC ";
    } else if (req.query.price) {
      //价格
      req.query.price === "1" ? (sql += " ORDER BY `p`.`price` DESC ") : (sql += " ORDER BY `p`.`price` ASC ");
    }

    // 分页
    sql += " LIMIT :offset, :count";

    // 总条数
    let selectRows = "SELECT FOUND_ROWS() ";

    api
      .query(sql, params)
      .then((res1) => {
        let dataArr = [];
        let result = {};
        result.productList = res1;
        api.query(selectRows).then((res2) => {
          result.rows = Object.values(res2[0])[0];
          dataArr.push(result);
          res.send({ msg: "查询商品成功", status: 1070, url, result: dataArr });
        });
      })
      .catch((err) => {
        console.log("searchInput err ==>", err);
        res.send({ msg: "查询商品失败", status: 1071 });
      });
  }

  /**
   * @description 创建收货地址
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  addAddress(req, res) {
    // 订单数据
    let addressData = Object.assign(req.body);

    api
      .createData("Address", {
        userId: req.userId,
        adrid: "adr" + new Date().getTime(),
        consigneeName: addressData.consigneeName,
        consigneePhone: addressData.consigneePhone,
        addressName: addressData.addressName,
        addressDetail: addressData.addressDetail,
        createBy: req.userId,
        updateBy: req.userId,
      })

      .then((result) => {
        res.send({ msg: "创建成功", status: 1060, result });
      })
      .catch((err) => {
        console.log("addAddress err ==>", err);
        res.send({ msg: "创建失败", status: 1061 });
      });
  }
  /**
   * @description 查找收货地址
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  findAddress(req, res) {
    api
      .findData({
        modelName: "Address",
        condition: {
          userId: req.userId,
          isDelete: 0,
        },
      })
      .then((result) => {
        res.send({ msg: "查询成功", status: 1060, result });
      })
      .catch((err) => {
        console.log("findAddress err ==>", err);
        res.send({ msg: "查询失败", status: 1061 });
      });
  }

  /**
   * @description 更新收货地址  isdefault 如果传了这个，则更换默认地址 没传，更新其他属性
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  updateAddress(req, res) {
    let addressData = Object.assign(req.body);

    if (addressData.isdefault) {
      // 更换之前需要将之前的默认设为 0
      api
        .updateData(
          "Address",
          {
            isdefault: false,
          },
          {
            isdefault: true,
            isDelete: 0,
          }
        )
        .then((result) => {
          api
            .updateData(
              "Address",
              {
                consigneeName: addressData.consigneeName,
                consigneePhone: addressData.consigneePhone,
                addressName: addressData.addressName,
                addressDetail: addressData.addressDetail,
                isdefault: addressData.isdefault,
              },
              {
                adrid: addressData.adrid,
              }
            )
            .then((result) => {
              res.send({ msg: "更新成功", status: 1060, result });
            })
            .catch((err) => {
              console.log("updateAddress err ==>", err);
              res.send({ msg: "更新失败", status: 1061 });
            });
        })
        .catch((err) => {
          console.log("updateAddress err ==>", err);
          res.send({ msg: "更新失败", status: 1061 });
        });
    } else {
      api
        .updateData(
          "Address",
          {
            consigneeName: addressData.consigneeName,
            consigneePhone: addressData.consigneePhone,
            addressName: addressData.addressName,
            addressDetail: addressData.addressDetail,
          },
          {
            adrid: addressData.adrid,
          }
        )
        .then((result) => {
          res.send({ msg: "更新成功", status: 1060, result });
        })
        .catch((err) => {
          console.log("updateAddress err ==>", err);
          res.send({ msg: "更新失败", status: 1061 });
        });
    }
  }

  /**
   * @description 删除收货地址
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  deleteAddress(req, res) {
    api
      .updateData(
        "Address",
        {
          isDelete: 1,
        },
        {
          adrid: req.body.adrid,
        }
      )
      .then((result) => {
        res.send({ msg: "更新成功", status: 200, result });
      })
      .catch((err) => {
        console.log("updateAddress err ==>", err);
        res.send({ msg: "更新失败", status: 250 });
      });
  }

  /**
   * @description 创建订单
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  addOrder(req, res) {
    let addOrder = Object.assign(req.body);
    let products = JSON.parse(addOrder.productList);
    delete addOrder.productList;
    // 生成订单id
    addOrder.orderNum = "ORD" + new Date().getTime(); // uuid.v1();
    // 生成订单商品id
    addOrder.orderProductId = "OP" + new Date().getTime(); // uuid.v1();
    addOrder.buyerId = req.userId;
    addOrder.status = 0;
    addOrder.createBy = req.userId;
    addOrder.updateBy = req.userId;
    let opArr = new Array();
    products.forEach((item) => {
      let obj = {
        orderProductId: addOrder.orderProductId,
        pid: Object.keys(item)[0],
        count: Object.values(item)[0],
        createBy: req.userId,
        updateBy: req.userId,
      };
      opArr.push(obj);
    });

    // 启动事务处理 t: 事务处理对象
    api
      .transaction(async (t) => {
        // 1.创建 Order
        await api.createData("Order", addOrder, t);
        // 2.创建 OrderProduct 表 (创建多个)
        await api.bulkCreateData("OrderProduct", opArr, t);
      })
      .then((result) => {
        res.send({ msg: "订单创建成功", status: 200, result: { orderNum: addOrder.orderNum } });
      })
      .catch((err) => {
        console.log("addOrder err ==> ", err);
        res.send({ msg: "订单创建失败", status: 201 });
      });
  }

  /**
   * @description 获取订单  传递订单号 {orderNum,}
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  findOrder(req, res) {
    let sql =
      selectOrderProduct +
      " FROM `order` AS `o` INNER JOIN `order_product` AS `op` ON `o`.`order_product_id` = `op`.`order_product_id` INNER JOIN `product` AS `p` ON `op`.`pid` = `p`.`pid` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` INNER JOIN `type` AS `t` ON `pt`.`type_id` =  `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` ";

    // let opWhere =
    //     "  WHERE `o`.`order_num` = :orderNum AND `p`.`is_delete` = 0 AND `pt`.`is_delete` = 0 AND `t`.`is_delete` = 0 AND `up`.`is_delete` = 0 AND `u`.`is_delete` = 0 AND `op`.`is_delete` = 0 AND `o`.`is_delete` = 0";
    let opWhere = "  WHERE `o`.`order_num` = :orderNum AND `o`.`is_delete` = 0";

    sql += opWhere;

    let result = new Object();

    new Promise((resolve, reject) => {
      let res1 = api.findData({
        modelName: "Order",
        condition: {
          buyerId: req.userId,
          orderNum: req.body.orderNum,
          isDelete: 0,
        },
      });

      resolve(res1);
    })
      .then((res1) => {
        let data = JSON.stringify(res1);
        data = JSON.parse(data)[0];
        result = Object.assign(data);

        // 收货地址
        api
          .findData({
            modelName: "Address",
            condition: {
              adrid: data.addressId,
            },
          })
          .then((address) => {
            result.address = address;

            // 订单商品
            api.query(sql, { orderNum: req.body.orderNum }).then((res2) => {
              result.productList = res2;
              res.send({ msg: "查询订单成功", status: 200, url, result });
            });
          });
      })
      .catch((err) => {
        console.log("findOrder err =>", err);
        res.send({ msg: "查询订单失败", status: 250 });
      });
  }

  /**
   * @description 通过条件 获取订单
   * @param {object} req 请求体  req.body.status 是一个数组   分页参数
   * @param {object} res 响应体
   */
  findOrderBySome(req, res) {
    // let addOrder = Object.assign(req.body);
    // let products = JSON.parse(addOrder.productList);
    let { status, limitNum, offsetNum } = req.body;
    let statusArr = status.split(",");
    console.log(statusArr);

    let sql =
      selectOrderProduct +
      " FROM `order` AS `o` INNER JOIN `order_product` AS `op` ON `o`.`order_product_id` = `op`.`order_product_id` INNER JOIN `product` AS `p` ON `op`.`pid` = `p`.`pid` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` INNER JOIN `type` AS `t` ON `pt`.`type_id` =  `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` ";

    // let opWhere =
    //     "  WHERE `p`.`is_delete` = 0 AND `pt`.`is_delete` = 0 AND `t`.`is_delete` = 0 AND `up`.`is_delete` = 0 AND `u`.`is_delete` = 0 AND `op`.`is_delete` = 0 AND `o`.`is_delete` = 0";
    // 查找订单未删除的，与其关联的商品不管是否删除都展示
    let opWhere = "  WHERE `o`.`order_num` = :orderNum AND `o`.`is_delete` = 0";

    sql += opWhere;

    let result = new Object();

    new Promise((resolve, reject) => {
      // 分页查询
      let res1 = api.findAndCountAllData(
        "Order",
        [],
        {
          buyerId: req.userId,
          status: statusArr,
          isDelete: 0,
        },
        Number(offsetNum),
        Number(limitNum)
      );

      resolve(res1);
    })
      .then((res1) => {
        // 可能不只一个数据
        let data = JSON.stringify(res1);
        data = JSON.parse(data);

        result = Object.assign({});
        result.orderList = [];
        result.count = data.count;

        if (data.rows.length === 0) {
          res.send({ msg: "查询订单成功", status: 205 });
          return;
        }

        new Promise((resolve, reject) => {
          data.rows.forEach((item, index) => {
            let obj = Object.assign(item);
            // 收货地址
            api
              .findData({
                modelName: "Address",
                condition: {
                  adrid: item.addressId,
                },
              })
              .then((res2) => {
                let data = JSON.stringify(res2);
                data = JSON.parse(data);
                obj.address = data;

                // 订单商品
                api
                  .query(sql, { orderNum: item.orderNum })
                  .then((res3) => {
                    let data = JSON.stringify(res3);
                    data = JSON.parse(data);
                    obj.productList = data;
                    result.orderList.push(obj);
                  })
                  .catch((err) => {
                    console.log("query err=>", err);
                    res.send({ msg: "查询订单失败", status: 250 });
                  });
              })
              .catch((err) => {
                console.log("findOrder err =>", err);
                res.send({ msg: "查询订单失败", status: 250 });
              });
          });

          setTimeout(() => {
            resolve(result);
          }, 500);
        })
          .then(() => {
            res.send({ msg: "查询订单成功", status: 200, url, result });
          })
          .catch((err) => {
            console.log("find And query err =>", err);
            res.send({ msg: "查询订单失败", status: 250 });
          });
      })
      .catch((err) => {
        console.log("findOuder err =>", err);
        res.send({ msg: "查询订单失败", status: 250 });
      });
  }

  /**
   * @description 获取用户所有  未支付 的订单表 没有其他地址与商品等信息
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  findNoPayOrder(req, res) {
    new Promise((resolve, reject) => {
      let result = api.findData({
        modelName: "Order",
        condition: {
          buyerId: req.userId,
          status: [0, 1],
          isDelete: 0,
        },
      });

      resolve(result);
    })
      .then((result) => {
        res.send({ msg: "查询未支付订单成功", status: 200, result });
      })
      .catch((err) => {
        console.log("findNoPayOrder err =>", err);
        res.send({ msg: "查询未支付订单失败", status: 250 });
      });
  }

  /**
   * @description 获取订单 数量
   * @param {object} req 请求体  req.body.status 是一个数组   分页参数
   * @param {object} res 响应体
   */
  // orderCount() {
  //     api.count('Order',{}).then((res2) => {
  //         result.productList = res2;
  //         res.send({ msg: "查询订单成功", status: 200, url, result });

  //     })
  //         .catch((err) => {
  //             console.log("findOrder err =>", err);
  //             res.send({ msg: "查询订单失败", status: 250 });
  //         });
  // }

  /**
   * @description 通过 orderNum 更新订单
   * @param {object} req 请求体 字段与数据库对应
   * @param {object} res 响应体
   */
  updateOrder(req, res) {
    let data = Object.assign(req.body);
    let orderNum = data.orderNum.split(",");

    delete data.orderNum;

    api
      .updateData("Order", data, {
        orderNum: orderNum,
        isDelete: 0,
      })
      .then((result) => {
        res.send({ msg: "更新成功", status: 200 });
      })
      .catch((err) => {
        console.log("updateAddress err ==>", err);
        res.send({ msg: "更新失败", status: 250 });
      });
  }

  /**
   * @description  支付
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  async payOrder(req, res) {
    let data = Object.assign(req.body);

    let orderNum = data.orderNum;
    let productCount = data.productCount;
    let productOne = data.productOne;
    console.log(typeof data.totalPrice);
    let totalPrice = data.totalPrice.replace(new RegExp(",", "g"), "");
    delete data.orderNum;
    delete data.productCount;
    delete data.productOne;

    const formData = new AlipayFormData();
    formData.setMethod("get");
    formData.addField("bizContent", {
      outTradeNo: orderNum, // 商户订单号,64个字符以内、可包含字母、数字、下划线,且不能重复
      productCode: "FAST_INSTANT_TRADE_PAY", // 销售产品码，与支付宝签约的产品码名称,仅支持FAST_INSTANT_TRADE_PAY
      totalAmount: totalPrice, // 订单总金额，单位为元，精确到小数点后两位
      subject: `${"二手交易" + orderNum + "号商品"}`, // 订单标题
      body: `${productCount > 1 ? productOne + "等" + " " + productCount + " 件商品" : productOne}`, // 订单描述
    });
    // // 表示异步通知回调,
    formData.addField("notifyUrl", "https://www.baidu.com");
    // 付款成功的跳转页面
    formData.addField("returnUrl", "http://localhost:8080/#/PaySuccess");

    utils
      .alipaySDK()
      .exec(
        // result 为可以跳转到支付链接的 url
        "alipay.trade.page.pay", // 统一收单下单并支付页面接口
        {}, // api 请求的参数（包含“公共请求参数”和“业务参数”）
        {
          formData: formData,
        }
      )
      .then((url) => {
        // 支付接口获取成功则更新 订单状态 1 待支付
        data.status = 1;
        let result = Object.assign({});
        result.url = url;
        api
          .updateData("Order", data, {
            orderNum: orderNum,
            isDelete: 0,
          })
          .then((res2) => {
            res.send({ msg: "支付中", status: 200, result });
          })
          .catch((err) => {
            console.log("updateAddress err ==>", err);
            res.send({ msg: "更新失败", status: 250 });
          });
      })
      .catch((err) => {
        // 支付失败 更新状态  3 支付失败
        data.status = 3;
        api
          .updateData("Order", data, {
            orderNum: orderNum,
            isDelete: 0,
          })
          .then((res2) => {
            res.send({ msg: "支付中", status: 200, result });
          })
          .catch((err) => {
            console.log("updateAddress err ==>", err);
            res.send({ msg: "更新失败", status: 250 });
          });
        console.log("alipay err=>", err);
        res.send({ msg: "获取支付失败", status: 251 });
      });
  }

  /**
   * @description  确认收货
   * @param {object} req 请求体 支付成功订单号 支付方式
   * @param {object} res 响应体
   */
  confirmReceipt(req, res) {
    console.log(req.body);
    let data = Object.assign(req.body);
    let orderNum = data.orderNum;
    let pidArr = data.pidArr;

    console.log(pidArr);
    delete data.orderNum;
    delete data.pidArr;

    // 状态改为完成
    data.status = 6;
    data.takeTime = new Date();
    api
      .transaction(async (t) => {
        await api.updateData(
          "Order",
          data,
          {
            orderNum: orderNum,
            isDelete: 0,
          },
          t
        );

        await api.subOrAdd(
          "Product",
          { seals: 1 },
          {
            pid: pidArr,
          },
          t,
          "add"
        );
      })
      .then((res2) => {
        res.send({ msg: "收货成功", status: 200, result: "ok" });
      })
      .catch((err) => {
        console.log("paySuccess err ==>", err);
        res.send({ msg: "收货失败", status: 250 });
      });
  }

  /**
   * @description  支付成功
   * @param {object} req 请求体 支付成功订单号 支付方式
   * @param {object} res 响应体
   */
  paySuccess(req, res) {
    let data = Object.assign(req.body);
    let orderNum = data.orderNum;

    delete data.orderNum;

    data.status = 2;

    api
      .updateData("Order", data, {
        orderNum: orderNum,
        isDelete: 0,
      })
      .then((res2) => {
        res.send({ msg: "更新支付成功", status: 200, result: "ok" });
      })
      .catch((err) => {
        console.log("paySuccess err ==>", err);
        res.send({ msg: "更新支付失败", status: 250 });
      });
  }

  /**
   * @description  发布评价
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  sendComment(req, res) {
    api
      .transaction(async (t) => {
        let commentId = "COM" + new Date().getTime();
        await api.createData(
          "Comment",
          {
            commentId,
            productId: req.body.productId,
            content: req.body.content,
            rate: req.body.rate,
            createBy: req.userId,
          },
          t
        );

        // 获取商品的所有评价数
        let count = await api.count(
          "Comment",
          {
            productId: req.body.productId,
          },
          t
        );

        // 重新计算评分  插入数据库 需要前台传入上一次总的评分
        let productRate = (req.body.productRate * (count - 1) + req.body.rate) / count;
        await api.updateData(
          "Product",
          {
            rate: productRate,
          },
          {
            pid: req.body.productId,
          },
          t
        );

        // 评价成功之后 更改orderProduct 评价状态
        await api.updateData(
          "OrderProduct",
          {
            isCoumment: 1,
          },
          {
            pid: req.body.productId,
          },
          t
        );
      })
      .then((result) => {
        res.send({ msg: "发布评论成功", status: 200, result });
      })
      .catch((err) => {
        console.log("sendComment err ==>", err);
        res.send({ msg: "发布评论失败", status: 250 });
      });
  }

  /**
   * @description  更新评价 传入与数据库匹配
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  updateComment(req, res) {
    let data = Object.assign(req.body);
    let commentId = data.commentId;
    delete data.commentId;

    api
      .updateData("Comment", data, {
        commentId,
        updateBy: req.userId,
        isDelete: 0,
      })
      .then((res2) => {
        res.send({ msg: "更新评论成功", status: 200, result: "ok" });
      })
      .catch((err) => {
        console.log("deleteComment err ==>", err);
        res.send({ msg: "更新评论失败", status: 250 });
      });
  }

  /**
   * @description  获取评价 列表
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  getCommentList(req, res) {
    let pid = req.body.pid;
    let offset = req.body.offsetNum;
    let count = req.body.limitNum;

    let sql =
      "SELECT * ,`u`.`password`,`u`.`is_catch` FROM `comment` AS `c` INNER JOIN `u` AS `user` ON `u`.`user_id` = `c`.`create_by` WHERE `c`.`product_id` = :pid ORDER BY `c`.`created_at` DESC  LIMIT :offset, :count";
    api
      .query(sql, {
        pid,
        offset,
        count,
      })
      // api.findAndCountAllData(
      //     "Comment",
      //     [],
      //     {
      //         productId: req.body.productId,
      //     },
      //     Number(req.body.offsetNum),
      //     Number(req.body.limitNum),
      //     [["createdAt", "DESC"]]
      // )
      .then((result) => {
        res.send({ msg: "获取评论成功", status: 200, url, result });
      })
      .catch((err) => {
        console.log("getCommentList err ==>", err);
        res.send({ msg: "获取评论失败", status: 250 });
      });
  }

  /**
   * @description  获取已评价的订单商品 列表
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  getCommentedOrderP(req, res) {
    let offset = req.body.offsetNum;
    let count = req.body.limitNum;

    let sql =
      "SELECT `c`.`comment_id`,`c`.`created_at`,`c`.`content`,`c`.`rate`,`p`.`img`,`p`.`title` FROM `comment` AS `c` INNER JOIN `p` AS `product` ON `p`.`pid` = `c`.`product_id` WHERE `c`.`create_by` = :userId ORDER BY `c`.`created_at` DESC  LIMIT :offset, :count";
    api
      .query(sql, {
        userId: req.userId,
        offset,
        count,
      })
      // api.findAndCountAllData(
      //     "Comment",
      //     [],
      //     {
      //         productId: req.body.productId,
      //     },
      //     Number(req.body.offsetNum),
      //     Number(req.body.limitNum),
      //     [["createdAt", "DESC"]]
      // )
      .then((result) => {
        res.send({ msg: "获取个人评论商品成功", status: 200, url, result });
      })
      .catch((err) => {
        console.log("getCommentedOrderP err ==>", err);
        res.send({ msg: "获取个人评论商品失败", status: 250 });
      });
  }

  /**
   * @description  初始化会话
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  initTalk(req, res) {
    // let sql = "SELECT `tu`.`talk_user_id`,`tu`.`reply_user_id`,`tu`.`create_by`,`tu`.`updated_at`,`tu`.`new_msg_one`,`u`.`nick_name`,`u`.`email`,`u`.`avatar` ,`u`.`user_id` FROM `talk_user` AS `tu` INNER JOIN `user` AS `u` ON `u`.`user_id` = `tu`.`reply_user_id` WHERE (`tu`.`create_by` = :createBy OR `tu`.`reply_user_id` = :replyUserId) AND `tu`.`is_delete` = 0 ORDER BY `tu`.`updated_at` DESC"
    // api.query(sql, {
    //     createBy: req.userId,
    //     replyUserId: req.userId
    // }
    // ).then((result) => {
    //     res.send({ msg: "初始化会话成功", status: 200, url, result });
    // }).catch((err) => {
    //     console.log('initTalk err=>', err);
    //     res.send({ msg: "初始化会话失败", status: 250 });
    // })

    api
      .findData({
        modelName: "TalkUser",
        condition: {
          [Op.or]: [{ createBy: req.userId }, { replyUserId: req.userId }],
          isDelete: 0,
        },
        attributes: ["talkUserId", "replyUserId", "newMsgOne", "createBy", "updatedAt"],
      })
      .then((result) => {
        res.send({ msg: "初始化会话成功", status: 200, result });
      })
      .catch((err) => {
        console.log("initTalk err=>", err);
        res.send({ msg: "初始化会话失败", status: 250 });
      });
  }

  /**
   * @description  创建会话  replyUserId
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  createTalk(req, res) {
    // let sql =  "SELECT `tu`.`talk_user_id`,`tu`.`reply_user_id`,`tu`.`create_by`,`tu`.`updated_at`,`tu`.`new_msg_one`,`u`.`nick_name`,`u`.`email`,`u`.`avatar` ,`u`.`user_id` FROM `talk_user` AS `tu` INNER JOIN `user` AS `u` ON `u`.`user_id` = `tu`.`reply_user_id` WHERE (`tu`.`create_by` = :createBy OR `tu`.`reply_user_id` = :replyUserId) AND `tu`.`is_delete` = 0 ORDER BY `tu`.`updated_at` DESC"

    // 创建之前先查找，防止再次创建
    api
      .findData({
        modelName: "TalkUser",
        condition: {
          [Op.or]: [
            { [Op.and]: [{ replyUserId: req.body.replyUserId }, { createBy: req.userId }] },
            { [Op.and]: [{ createBy: req.body.replyUserId }, { replyUserId: req.userId }] },
          ],
          isDelete: 0,
        },
      })
      .then((res1) => {
        if (res1.length > 0) {
          res.send({ msg: "会话已创建", status: 200, result: res1 });
        } else {
          // 创建会话
          let talkUserId = "TU" + new Date().getTime();
          api
            .createData("TalkUser", {
              talkUserId,
              replyUserId: req.body.replyUserId,
              createBy: req.userId,
            })
            .then((result) => {
              res.send({ msg: "创建会话成功", status: 200, result });
            })
            .catch((err) => {
              res.send({ msg: "创建会话失败", status: 250 });
            });
        }
      })
      .catch((err) => {
        console.log("createTalk err=>", err);
        res.send({ msg: "查找创建会话失败", status: 250 });
      });
  }

  /**
   * @description  更新会话 newMsgOne 或 unreadCount 字段  通过talkUserId
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  updateTalk(req, res) {
    let params = Object.assign({}, req.body);
    console.log(params);
    let talkUserId = params.talkUserId;
    delete params.talkUserId;

    api
      .updateData("TalkUser", params, {
        talkUserId,
        isDelete: 0,
      })

      .then((result) => {
        res.send({ msg: "更新会话成功", status: 200, result });
      })
      .catch((err) => {
        res.send({ msg: "更新会话失败", status: 250 });
      });
  }

  /**
     * @description  新增会话消息   talkUserId: talkUserId, replyUserId: replyUserId, text
               
     * @param {object} req 请求体
     * @param {object} res 响应体
     */
  addTalkMessage(req, res) {
    let talkId = "TK" + new Date().getTime();
    api
      .createData("Talk", {
        talkId,
        text: req.body.text,
        talkUserId: req.body.talkUserId,
        replyUserId: req.body.replyUserId,
        createBy: req.userId,
      })
      .then((result) => {
        res.send({ msg: "创建会话消息成功", status: 200, result });
      })
      .catch((err) => {
        res.send({ msg: "创建会话消息失败", status: 250 });
      });
  }

  /**
   * @description  更新会话消息 isRead 字段  通过talkUserId
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  updateTalkMessage(req, res) {
    api
      .updateData(
        "Talk",
        {
          isRead: 1,
        },
        {
          talkUserId: req.body.talkUserId,
          isRead: 0,
        }
      )
      .then((result) => {
        res.send({ msg: "更新会话消息成功", status: 200, result });
      })
      .catch((err) => {
        res.send({ msg: "更新会话消息失败", status: 250 });
      });
  }

  /**
   * @description  查找会话消息 通过talkUserId
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  findTalkMessage(req, res) {
    // api.("Order", [], params, Number(offsetNum), Number(limitNum));
    let offsetNum = req.body.offsetNum;
    let limitNum = req.body.limitNum;
    api
      .findAndCountAllData(
        "Talk",
        [],
        {
          talkUserId: req.body.talkUserId,
          isDelete: 0,
        },
        Number(offsetNum),
        Number(limitNum),
        [["createdAt", "DESC"]]
      )
      .then((result) => {
        res.send({ msg: "查找会话消息成功", status: 200, result });
      })
      .catch((err) => {
        console.log("findTalkMessage err=>", err);
        res.send({ msg: "查找会话消息失败", status: 250 });
      });
  }

  /**
   * @description  用户查找总的 未读 会话消息数目
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  findUnTalkCount(req, res) {
    api
      .count("Talk", {
        replyUserId: req.userId,
        isDelete: 0,
        isRead: 0,
      })
      .then((result) => {
        res.send({ msg: "查找未读会话消息成功", status: 200, result });
      })
      .catch((err) => {
        console.log("findUnTalkCount err=>", err);
        res.send({ msg: "查找未读会话消息失败", status: 250 });
      });
  }

  /**
   * @description  用户查找单个会话 未读 消息数目 通过talkUserId replyUserId
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  findOneUnTalkCount(req, res) {
    api
      .count("Talk", {
        talkUserId: req.body.talkUserId,
        replyUserId: req.userId,
        isDelete: 0,
        isRead: 0,
      })
      .then((result) => {
        res.send({ msg: "查找单个会话 未读会话消息成功", status: 200, result });
      })
      .catch((err) => {
        console.log("findOneUnTalkCount err=>", err);
        res.send({ msg: "查找单个 未读会话消息失败", status: 250 });
      });
  }
}

// 导出实例
module.exports = new RoutesCon();
