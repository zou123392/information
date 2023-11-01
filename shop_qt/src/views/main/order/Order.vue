<template>
  <main class="order">
    <header class="head">
      <el-row :gutter="20">
        <el-col :span="24">
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
        </el-col>
      </el-row>
    </header>

    <section class="content">
      <div class="message">
        <!-- 收货地址 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="address">
              <el-descriptions class="margin-top"
                               title="收获地址"
                               :column="2"
                               border>
                <template slot="extra">
                  <div class="button"
                       @click="dialogVisible = true">
                    修改地址
                  </div>
                </template>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-user"></i>
                    收件名
                  </template>
                  {{ isdefaultData?.consigneeName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-mobile-phone"></i>
                    手机号
                  </template>
                  {{ isdefaultData?.consigneePhone }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-location-outline"></i>
                    收货地址
                  </template>
                  {{ isdefaultData?.addressName }}
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-office-building"></i>
                    详细地址
                  </template>
                  {{ isdefaultData?.addressDetail }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-office-building"></i>
                    电子邮件
                  </template>
                  {{ userInfo?.email }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-col>
        </el-row>

        <el-divider content-position="left">请确保地址真实</el-divider>

        <!-- 商品列表 -->
        <section class="product">
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="title">商品列表</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="des">请核对商品清单之后再提交订单</div>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <section v-for="item in shopcart"
                   :key="item.id"
                   class="productList">
            <el-row type="flex"
                    justify="start"
                    align="middle"
                    :gutter="20">
              <el-col :span="2">
                <div class="img"><img :src="item.img"
                       alt="item.name" /></div>
              </el-col>
              <el-col :span="10">
                <div class="name">{{ item.name }}</div>
              </el-col>
              <el-col :span="6">
                <div class="price">NT$ {{ price(item) }} × {{ item.count }}</div>
              </el-col>
              <el-col :span="6">
                <div class="totle">NT$ {{ itemPriceCount(item)}}</div>
              </el-col>
            </el-row>
          </section>
        </section>

        <el-divider></el-divider>

        <!-- 结算 -->
        <section v-if="shopcart.length !== 0"
                 class="setOrder">
          <el-row type="flex"
                  justify="end"
                  align="middle"
                  :gutter="20">
            <el-col :span="20">
              <div class="detail">
                <div class="price">商品价格：NT$ {{ oldPrice }}</div>
                <div class="youhui">优惠：-NT$ {{ discount }}</div>
                <div class="other">运费已包含</div>
                <div class="total">
                  <div class="apply">总金额：NT$&nbsp;</div>
                  <div class="totalPrice">{{ newPrice }}</div>
                </div>
              </div>
            </el-col>
          </el-row>

          <el-divider></el-divider>

          <el-row type="flex"
                  justify="end"
                  align="middle"
                  :gutter="20">
            <el-col :span="4">
              <div class="goPay"
                   @click="goPay">生成订单</div>
            </el-col>
          </el-row>
        </section>
      </div>
    </section>

    <!-- 弹窗 -->
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="80%"
               :before-close="handleClose">
      <span>
        <Address />
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="getAddressArgin">确 定</el-button>
      </span>
    </el-dialog>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "Order",
  data () {
    return {
      dialogVisible: false, //弹窗标识
      isdefaultData: [],
      shopcart: [],
      order: new Object(),
      pagination: {
        //分页组件
        total: 0,
        pageCount: 4,
        page: 5,
        offset: 0,
      },
    };
  },

  components: {
    Address: () => import("@/components/Address.vue"),
  },

  computed: {
    ...mapState({
      checkCart: (state) => state.cart.checkCart,
      detail: (state) => state.product.detail,
      userInfo: (state) => state.user.userInfo,
    }),

    price () {
      return function (item) {
        console.log(item);
        return utils.formatPrice(item.discount / 10 * item.price, 0)
      }
    },

    itemPriceCount () {
      return function (item) {
        return utils.formatPrice(item.discount / 10 * item.price * item.count, 0)
      }
    },


    // 总计
    // 原价
    oldPrice () {
      return utils.formatPrice(this.shopcart.reduce((a, b) => {
        return a + b.price * b.count;
      }, 0), 0)
    },
    // 现价
    newPrice () {
      return utils.formatPrice(this.shopcart.reduce((a, b) => {
        return a + b.discount / 10 * b.price * b.count;
      }, 0), 0)
    },
    // 优惠
    discount () {
      return utils.formatPrice(this.oldPrice.replaceAll(',', '') - this.newPrice.replaceAll(',', ''), 0)
    },
  },

  methods: {
    ...mapMutations({
      updateOrder: "order/updateOrder",
      updateCartCount: "cart/updateCartCount",
    }),
    ...mapActions({
      shopcartProducts: "cart/shopcartProducts",
      shopcartCount: "cart/shopcartCount",
      removeShopcart: "cart/removeShopcart",
      findAddress: "address/findAddress",
      addOrder: "order/addOrder",
    }),

    // 弹窗
    handleClose (done) {
      if (!this.isdefaultData) {
        this.$confirm("收货地址不能为空", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => { })
          .catch((_) => {
            done();
          });
      } else {
        done();
      }
    },

    getAddressArgin () {
      this.findAddress().then((res) => {
        if (res.data.status === 1060) {
          this.isdefaultData = res.data.result.filter(
            (item) => item.isdefault === true
          )[0];
        }

        this.dialogVisible = false;
      });
    },

    //初始化数据
    async getMessage () {
      let params = Object.assign({
        offset: this.pagination.offset,
        count: this.pagination.pageCount,
      });

      let res2 = await this.shopcartProducts(params);

      this.getAddressArgin();
      // let res1 = await this.findAddress();
      // if (res1.data.status === 1060) {
      //   this.isdefaultData = res1.data.result.filter(
      //     (item) => item.isdefault === true
      //   )[0];
      // }

      if (res2.data.status === 1174) {
        // 将图片路径加上去
        res2.data.result.forEach((v) => {
          v.img = res2.data.url + v.img;
          v.detail_img = res2.data.url + v.detail_img;
          v.avatar = res2.data.url + v.avatar;
          v.updated_at = utils.formatDate(v.updated_at, "yyyy-MM-dd hh:mm:ss");
        });
        this.shopcart = res2.data.result.filter((item) => {
          return item.is_checked === 1;
        });
      } else {
        this.$router.push({
          name: "Cart",
        });
      }
    },

    // 创建订单逻辑
    createOrder () {
      if (this.isdefaultData && this.shopcart) {
        let params = Object.assign({});
        let count = 0;

        // 暂存清空购物车的id
        let ids = new Array();
        //商品列表
        let product = new Array();
        // let Productcount =
        // let productIds = new Array()

        this.shopcart.forEach((item) => {
          count += item.count;
          product.push({ [item.pid]: item.count });
          ids.push(item.id);
        });

        console.log(this.newPrice);
        params.productCount = count;
        params.totalPrice = this.newPrice;
        params.addressId = this.isdefaultData.adrid;
        params.productList = JSON.stringify(product);
        params.sellerId = ""; //这个字段待定

        this.addOrder(params).then((res) => {
          if (res.data.status === 200) {
            // 订单创建成功 清空购物车 并跳转到支付界面
            this.removeShopcart({ ids: ids }).then((res2) => {
              if (res2.data.status === 1172) {
                // 更新购物车记录数
                this.shopcartCount().then(res => {
                  this.updateCartCount({ cartCount: res.data.result })
                })
                this.$router.push({
                  name: "Pay",
                  params: {},
                  query: {
                    orderNum: utils.Base64.encode(res.data.result.orderNum),
                  },
                });
              }
            });
          } else {
            this.$message.error("系统错误");
          }
        });
      } else {
        //用户没有添加地址
        this.$confirm("收货地址等信息不能为空", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => { })
          .catch((_) => { });
      }
    },

    goPay () {
      this.createOrder();
    },
  },

  mounted () {
    this.getMessage();
  },
};
</script>

<style lang="scss" scoped>
@import './order.scss';
</style>