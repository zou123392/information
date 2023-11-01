/**
 * @module 模型：Order模型, order表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class Order extends Model { }

// 定义模型结构, 数据表结构
Order.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: "表id",
        },

        orderNum: {
            type: DataTypes.STRING(30),
            allowNull: false,

            // 默认值
            defaultValue: "",
            comment: "订单编号",
        },

        orderProductId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "订单商品表id",
        },

        productCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: "0",
            comment: "商品总件数",
        },

        totalPrice: {
            type: DataTypes.STRING(15),
            allowNull: false,
            defaultValue: "0",
            comment: "总价格",
        },
        sellerId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "卖家id",
        },
        buyerId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "买家id",
        },

        addressId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "收货地址id",
        },

        logNum: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "物流单号",
        },
        payWay: {
            type: DataTypes.STRING(10),
            allowNull: true,
            // 默认值
            defaultValue: "",
            comment: "支付方式",
        },

        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "-1",
            comment: "订单状态 0创建 1待支付 2支付成功 3支付失败 4订单超时 5发货成功（显示物流单号） 6收货成功",
        },

        payTime: {
            type: DataTypes.DATE,
            allowNull: true,
            // defaultValue: null,
            comment: "支付时间",
        },

        sendTime: {
            type: DataTypes.DATE,
            allowNull: true,
            // defaultValue: null,
            comment: "发货时间（录入物流信息时间）",
        },

        takeTime: {
            type: DataTypes.DATE,
            allowNull: true,
            // defaultValue: null,
            comment: "收货时间(即订单完成)",
        },

        createBy: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "创建人id",
        },
        updateBy: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "更新人id",
        },

        isDelete: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "删除 ",
        },
    },
    {
        // 指定连接实例，这样才知道在指定数据库创建order表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> orders作为表名
        modelName: "order",

        // 不推断，直接使用模型作为表名 ==> order作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "order",
    }
);

// 同步数据库表
// force: true ==> 删除原有order表，新建order表
// force: false ==> 如果order存在，则不创建，反之，不创建order表
Order.sync({ force: config.mysqlOptions.forceRemove });
// Order.sync({ alter: true });

module.exports = Order;
