import {
  login,
  getUserInfo,
  getUserInfoForEmail,
  getUserInfoByUserId,
  register,
  sendEmail,
  updateUserInfo,
  jadgeCode,
} from "@/services/user";

const state = {
  isLogin: JSON.parse(sessionStorage.getItem("userInfo"))?.isLogin || false,
  userInfo: JSON.parse(sessionStorage.getItem("userInfo"))?.userInfo || {},
};

const mutations = {
  /**
   * @description 更新登录状态值
   * @param {object} state 状态
   * @param {{isLogin: boolean}} isLogin 登录状态值
   */
  updateIsLogin(state, { isLogin }) {
    state.isLogin = isLogin;
  },

  /**
   * @description 更新用户信息
   * @param {object} state 状态
   * @param {{userInfo: object}} userInfo 用户信息
   */
  updateUserInfo(state, { info }) {
    state.userInfo = info;
  },
};

const actions = {
  /**
   * @description 登录
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async login({ commit }, data) {
    const res = await login(data);
    if (res.data.status == 1030) {
      commit("updateIsLogin", { isLogin: true });
    }
    return res.data;
  },

  /**
   * @description 获取用户信息
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   */
  async getUserInfo({ commit }, params) {
    const res = await getUserInfo(params);
    if (res.data.status == 1040) {
      if (res.data.result.length > 0) {
        res.data.result[0].avatar = res.data.url + res.data.result[0].avatar;

        // 将用户信息与登录状态保存在session中
        sessionStorage.setItem(
          "userInfo",
          JSON.stringify({
            userInfo: res.data.result[0],
            isLogin: true,
          })
        );

        commit("updateUserInfo", { info: res.data.result[0] });
        commit("updateIsLogin", { isLogin: true });
      }
    }
    return res;
  },

  /**
   * @description 通过userId获取用户信息
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   */
  async getUserInfoByUserId({ commit }, data) {
    const res = await getUserInfoByUserId(data);
    if (res.data.status == 1040) {
      if (res.data.result.length > 0) {
        res.data.result[0].avatar = res.data.url + res.data.result[0].avatar;
      }
    }
    return res;
  },

  /**
   * @description 邮箱获取用户信息
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   */
  async getUserInfoForEmail({ commit }, params) {
    const res = await getUserInfoForEmail(params);
    if (res.data.status == 1040) {
      if (res.data.result.length > 0) {
        res.data.result[0].avatar = res.data.url + res.data.result[0].avatar;
        commit("updateUserInfo", { info: res.data.result[0] });
        commit("updateIsLogin", { isLogin: true });
      }
    }
    return res;
  },

  /**
   * @description 发送验证码
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async sendEmail({ commit }, data) {
    const res = await sendEmail(data);
    return res;
  },

  /**
   * @description 注册
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async register({ commit }, data) {
    const res = await register(data);
    return res;
  },

  /**
   * @description 校正验证码
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async jadgeCode({ commit }, data) {
    const res = await jadgeCode(data);
    return res;
  },

  /**
   * @description 更新用户信息
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async setUserInfo({ commit }, data) {
    const res = await updateUserInfo(data);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
