<template>
  <main class="CproductList">
    <product-card v-for="(item, index) in cProductList"
                  :key="index"
                  :index="index"
                  :sort="false"
                  :cardData="item"
                  :marginTop="39"
                  :isDiscount="true"></product-card>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import productCard from "../productCard.vue";
export default {
  components: { productCard },
  name: "CproductList",
  data () {
    return {
      cProductList: [
        {
          pic: require("../../images/home/c3.jpg"),
          title: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          pic: require("../../images/home/c1.jpg"),
          title: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          pic: require("../../images/home/c2.jpg"),
          title: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          pic: require("../../images/home/c4.png"),
          title: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          pic: require("../../images/home/top1.png"),
          title: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          pic: require("../../images/home/top2.jpg"),
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

    init () {
      let params = Object.assign({
        offset: 0,
        count: 10,
      });

      params.recommend = 1;
      params.isSelf = 1;
      this.getProducts(params).then((res) => {
        let { status, result } = res.data;
        if (status === 1120) {
          this.cProductList = result;
        }
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.CproductList {
  display: flex;
  flex-wrap: wrap;
}
</style>