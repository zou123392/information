import {
  addShopcart,
  updateShopcartCount,
  updateShopcartCheck,
  removeShopcart,
  shopcartProducts,
  shopcartCount,
} from "@/services/cart";

const state = {
  cartList: [],
  checkCart: [], //需要存储local
  cartCount: 0,
};

const mutations = {
  /**
   * @description 更新购物车商品
   * @param {object} state
   * @param {{cartList: array }} {cartList} 购物车
   */
  updateCartList(state, { cartList }) {
    state.cartList = cartList;
  },

  updateCartCount(state, { cartCount }) {
    state.cartCount = cartCount;
  },
  /**
   * @description 更新选择地购物车商品
   * @param {object} state
   * @param {{cartList: array }} {cartList} 购物车
   */
  updateCheckCart(state, { checkCart }) {
    state.checkCart = checkCart;
  },
};

const actions = {
  /**
   * @description 加购
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async addShopcart({ commit }, data) {
    const res = await addShopcart(data);
    if (res.data.status === 1170) {
      commit("updateCartList", { cartList: res.data.result });
    }
    return res;
  },

  /**
   * @description 更新加购数目
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async updateShopcartCount({ commit }, data) {
    const res = await updateShopcartCount(data);
    if (res.data.status === 1170) {
      // commit("updateCartCount", { cartCount: res.data.result });
    }
    return res;
  },

  /**
   * @description 更新购物车商品选择状态
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async updateShopcartCheck({ commit }, data) {
    const res = await updateShopcartCheck(data);
    return res;
  },

  /**
   * @description 取消加购 id 传数组
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async removeShopcart({ commit }, data) {
    const res = await removeShopcart(data);
    return res;
  },

  /**
   * @description 用户加购数据
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async shopcartProducts({ commit }, params) {
    const res = await shopcartProducts(params);
    return res;
  },

  /**
   * @description 用户加购的商品条目
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async shopcartCount({ commit }, params) {
    const res = await shopcartCount(params);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
