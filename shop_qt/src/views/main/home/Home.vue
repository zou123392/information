<template>
  <main class="home">
    <div class="banner">
      <Banner :bannerList="bannerList" :effect="'fade'"></Banner>

      <div class="leftNav">
        <Left-nav />
      </div>
    </div>

    <section class="cardOne">
      <div class="cardOne__top">
        <div class="pic" v-for="item in one.child" :key="item.pic">
          <img :src="item.pic" alt="精品手机" />
        </div>
      </div>
      <div class="cardOne__bottom">
        <img :src="one.bottom" alt="活动" />
      </div>
    </section>

    <!-- 官方 -->
    <section class="company">
      <div class="company__sort">
        <h2 class="title">官方热销排行</h2>
        <Hot />
      </div>
      <div class="company__productList">
        <h2 class="title">官方优选</h2>
        <CproductList />
      </div>
    </section>

    <!-- 用户商品列表 -->
    <section class="userProductList">
      <div class="box">
        <h2 class="title">二手商品</h2>
        <div class="item">
          <product-card
            v-for="(item, index) in userProductList"
            :key="index"
            :index="index"
            :sort="false"
            :cardData="item"
            :marginTop="0"
          ></product-card>
        </div>
      </div>
    </section>

    <!-- <Category></Category> -->
  </main>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Home",

  components: {
    Category: () => import("../category/Category.vue"),
    Banner: () => import("@/components/Banner.vue"),
    LeftNav: () => import("@/components/LeftNav.vue"),
    ProductCard: () => import("@/components/productCard.vue"),
    Hot: () => import("@/components/company/Hot.vue"),
    CproductList: () => import("@/components/company/CproductList.vue"),
    Product: () => import("@/components/Product.vue"),
  },

  data() {
    return {
      bgHeight: 500,
      loading: false,
      disable: true,
      bannerList: [
        {
          id: 1,
          url: require("../../../components/images/banner1.jpg"),
          titleColor: "",
          desColor: "",
          titleArr: ["质量合规专家"],
          desArr: [
            "立足生命健康行业",
            "业务覆盖生产制造、质量合规、药物警戒等领域",
          ],
        },
        {
          id: 2,
          url: require("../../../components/images/banner2.jpg"),
          titleArr: ["用技术创造健康价值"],
          desArr: ["We create health value with technology"],
        },
        {
          id: 3,
          url: require("../../../components/images/banner3.jpg"),
          titleArr: ["创新 -- 细胞治疗生产与追溯数字化解决方案"],
          desArr: [""],
        },
        {
          id: 4,
          url: require("../../../components/images/banner4.jpg"),
          titleArr: ["创新 -- 细胞治疗生产与追溯数字化解决方案"],
          desArr: [""],
        },
      ],

      one: {
        bottom: require("../../../images/home/top5.jpg"),
        child: [
          { pic: require("../../../images/home/top1.png") },
          { pic: require("../../../images/home/top2.jpg") },
          { pic: require("../../../images/home/top3.jpg") },
          { pic: require("../../../images/home/top4.jpg") },
        ],
      },

      userProductList: [
        {
          img: require("../../../images/home/c1.jpg"),
          name: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          img: require("../../../images/home/c3.jpg"),
          name: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          img: require("../../../images/home/c2.jpg"),
          name: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          img: require("../../../images/home/c4.png"),
          name: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          img: require("../../../images/home/top1.png"),
          name: "Xiaomi 智慧顯示器 A2 55型",
          price: "2345",
        },
        {
          img: require("../../../images/home/top2.jpg"),
          name: "Xiaomi 智慧顯示器 A2 55型",
          price: "",
        },
      ],
    };
  },

  computed: {
    ...mapState({
      h: (state) => state.h,
      sh: (state) => state.sh,
      headerHeight: (state) => state.header.headerHeight,
      products: (state) => state.product.products,
      productTitle: (state) => state.product.productTitle,
    }),
  },

  mounted() {
    this.init();
  },

  watch: {},

  methods: {
    ...mapMutations({
      updateProductTitle: "product/updateProductTitle",
    }),
    ...mapActions({
      getProducts: "product/getProducts",
    }),

    init() {
      let params = Object.assign({
        offset: 0,
        count: 10,
      });

      params.recommend = 1;
      params.isSelf = 0;
      this.getProducts(params).then((res) => {
        let { status, result } = res.data;
        if (status === 1120) {
          this.userProductList = result;
        }
        console.log(res);
      });
    },
  },
};
</script>

<style lang="scss"
       scoped>
@import "./home.scss";
</style>
