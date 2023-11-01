<template>
  <main class="product">
    <section class="content">
      <div class="btn"
           @click="check">
        <i class="el-icon-success checked"
           v-show="cartData.is_checked"></i>
        <i class="cancel"
           v-show="!cartData.is_checked"></i>
      </div>

      <div class="con text1"
           @click="goDetail">
        <img :src="cartData.img"
             :alt="cartData.name" />
      </div>
      <div class="con text2">{{ cartData.name }}</div>
      <div class="con text3">NT${{ newPrice }}</div>
      <div class="con text4">
        <el-input-number v-model="count"
                         @change="handleChange"
                         :min="1"
                         :max="10"
                         label=""></el-input-number>
      </div>
      <div class="con text5">NT${{totalPrice}}</div>

      <i class="el-icon-close remove"
         @click="del"></i>
    </section>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from '@/utils/utils'
export default {
  name: "product",
  data () {
    return {
      count: 0,
      isCheck: true,
      // cartProduct: [],
      timer: null,
    };
  },

  props: ["cartData"],

  computed: {
    ...mapState({
      checkCart: (state) => state.cart.checkCart,
      cartCount: (state) => state.cart.cartCount,
      userInfo: (state) => state.user.userInfo,
    }),

    newPrice () {
      return utils.formatPrice(this.cartData.discount / 10 * this.cartData.price, 0)
    },
    totalPrice () {
      return utils.formatPrice(this.cartData.discount / 10 * this.cartData.price * this.count, 0)

    }
  },

  watch: {
    isCheck: function (newval, oldval) {
      this.$parent.setment();
    },
    count () {
      this.$parent.setment();
    },
  },

  methods: {
    ...mapMutations({
      updateCheckCart: "cart/updateCheckCart",
      updateCartCount: "cart/updateCartCount",
    }),
    ...mapActions({
      updateShopcartCount: "cart/updateShopcartCount",
      removeShopcart: "cart/removeShopcart",
      shopcartProducts: "cart/shopcartProducts",
      updateShopcartCheck: "cart/updateShopcartCheck",
      shopcartCount: "cart/shopcartCount",
    }),

    async handleChange (value) {

      //改变数量
      let res = await this.updateShopcartCount({
        pid: this.cartData.pid,
        userId: this.userInfo.userId,
        count: this.count,
      });

      //  重新获取购物车数据 调用父组件方法
      new Promise((resolve, reject) => {
        this.$parent.getCartDataList();
        this.$parent.setment();
        resolve();
      }).then(() => {

      });

    },

    /**
     * @description 删除购物车中的商品
     */
    del () {
      this.$confirm("确认删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.removeShopcart({
            ids: [this.cartData.id],
          }).then((res) => {
            if (res.data.status === 1172) {
              //  重新获取购物车数据 调用父组件方法
              new Promise((resolve, reject) => {
                this.$parent.getCartDataList();
                this.$parent.setment();
                resolve();
              }).then(() => {
                this.updateCartCount({ cartCount: this.cartCount - 1 })
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
              });
            } else {
              this.$message.error("删除失败，请联系管理员");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    /**
     * @description 更新全选状态（父组件中）
     */
    checkAll () {
      let params = {
        isCheck: this.$parent.isCheck,
        pid: this.cartData.pid,
        userId: this.userInfo.userId,
      };

      this.updateShopcartCheck(params).then((res) => {
        if (res.data.status === 1170) {
          this.isCheck = this.$parent.isCheck;
          this.$parent.getCartDataList();
        } else {
          this.$message.error("更新失败");
        }
      });
    },

    /**
     * @description 更新选择状态（自己）
     */
    check () {
      let params = {
        isCheck: !this.isCheck,
        pid: this.cartData.pid,
        userId: this.userInfo.userId,
      };

      this.updateShopcartCheck(params).then((res) => {
        if (res.data.status === 1170) {
          this.isCheck = !this.isCheck;
          this.$parent.getCartDataList();

          // 只要存在一个false 就更改父组件中的勾选状态
          if (!this.isCheck) {
            this.$emit("changeCheckAll", false);
          }
        } else {
          this.$message.error("更新失败");
        }
      });
    },

    goDetail () {
      this.$router.push({
        name: "Detail2",
        query: { pid: utils.Base64.encode(this.cartData.pid) },
      });
    },
  },
  mounted () {
    setTimeout(() => {
      this.count = this.cartData.count
    }, 100)
  },
};
</script>

<style lang="scss" scoped>
.product {
  padding: 25px 48px;
  .content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-basis: auto;
    height: auto;
    overflow: hidden;
    width: 100%;
    z-index: 6;

    .btn {
      width: 18px;
      height: 18px;
      box-sizing: border-box;
      cursor: pointer;
      .checked {
        font-size: 18px;
        color: $headNavColor-active;
      }
      .cancel {
        display: block;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        color: $subTextColor;
        border: 1px solid $subTextColor;
      }
    }

    .con {
      font-size: 18px;
      font-weight: 400;
      color: $primaryTextColor;
      line-height: 24px;
      text-align: left;
      margin-left: 30px;
    }

    .text1 {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 145px;
      box-sizing: border-box;
      cursor: pointer;
      height: 144px;
      object-fit: contain;
      padding: 5px;
      width: 144px;
      border: 1px solid rgba(204, 202, 202, 0.5);
      img {
        width: 100%;
        border-radius: 6px;
      }
    }
    .text2 {
      width: 400px;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .text3 {
      color: $primaryTextColor;
      text-align: center;
      width: 130px;
    }
    .text4 {
      text-align: center;
      width: 130px;
      /deep/el-input__inner:focus {
        border-color: #f33b3b !important;
        outline: 0;
      }

      /deep/.el-input-number__decrease:hover,
      /deep/.el-input-number__increase:hover {
        color: $headNavColor-active;
      }

      /deep/.el-input-number .el-input__inner {
        height: 32px;
        border-color: rgba(204, 202, 202, 0.5) !important;
      }
      /deep/.el-input {
        font-size: 16px;
      }

      /deep/.el-input-number {
        line-height: 30px;
        width: 125px;
        height: 30px;
      }
    }
    .text5 {
      color: $headNavColor-active;
      text-align: center;
      width: 135px;
    }

    .remove {
      font-size: inherit;
      color: rgb(190, 187, 187);
      transform: translate(30px, 0);
      cursor: pointer;
    }
  }
}
</style>