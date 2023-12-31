/**
 * @module 模型：Product模型, product表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class Product extends Model { }

// 定义模型结构, 数据表结构
Product.init(
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

        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "商品名称",
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

        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "",
            comment: "商品状态",
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

        rate: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 0,
            comment: "总评分",
        },

        audit: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "-1",
            comment: "商品审核状态 0发布 1审核成功 2审核失败 ",
        },
        isSelf: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "是否是官方产品 ",
        },
        putaddress: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "中国",
            comment: "发布地址",
        },

        likeCount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0,
            comment: "收藏数目",
        },

        seals: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: "销量",
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
        // 指定连接实例，这样才知道在指定数据库创建product表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> products作为表名
        modelName: "product",

        // 不推断，直接使用模型作为表名 ==> product作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "product",
    }
);

// 同步数据库表
// force: true ==> 删除原有product表，新建product表
// force: false ==> 如果product存在，则不创建，反之，不创建product表
Product.sync({ force: config.mysqlOptions.forceRemove });
// Product.sync({ alter: true });

module.exports = Product;
