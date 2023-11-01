/**
 * @module 模型：Address模型, address表
 * @author : zou
 * */

let { DataTypes, Model } = require("sequelize");

class Address extends Model {}

// 定义模型结构, 数据表结构
Address.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: "表id",
        },

        adrid: {
            type: DataTypes.STRING(30),
            allowNull: false,
            // 默认值
            defaultValue: "",
            comment: "地址id",
        },
        userId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "关联用户id",
        },

        consigneeName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "收件人昵称",
        },

        consigneePhone: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "收件人电话",
        },

        addressName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "地址名称",
        },

        addressDetail: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: "",
            comment: "详细地址",
        },

        isdefault: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "默认地址",
        },

        isAdd: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "前端控制编辑状态",
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
        // 指定连接实例，这样才知道在指定数据库创建address表
        sequelize,

        // 模型名称, 当没有指定表名时，sequelize推断名称为模型名称的复数 ==> addresss作为表名
        modelName: "address",

        // 不推断，直接使用模型作为表名 ==> address作为表名
        freezeTableName: true,

        // 指定表名
        tableName: "address",
    }
);

// 同步数据库表
// force: true ==> 删除原有address表，新建address表
// force: false ==> 如果address存在，则不创建，反之，不创建address表
Address.sync({ force: config.mysqlOptions.forceRemove });

module.exports = Address;
