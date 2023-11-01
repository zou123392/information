const { result } = require("underscore");

// 导入API, 操作MySQL数据库
let api = require(__basename + "/api/api.js");

class Sql {
    findunReadCount(talkUserId, myUserId) {
        return new Promise((resolve, reject) => {
            api.count("Talk", {
                talkUserId: talkUserId,
                replyUserId: myUserId,
                isDelete: 0,
                isRead: 0,
            }).then((res) => {
                resolve(res);
            });
        })
            .then((result) => {
                return result;
            })
            .catch((err) => {
                console.log("sql initTalk err=>", err);
                return 0;
            });
    }
}

module.exports = new Sql();
