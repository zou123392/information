/**
 * @module 模型：Comment模型, comment表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class Comment extends Model {}

// 定义模型结构, 数据表结构
Comment.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: "表id",
        },

        commentId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "评论id",
        },

        productId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "对应商品id",
        },

        rate: {
            type: DataTypes.STRING(2),
            allowNull: false,
            defaultValue: 8,
            comment: "评分",
        },

        content: {
            type: DataTypes.STRING(),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "主要内容",
        },

        replyId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "回复评论 回复的用户id",
        },

        likeCont: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "0",
            comment: "点赞数量",
        },

        audit: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "评论审核状态 0发布 1审核成功 2审核失败 ",
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

        isReply: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "是否是回复的评论 ",
        },

        isDelete: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "删除 ",
        },
    },
    {
        // 指定连接实例，这样才知道在指定数据库创建comment表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> comments作为表名
        modelName: "comment",

        // 不推断，直接使用模型作为表名 ==> comment作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "comment",
    }
);

// 同步数据库表
// force: true ==> 删除原有comment表，新建comment表
// force: false ==> 如果comment存在，则不创建，反之，不创建comment表
Comment.sync({ force: config.mysqlOptions.forceRemove });
// Comment.sync({ alter: true });

module.exports = Comment;
