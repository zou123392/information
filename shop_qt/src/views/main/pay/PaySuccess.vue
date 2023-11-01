<template>
  <main class="paySuccessData">
    <div class="content">
      <div class="bg"></div>
      <section class="left">
        <div class="successCard">
          <i class="el-icon-success success"></i>
          <div class="title">
            <p>购买成功</p>
            <p>我们尽快为您处理</p>
          </div>
          <p class="orderNum">订单编号：{{ paySuccessData.out_trade_no }}</p>
          <p class="orderNum">在线支付：{{ paySuccessData.total_amount }}元</p>
          <p class="orderNum">支付时间：{{ paySuccessData.timestamp }}</p>
          <div class="button">
            <span class="godetail"
                  @click="goDetail">查看订单详情</span>
            <el-divider direction="vertical"></el-divider>
            <span class="gosearch"
                  @click="goSearch">继续逛逛</span>
          </div>
          <el-divider></el-divider>
          <p>温馨提示：谨防诈骗，请不要点击任何链接进行退款等操作</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "PaySuccess",
  data () {
    return {
      paySuccessData: [],
    };
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      paySuccess: "pay/paySuccess",
    }),

    // 初始化数据
    init () {
      let url = window.location.href;
      this.paySuccessData = utils.getQueryString(url);
      this.paySuccessData.timestamp = utils.formatDate(
        this.paySuccessData.timestamp,
        "yyyy-MM-dd hh:mm"
      );

      let params = Object.assign({});
      params.orderNum = this.paySuccessData.out_trade_no;
      params.payTime = utils.getQueryString(url).timestamp;
      this.paySuccessData.method.split(".")[0] === "alipay"
        ? (params.payWay = "支付宝付款")
        : (params.payWay = "在线支付");

      // 更新订单状态
      this.paySuccess(params)
        .then((res) => { })
        .catch(() => {
          this.$message.error("系统出错啦");
        });
    },

    // 前往详情页
    goDetail () {
      this.$router.push({
        name: "OrderDetail",
        query: {
          orderNum: utils.Base64.encode(this.paySuccessData.out_trade_no),
        },
      });
    },

    // 前往搜索页
    goSearch () {
      this.$router.push({ name: "Search" });
    },
  },
  mounted () {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.paySuccessData {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 500px;
  padding: 55px 0 50px 0;
  border-top: 1px solid $headNavColor-active;
  // overflow: hidden;

  .content {
    position: relative;
    margin: 30px auto;
    width: $mainWidth;
    min-height: 600px;
    .bg {
      position: absolute;
      top: 0;
      left: 50%;
      right: 0;
      bottom: 0;
      background-image: url('./img/paySuccess.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      // // filter: blur(5px);
      width: 1900px;
      height: 100%;
      transform: translateX(-50%);
      z-index: 1;
      pointer-events: none;
    }
    .left {
      .successCard {
        width: 450px;
        height: auto;
        padding: 40px 42px 120px 42px;
        background: white;
        font-size: 18px;
        color: $normalTextColor;
        line-height: 32px;
        box-shadow: -4px 5px 13px 12px #706f6f2e;

        .success {
          font-size: 65px;
          font-weight: 900;
          color: $success;
        }

        .title {
          font-size: 32px;
          font-weight: 600;
          color: $success;
          line-height: 48px;
          margin: 20px 0;
        }
        .orderNum,
        .payway,
        .button {
          line-height: 42px;
        }

        .button {
          span {
            cursor: pointer;
            color: #7eb2fb;
          }
          .godetail {
            margin-right: 20px;
          }
          .gosearch {
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>