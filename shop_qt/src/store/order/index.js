import {
  addOrder,
  findOrder,
  findOrderBySome,
  findNoPayOrder,
  updateOrder,
  confirmReceipt
} from "@/services/order";

const state = {
  order: [],
};

const mutations = {
  /**
   * @description 更新订单
   * @param {object} state 状态
   * @param
   */
  updateOrder(state, { order }) {
    state.order = order;
  },
};

const actions = {
  /**
   * @description 创建订单
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async addOrder({ commit }, data) {
    const res = await addOrder(data);
    // if (res.data.status == 1030) {
    //   console.log(res);
    //   // commit("addAddress", { isLogin: true });
    // }
    return res;
  },

  /**
   * @description 查找订单 通过订单号
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async findOrder({ commit }, data) {
    const res = await findOrder(data);
    return res;
  },

  /**
   * @description 查找订单 通过订单状态
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async findOrderBySome({ commit }, data) {
    const res = await findOrderBySome(data);
    return res;
  },

  /**
   * @description 查找用户所有 未支付 订单
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async findNoPayOrder({ commit }, data) {
    const res = await findNoPayOrder(data);
    return res;
  },

  /**
   * @description 更新订单
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async updateOrder({ commit }, data) {
    const res = await updateOrder(data);
    return res;
  },

  /**
   * @description 确认收货
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async confirmReceipt({ commit }, data) {
    const res = await confirmReceipt(data);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
