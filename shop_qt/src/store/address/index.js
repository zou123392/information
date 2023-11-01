import {
  addAddress,
  findAddress,
  updateAddress,
  deleteAddress,
} from "@/services/address";

const state = {
  address: [],
};

const mutations = {
  /**
   * @description 更新地址
   * @param {object} state 状态
   * @param
   */
  updateAddress(state, { address }) {
    state.address = address;
  },
};

const actions = {
  /**
   * @description 创建地址
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async addAddress({ commit }, data) {
    const res = await addAddress(data);
    // if (res.data.status == 1030) {
    //   console.log(res);
    //   // commit("addAddress", { isLogin: true });
    // }
    return res;
  },

  /**
   * @description 查找地址
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async findAddress({ commit }, data) {
    const res = await findAddress(data);
    return res;
  },

  /**
   * @description 更新地址
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async updateAddress({ commit }, data) {
    const res = await updateAddress(data);
    return res;
  },

  /**
   * @description 更新地址
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async deleteAddress({ commit }, data) {
    const res = await deleteAddress(data);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
