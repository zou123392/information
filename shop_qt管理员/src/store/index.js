import Vue from "vue";
import Vuex from "vuex";

import { state } from "./state";
import { mutations } from "./mutations";
import { actions } from "./actions";
import user from "./user";
import product from "./product";
import order from "./order";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    user,
    product,
    order
  }
});
