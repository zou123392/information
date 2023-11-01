import request from "@/utils/request";

/**
 * @description 支付
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function payOrder(data) {
  return request({
    url: "/payOrder",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 支付成功
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function paySuccess(data) {
  return request({
    url: "/paySuccess",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}
