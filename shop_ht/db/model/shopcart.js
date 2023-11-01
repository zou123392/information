/**
 * @module 模型：Shopcart模型, shopcart表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class Shopcart extends Model {}

/**
 * @description 定义模型结构, 数据表结构
 */
Shopcart.init(
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
            comment: "验证码id",
        },

        userId: {
            type: DataTypes.STRING(30),
            allowNull: false,

            // 默认值
            defaultValue: "",
            comment: "用户id",
        },

        count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "购车商品数量",
        },

        isChecked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: "用于前端选择字段 ",
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
        // 指定连接实例，这样才知道在指定数据库创建shopcart表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> shopcarts作为表名
        modelName: "shopcart",

        // 不推断，直接使用模型作为表名 ==> shopcart作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "shopcart",
    }
);

// 同步数据库表
// force: true ==> 删除原有shopcart表，新建shopcart表
// force: false ==> 如果shopcart存在，则不创建，反之，不创建shopcart表
Shopcart.sync({ force: config.mysqlOptions.forceRemove });

module.exports = Shopcart;
