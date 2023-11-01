<template>
  <main class="payway">
    <header class="head">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="step">
            <el-steps :active="2"
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
    <div class="content">
      <section class="status"
               :class="{ 'status--active': isOpen }"
               :style="{ transition: isClose ? 'none' : 'all .3s ease 0s' }">
        <el-row :gutter="20">
          <el-col :span="2">
            <i class="result"
               :class="{
                'el-icon-warning': isClose,
                'el-icon-success': !isClose,
              }"
               :style="{ color: isClose ? '#B0B0B7' : ' #83C44E' }"></i>
          </el-col>
          <el-col :span="15">
            <div class="msg">
              <div class="msg__title">
                {{ isClose ? "订单已关闭" : "订单提交成功! 去付款~" }}
              </div>
              <div class="time">
                请在
                <span>{{ diffTime.hours }}</span>&nbsp;小时&nbsp;<span>{{ diffTime.minutes }}</span>&nbsp;分钟&nbsp;<span>{{ diffTime.seconds }}</span>
                &nbsp;秒内完成
              </div>
              <div v-show="!isOpen"
                   class="address">
                <span> 收货人姓名：{{ infor.consigneeName }}</span>
                <span> 收货地址：{{ address }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="detail">
              <div class="total">
                <span class="title">金额：</span>
                <span class="danwei"
                      :style="{ color: isClose ? '#e78e8e' : '#fe3a3a' }">NT$&nbsp;</span>
                <span class="price"
                      :style="{ color: isClose ? '#e78e8e' : '#fe3a3a' }">{{ payInfo.totalPrice }}</span>
              </div>
              <div class="tools"
                   v-show="!isClose"
                   @click="detail">
                订单详情<i class="el-icon-arrow-down arrow"></i>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex"
                jusify="end"
                :gutter="20">
          <el-col :span="2"> </el-col>
          <el-col :span="22">
            <div class="msg2">
              <el-divider></el-divider>
              <div class="form">
                <div>
                  <span class="title">订单号：</span>
                  <span class="orderNum">{{ payInfo.orderNum }}</span>
                </div>
                <div>
                  <span class="title">收货信息：</span>
                  <span class="de">{{ infor.consigneeName }}</span>
                  <span class="de">{{ infor.consigneePhone }}</span>
                  <span class="de">{{ address }}</span>
                </div>
                <div class="product">
                  <span class="title">商品名称：</span>
                  <ul class="">
                    <li v-for="item in payInfo.productList"
                        :key="item.pid">
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
                <div>
                  <span class="title">配送时间：</span>
                  <span class="">与商家沟通</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex"
                jusify="end"
                :gutter="20">
          <div v-if="isClose"
               class="goOrderCenter"
               @click="goOrderCenter">
            前往订单中心
          </div>
        </el-row>
      </section>

      <section class="way"
               v-if="!isClose">
        <p>选择以下支付方式付款</p>
        <el-divider content-position="left"></el-divider>
        <div class="box">
          <div class="img aliPay"
               @click="goPay">
            <img src="./img/alipay.png"
                 alt="支付宝" />
          </div>
          <div class="img vxPay"
               :style="{ cursor: 'not-allowed' }">
            <img src="./img/vxpay.png"
                 alt="微信" />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "Pay",
  data () {
    return {
      payInfo: {},
      address: "",
      infor: {},
      diffTime: {
        hours: "0",
        minutes: "0",
        seconds: "0",
      },
      isClose: false,
      timer: null,
      isOpen: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      findOrder: "order/findOrder",
      updateOrder: "order/updateOrder",
      payOrder: "pay/payOrder",
      findAddress: "address/findAddress",
    }),

    // 处理倒计时时间逻辑
    timestart (createTime, diffHour) {
      this.timer = setInterval(() => {
        // 当前日期
        let nowDate = new Date();
        nowDate = nowDate.getTime();

        // 创建日期
        let createDate = new Date(createTime);

        createDate = createDate.getTime();

        // 差距
        let diff = createDate + diffHour * 60 * 60 * 1000 - nowDate;

        // 半小时为期限
        if (diff <= 0) {
          let params = Object.assign({});
          params.status = 4;
          params.orderNum = this.payInfo.orderNum;
          // 超时则关闭订单
          this.updateOrder(params).then((res) => {
            if (res.data.status === 200) {
              this.isClose = true;
              this.isOpen = true;
              this.$message("订单已关闭");
            } else {
              this.$message.error("系统错误");
            }
          });
          clearInterval(this.timer);
          return;
        }
        // let day = parseInt(diff / (1000 * 60 * 60 * 24))
        // 时
        this.diffTime.hours = parseInt(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        // 分
        this.diffTime.minutes = parseInt(
          (diff % (1000 * 60 * 60)) / (1000 * 60)
        );
        // 秒
        this.diffTime.seconds = parseInt((diff % (1000 * 60)) / 1000);
      });
    },

    // 获取订单信息
    innt () {
      this.findOrder({
        orderNum: utils.Base64.decode(this.$route.query.orderNum),
      }).then((res) => {
        if (res.data.status === 200) {
          this.payInfo = res.data.result;
          this.infor = this.payInfo.address[0];
          this.address =
            this.infor.addressName.replace(/\//g, " ") +
            " " +
            this.infor.addressDetail;
          // this.diffTime = this.payInfo.createdAt
          if (this.payInfo.status === '4' || this.payInfo.status === '3') {
            this.isClose = true;
            this.isOpen = true;
            this.diffTime = {
              hours: "0",
              minutes: "0",
              seconds: "0",
            }
            this.$message("订单已关闭");
            return
          }

          this.timestart(this.payInfo.createdAt, 0.5);
        } else {
          this.$message.error("系统错误");
        }
      });
    },

    detail () {
      this.isOpen = !this.isOpen;
    },

    goOrderCenter () {
      this.$router.push({
        name: "Personal",
        query: { active: 1 },
      });
    },

    goPay () {
      let params = Object.assign({});

      // 还有一些其他属性
      params.orderNum = this.payInfo.orderNum;
      params.totalPrice = this.payInfo.totalPrice;
      params.productCount = this.payInfo.productCount;
      params.productOne = this.payInfo.productList[0].name;

      this.payOrder(params).then((res) => {
        if (res.data.status === 200) {
          window.open(res.data.result.url);
          this.$router.push({ name: 'Home' })
        } else {
          this.$message.error("系统错误");
        }
      });
    },
  },
  mounted () {
    this.innt();
  },
};
</script>

<style lang="scss" scoped>
@import './pay.scss';
</style>