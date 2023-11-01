import { login, getUserInfo, getUserList, changeUser, deleteUser } from "@/services/user";

const state = {
  isLogin: false,
  userInfo: {}
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
  }
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
        commit("updateUserInfo", { info: res.data.result[0] });
        commit("updateIsLogin", { isLogin: true });
      }
    }
    return res;
  },

  /**
   * @description 获取用户列表
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   */
  async getUserList({ commit }, params) {
    const res = await getUserList(params);
    if (res.data.status == 1040) {
      if (res.data.result.length > 0) {
        res.data.result[0].avatar = res.data.url + res.data.result[0].avatar;
      }
    }
    console.log(res);
    return res;
  },

  /**
   * @description 更新用户信息(账号状态)
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async changeUser({ commit }, data) {
    const res = await changeUser(data);
    return res;
  },

  /**
   * @description 删除用户
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async deleteUser({ commit }, data) {
    const res = await deleteUser(data);
    return res;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
