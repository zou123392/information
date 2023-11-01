import Vue from "vue";
import Vuex from "vuex";

import { state } from "./state";
import { mutations } from "./mutations";
import { actions } from "./actions";
import home from "./home";
import header from "./header";
import footer from "./footer";
import user from "./user";
import product from "./product";
import address from "./address";
import order from "./order";
import cart from "./cart";
import pay from "./pay";
import talk from "./talk";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    home,
    header,
    footer,
    user,
    product,
    address,
    order,
    cart,
    pay,
    talk,
  },
});
