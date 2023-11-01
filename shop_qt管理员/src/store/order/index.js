import { findOrderBySome, adminUpdateOrder } from "@/services/order";

const state = {
  types: []
};

const mutations = {
  /**
   * @description 更新商品类型
   * @param {object} state
   * @param {{type: array}} {types} 商品类型
   */
  updateTypes(state, { types }) {
    state.types = types;
  }
};

const actions = {
  /**
   * @description 通过条件获取订单
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   */
  async findOrderBySome({ commit }, params) {
    const res = await findOrderBySome(params);

    return res;
  },
  /**
   * @description 通过条件获取订单
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   */
  async adminUpdateOrder({ commit }, params) {
    const res = await adminUpdateOrder(params);

    return res;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
