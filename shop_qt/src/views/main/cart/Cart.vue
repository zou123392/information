<template>
  <main class="main">
    <div class="cart">
      <div class="step">
        <el-steps :active="1"
                  finish-status="success"
                  simple
                  style="margin-top: 20px">
          <el-step title="购物车"></el-step>
          <el-step title="提交订单"></el-step>
          <el-step title="完成支付"></el-step>
        </el-steps>
      </div>

      <!-- 商品列表 -->
      <section v-show="cartList?.length !== 0"
               class="content">
        <header class="content__title">
          <div class="btn"
               @click="checkAll">
            <i class="el-icon-success checked"
               v-show="isCheck"></i>
            <i class="cancel"
               v-show="!isCheck"></i>
          </div>
          <div class="con text1">选择所有</div>
          <div class="con text2">商品名称</div>
          <div class="con text3">价格</div>
          <div class="con text4">数量</div>
          <div class="con text5">总计</div>
        </header>

        <div v-for="item in cartList"
             :key="item.pid"
             class="product">
          <!-- 组件 -->
          <product ref="child"
                   :cartData="item"
                   @changeCheckAll="changeCheckAll" />
        </div>
      </section>

      <!-- 空状态 -->
      <div v-show="cartList?.length === 0"
           class="empty">
        <el-empty description="您的购物车沒有任何商品"
                  :image-size="250">
          <div class="goshoping"
               @click="goshoping">去购物</div>
        </el-empty>
      </div>

      <!-- 分页组件 -->
      <!-- <el-pagination background
                     v-if="pagination.total > pagination.pageCount"
                     layout="prev, pager, next"
                     :total="pagination.total"
                     :pager-count="pagination.page"
                     :page-size="pagination.pageCount"
                     @current-change="currentChange">
      </el-pagination> -->

      <div v-if="cartCount !== 0"
           class="setment">
        <section>
          <div class="msg">
            <div class="delete"
                 @click="delAll">删除</div>
            <el-divider direction="vertical"></el-divider>
            <div class="checkedNum">
              已选择&nbsp;<span>{{ setmentData.choiceNum }}</span>&nbsp;件，共&nbsp;<span>{{ setmentData.count }}</span>&nbsp;件
            </div>
          </div>
          <div class="goSetment">
            <div class="totle">
              总计NT${{ totalPrice}}
            </div>
            <div class="goRoute"
                 @click="goOrder">
              去结算({{ setmentData.choiceNum }})
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
import product from "./product.vue";
export default {
  components: { product },
  name: "Cart",
  data () {
    return {
      // cartList: [],
      setmentData: [],
      isCheck: false,
      pagination: {
        //分页组件
        total: 0,
        pageCount: 4,
        page: 5,
        offset: 0,
      },
    };
  },
  computed: {
    ...mapState({
      cartList: (state) => state.cart.cartList,
      cartCount: (state) => state.cart.cartCount,
      checkCart: (state) => state.cart.checkCart,
      userInfo: (state) => state.user.userInfo,
    }),

    totalPrice () {
      return utils.formatPrice(this.setmentData.total, 0)
    }
  },

  watch: {},

  methods: {
    ...mapMutations({
      updateCartList: "cart/updateCartList",
      updateCartCount: "cart/updateCartCount",
      updateCheckCart: "cart/updateCheckCart",
    }),
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      shopcartProducts: "cart/shopcartProducts",
      shopcartCount: "cart/shopcartCount",
      updateShopcartCheck: "cart/updateShopcartCheck",
      removeShopcart: "cart/removeShopcart",
    }),

    // 子组件传的值
    changeCheckAll (value) {
      this.isCheck = value;
    },

    goshoping () {
      this.$router.push({
        name: "Search",
      });
    },

    // 选择所有
    async checkAll () {
      if (this.isCheck) {
        //已选中时
        this.isCheck = false;
        this.cartList?.forEach((item, index) => {
          if (item.is_checked !== this.isCheck) {
            this.$refs.child[index].checkAll();
          }
          return;
        });
      } else {
        this.isCheck = !this.isCheck;
        this.cartList?.forEach((item, index) => {
          if (item.is_checked !== this.isCheck) {
            this.$refs.child[index].checkAll();
          }
        });
      }
    },

    // 获取购物车列表
    getCartDataList () {
      let params = Object.assign({
        // offset: this.pagination.offset,
        // count: this.pagination.pageCount,
      });
      params.userId = this.userInfo.userId;
      this.shopcartProducts(params).then((res) => {
        if (res.data.status === 1174) {
          // 将图片路径加上去
          res.data.result.forEach((v) => {
            v.img = res.data.url + v.img;
            v.detail_img = res.data.url + v.detail_img;
            v.avatar = res.data.url + v.avatar;
            v.updated_at = utils.formatDate(
              v.updated_at,
              "yyyy-MM-dd hh:mm:ss"
            );
          });

          // 更新购物车
          this.updateCartList({ cartList: res.data.result });
          // 更新购物车记录数
          this.shopcartCount().then(res => {
            this.updateCartCount({ cartCount: res.data.result })
          })


          if (this.isCheck) return; //已选择就退出

          // 控制全选状态
          for (let item of this.cartList) {
            if (item.is_checked === 0) {
              this.isCheck = false;
              break;
            }

            if (item.is_checked === 1) {
              this.isCheck = true;
              continue;
            }

            this.isCheck = true;
          }
        }
      });
    },

    /**
     * @description 切换分页数据  没加
     * @param {number} e 页码
     */

    async currentChange (e) {
      // 累加偏移量
      this.pagination.offset = (e - 1) * this.pagination.pageCount;
      if (this.active === 0) {
        this.myProducts();
      }
      if (this.active === 1) {
        this.shopcart();
      }
      if (this.active === 2) {
        this.likeProducts();
      }
    },

    /**
     * @description 结算数据
     */

    setment () {
      let count = 0;
      let choiceNum = 0;
      let total = 0;
      let obj = new Object();

      // 拿到最新数据进行统计
      let params = Object.assign({
        // offset: this.pagination.offset,
        // count: this.pagination.pageCount,
      });

      this.shopcartProducts(params).then((res) => {
        if (res.data.status === 1174) {
          res.data.result.forEach((item) => {
            if (item.is_checked) {
              total += item.discount / 10 * item.price * item.count;
              choiceNum += item.count;
            }
            count += item.count;
          });

          obj.count = count;
          obj.choiceNum = choiceNum;
          obj.total = total;
          this.setmentData = obj;
        }
      });
    },

    /**
     * @description 清空购物车
     */
    delAll () {
      this.$confirm("确认清空购物车?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = new Array();
          this.cartList?.forEach((item) => {
            ids.push(item.id);
          });

          this.removeShopcart({
            ids: ids,
          }).then((res) => {
            if (res.data.status === 1172) {
              //  重新获取购物车数据 调用父组件方法
              new Promise((resolve, reject) => {
                this.getCartDataList();
                this.setment();
                this.updateCartCount({ cartCount: 0 })
                resolve();
              }).then(() => {
                this.$message({
                  message: "已清空购物车!",
                  type: "success",
                });
              });
            } else {
              this.$message.error("清空失败，请联系管理员");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    goOrder () {
      console.log(this.setmentData);
      // const newPage = this.$router.resolve({
      //   name: 'Order'
      // })
      // window.open(newPage.href, '_blank')
      this.$router.push({
        name: "Order",
        params: {},
        query: {},
      });
    },
  },

  async mounted () {
    await this.getCartDataList();
  },
};
</script>

<style lang="scss" scoped>
@import './cart.scss';
</style>