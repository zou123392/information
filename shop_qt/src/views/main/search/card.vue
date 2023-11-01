<template>
  <main class="card">
    <div class="boxImg">
      <img :src="cardData.img"
           alt="" />
    </div>
    <h1 class="boxTitle">{{ cardData.name }}</h1>
    <div class="price">
      <div class="now">
        {{newPrice ? "NT$&nbsp;" + newPrice : "价格待定"}}
      </div>
      <div class="old"
           v-if="cardData.discount < 10">
        NT$&nbsp;{{ oldPrice }}
      </div>
    </div>

    <div class="discount">
      <div v-if="cardData.discount < 10"
           class="title1">
        {{ cardData.discount + "折" }}
      </div>
      <div class="title2"
           v-if="isNew">{{ isNew }}</div>
    </div>

    <div v-if="cardData.is_self === '1'"
         class="addCar">
      <i class="el-icon-shopping-cart-1 aCar"></i>
      <div class="des"
           @click="cartF">加入购物车</div>
    </div>
    <div v-else
         class="addCar">
      <i class="el-icon-s-custom aCar"></i>
      <div class="des"
           @click="sellPersonalInfo">查看卖家信息</div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "card",
  data () {
    return {};
  },
  props: {
    cardData: { type: Object, required: true },
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),

    oldPrice () {
      return utils.formatPrice(this.cardData.price, 0)
    },

    newPrice () {
      return utils.formatPrice(this.cardData?.discount / 10 * this.cardData?.price, 0)
    },

    isNew () {
      return new Date().getTime() - this.cardData.created_at < 259200000
        ? "新品"
        : "";
    },
  },
  methods: {
    ...mapMutations({
      updateCartList: "cart/updateCartList",
      updateCartCount: "cart/updateCartCount",
      updateCheckCart: "cart/updateCheckCart",
    }),
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      shopcartProducts: "cart/shopcartProducts",
      addShopcart: "cart/addShopcart",
      shopcartCount: "cart/shopcartCount",
      updateShopcartCheck: "cart/updateShopcartCheck",
      removeShopcart: "cart/removeShopcart",
    }),

    cartF () {
      this.addShopcart({
        pid: this.cardData.pid,
        userId: this.userInfo?.userId,
        count: 1,
      })
        .then((res) => {
          if (res.data.status === 1034) {
            this.$message({
              message: "请先登录",
              type: "warning",
              offset: 100,
            });
            return;
          }
          if (res.data.status === 1170) {
            console.log(res);
            this.$message({
              message: "已加入购物车",
              type: "success",
              offset: 100,
            });

            this.shopcartCount().then((res2) => {
              console.log(res2);
              if (res2.data.status === 1176) {
                this.updateCartCount({ 'cartCount': res2.data.result })
              }
            })
          }

          if (res.data.status === 11700) {
            this.$message({
              message: "已达到最大数量",
              type: "warning",
              offset: 100,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("加购失败");
        });
    },
    sellPersonalInfo () {
      this.$router.push({
        name: 'Detail',
        query: {
          pid: utils.Base64.encode(this.cardData.pid)
        }
      })
    }
  },
  mounted () {
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 297px;
  height: 383px;
  // padding: 39px 0 10px 0;
  cursor: pointer;
  transition: all 0.5s ease 0s;
  background: white;
  margin-bottom: 30px;
  overflow: hidden;

  .boxImg {
    // width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 230px;
    margin-bottom: 30px;
    box-sizing: border-box;
    overflow: hidden;
    img {
      height: 100%;
    }
  }
  .boxTitle {
    width: 100%;
    padding: 0 15px;
    text-align: center;
    line-height: 18px;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .price {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 15px;
    font-size: 16px;
    line-height: 28px;
    text-align: center;
    margin-bottom: 35px;
    color: $headNavColor-active;
    .new {
      padding: 0 10px;
    }
    .old {
      padding: 0 10px;
      color: $subTextColor;
      text-decoration: line-through;
    }
  }

  .discount {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 20px;
    font-size: 12px;
    text-align: center;
    color: white;
    line-height: 20px;
    .title1 {
      width: 50%;
      background-color: #f23835;
    }
    .title2 {
      width: 50%;
      background-color: #83c44e;
    }
  }

  .addCar {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 35px;
    height: 24px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: $primaryTextColor;
    line-height: 20px;
    font-weight: 600;
    text-align: center;
    opacity: 0;
    transition: all 0.5s ease-out 0s;
    // background: #e53935;

    .aCar {
      font-size: 22px;
      font-weight: 600px;
      margin-right: 7px;
    }
  }
}
.card:hover {
  box-shadow: 0px 9px 11px 9px rgba(0, 0, 0, 0.1);
}

.card:hover .addCar {
  opacity: 1;
}
// .card + .card {
//   margin-right: 20px;
// }
</style>