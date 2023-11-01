import {
  initTalk,
  createTalk,
  updateTalk,
  addTalkMessage,
  updateTalkMessage,
  findTalkMessage,
  findUnTalkCount,
  findOneUnTalkCount,
} from "@/services/talk";

const state = {
  talkActive: -1, //left导航标识
  talkList: [],
  talking: [], //正在会话的对象
  UnTalkCount: 0, //总的未读消息
};

const mutations = {
  /**
   * @description 更新left导航标识
   * @param {object} state 状态
   * @param {{talkActive: number}}
   */
  updateTalkActive(state, { talkActive }) {
    state.talkActive = talkActive;
  },

  /**
   * @description 更新会话
   * @param {object} state 状态
   * @param {{talkActive: number}}
   */
  updateTalkList(state, { talkList }) {
    state.talkList = talkList;
  },

  /**
   * @description 更新正在会话的消息
   * @param {object} state 状态
   * @param {{talkActive: number}}
   */
  updatetalking(state, { talking }) {
    state.talking = talking;
  },

  /**
   * @description 更新总的未读会话消息
   * @param {object} state 状态
   * @param {{talkActive: number}}
   */
  updateUnTalkCount(state, { UnTalkCount }) {
    state.UnTalkCount = UnTalkCount;
  },
};

const actions = {
  /**
   * @description 初始化会话
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async initTalk({ commit }, data) {
    const res = await initTalk(data);
    const { status, url, result } = res.data;
    if (status === 200) {
      res.data.result.forEach((item, index) => {
        item.avatar = url + item.avatar;
      });
      commit("updateTalkList", { talkList: res.data.result });
    }

    return res;
  },

  /**
   * @description 创建会话
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async createTalk({ commit }, data) {
    const res = await createTalk(data);

    return res;
  },

  /**
   * @description 更新会话
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async updateTalk({ commit }, data) {
    const res = await updateTalk(data);
    if (res.data.status === 200) {
      // commit("updateTalkList", { talkList: res.data.result });
    }
    return res;
  },

  /**
   * @description 新增会话消息，用户发起消息
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async addTalkMessage({ commit }, data) {
    const res = await addTalkMessage(data);
    return res;
  },

  /**
   * @description 用户已读会话消息 更新会话
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async updateTalkMessage({ commit }, data) {
    const res = await updateTalkMessage(data);
    return res;
  },

  /**
   * @description 查找当前会话的所有消息会话  分页查询，查找最新
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async findTalkMessage({ commit }, data) {
    const res = await findTalkMessage(data);
    return res;
  },

  /**
   * @description 查找未读会话消息数目
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async findUnTalkCount({ commit }, data) {
    const res = await findUnTalkCount(data);
    return res;
  },

  /**
   * @description 查找单次会话消息数
   * @param {{commit: Function}} {commit} vuex提交mutations方法
   * @param {object} data 请求参数,具体请查看接口文档
   */
  async findOneUnTalkCount({ commit }, data) {
    const res = await findOneUnTalkCount(data);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
