/**
 * @module 模型：TalkUser模型, talk_user表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class TalkUser extends Model { }

// 定义模型结构, 数据表结构
TalkUser.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: "表id",
        },

        // 唯一标识
        talkUserId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "会话与文本信息关联表id",
        },

        replyUserId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "回复用户id",
        },

        newMsgOne: {
            type: DataTypes.STRING(),
            allowNull: false,
            defaultValue: "",
            comment: "最新的一条消息",
        },

        unreadCount: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: "0",
            comment: "未读消息数量 ",
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
        // 指定连接实例，这样才知道在指定数据库创建talk_user表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> talk_users作为表名
        modelName: "talk_user",

        // 不推断，直接使用模型作为表名 ==> talk_user作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "talk_user",
    }
);

// 同步数据库表
// force: true ==> 删除原有talk_user表，新建talk_user表
// force: false ==> 如果talk_user存在，则不创建，反之，不创建talk_user表
TalkUser.sync({ force: config.mysqlOptions.forceRemove });
// TalkUser.sync({ alter: true });
module.exports = TalkUser;
