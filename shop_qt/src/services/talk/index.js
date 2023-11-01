import request from "@/utils/request";

/**
 * @description 初始化会话
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function initTalk(data) {
  return request({
    url: "/initTalk",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 创建会话
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function createTalk(data) {
  return request({
    url: "/createTalk",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 更新会话
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function updateTalk(data) {
  return request({
    url: "/updateTalk",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 添加 会话消息
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function addTalkMessage(data) {
  return request({
    url: "/addTalkMessage",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 更新会话 未读变已读
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function updateTalkMessage(data) {
  return request({
    url: "/updateTalkMessage",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 查找会话 消息文本
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function findTalkMessage(data) {
  return request({
    url: "/findTalkMessage",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 查找 总的会话 未读消息的数量
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function findUnTalkCount(data) {
  return request({
    url: "/findUnTalkCount",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 查找 单个会话的 未读消息的数量
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function findOneUnTalkCount(data) {
  return request({
    url: "/findOneUnTalkCount",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

// /**
//  * @description 获取用户信息
//  * @param {object} params 请求参数,具体请查看接口文档
//  */
// export function createTalk(params) {
//     return request({
//         url: '/createTalk',
//         method: 'GET',
//         params,
//         headers: {
//             token: document.cookie
//         }
//     })
// }
