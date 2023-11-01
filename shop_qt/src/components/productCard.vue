<template>
  <main class="productCard"
        @click="goDetail">
    <img class="boxImg"
         :src="cardData.img"
         alt=""
         :style="{ marginTop: marginTop }" />

    <h1 class="boxTitle">{{ cardData.name }}</h1>
    <div class="price">
      {{price ? "NT$&nbsp;" + price: "价格待定" }}
    </div>

    <div v-show="sort && index < 5"
         class="sort"
         :style="{ backgroundColor: `${color[index]}` }">
      {{ index + 1 }}
    </div>
    <div v-show="isDiscount && cardData?.discount < 10"
         class="discount">
      {{ cardData?.discount }}折
    </div>
  </main>
</template>

<script>
import { utils } from '@/utils/utils';
export default {
  name: "productCard",
  data () {
    return {
      color: ["#e53935", "#26A69A", "#F6AA00 ", "#91C246", " #2196F3"],
    };
  },
  computed: {
    price () {
      return utils.formatPrice(this.cardData.discount / 10 * this.cardData.price, 0)
    }
  },

  props: {
    cardData: { type: Object, required: true },
    index: { type: Number, required: true },
    sort: { type: Boolean, default: false },
    isDiscount: { type: Boolean, default: false },
    marginTop: { type: Number, default: 0 },
  },

  methods: {
    goDetail () {
      let routeName = "";
      this.cardData.is_self === "1" ? routeName = "Detail2" : routeName = "Detail";

      this.$router.push({
        name: routeName,
        query: {
          pid: utils.Base64.encode(this.cardData.pid),
        },
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.productCard {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 234px;
  height: auto;
  // padding: 39px 0 10px 0;
  cursor: pointer;
  transition: all 0.2s ease 0s;
  background: white;
  margin-top: 20px;
  overflow: hidden;
  margin-right: 20px;
  .boxImg {
    // width: 100%;
    height: 160px;
    box-sizing: border-box;
    margin: 39px auto 22px;
  }
  .boxTitle {
    width: 100%;
    padding: 0 15px;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    font-weight: 600;
  }
  .price {
    width: 100%;
    padding: 0 15px;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
    margin-bottom: 40px;
    color: $headNavColor-active;
  }

  .sort {
    position: absolute;
    top: 0;
    left: 0;
    width: 42px;
    height: 20px;
    text-align: center;
    font-size: 14px;
    color: white;
    line-height: 20px;
    background: #e53935;
  }

  .discount {
    position: absolute;
    width: 117px;
    height: 20px;
    font-size: 12px;
    text-align: center;
    color: white;
    line-height: 20px;
    background-color: #f23835;
  }
}
.productCard:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -webkit-transform: —translate3d(0, -2px, 0);
  transform: translate3d(0, -2px, 0);
}
// .productCard + .productCard {
//   margin-right: 20px;
// }

.productCard:nth-of-type(5n) {
  margin-right: 0;
}
</style>