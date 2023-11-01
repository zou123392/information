<template>
  <div class="littleProduct">
    <!-- 商品列表 -->
    <div class="top">
      <div v-for="(item, index) in cartList"
           :key="item.id"
           class="product">
        <img :src="item.img"
             :alt="item.name" />
        <div class="text">
          <p class="text__title">{{ item.title }}</p>
          <div class="text__priceAndNum">
            <div class="priceNum">
              <b class="lUnit">NT$ {{ price(item)}}</b>
              <b class="lTotalNum"> × {{ item.count }}</b>
            </div>
          </div>
        </div>
        <i class="el-icon-close remove"
           @click="del(item, index)"></i>
      </div>
    </div>
    <!-- 底部结算 -->
    <div class="bottom">
      <div class="total">
        <div class="num">
          <div class="numTotle">共计 {{ count }} 件商品</div>
          <div class="priceNum">
            <b class="unit">NT$</b>
            <b class="totalPrice">&nbsp;{{ total }}</b>
          </div>
        </div>
        <div class="settlement"
             @click="$router.push({ name: 'Cart' })">
          去购物车结算
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from '@/utils/utils'
export default {
  name: "littleProduct",
  data () {
    return {
      productInfo: [],
      // cartList: [],
    };
  },

  computed: {
    ...mapState({
      cartList: (state) => state.cart.cartList,
    }),

    price () {
      return function (item) {
        return utils.formatPrice(item.discount / 10 * item.price, 0)
      }
    },

    total () {
      let total = 0;
      if (this.cartList?.length > 0) {
        this.cartList?.forEach((item) => {
          total += item.discount / 10 * item.price * item.count;
        });

      }
      return utils.formatPrice(total, 0);
    },
    count () {
      let count = 0;
      if (this.cartList?.length > 0) {
        this.cartList?.forEach((item) => {
          count += item.count;
        });
      }
      return count;
    },
  },

  mounted () {
    // this.cartList = this.cart;
  },

  methods: {
    ...mapMutations({
      updateCartList: "cart/updateCartList",
      updateCartCount: "cart/updateCartCount",
    }),
    ...mapActions({
      removeShopcart: "cart/removeShopcart",
      shopcartProducts: "cart/shopcartProducts",
      shopcartCount: "cart/shopcartCount",
    }),
    /**
     * @description 删除购物车中的商品
     */
    del (item, index) {
      this.removeShopcart({
        ids: [item.id],
      }).then((res) => {
        if (res.data.status === 1172) {
          // 更新购物车
          let params = Object.assign({
            offset: 0,
            count: 100,
          });
          this.shopcartProducts(params).then((res2) => {
            this.updateCartList({ cartList: res2.data.result });
          });

          this.shopcartCount().then((res) => {
            this.updateCartCount({ cartCount: res.data.result });
          });
        } else {
          this.$message.error("删除失败，请联系管理员");
        }
      });
    },
  },
  // props: ["cartList"],
};
</script>
<style lang="scss" scoped>
@import '@/styles/comment.scss';
.littleProduct {
  display: flex;
  width: 100%;
  height: 100%;

  .top {
    width: 100%;
    max-height: 430px;
    box-sizing: border-box;
    overflow-y: scroll;
    .product {
      position: relative;
      display: flex;
      width: auto;
      margin: 0 15px;
      padding: 10px 0;
      img {
        width: 60px;
      }
      .text {
        width: 100%;
        padding: 5px;
        &__title {
          width: 140px;
          text-align: left;
          font-size: 16px;
          font-weight: 700;
          line-height: 18px;
          @include ellipsis(2, '');
        }
        &__priceAndNum {
          font-size: 14px;
          color: $headNavColor-active;
          margin-top: 10px;

          width: 100%;
          .priceNum {
            display: flex;
            justify-content: flex-end;
            margin-right: 15px;
          }
        }
      }

      .remove {
        display: none;
        position: absolute;
        right: 5px;
        top: 14px;
        font-size: 18px;
        transition: all 0.2s;
      }
    }
    .product + .product {
      border-top: 1px solid #e0e0e0;
    }
    .product:hover .remove {
      display: block;
    }
  }

  .bottom {
    width: 100%;
    padding: 15px 10px 10px 10px;
    background-color: #fafafa;
    .total {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .num {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 50%;
        .numTotle {
          font-size: 12px;
          font-weight: 600;
          color: $primaryTextColor;
        }
        .priceNum {
          display: flex;
          align-items: flex-end;
          color: $headNavColor-active;
          .unit {
            font-size: 16px;
            line-height: 19px;
          }
          .totalPrice {
            font-size: 24px;
            line-height: 24px;
          }
        }
      }
    }
    .settlement {
      width: 50%;
      background-color: $headNavColor-active;
      font-size: 18px;
      font-weight: 600;
      line-height: 18px;
      text-align: center;
      padding: 10px;
      color: $white;
    }
  }
}
</style>