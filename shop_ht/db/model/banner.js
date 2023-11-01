/**
 * @module 模型：Banner模型, banner表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class Banner extends Model {}

// 定义模型结构, 数据表结构
Banner.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: "表id",
        },

        bannerId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "轮播图id",
        },

        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "轮播图名称",
        },

        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            comment: "价格",
        },

        discount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 1,
            comment: "折扣",
        },

        desc: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            comment: "商品描述",
        },

        img: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "",
            comment: "商品图片",
        },

        detailImg: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "",
            comment: "商品详情图片",
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
        // 指定连接实例，这样才知道在指定数据库创建banner表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> banners作为表名
        modelName: "banner",

        // 不推断，直接使用模型作为表名 ==> banner作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "banner",
    }
);

// 同步数据库表
// force: true ==> 删除原有banner表，新建banner表
// force: false ==> 如果banner存在，则不创建，反之，不创建banner表
Banner.sync({ force: config.mysqlOptions.forceRemove });

module.exports = Banner;
