import request from "@/utils/request";

/**
 * @description 登录
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function login(data) {
  return request({
    url: "/admin",
    method: "POST",
    data
  });
}

/**
 * @description 获取用户信息
 * @param {object} params 请求参数,具体请查看接口文档
 */
export function getUserInfo(params) {
  return request({
    url: "/getAdminInfo",
    method: "GET",
    params,
    headers: {
      token: document.cookie
    }
  });
}

/**
 * @description 获取用户列表
 * @param {object} params 请求参数,具体请查看接口文档
 */
export function getUserList(params) {
  return request({
    url: "/getUserList",
    method: "GET",
    params,
    headers: {
      token: document.cookie
    }
  });
}

/**
 * @description 更新用户 账号状态
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function changeUser(data) {
  return request({
    url: "/changeUser",
    method: "POST",
    data,
    headers: {
      token: document.cookie
    }
  });
}

/**
 * @description 删除用户
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function deleteUser(data) {
  return request({
    url: "/deleteUser",
    method: "POST",
    data,
    headers: {
      token: document.cookie
    }
  });
}

// 用户

/**
 * @description 邮箱获取用户信息
 * @param {object} params 请求参数,具体请查看接口文档
 */
export function getUserInfoForEmail(params) {
  return request({
    url: "/getUserInfoForEmail",
    method: "GET",
    params
  });
}

/**
 * @description 发送验证码
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function sendEmail(data) {
  return request({
    url: "/email",
    method: "POST",
    data
  });
}

/**
 * @description 注册
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function register(data) {
  return request({
    url: "/register",
    method: "POST",
    data
  });
}

/**
 * @description 校正验证码
 * @param {object} data 请求参数,具体请查看接口文档
 */
export function jadgeCode(data) {
  return request({
    url: "/jadgeCode",
    method: "POST",
    data
  });
}
