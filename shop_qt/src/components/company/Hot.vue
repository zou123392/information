<template>
  <main class="hot">
    <product-card v-for="(item, index) in HotList"
                  :key="index"
                  :index="index"
                  :sort="true"
                  :cardData="item"
                  :marginTop="39"
                  @click="goDetail(item)"></product-card>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import productCard from "../productCard.vue";
export default {
  components: { productCard },
  name: "Hot",
  data () {
    return {
      HotList: [
        {
          id: "01",
          img: require("../../images/home/c3.jpg"),
          title: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          id: "02",
          pic: require("../../images/home/c3.jpg"),
          title: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
      ],
    };
  },

  created () {
    //请求获取数据	5个
    this.init();
  },

  mounted () { },

  methods: {
    ...mapActions({
      getProducts: "product/getProducts",
    }),

    goDetail (item) {
      this.updateDetail({
        detail: item,
      });
      this.isShowSubNav = false;
      let routeName = "";
      item.is_self === "1" ? routeName = "Detail2" : routeName = "Detail";

      this.$router.push({
        name: routeName,
        query: {
          pid: utils.Base64.encode(item.pid),
        },
      });

    },

    init () {
      let params = Object.assign({
        offset: 0,
        count: 5,
      });

      params.seals = 1;
      params.isSelf = 1;
      this.getProducts(params).then((res) => {
        let { status, result } = res.data;
        if (status === 1120) {
          this.HotList = result;
        }
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.hot {
  display: flex;
  flex-wrap: wrap;
}
</style>