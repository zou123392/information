import request from "@/utils/request";

/**
 * @description 创建地址
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function addAddress(data) {
  return request({
    url: "/addAddress",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 查找地址
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function findAddress(data) {
  return request({
    url: "/findAddress",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}
/**
 * @description 更新地址
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function updateAddress(data) {
  return request({
    url: "/updateAddress",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}
/**
 * @description 删除地址
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function deleteAddress(data) {
  return request({
    url: "/deleteAddress",
    method: "POST",
    data,
    headers: {
      token: document.cookie,
    },
  });
}

/**
 * @description 获取用户信息
 * @param {object} params 请求参数,具体请查看接口文档
 */
export function getUserInfo(params) {
  return request({
    url: "/getUserInfo",
    method: "GET",
    params,
    headers: {
      token: document.cookie,
    },
  });
}
