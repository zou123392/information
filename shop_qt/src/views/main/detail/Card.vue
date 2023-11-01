<template>
  <main class="card">

    <head class="chead">
      <h1 class="title">{{ message.name }}</h1>
      <div>
        <i class="collect"
           :class="isLike ? 'el-icon-star-on' : 'el-icon-star-off'"
           @click="handleLike"></i>
      </div>
    </head>

    <div class="sourse">
      <span class="text">发布者：</span>
      <em class="detailOfOne">{{ message.email ? message.email : '官方' }}</em>
    </div>
    <div class="sourse">
      <span class="text">发布于：</span>
      <em class="detailOfOne">{{ message.putaddress }}</em>
    </div>
    <p class="detail">{{ message.desc }}</p>
    <div class="price">NT${{newPrice }}</div>

    <el-divider content-position="right"></el-divider>

    <div class="count">
      <div class="count__text">数量</div>
      <el-input-number v-model="count"
                       @change="handleChange"
                       :min="1"
                       :max="10"
                       label="描述文字"></el-input-number>
    </div>

    <div class="minCard">
      <div class="one">
        <div class="one__ttitle">{{ message.name }} * {{ count }}</div>
        <div class="onePrice">NT${{totalPrice}}</div>
      </div>
      <div class="totle">
        <div class="totle__title">总计：</div>
        <div class="priceNum">
          <small class="unit">NT$</small>
          <strong class="totalPrice">{{ totalPrice}}</strong>
        </div>
      </div>
    </div>

    <div @click="handleShopcart"
         class="settlement">立即购买</div>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "Card",
  data () {
    return {
      isLike: false, //是否收藏
      count: 0,
    };
  },

  props: ["message"],
  computed: {
    ...mapState({
      container: (state) => state.container,
      detail: (state) => state.product.detail,
      userInfo: (state) => state.user.userInfo,
    }),

    newPrice () {
      console.log(this.message);
      return utils.formatPrice(this.message.discount / 10 * this.message.price, 0)
    },

    totalPrice () {
      return utils.formatPrice(this.message.discount / 10 * this.message.price * this.count, 0)
    }
  },

  watch: {
    async message () {
      let res = await this.findLike({ pid: this.message.pid })
      res?.data?.result.length > 0 ? this.isLike = true : this.isLike = false
    }
  },

  methods: {
    ...mapMutations({
      updateDetail: "product/updateDetail",
      updateActive: "header/updateActive",
    }),
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      like: "product/like",
      removeLike: "product/removeLike",
      findLike: "product/findLike",
      addShopcart: "cart/addShopcart",
      removeShopcart: "cart/removeShopcart",
      shopcartProducts: "cart/shopcartProducts",
    }),

    /**
     * @description 收藏处理
     */
    handleLike () {
      if (!this.isLike) {
        this.like({
          pid: this.message.pid,
          userId: this.userInfo.userId,
        }).then((res) => {
          if (res.data.status === 1160) {
            this.isLike = true;
            this.$message({
              message: "收藏成功",
              type: "success",
              offset: 100,
            });
          }
        });
        return;
      }
      this.removeLike({
        pid: this.message.pid,
        userId: this.userInfo.userId,
      }).then((res) => {
        if (res.data.status === 1160) {
          this.isLike = false;
          this.$message({
            message: "取消收藏成功",
            type: "success",
            offset: 100,
          });
        }
      });
    },

    /**
     * @description 加购处理
     */
    handleShopcart () {
      this.addShopcart({
        pid: this.message.pid,
        userId: this.userInfo.userId,
        count: this.count,
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
            this.$message({
              message: "加购成功",
              type: "success",
              offset: 100,
            });
          }

          if (res.data.status === 11700) {
            this.$message({
              message: "最大数量不能超过10件",
              type: "warning",
              offset: 100,
            });
          }

          this.$router.push({
            name: "Cart",
          });
        })
        .catch(() => {
          this.$message().error("加购失败");
        });
    },

    // 数量
    handleChange (value) { },
  },

  async created () {
    let res = await this.findLike({ pid: this.message.pid })
    res?.data?.result.length > 0 ? this.isLike = true : this.isLike = false
  },
  async mounted () {

  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/comment.scss';
.card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  width: 100%;
  height: auto;
  font-size: 16px;
  font-weight: 400px;
  color: $normalTextColor;
  text-align: left;
  .chead {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .title {
      font-size: 40px;
      font-weight: 400;
      line-height: 40px;
      color: $primaryTextColor;
      @include ellipsis(1, '');
    }
    .collect {
      font-size: 32px;
      color: $headNavColor-active;
      cursor: pointer;
    }
  }

  .sourse {
    font-size: 14px;
    font-weight: 400px;
    color: $normalTextColor;
    padding: 5px 0;
    .text {
    }
    .detailOfOne {
    }
  }
  .detail {
    margin: 10px 0;
    font-size: 16px;
    font-weight: 400px;
    color: $normalTextColor;
  }
  .price {
    font-size: 20px;
    font-weight: 400;
    color: $headNavColor-active;
  }

  .count {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .count__text {
      font-size: 20px;
      font-weight: 400;
      margin-bottom: 20px;
    }

    /deep/el-input__inner:focus {
      border-color: #f33b3b !important;
      outline: 0;
    }

    /deep/.el-input {
      font-size: 20px;
    }

    /deep/.el-input-number {
      line-height: 37px;
      width: 130px;
    }

    /deep/.el-input-number__decrease:hover,
    /deep/.el-input-number__increase:hover {
      color: $headNavColor-active;
    }
    /deep/.el-input-number .el-input__inner {
      border-color: rgba(204, 202, 202, 0.5) !important;
    }
  }
  .minCard {
    margin-top: 30px;
    padding: 20px;
    width: 100%;
    height: auto;
    background: white;
    .one,
    .totle {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .one {
      font-size: 16px;
      font-weight: 300;
      .one__ttitle {
      }
      .onePrice {
      }
    }
    .totle {
      margin-top: 20px;
      .totle__title {
        font-size: 20px;
        font-weight: 300;
      }
      .priceNum {
        display: flex;
        align-items: flex-end;
        font-size: 32px;
        font-weight: 400;
        color: $headNavColor-active;
        .unit {
          font-size: 20px;
          line-height: 21px;
        }
        .totalPrice {
          font-size: 30px;
          line-height: 30px;
        }
      }
    }
  }
  .settlement {
    width: 100%;
    background-color: $headNavColor-active;
    font-size: 20px;
    font-weight: 600;
    line-height: 20px;
    text-align: center;
    padding: 14px;
    color: $white;
    margin-top: 50px;
    cursor: pointer;
  }
}
</style>