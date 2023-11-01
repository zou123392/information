<template>
  <main :style="{ 'min-width': container + 'px' }">
    <!-- <Advertisement></Advertisement> -->
    <!-- <top-nav></top-nav> -->
    <div class="headNav">
      <head-nav></head-nav>
    </div>

    <Header></Header>
    <router-view></router-view>
    <Footer v-if="$route.name !== 'Talk'"></Footer>
  </main>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { utils } from "@/utils/utils";

export default {
  name: "Main",

  components: {
    Advertisement: () => import("@/components/Advertisement.vue"),
    Header: () => import("@/components/Header.vue"),
    Footer: () => import("@/components/Footer.vue"),
    HeadNav: () => import("@/components/headNav.vue"),
    TopNav: () => import("@/components/TopNav.vue"),
  },

  watch: {
    $route (val) {
      document.title = val.meta.name;
    },
  },

  computed: {
    ...mapState({
      container: (state) => state.container,
    }),
  },

  created () {
    this.init();
  },

  mounted () {
    this.closeOrder();
    this.findAllmsgCount();

    //轮询
    this.checkOrder();
  },

  methods: {
    ...mapMutations({
      updateUnTalkCount: "talk/updateUnTalkCount",
    }),

    ...mapActions({
      getUserInfo: "user/getUserInfo",
      getTypes: "product/getTypes",
      findNoPayOrder: "order/findNoPayOrder",
      updateOrder: "order/updateOrder",
      findUnTalkCount: "talk/findUnTalkCount",
    }),

    async init () {
      this.getUserInfo().then((res) => {
        console.log(res.data);
        if (res.data.status === 1040) {
          // 初始化scoketio
          this.$socket.emit("init", res.data.result[0].userId);
        } else {
          console.error("实时失败");
          // this.$message.error('实时通信失败')
        }
      });

      await this.getTypes();
    },

    // 关闭未关闭的订单
    closeOrder () {
      let closeOrderNumArr = new Array();
      this.findNoPayOrder()
        .then((res) => {
          let { status, result } = res.data;
          if (status === 200 && result?.length !== 0) {
            result.forEach((item) => {
              let flag = utils.timeOut(item.createdAt, 0.5);

              // 超时则关闭订单
              if (flag) {
                closeOrderNumArr.push(item.orderNum);
              }
            });
            new Promise((resolve, reject) => {
              let params = Object.assign({});
              params.status = 4;
              params.orderNum = closeOrderNumArr;
              this.updateOrder(params);
              resolve();
            }).then(() => {
              // this.getOrder(this.orderHeadNav[this.orderActive].status);
            });
          }
        })
        .catch((err) => { });
    },

    // 查询有无消息数
    findAllmsgCount () {
      this.findUnTalkCount().then((res) => {
        const { status, result } = res.data;
        if (status === 200) {
          this.updateUnTalkCount({ UnTalkCount: result });
        }
        console.log(res);
      });
    },

    // 订单轮询 半小时查一次
    checkOrder () {
      setInterval(() => {
        this.closeOrder();
      }, 1800000);
    },
  },

  // 接收消息
  sockets: {
    allUnReadCount (item) {
      console.log('main', item);
      this.updateUnTalkCount({ UnTalkCount: item.count });
    },
  },
};
</script>

<style lang="scss"
       scoped>
@import './index.scss';
</style>
