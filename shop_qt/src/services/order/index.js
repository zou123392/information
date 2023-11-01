import request from "@/utils/request";

/**
 * @description 创建订单
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function addOrder(data) {
  return request({
    url: "/addOrder",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 查找订单 通过订单号
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function findOrder(data) {
  return request({
    url: "/findOrder",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 查找订单 通过订单状态
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function findOrderBySome(data) {
  return request({
    url: "/findOrderBySome",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 查找用户所有 未支付 订单
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function findNoPayOrder(data) {
  return request({
    url: "/findNoPayOrder",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 更新订单
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function updateOrder(data) {
  return request({
    url: "/updateOrder",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 确认收货
 * @param {object} params 请求参数,具体请查看接口文档
 */
export function confirmReceipt(data) {
  return request({
    url: "/confirmReceipt",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}
