/**
 * @module 路由控制器
 * @author : zou
 * */

// 导入API, 操作MySQL数据库
let api = require(__basename + "/api/api.js");

// 导入sequelize的Op模块
let { Op } = require("sequelize");

// 导入node-uuid模块
// let uuid = require('node-uuid')

// 导入utils, 调用公共方法
let utils = require(__basename + "/utils/utils.js");

let url = config.serverOptions.host;
if (config.serverOptions.port) {
  url += `:${config.serverOptions.port}`;
}

url += config.serverOptions.baseUrl;

// let productSQL =
//     "SELECT `p`.`pid`, `p`.`name`, `p`.`price`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`updated_at`, `pt`.`type_id`, `t`.`title`, `u`.`email`, `u`.`avatar` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` AND `p`.`status` = '上架' INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` INNER JOIN `user` AS `u` ON `up`.`user_id` = `u`.`user_id`";
// let productSQL =
//     "SELECT  `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`rate`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`,`p`.`seals`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`, `u`.`email`, `u`.`avatar` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` AND `p`.`status` = '上架' INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` INNER JOIN `user` AS `u` ON `up`.`user_id` = `u`.`user_id`";
// 查询所有商品
let productSQL =
  "SELECT  `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`img`, `p`.`detail_img`, `p`.`rate`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`, `p`.`like_count`, `p`.`seals`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`, `up`.`user_id` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` AND `p`.`status` = '上架' INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` ";

let pwhere = " WHERE `p`.`is_delete` = 0 AND `pt`.`is_delete` = 0 AND `t`.`is_delete` = 0 AND `up`.`is_delete` = 0 ";

/**
 * @description 路由接口
 * @class RoutesController
 */
class RoutesController {
  /**
   * @description 请求域拦截
   * @param {object} req 请求体
   * @param {object} res 返回体
   * @param {function} next 下一步
   */
  verfiyHost(req, res, next) {
    if (config.hostOptions.indexOf(req.headers.origin) === -1) {
      return res.send({ msg: "请求域不合法", status: 1020 });
    }
    next();
  }

  /**
   * @description 验证码拦截
   * @param {object} req 请求体
   * @param {object} res 返回体
   * @param {function} next 下一步
   */
  verifyCode(req, res, next) {
    // 验证验证码
    let url = req.url.split("?")[0];
    if (config.codeUrlOptions.includes(url)) {
      api
        .findData({
          modelName: "Code",
          condition: {
            codeId: req.body.codeId,
          },
        })
        .then((result) => {
          // 获取当前时间和验证码有效时间差
          let time = new Date().getTime() - config.emailOptions.expires;

          // 获取验证码保存时间
          let codeTime = new Date(result[0].dataValues.createdAt).getTime();

          // 如果验证码保存时间 >= time
          let isPass = req.body.validcode == result[0].dataValues.code && req.body.email == result[0].dataValues.email && codeTime >= time;

          // 如果验证通过，则将请求传递给下一个中间件或者路由
          isPass ? next() : res.send({ msg: "验证码错误", status: 1031 });
        })
        .catch((err) => {
          console.log("verifyCode err ==>", err);
          res.send({ msg: "验证码错误", status: 1031 });
        });
    } else {
      next();
    }
  }

  /**
   * @description 验证Token(验证登录) 管理员与用户
   * @param {object} req 请求体
   * @param {object} res 响应体
   * @param {function} next 下一步
   */
  verifyToken(req, res, next) {
    // 需要验证token
    let url = req.url.split("?")[0];
    if (config.tokenOptions.tokenUrls.indexOf(url) > -1) {
      if (!req.headers.token) {
        res.send({ msg: "请先登录", status: 1034 });
      } else {
        // 验证管理员
        console.log(url);
        if (config.adminOptions.includes(url)) {
          let cookie = utils.transformCookie(req.headers.token);
          console.log(cookie);
          let adminToken = [cookie.Amama12, cookie.Anana20, cookie.Amama20].join(".");

          // 验证token
          utils
            .verifyToken(adminToken)
            .then((result) => {
              console.log(result);
              // 将userId传递
              req.userId = result.data;
              next();
            })
            .catch((err) => {
              console.log("verifyToken1 err ==>", err);
              res.send({ msg: "请先登录", status: 1034 });
            });
        } else {
          //验证用户
          let cookie = utils.transformCookie(req.headers.token);
          let token = [cookie.mama12, cookie.nana20, cookie.mama20].join(".");

          // 验证token
          utils
            .verifyToken(token)
            .then((result) => {
              // 将userId传递
              req.userId = result.data;
              next();
            })
            .catch((err) => {
              console.log("verifyToken2 err ==>", err);
              res.send({ msg: "请先登录", status: 1034 });
            });
        }
      }
    } else {
      next();
    }
  }

  /**
   * @description 用户登录
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  login(req, res) {
    api
      .findData({
        modelName: "User",
        condition: {
          email: req.body.email,
          isDelete: 0,
        },
        attributes: ["userId", "password"],
      })
      .then((result) => {
        // 如果存在用户
        if (result.length > 0) {
          // 验证密码是否正确
          let password = utils.encodeString(req.body.password);
          if (password == result[0].dataValues.password) {
            // 生成token：加密的字符串，一般用于身份验证，登录验证
            let token = utils.signToken(result[0].dataValues.userId);

            // 将token切片
            let ts = token.split(".");
            let tsObj = {
              mama12: ts[0],
              nana20: ts[1],
              nana19: "uyTrgabciOGHgsadrtjhaCI6Ik98EwahbvD", // 干扰项
              mama20: ts[2],
            };
            res.send({ msg: "登录成功", status: 1030, data: tsObj });
          } else {
            res.send({ msg: "用户名或者密码不正确", status: 1033 });
          }
        } else {
          res.send({ msg: "用户不存在", status: 1032 });
        }
      })
      .catch((err) => {
        console.log("login err ==>", err);
        res.send({ msg: "登录失败", status: 1031 });
      });
  }

  /**
   * @description 注册接口
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  register(req, res) {
    // 插入数据 ==> 模型.create(创建数据对象) 查询邮箱是否已经被注册
    api
      .findData({
        modelName: "User",
        condition: {
          email: req.body.email,
        },
        attributes: ["email"],
      })
      .then((result) => {
        // 如果邮箱已经被注册，则提示用户该邮箱已经被注册
        if (result.length > 0) {
          res.send({ msg: "该邮箱已经被注册", status: 1002 });
        } else {
          // 创建用户id
          let userId = "_uid" + new Date().getTime();
          // let userId = "uid" + uuid.v1()

          // 随机昵称
          let index = Math.floor(Math.random() * config.nickNameOptions.length);
          let nickName = config.nickNameOptions[index] + userId;

          // 加密密码
          let password = utils.encodeString(req.body.password);

          // 添加用户数据，注册用户
          api
            .createData("User", {
              email: req.body.email,
              password,
              nickName,
              userId,
            })
            .then((result) => {
              res.send({ msg: "注册成功", status: 1000, result });
            })
            .catch((err) => {
              console.log("register err ==>", err);
              res.send({ msg: "注册失败", status: 1001 });
            });
        }
      })
      .catch((err) => {
        console.log("register err ==>", err);
        res.send({ msg: "注册失败", status: 1001 });
      });
  }

  /**
   * @description 发邮件
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  email(req, res) {
    // 随机生成验证码
    let code = utils.randomCode();

    // 生成验证码唯一id
    let codeId = "cid" + new Date().getTime();
    // console.log(uuid.v1());
    // let codeId = "cid" + uuid.v1()

    // 先把验证码存储，再发邮件给用户
    api
      .createData("Code", {
        email: req.body.email,
        codeId,
        code,
      })
      .then((result) => {
        // 如果创建成功，就发邮件
        if (result.dataValues) {
          utils
            .sendEmail({
              to: req.body.email,
              subject: "旭日东升二手交易",
              html: `验证码为：<a href="javascript:;">${code}</a>，${
                config.emailOptions.expires / 1000 / 60
              }分钟内有效，请尽快提交您的验证码。为保证信息安全，切勿将验证码告知他人。`,
            })
            .then((result) => {
              res.send({ msg: `验证码已发至${result.accepted[0]}`, status: 1010, cid: codeId });
            })
            .catch((err) => {
              console.log("email err ==>", err);
              res.send({ msg: "发送验证码失败", status: 1011 });
            });
        } else {
          res.send({ msg: "发送验证码失败", status: 1011 });
        }
      })
      .catch((err) => {
        console.log("email err ==>", err);
        res.send({ msg: "发送验证码失败", status: 1011 });
      });
  }

  /**
   * @description 校正验证码
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  jadgeCode(req, res) {
    api
      .findData({
        modelName: "Code",
        condition: {
          codeId: req.body.codeId,
        },
      })
      .then((result) => {
        if (result.length !== 0) {
          // 检验验证码时效
          let time = new Date().getTime() - config.emailOptions.expires;
          let codeTime = new Date(result[0].dataValues.createdAt).getTime();
          let isPass = req.body.validcode == result[0].dataValues.code && req.body.email == result[0].dataValues.email && codeTime >= time;
          isPass ? res.send({ msg: `验证通过`, status: 1035 }) : res.send({ msg: `验证码错误`, status: 1031 });
        }
      })
      .catch((err) => {
        console.log("jadgeCode err ==>", err);
        res.send({ msg: "验证码错误", status: 1031 });
      });
  }

  /**
   * @description 获取当前 登录 用户信息
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  getUserInfo(req, res) {
    api
      .findData({
        modelName: "User",
        condition: {
          userId: req.userId,
          isDelete: 0,
        },
      })
      .then((result) => {
        if (result.length > 0) {
          res.send({ msg: "查询用户信息成功", status: 1040, result, url });
        } else {
          res.send({ msg: "查询用户信息失败", status: 1041, result, url });
        }
      })
      .catch((err) => {
        console.log("getUserInfo err ==>", err);
        res.send({ msg: "查询用户信息失败", status: 1041, result, url });
      });
  }

  /**
   * @description 获取 用户信息 通过用户userId
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  getUserInfoByUserId(req, res) {
    api
      .findData({
        modelName: "User",
        condition: {
          userId: req.body.userId,
        },
        attributes: { exclude: ["password"] },
      })
      .then((result) => {
        if (result.length > 0) {
          res.send({ msg: "获取用户信息成功", status: 1040, result, url });
        } else {
          res.send({ msg: "获取用户信息失败", status: 1041, result, url });
        }
      })
      .catch((err) => {
        console.log("getUserInfo err ==>", err);
        res.send({ msg: "获取用户信息失败", status: 1041, result, url });
      });
  }

  /**
   * @description 获取用户信息 通过邮件
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  getUserInfoForEmail(req, res) {
    api
      .findData({
        modelName: "User",
        condition: {
          email: req.query.email,
          isDelete: 0,
        },
      })
      .then((result) => {
        if (result.length > 0) {
          res.send({ msg: "查询用户信息成功", status: 1040, result, url });
        } else {
          res.send({ msg: "查询用户信息失败", status: 1041, result, url });
        }
      })
      .catch((err) => {
        console.log("getUserInfoForEmail err ==>", err);
        res.send({ msg: "查询用户信息失败", status: 1041, result, url });
      });
  }

  /**
   * @description 更新用户信息
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  async updateUserInfo(req, res) {
    // 更改密码
    if (req.body.password) {
      req.body.password = utils.encodeString(req.body.password);
    }
    // 更换头像
    if (req.body.avatar) {
      req.body.imgType = req.body.imgType || "jpg";
      const promise = [utils.uploadImg(req.body.avatar, req.body.imgType)];
      await Promise.all(promise).then((result) => {
        req.body.avatar = result[0];
        delete req.body.img;
        delete req.body.imgType;
      });
    }
    const userId = req.body.userId;
    delete req.body.userId;
    // 写入数据库
    api
      .updateData("User", req.body, {
        userId,
        isDelete: 0,
      })
      .then((result) => {
        result.length > 0 ? res.send({ msg: "更新成功", status: 1042 }) : res.send({ msg: "更新失败", status: 1043 });
      })
      .catch((err) => {
        console.log("updateUserInfo err ==>", err);
        res.send({ msg: "更新失败", status: 1043 });
      });
  }

  /**
   * @description 获取商品类型
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  getTypeData(req, res) {
    api
      .findData({
        modelName: "Type",
        condition: {
          isDelete: 0,
        },
      })
      .then((result) => {
        res.send({ msg: "查询类型成功", status: 1050, result });
      })
      .catch((err) => {
        console.log("getTypeData err ==>", err);
        res.send({ msg: "查询类型失败", status: 1051 });
      });
  }

  /**
   * @description 发布商品
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  postProduct(req, res) {
    // 先上传图片
    let promise = [utils.uploadImg(req.body.img, req.body.imgType), utils.uploadImg(req.body.detailImg, req.body.detailImgType)];

    // 等待所有图片都上传完成后，再将商品数据写入mysql数据库
    Promise.all(promise)
      .then((result) => {
        // 商品数据
        let productData = Object.assign(req.body);
        productData.img = result[0];
        productData.detailImg = result[1];

        // 商品类型id
        let typeId = productData.type;

        // 删除商品类型,图片类型
        delete productData.type;
        delete productData.imgType;
        delete productData.detailImgType;

        // 生成商品id
        productData.pid = "pid" + new Date().getTime();
        // productData.pid = "pid" + uuid.v1()

        // 启动事务处理 t: 事务处理对象
        api
          .transaction((t) => {
            return Promise.all([
              // 01-将商品数据写入Product模型
              api.createData("Product", productData, t),

              // 02-将商品和用户关系写入UserProduct模型
              api.createData(
                "UserProduct",
                {
                  pid: productData.pid,
                  userId: req.userId,
                  createBy: req.userId,
                  updateBy: req.userId,
                },
                t
              ),

              // 03-将商品和商品类型关系写入ProductType模型
              api.createData(
                "ProductType",
                {
                  pid: productData.pid,
                  typeId,
                },
                t
              ),
            ]);
          })
          .then((result) => {
            res.send({ msg: "发布商品成功", status: 1060, result });
          })
          .catch((err) => {
            console.log("postProduct err ==>", err);
            res.send({ msg: "发布商品失败", status: 1061 });
          });
      })
      .catch((err) => {
        console.log("postProduct err ==>", err);
        res.send({ msg: "发布商品失败", status: 1061 });
      });
  }

  /**
   * @description 根据条件搜索 当前用户的商品
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  search(req, res) {
    // SQL预处理，防止SQL注入
    let sql = productSQL + " AND `up`.`user_id` = :userId";

    // 条件
    let params = {
      userId: req.userId,
      offset: Number(req.query.offset),
      count: Number(req.query.count),
    };

    // 判断是否根据名称搜索
    if (req.query.name) {
      sql += " AND `p`.`name` LIKE '%" + req.query.name + "%'";
    }

    // 判断是否根据类型搜索
    if (req.query.type_id) {
      params.type_id = req.query.type_id;
      sql += " AND `pt`.`type_id` = :type_id";
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

    // 排序并且分页
    sql += " ORDER BY `p`.`updated_at` DESC LIMIT :offset, :count";

    api
      .query(sql, params)
      .then((result) => {
        res.send({ msg: "查询商品成功", status: 1070, data: { url, result } });
      })
      .catch((err) => {
        console.log("search err ==>", err);
        res.send({ msg: "查询商品失败", status: 1071 });
      });
  }

  /**
   * @description 根据条件查询商品总数目
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  count(req, res) {
    // SQL预处理，防止SQL注入
    let sql =
      "SELECT COUNT(`p`.`pid`) AS `count` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` AND `up`.`user_id` = :userId";

    // 条件
    let params = {
      userId: req.userId,
    };

    // 判断是否根据名称搜索
    if (req.query.name) {
      sql += " AND `p`.`name` LIKE '%" + req.query.name + "%'";
    }

    // 判断是否根据类型搜索
    if (req.query.type_id) {
      params.type_id = req.query.type_id;
      sql += " AND `pt`.`type_id` = :type_id";
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

    // 未删除
    sql += " WHERE `p`.`is_delete` = 0 AND `pt`.`is_delete` = 0 AND `t`.`is_delete` = 0 AND `up`.`is_delete` = 0";

    api
      .query(sql, params)
      .then((result) => {
        res.send({ msg: "查询商品数目成功", status: 1080, result });
      })
      .catch((err) => {
        console.log("count err ==>", err);
        res.send({ msg: "查询商品数目失败", status: 1081 });
      });
  }

  /**
   * @description 上下架
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  updownself(req, res) {
    api
      .updateData(
        "Product",
        {
          status: req.body.status,
        },
        {
          pid: req.body.pid,
          isDelete: 0,
        }
      )
      .then((result) => {
        res.send({ msg: "更新商品状态成功", status: 1090, result });
      })
      .catch((err) => {
        console.log("updownself err ==>", err);
        res.send({ msg: "更新商品状态失败", status: 1091 });
      });
  }

  /**
   * @description 根据商品pid查询 用户 商品信息
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  getProductById(req, res) {
    let sql = productSQL + " WHERE `p`.`pid` = :pid AND `p`.`is_delete` = 0";

    api
      .query(sql, {
        pid: req.query.pid,
      })
      .then((result) => {
        res.send({ msg: "查询商品成功", status: 1070, data: { url, result } });
      })
      .catch((err) => {
        console.log("getProductById err ==>", err);
        res.send({ msg: "查询商品失败", status: 1071 });
      });
  }

  /**
   * @description 更新商品数据
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  updateProduct(req, res) {
    // 更新商品数据
    function updatePro(productData, pid) {
      // 更新Product模型
      api
        .updateData("Product", productData, {
          pid,
          isDelete: 0,
        })
        .then((r1) => {
          res.send({ msg: "更新商品数据成功", status: 1100, result: r1 });
        })
        .catch((err) => {
          console.log("updateProduct err ==>", err);
          res.send({ msg: "更新商品数据失败", status: 1101 });
        });
    }

    // 更新商品数据和商品类型
    function updateProAndType(productData, pid) {
      // 开始事务处理, 更新Product, ProductType模型
      api
        .transaction(async (t) => {
          // 更新商品数据
          await api.updateData("Product", productData, { pid, isDelete: 0 }, t);

          // 更新商品类型数据
          await api.updateData("ProductType", { typeId }, { pid, isDelete: 0 }, t);
        })
        .then((r3) => {
          res.send({ msg: "更新商品数据成功", status: 1100, result: r3 });
        })
        .catch((err) => {
          console.log("updateProduct err ==>", err);
          res.send({ msg: "更新商品数据失败", status: 1101 });
        });
    }

    //01-如果存在图片, 先上传图片，再更新商品数据
    //02-如果没有图片, 直接更新商品数据
    //03-如果更新类型, 需要操作更新ProductType模型
    //04-如果更新商品数据, 需要操作更新Product模型
    let promise = [];
    let imgs = [];

    // 商品数据
    let productData = Object.assign(req.body);

    // 商品类型id
    let typeId = productData.type;

    // 商品pid
    let pid = productData.pid;

    // 删除商品类型,图片类型
    delete productData.type;
    delete productData.imgType;
    delete productData.detailImgType;
    delete productData.pid;

    if (req.body.img) {
      imgs.push("img");
      promise.push(utils.uploadImg(req.body.img, req.body.imgType));
    }
    if (req.body.detailImg) {
      imgs.push("detailImg");
      promise.push(utils.uploadImg(req.body.detailImg, req.body.detailImgType));
    }

    // 如果存在图片, 先上传图片，再更新商品数据
    if (promise.length > 0) {
      // 等待所有图片都上传完成后，再将商品数据写入mysql数据库
      Promise.all(promise)
        .then((result) => {
          imgs.map((v, i) => {
            productData[v] = result[i];
          });

          // 判断是否存在更改类型
          if (typeId) {
            // 开始事务处理, 更新Product, ProductType模型
            updateProAndType(productData, pid);
          } else {
            updatePro(productData, pid);
          }
        })
        .catch((err) => {
          console.log("updateProduct err ==>", err);
          res.send({ msg: "更新商品数据失败", status: 1101 });
        });
    } else {
      // 没有图片 只有类型
      if (typeId && JSON.stringify(productData) == "{}") {
        // 更新ProductType模型
        api
          .updateData("ProductType", { typeId }, { pid, isDelete: 0 })
          .then((r2) => {
            res.send({ msg: "更新商品数据成功", status: 1100, result: r2 });
          })
          .catch((err) => {
            console.log("updateProduct err ==>", err);
            res.send({ msg: "更新商品数据失败", status: 1101 });
          });
      } else if (typeId && JSON.stringify(productData) != "{}") {
        // 有类型且有商品数据 开始事务处理
        updateProAndType(productData, pid);
      } else {
        // 只有商品数据 更新Product模型
        updatePro(productData, pid);
      }
    }
  }

  /**
   * @description 用户删除商品
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  remove(req, res) {
    // 删除Product、ProductType、UserProduct模型数据 开启事务处理
    api
      .transaction(async (t) => {
        // 方式一
        // 删除UserProduct模型数据
        await api.updateData(
          "UserProduct",
          { isDelete: 1 },
          {
            pid: req.body.pid,
            userId: req.userId,
          },
          t
        );

        // 删除ProductType模型数据
        await api.updateData(
          "ProductType",
          { isDelete: 1 },
          {
            pid: req.body.pid,
          },
          t
        );

        // 删除Product模型数据
        await api.updateData(
          "Product",
          { isDelete: 1 },
          {
            pid: req.body.pid,
          },
          t
        );
      })
      .then((result) => {
        res.send({ msg: "删除商品数据成功", status: 1110 });
      })
      .catch((err) => {
        console.log("remove err ==>", err);
        res.send({ msg: "删除商品数据失败", status: 1111 });
      });
  }

  /**
   * @description 查询客户端首页的推荐商品  通过is_self 来判断官方与私人商品
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  clientHomeProduct(req, res) {
    let sql = productSQL;
    let params = {
      offset: Number(req.query.offset),
      count: Number(req.query.count),
    };

    // 查询未删除的
    sql += pwhere;

    // 获取个人商品
    if (req.query.isSelf) {
      params.is_self = req.query.isSelf;
      sql += "AND `P`.`is_self` = :is_self";
    }

    // 获取官方商品 热销
    if (req.query.seals) {
      sql += " ORDER BY `p`.`seals` DESC ";
    }

    // 获取官方商品 热销
    if (req.query.recommend) {
      sql += " ORDER BY `p`.`seals` + `p`.`like_count` + `p`.`rate` DESC ";
    }

    // 分页
    sql += " LIMIT :offset, :count";

    api
      .query(sql, params)
      .then((result) => {
        res.send({ msg: "查询商品成功", status: 1120, url, result });
      })
      .catch((err) => {
        console.log("clientHomeProduct err ==>", err);
        res.send({ msg: "查询商品失败", status: 1121 });
      });
  }

  /**
   * @description 查询首页类别数据
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  category(req, res) {
    api
      .findData({
        modelName: "Type",
        condition: {
          home: 1,
          isDelete: 0,
        },
      })
      .then((result) => {
        res.send({ msg: "查询类别成功", status: 1130, result, url });
      })
      .catch((err) => {
        console.log("category err ==> ", err);
        res.send({ msg: "查询类别失败", status: 1131 });
      });
  }

  /**
   * @description 首页搜索商品 简单
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  clientSearch(req, res) {
    api
      .findData({
        modelName: "Product",
        condition: {
          name: {
            [Op.like]: `%${req.query.keyword}%`,
          },
          status: "上架",
          isDelete: 0,
        },
      })
      .then((result) => {
        res.send({ msg: "搜索商品成功", status: 1140, result, url });
      })
      .catch((err) => {
        console.log("clientSearch err ==> ", err);
        res.send({ msg: "搜索商品失败", status: 1141 });
      });
  }

  /**
   * @description 客户端根据商品pid查询商品详情信息(不包含其他信息)
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  productDetail(req, res) {
    api
      .findData({
        modelName: "Product",
        condition: {
          pid: req.query.pid,
          isDelete: 0,
        },
      })
      .then((result) => {
        console.log(111);
        console.log(result);
        res.send({ msg: "查询商品详情成功", status: 1150, result, url });
      })
      .catch((err) => {
        console.log("productDetail err ==> ", err);
        res.send({ msg: "查询商品详情失败", status: 1151 });
      });
  }

  /**
   * @description 客户端收藏商品
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  like(req, res) {
    // 启动事务处理 t: 事务处理对象
    api
      .transaction(async (t) => {
        // 1.创建like
        await api.createData(
          "Like",
          {
            pid: req.body.pid,
            userId: req.userId,
          },
          t
        );
        // 2.更新Product的likecount字段   使用api增加 可以避免并发

        await api.subOrAdd(
          "Product",
          { likeCount: 1 },
          {
            pid: req.body.pid,
            isDelete: 0,
          },
          t,
          "add"
        );
      })
      .then((result) => {
        res.send({ msg: "收藏商品成功", status: 1160, result });
      })
      .catch((err) => {
        console.log("like err ==>", err);
        res.send({ msg: "收藏商品失败", status: 1161 });
      });
  }

  /**
   * @description 删除收藏商品 逻辑删除
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  removeLike(req, res) {
    // 启动事务处理 t: 事务处理对象
    api
      .transaction(async (t) => {
        // 1.创建like
        await api.updateData(
          "Like",
          {
            isDelete: 1,
          },
          {
            pid: req.body.pid,
            userId: req.userId,
            isDelete: 0,
          },
          t
        );
        // 2.更新Product的likecount字段 使用api 避免并发问题 （减少）
        await api.subOrAdd(
          "Product",
          { likeCount: 1 },
          {
            pid: req.body.pid,
            isDelete: 0,
          },
          t
        );
      })
      .then((result) => {
        res.send({ msg: "删除收藏商品成功", status: 1160, result });
      })
      .catch((err) => {
        console.log("removelike err ==>", err);
        res.send({ msg: "删除收藏商品失败", status: 1161 });
      });
  }

  /**
   * @description 查询指定商品是否已收藏 和用户收藏的商品
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  findLike(req, res) {
    // SQL预处理，防止SQL注入
    let findLikeProduct =
      "SELECT  `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`rate`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`,`p`.`seals`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`, `up`.`user_id` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` AND `p`.`status` = '上架' INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` ";

    let sql = findLikeProduct + " INNER JOIN `Like` AS `l` ON `l`.`pid` = `p`.`pid` AND `l`.`user_id` = :userId"; //AND `up`.`user_id` = :userId"

    // 条件
    let params = {
      userId: req.userId,
    };

    // 查询是否收藏该商品，没有此参数就查所有商品
    if (req.query.pid) {
      params.pid = req.query.pid;
      sql += " AND `p`.`pid` = :pid";
    }

    //查询未删除的
    sql += " AND l.is_delete = 0";

    // 排序并且分页
    if (req.query.offset && req.query.count) {
      params.offset = Number(req.query.offset);
      params.count = Number(req.query.count);
      sql += " ORDER BY `p`.`updated_at` DESC LIMIT :offset, :count";
    }

    api
      .query(sql, params)
      .then((result) => {
        res.send({ msg: "查询收藏商品成功", status: 1165, url, result });
      })
      .catch((err) => {
        console.log("findLike err ==>", err);
        res.send({ msg: "查询收藏商品失败", status: 1166 });
      });
  }

  /**
   * @description 收藏条目数
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  likeCount(req, res) {
    api
      .count("Like", {
        userId: req.userId,
        isDelete: 0,
      })
      .then((result) => {
        res.send({ msg: "查询收藏记录数成功", status: 1166, result });
      })
      .catch((err) => {
        console.log("likeCount err ==> ", err);
        res.send({ msg: "查询收藏记录数失败", status: 1167 });
      });
  }

  /**
   * @description 加入购物车
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  addShopcart(req, res) {
    // 先查询购物车是否存在该商品, 如果存在则累加数量，否则新增一条数据
    api
      .findData({
        modelName: "Shopcart",
        condition: {
          pid: req.body.pid,
          userId: req.userId,
          isDelete: 0,
        },
      })
      .then((result) => {
        if (result.length == 0) {
          // 新增购物车数据
          api
            .createData("Shopcart", {
              pid: req.body.pid,
              userId: req.userId,
              count: Number(req.body.count),
            })
            .then((result) => {
              res.send({ msg: "创建购物车成功", status: 1170, result: 1 });
            })
            .catch((err) => {
              console.log("addShopcart err ==> ", err);
              res.send({ msg: "创建购物车失败", status: 1171 });
            });
        } else {
          // 更新之前先  查找 限制数量 最大为10
          api
            .findData({
              modelName: "Shopcart",
              condition: {
                pid: req.body.pid,
                userId: req.userId,
                isDelete: 0,
              },
            })
            .then((res2) => {
              let data = JSON.stringify(res2);
              if (JSON.parse(data)[0].count + Number(req.body.count) > 10) {
                res.send({ msg: "最大数量为10", status: 11700 });
                return;
              }

              // 更新数量
              api
                .updateData(
                  "Shopcart",
                  {
                    count: Number(req.body.count) + JSON.parse(data)[0].count,
                  },
                  {
                    pid: req.body.pid,
                    userId: req.userId,
                    isDelete: 0,
                  }
                )
                .then((result) => {
                  res.send({ msg: "加入购物车成功", status: 1170 });
                })
                .catch((err) => {
                  console.log("addShopcart err ==> ", err);
                  res.send({ msg: "加入购物车失败", status: 1171 });
                });
            })
            .catch((err) => {
              console.log("addShopcart err ==> ", err);
              res.send({ msg: "加入购物车失败", status: 1171 });
            });
        }
      })
      .catch((err) => {
        console.log("addShopcart err ==> ", err);
        res.send({ msg: "加入或创建购物车失败", status: 1171 });
      });
  }
  /**
   * @description 更新购物车商品是否选择
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  updateShopcartCheck(req, res) {
    // 更新数量
    api
      .updateData(
        "Shopcart",
        {
          isChecked: req.body.isCheck,
        },
        {
          pid: req.body.pid,
          userId: req.body.userId, // 为啥这里用token验证中的用户id不能成功
          isDelete: 0,
        }
      )
      .then((result) => {
        res.send({ msg: "更新购物车商品选择成功", status: 1170, result: 0 });
      })
      .catch((err) => {
        console.log("updateShopcartCount err ==> ", err);
        res.send({ msg: "更新购物车商品选择失败", status: 1171 });
      });
  }
  /**
   * @description 更新购物车商品数目
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  updateShopcartCount(req, res) {
    // // let data = JSON.stringify({ data: req });
    // // console.log(JSON.parse(data));
    // console.log(req.body.userId);
    // 更新数量
    api
      .updateData(
        "Shopcart",
        {
          count: Number(req.body.count),
        },
        {
          pid: req.body.pid,
          userId: req.body.userId, // 为啥这里用token验证中的用户id不能成功
          isDelete: 0,
        }
      )
      .then((result) => {
        res.send({ msg: "更新购物车数目成功", status: 1170, result: 0 });
      })
      .catch((err) => {
        console.log("updateShopcartCount err ==> ", err);
        res.send({ msg: "更新购物车数目失败", status: 1171 });
      });
  }

  /**
   * @description 逻辑删除购物车商品 通过id数组删除
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  removeShopcart(req, res) {
    let ids = req.body.ids.split(",");

    api
      .updateData(
        "Shopcart",
        {
          isDelete: 1,
        },
        {
          id: ids,
        }
      )
      .then((result) => {
        res.send({ msg: "删除购物车成功", status: 1172, result: 0 });
      })
      .catch((err) => {
        console.log("addShopcart err ==> ", err);
        res.send({ msg: "删除购物车失败", status: 1173 });
      });
  }

  /**
   * @description 查询购物车商品 只针对 官方
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  shopcartProducts(req, res) {
    // SQL预处理，防止SQL注入
    // let shopSQL =
    //     "SELECT `s`.`id`, `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`rate`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`,`p`.`seals`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`, `u`.`email`, `u`.`avatar`,`s`.`is_checked` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` AND `p`.`status` = '上架' INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` INNER JOIN `user` AS `u` ON `up`.`user_id` = `u`.`user_id`";
    let shopSQL =
      "SELECT `s`.`id`, `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`rate`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`,`p`.`seals`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`, `up`.`user_id`,`s`.`is_checked` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` AND `p`.`status` = '上架' INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` ";

    let sql = shopSQL + " INNER JOIN `shopcart` AS `s` ON `s`.`pid` = `p`.`pid` AND `s`.`user_id` = :userId "; // AND `up`.`user_id` = :userId "
    sql = sql.replace("SELECT", "SELECT `s`.`count`,");
    // 条件
    let params = {
      userId: req.userId,
    };

    // 查询是否收藏该商品，没有此参数就查所有商品
    if (req.query.pid) {
      params.pid = req.query.pid;
      sql += " AND `p`.`pid` = :pid";
    }

    //查询未删除的
    sql += pwhere + " AND `s`.`is_delete` = 0";

    // 排序
    sql += " ORDER BY `p`.`updated_at` DESC";

    // 分页
    if (req.query.offset && req.query.count) {
      params.offset = Number(req.query.offset);
      params.count = Number(req.query.count);
      sql += " LIMIT :offset, :count";
    }

    api
      .query(sql, params)
      .then((result) => {
        console.log(result);
        res.send({ msg: "查询购物车商品成功", status: 1174, url, result });
      })
      .catch((err) => {
        console.log("shopcartProducts err ==>", err);
        res.send({ msg: "查询购物车商品失败", status: 1175 });
      });
  }

  /**
   * @description 查询购物车记录数
   * @param {object} req 请求体
   * @param {object} res 响应体
   */
  shopcartCount(req, res) {
    api
      .count("Shopcart", {
        userId: req.userId,
        isDelete: 0,
      })
      .then((result) => {
        res.send({ msg: "查询购物车记录数成功", status: 1176, result });
      })
      .catch((err) => {
        console.log("shopcartCount err ==> ", err);
        res.send({ msg: "查询购物车记录数失败", status: 1177 });
      });
  }
}

// 导出实例
module.exports = new RoutesController();
