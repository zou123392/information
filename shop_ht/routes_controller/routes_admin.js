/**
 * @module 管理员路由控制器
 * @author : zou
 * */

// 导入API, 操作MySQL数据库
let api = require(__basename + "/api/api.js");

// 导入sequelize的Op模块
let { Op, DataTypes, where, DATE } = require("sequelize");

// 导入node-uuid模块
// let uuid = require("node-uuid");

// 导入utils, 调用公共方法
let utils = require(__basename + "/utils/utils.js");

let url = config.serverOptions.host;
if (config.serverOptions.port) {
    url += `:${config.serverOptions.port}`;
}
url += config.serverOptions.baseUrl;

let selectOrderProduct =
    "SELECT  `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`seals`,  `p`.`like_count`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title`,`op`.`count`, `u`.`email`,`u`.`nick_name`";
let product =
    "SELECT sql_calc_found_rows `p`.`pid`, `p`.`name`, `p`.`price`,`p`.`discount`, `p`.`status`, `p`.`desc`, `p`.`rate`, `p`.`img`, `p`.`detail_img`, `p`.`seals`, `p`.`like_count`, `p`.`audit`,`p`.`is_self`,`p`.`putaddress`, `p`.`create_by`, `p`.`created_at`, `p`.`updated_at`, `t`.`title` ,`up`.`user_id` FROM `product` AS `p` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` INNER JOIN `type` AS `t` ON `pt`.`type_id` = `t`.`type_id` INNER JOIN `user_product` AS `up` ON `p`.`pid` = `up`.`pid`";

let pwhere = " WHERE `p`.`is_delete` = 0 AND `pt`.`is_delete` = 0 AND `t`.`is_delete` = 0 ";
/**
 * @description 管理员路由接口
 * @class RoutesAdmin
 */
class RoutesAdmin {
    /**
     * @description 管理员登录
     * @param {object} req 请求体
     * @param {object} res 响应体
     */
    adminLogin(req, res) {
        api.findData({
            modelName: "Admin",
            condition: {
                email: req.body.email,
            },
            attributes: ["adminId", "password"],
        })
            .then((result) => {
                // 如果存在用户
                if (result.length > 0) {
                    // 验证密码是否正确
                    let password = utils.encodeString(req.body.password);
                    if (password == result[0].dataValues.password) {
                        // 生成token：加密的字符串，一般用于身份验证，登录验证
                        let token = utils.signToken(result[0].dataValues.adminId);

                        // 将token切片
                        let ts = token.split(".");
                        let tsObj = {
                            Amama12: ts[0],
                            Anana20: ts[1],
                            Anana19: "uyTrgabciOGHgsadrtjhaCI6Ik98EwahbvD", // 干扰项
                            Amama20: ts[2],
                        };
                        res.send({ msg: "登录成功", status: 1030, data: tsObj });
                    } else {
                        res.send({ msg: "登录名或者密码不正确", status: 1033 });
                    }
                } else {
                    res.send({ msg: "管理员不存在", status: 1032 });
                }
            })
            .catch((err) => {
                console.log("login err ==>", err);
                res.send({ msg: "登录失败", status: 1031 });
            });
    }

    /**
     * @description 获取管理员信息
     * @param {object} req 请求体
     * @param {object} res 响应体
     */
    getAdminInfo(req, res) {
        console.log(req.userId);
        api.findData({
            modelName: "Admin",
            condition: {
                adminId: req.userId,
                isDelete: 0,
            },
            attributes: { exclude: ["password"] },
        })
            .then((result) => {
                if (result.length > 0) {
                    res.send({ msg: "查询管理员信息成功", status: 1040, result, url });
                } else {
                    res.send({ msg: "查询管理员信息失败", status: 1041 });
                }
            })
            .catch((err) => {
                console.log("getUserInfo err ==>", err);
                res.send({ msg: "查询管理员信息失败", status: 1041 });
            });
    }

    /**
     * @description 官方发布商品
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
                api.transaction((t) => {
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
     * @description 商家删除商品
     * @param {object} req 请求体
     * @param {object} res 响应体
     */
    remove(req, res) {
        // 删除Product、ProductType、UserProduct模型数据 开启事务处理
        api.transaction(async (t) => {
            // 方式一
            // 删除UserProduct模型数据
            await api.updateData(
                "UserProduct",
                { isDelete: 1 },
                {
                    pid: req.body.pid,
                    userId: req.body.userId,
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
        if (req.query.name) {
            sql += " AND `p`.`name` LIKE '%" + req.query.name + "%'";
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
        if (req.query.comment === "用户") {
            params.isSelf = "0";
            sql += " AND `p`.`is_self` = :isSelf";
        }

        // 查询官方
        if (req.query.comment === "官方") {
            params.isSelf = "1";
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
            sql += " ORDER BY `p`.`seals` DESC ,`p`.`like_count`,`p`.`rate`";
        } else if (req.query.price) {
            req.query.price === "1" ? (sql += " ORDER BY `p`.`price` DESC ") : (sql += " ORDER BY `p`.`price` ASC ");
        }

        // 分页
        sql += " LIMIT :offset, :count";

        // 总条数
        let selectRows = "SELECT FOUND_ROWS() ";

        api.query(sql, params)
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
     * @description 根据条件搜索订单
     */
    findOrderBySome(req, res) {
        let params = req.query;
        let limitNum = params.limitNum;
        let offsetNum = params.offsetNum;
        delete params.limitNum;
        delete params.offsetNum;

        if (params.createdAt) {
            let t = new Date(params.createdAt);
            let year = t.getFullYear();
            let month = t.getMonth() + 1;
            let date = t.getDate();
            let fullDate = `${year}-${month}-${date}`;

            params.createdAt = {
                [Op.and]: {
                    [Op.gte]: new Date(`${fullDate} 00:00:00`),
                    [Op.lte]: new Date(`${fullDate} 23:59:59`),
                },
            };
        }

        if (params.payTime) {
            let pt = new Date(params.payTime);
            let year = pt.getFullYear();
            let month = pt.getMonth() + 1;
            let date = pt.getDate();
            let fullDate = `${year}-${month}-${date}`;
            params.payTime = {
                [Op.and]: {
                    [Op.gte]: new Date(`${fullDate} 00:00:00`),
                    [Op.lte]: new Date(`${fullDate} 23:59:59`),
                },
            };
        }

        // 去空
        for (let item in params) {
            if (params[item] == "") {
                delete params[item];
            }
        }

        params.isDelete = 0;

        let result = new Object();
        // 分页查询
        new Promise((resolve, reject) => {
            // 分页查询
            let res1 = api.findAndCountAllData("Order", [], params, Number(offsetNum), Number(limitNum));

            resolve(res1);
        })
            .then((res1) => {
                // 可能不只一个数据
                let data = JSON.stringify(res1);
                data = JSON.parse(data);

                result = Object.assign(data);
                result.count = data.count;

                new Promise((resolve, reject) => {
                    data.rows.forEach((item, index) => {
                        // 收货地址
                        api.findData({
                            modelName: "Address",
                            condition: {
                                adrid: item.addressId,
                            },
                        }).then((res2) => {
                            let data = JSON.stringify(res2);
                            data = JSON.parse(data);
                            item.address = data;
                        });
                    });
                    setTimeout(() => {
                        resolve(result);
                    }, 100);
                }).then((result) => {
                    res.send({ msg: "查询订单成功", status: 200, url, result });
                });
            })

            .catch((err) => {
                console.log("findOuder err =>", err);
                res.send({ msg: "查询订单失败", status: 250 });
            });
    }

    /**
     * @description 通过条件 获取订单 所有关联信息
     * @param {object} req 请求体  req.body.status 是一个数组   分页参数
     * @param {object} res 响应体
     */
    findOrderAllBySome(req, res) {
        // let addOrder = Object.assign(req.body);
        // let products = JSON.parse(addOrder.productList);
        let { status, limitNum, offsetNum } = req.query;
        if (status) {
            let statusArr = status.split(",");
            console.log(statusArr);
        }

        let sql =
            selectOrderProduct +
            " FROM `order` AS `o` INNER JOIN `order_product` AS `op` ON `o`.`order_product_id` = `op`.`order_product_id` INNER JOIN `product` AS `p` ON `op`.`pid` = `p`.`pid` INNER JOIN `product_type` AS `pt` ON `p`.`pid` = `pt`.`pid` INNER JOIN `type` AS `t` ON `pt`.`type_id` =  `t`.`type_id` INNER JOIN `user_product` AS `up` ON `up`.`pid` = `p`.`pid` INNER JOIN `user` AS `u` ON `u`.`user_id` = `up`.`user_id` ";

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
                    // buyerId: req.userId,
                    // status: statusArr,
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

                console.log("************************************", data);

                if (data.rows.length === 0) {
                    res.send({ msg: "查询订单成功", status: 205 });
                    return;
                }

                new Promise((resolve, reject) => {
                    data.rows.forEach((item, index) => {
                        let obj = Object.assign(item);
                        // 收货地址
                        api.findData({
                            modelName: "Address",
                            condition: {
                                adrid: item.addressId,
                            },
                        })
                            .then((res2) => {
                                let data = JSON.stringify(res2);
                                data = JSON.parse(data);
                                obj.address = data;

                                console.log("***********", obj);

                                // 订单商品
                                api.query(sql, { orderNum: item.orderNum })
                                    .then((res3) => {
                                        let data = JSON.stringify(res3);
                                        data = JSON.parse(data);
                                        obj.productList = data;
                                        result.orderList.push(obj);
                                        console.log(data);
                                        console.log(console.log("#######$$$$$$$$$$$$$$$$", result));
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
                    }, 200);
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
     * @description 通过 orderNum 更新订单
     * @param {object} req 请求体 字段与数据库对应
     * @param {object} res 响应体
     */
    updateOrder(req, res) {
        let data = Object.assign(req.body);
        let orderNum = data.orderNum.split(",");

        delete data.orderNum;
        api.updateData("Order", data, {
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
     * @description  获取用户列表
     * @param {object} req 请求体 字段与数据库对应
     * @param {object} res 响应体
     */
    getUserList(req, res) {
        let params = req.query;
        let limitNum = params.limitNum;
        let offsetNum = params.offsetNum;
        delete params.limitNum;
        delete params.offsetNum;

        // 去空
        for (let item in params) {
            if (params[item] == "") {
                delete params[item];
            }
        }

        if (params.createdAt) {
            let t = new Date(params.createdAt);
            let year = t.getFullYear();
            let month = t.getMonth() + 1;
            let date = t.getDate();
            let fullDate = `${year}-${month}-${date}`;

            params.createdAt = {
                [Op.and]: {
                    [Op.gte]: new Date(`${fullDate} 00:00:00`),
                    [Op.lte]: new Date(`${fullDate} 23:59:59`),
                },
            };
        }

        // 分页查询
        let res1 = api
            .findAndCountAllData("User", ["password"], params, Number(offsetNum), Number(limitNum))
            .then((result) => {
                res.send({ msg: "获取用户成功", status: 200, url, result });
            })
            .catch((err) => {
                console.log("getUserList err ==>", err);
                res.send({ msg: "获取用户失败", status: 250 });
            });
    }

    /**
     * @description 管理员 删除 用户
     * @param {object} req 请求体 userId
     * @param {object} res 响应体
     */
    async deleteUser(req, res) {
        await api
            .findData({
                modelName: "Admin",
                condition: {
                    adminId: req.userId,
                },
                attributes: ["password"],
            })
            .then((result) => {
                // 验证密码是否正确
                let password = utils.encodeString(req.body.password);
                if (password == result[0].dataValues.password) {
                    // 删除Product、ProductType、UserProduct模型数据 开启事务处理
                    api.transaction(async (t) => {
                        // 查找用户所关联的产品 pid
                        let pidArr = await api.findData({
                            modelName: "UserProduct",
                            condition: {
                                userId: req.body.userId,
                            },
                            attributes: ["pid"],
                        });
                        let sPid = JSON.stringify(pidArr);
                        pidArr = [];
                        JSON.parse(sPid).forEach((item) => {
                            pidArr.push(...Object.values(item));
                        });

                        // 删除用户
                        await api.updateData(
                            "User",
                            { isDelete: 1 },
                            {
                                userId: req.body.userId,
                            },
                            t
                        );

                        // 删除用户的 Shopcart 模型数据
                        await api.updateData(
                            "Shopcart",
                            { isDelete: 1 },
                            {
                                userId: req.body.userId,
                            },
                            t
                        );

                        // 还有其他表等
                        // 删除UserProduct模型数据
                        await api.updateData(
                            "UserProduct",
                            { isDelete: 1 },
                            {
                                pid: pidArr,
                            },
                            t
                        );

                        // 删除ProductType模型数据
                        await api.updateData(
                            "ProductType",
                            { isDelete: 1 },
                            {
                                pid: pidArr,
                            },
                            t
                        );

                        // 删除Product模型数据
                        await api.updateData(
                            "Product",
                            { isDelete: 1 },
                            {
                                pid: pidArr,
                            },
                            t
                        );
                    })
                        .then((result) => {
                            res.send({ msg: "删除用户成功", status: 1110 });
                        })
                        .catch((err) => {
                            console.log("remove err ==>", err);
                            res.send({ msg: "删除用户失败", status: 1111 });
                        });
                } else {
                    res.send({ msg: "密码错误", status: 1111 });
                }
            })
            .catch((err) => {
                console.log("login err ==>", err);
                res.send({ msg: "删除用户失败", status: 1111 });
            });
    }

    /**
     * @description  操作用户（更新 账号 状态）
     * @param {object} req 请求体 字段与数据库对应
     * @param {object} res 响应体
     */
    changeUser(req, res) {
        let params = req.body;
        let userId = params.userId;

        delete params.userId;

        // 去空
        for (let item in params) {
            if (params[item] == "") {
                delete params[item];
            }
        }

        api.updateData("User", params, {
            userId: userId,
            isDelete: 0,
        })
            .then((result) => {
                res.send({ msg: "更新用户状态成功", status: 200, url, result });
            })
            .catch((err) => {
                console.log("changeUser err ==>", err);
                res.send({ msg: "更新用户状态失败", status: 250 });
            });
    }
}

// 导出实例
module.exports = new RoutesAdmin();
