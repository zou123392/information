/**
 * @module 模型：Talk模型, talk表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class Talk extends Model { }

// 定义模型结构, 数据表结构
Talk.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: "表id",
        },

        talkId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "单个消息id",
        },

        talkUserId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "文本id",
        },

        replyUserId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "回复用户id",
        },

        text: {
            type: DataTypes.STRING(),
            allowNull: false,
            defaultValue: "",
            comment: "会话内容 ",
        },

        isRead: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "是否已读 ",
        },

        createBy: {
            type: DataTypes.STRING(30),
            allowNull: false,

            // 默认值
            defaultValue: "",
            comment: "创建人id",
        },

        isDelete: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "删除 ",
        },
    },
    {
        // 指定连接实例，这样才知道在指定数据库创建talk表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> talks作为表名
        modelName: "talk",

        // 不推断，直接使用模型作为表名 ==> talk作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "talk",
    }
);

// 同步数据库表
// force: true ==> 删除原有talk表，新建talk表
// force: false ==> 如果talk存在，则不创建，反之，不创建talk表
Talk.sync({ force: config.mysqlOptions.forceRemove });
// Talk.sync({ alter: true });
module.exports = Talk;
