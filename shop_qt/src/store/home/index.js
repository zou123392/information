const state = {
  searchKeyWord: "",
};

const mutations = {
  updateSearchKeyWord(state, { searchKeyWord }) {
    state.searchKeyWord = searchKeyWord;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
