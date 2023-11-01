import { payOrder, paySuccess } from "@/services/pay";

const state = {};

const mutations = {};

const actions = {
  /**
   * @description 支付
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async payOrder({ commit }, data) {
    const res = await payOrder(data);
    return res;
  },
  /**
   * @description 支付成功
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async paySuccess({ commit }, data) {
    const res = await paySuccess(data);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
