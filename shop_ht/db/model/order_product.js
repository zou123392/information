/**
 * @module 模型：OrderProduct模型 order_product表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");
class OrderProduct extends Model {}

/**
 * @description 定义模型结构, 数据表结构
 */
OrderProduct.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: "表id",
        },

        pid: {
            type: DataTypes.STRING(30),
            allowNull: false,

            // 默认值
            defaultValue: "",
            comment: "商品id",
        },

        orderProductId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "表唯一id",
        },

        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "商品数量",
        },

        isComment: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "是否已经评价 ",
        },

        isDelete: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "删除 ",
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
    },
    {
        // 指定连接实例，这样才知道在指定数据库创建order_product表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> order_products作为表名
        modelName: "order_product",

        // 不推断，直接使用模型作为表名 ==> order_product作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "order_product",
    }
);

// 同步数据库表
// force: true ==> 删除原有order_product表，新建order_product表
// force: false ==> 如果like存在，则不创建，反之，不创建order_product表
// OrderProduct.sync({ force: config.mysqlOptions.forceRemove });
OrderProduct.sync({ alter: true });
module.exports = OrderProduct;
