import request from "@/utils/request";

/**
 * @description 获取商品类型
 *  @param {object} params
 */
export function findOrderBySome(params) {
  return request({
    url: "/adminFindOrderBySome",
    method: "GET",
    params,
    headers: {
      token: document.cookie
    }
  });
}

/**
 * @description 发布商品
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function adminUpdateOrder(data) {
  return request({
    url: "/adminUpdateOrder",
    method: "POST",
    data,
    headers: {
      token: document.cookie
    }
  });
}
