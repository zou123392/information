/**
 * @module 模型：Admin模型, admin表 商家
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class Admin extends Model {}

/**
 * @description 定义模型结构, 数据表结构
 */
Admin.init(
    {
        id: {
            // 数据类型：INTEGER整型, UNSIGNED无符号
            type: DataTypes.INTEGER.UNSIGNED,

            // 自动递增
            autoIncrement: true,

            // 主键
            primaryKey: true,

            // 不允许为null
            allowNull: false,

            // 注释
            comment: "表id",
        },

        adminId: {
            type: DataTypes.STRING(30),
            allowNull: false,

            // 默认值
            defaultValue: "",
            comment: "管理员id",
        },

        nickName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "昵称",
        },

        password: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: "",
            comment: "密码",
        },

        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
            defaultValue: "",
            comment: "邮箱",
        },

        phone: {
            type: DataTypes.STRING(11),
            allowNull: true,
            defaultValue: null,
            comment: "手机号",
        },

        sex: {
            type: DataTypes.STRING(4),
            allowNull: false,
            defaultValue: "保密",
            comment: "管理员性别,女 男 保密",
        },

        avatar: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: "default1.jpg",
            comment: "管理员头像",
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
        // 指定连接实例，这样才知道在指定数据库创建admin表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> admins作为表名
        modelName: "admin",

        // 不推断，直接使用模型作为表名 ==> admin作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "admin",
    }
);

// 同步数据库表
// force: true ==> 删除原有admin表，新建admin表
// force: false ==> 如果admin存在，则不创建，反之，不创建admin表
Admin.sync({ force: config.mysqlOptions.forceRemove });

module.exports = Admin;
