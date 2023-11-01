<template>
  <main class="order">
    <section class="content">
      <header class="orderHead">
        <p class="title">订单详情</p>
        <el-row type="flex"
                justify="end"
                align="middle"
                :gutter="20">
          <el-col :span="24">
            <div class="box">
              <p class="orderNum">订单号：{{ order.orderNum }}</p>
              <div class="button">
                <span class="b cancle"
                      @click="
                    $router.push({ name: 'Personal', query: { active: 1 } })
                  ">返回订单详情</span>
                <span v-if="order.status === '5'"
                      class="b cancle"
                      @click="isGetThings = true">确认收货</span>
                <template v-if="noPay">
                  <span class="b cancle"
                        @click="cancleOrder">取消订单</span>
                  <span class="b goPay"
                        @click="goPay">立即付款</span>
                </template>

              </div>
            </div>
          </el-col>
        </el-row>

        <el-divider content-position="left"></el-divider>

        <el-row :gutter="20">
          <el-col :span="24">
            <div class="wait">
              <p class="stepTitle"
                 :class="{ close: order.status === '3' || order.status === '4' }">
                {{ statusText }}
              </p>
              <div class="step">
                <el-steps :active="stepActive"
                          align-center>
                  <el-step v-for="item in step"
                           :key="item.key"
                           :title="item.title"
                           :description="item.des"></el-step>
                </el-steps>
              </div>
            </div>
          </el-col>
        </el-row>
      </header>
      <div class="message">
        <!-- 物流信息 -->
        <section class="logs"
                 v-if="order.status === '5'">
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="title">物流信息</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="des">如刷物流信息未加载，请刷新试试</div>
            </el-col>
          </el-row>

          <section class="logBox">
            <el-row :gutter="20">
              <el-col :span="24">
                <!-- 物流查询 -->
                <!--用于显示查询结果的容器。-->
                <div v-if="true"
                     class="content"
                     id="YQContainer"></div>
              </el-col>
            </el-row>
          </section>
        </section>

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
          <section v-for="item in productList"
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
                <div class="price">NT$ {{price(item) }} × {{ item.count }}</div>
              </el-col>
              <el-col :span="6">
                <div class="totle">NT$ {{ price(item)}}</div>
              </el-col>
            </el-row>
          </section>
        </section>

        <el-divider content-position="left"></el-divider>
        <!-- 收货地址 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="address">
              <el-descriptions class="margin-top"
                               title="收获信息"
                               :column="2"
                               border>
                <template slot="extra">
                  <div v-if="orderIsSend"
                       class="button"
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

        <el-divider></el-divider>

        <!-- 结算 -->
        <section class="setOrder">
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
                  <div class="apply"
                       v-if="order.status === '0' || order.status === '1'">
                    应付金额：NT$&nbsp;
                  </div>
                  <div class="apply"
                       v-else>已付金额：NT$&nbsp;</div>
                  <div class="totalPrice">{{ newPrice }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </section>
      </div>
    </section>

    <!-- 修改地址弹窗 -->
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="80%"
               :before-close="handleClose">
      <div style="height: 48vh; overflow: scroll">
        <Address />
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="exitAddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确认收货弹窗 -->
    <el-dialog title="安全验证"
               :visible.sync="isGetThings"
               width="30%"
               :before-close="handleCloseGetThings">
      <div class="distitle">请确保货物已经收到</div>
      <div class="form"
           style="height: auto">
        <el-form :model="getThingsInfo"
                 :rules="rules"
                 class="demo-ruleForm"
                 status-icon
                 ref="getThingsInfo"
                 label-width="90px"
                 label-position="left"
                 :hide-required-asterisk="true">
          <el-form-item prop="email"
                        label="邮箱地址：">
            {{ userInfo.email }}
          </el-form-item>
          <el-form-item prop="validcode"
                        label="验证码：">
            <div class="send-code">
              <el-input v-model="getThingsInfo.validcode"
                        autocomplete="off"
                        placeholder="输入6位数字验证码">
              </el-input>
              <el-button class="send"
                         :disabled="isSend"
                         @click="sendCode">
                {{ text }}
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="isGetThings = false">取 消</el-button>
        <el-button type="primary"
                   @click="getThings('getThingsInfo')">确 定</el-button>
      </span>
    </el-dialog>
  </main>
</template>
  
  <script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "OrderDetail",
  data () {
    return {
      isGetThings: false, // 确认收货弹窗 标识
      dialogVisible: false, //修改地址 弹窗标识
      isdefaultData: [],
      productList: [],
      order: {},
      step: [
        {
          title: "下单",
          des: "",
          key: 0,
          status: [0, 1],
        },
        {
          title: "付款",
          des: "",
          key: 1,
          status: [2],
        },
        {
          title: "发货",
          des: "",
          key: 2,
          status: [5],
        },
        {
          title: "交易成功",
          des: "",
          key: 3,
          status: [6],
        },
      ],
      stepActive: 1,

      // 确认收货弹窗信息
      getThingsInfo: {
        validcode: "",
      },

      //验证表单规则
      rules: {
        validcode: [
          {
            validator: this.validCode,
            trigger: "blur",
          },
        ],
      },

      // 正则
      reg: {
        codeReg: /^\d{6}$/,
      },

      // 发送验证文本
      text: "发送验证码",

      // 是否发送验证码
      isSend: false,

      // 验证码id
      codeId: "",
    };
  },

  components: {
    Address: () => import("@/components/Address.vue"),
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),

    // 状态文字
    statusText () {
      let flag = this.order.status;
      return flag === "0" || flag === "1"
        ? "等待付款"
        : flag === "2"
          ? "等待发货"
          : flag === "3" || flag === "4"
            ? "订单已关闭"
            : flag === "5"
              ? "商家已发货"
              : "订单已完成";
    },

    // 订单是否未支付
    noPay () {
      return this.order.status === "0" || this.order.status === "1";
    },

    // 订单是否发货
    orderIsSend () {
      return this.order.status === "0" || this.order.status === "1" || this.order.status === "2";
    },

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
      return utils.formatPrice(this.productList.reduce((a, b) => {
        return a + b.price * b.count;
      }, 0), 0)
    },
    // 现价
    newPrice () {
      return utils.formatPrice(this.productList.reduce((a, b) => {
        return a + b.discount / 10 * b.price * b.count;
      }, 0), 0)
    },
    // 优惠
    discount () {
      return utils.formatPrice(this.oldPrice.replaceAll(',', '') - this.newPrice.replaceAll(',', ''), 0)
    },
  },

  methods: {
    ...mapMutations({}),
    ...mapActions({
      sendEmail: "user/sendEmail",
      jadgeCode: "user/jadgeCode",
      findOrder: "order/findOrder",
      confirmReceipt: "order/confirmReceipt",
      updateOrder: "order/updateOrder",
      findAddress: "address/findAddress",
    }),

    // 物流加载函数
    doTrack (logNum) {
      YQV5.trackSingle({
        //必须，指定承载内容的容器ID。
        YQ_ContainerId: "YQContainer",
        //可选，指定查询结果高度，最大为800px，默认为560px。
        YQ_Height: 600,
        //可选，指定运输商，默认为自动识别。
        YQ_Fc: "0",
        //可选，指定UI语言，默认根据浏览器自动识别。
        YQ_Lang: "en",
        //必须，指定要查询的单号。
        YQ_Num: logNum,
      });
    },

    // 计算状态步骤
    countStep () {
      let o = this.order;
      let orderTimeArr = [o.createdAt, o.payTime, o.sendTime, o.takeTime];
      for (let item of this.step) {
        if (item.status.includes(Number(this.order.status))) {
          this.stepActive = item.key + 1;
        }
        // 当时间为null时 跳出本次循环
        if (!orderTimeArr[item.key]) {
          this.step[item.key].des = "";
          continue;
        }

        this.step[item.key].des = utils.formatDate(
          orderTimeArr[item.key],
          "yyyy-MM-dd hh:mm"
        );
      }

      this.order.status === "3" || this.order.status === "4"
        ? (this.stepActive = -1)
        : "";
    },

    // 弹窗 1
    handleCloseGetThings (done) {
      this.$confirm("是否终止取消订单操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((_) => {
          done();
        })
        .catch((_) => { });
    },
    // 弹窗 2
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

    //初始化数据
    async init () {
      this.findOrder({
        orderNum: `${utils.Base64.decode(this.$route.query.orderNum)}`,
      }).then((res) => {
        if (res.data.status === 200) {
          // 将商品图片路径加上去
          let result = res.data.result;
          result.createdAt = utils.formatDate(
            result.createdAt,
            "yyyy-MM-dd hh:mm"
          );
          result.updatedAt = utils.formatDate(
            result.updatedAt,
            "yyyy-MM-dd hh:mm"
          );
          let product = result.productList;

          // 直接赋值拿不到数据，诡异
          product.forEach((v) => {
            v.img = res.data.url + v.img;
            v.detail_img = res.data.url + v.detail_img;
            v.avatar = res.data.url + v.avatar;
            v.updated_at = utils.formatDate(
              v.updated_at,
              "yyyy-MM-dd hh:mm:ss"
            );
          });

          this.productList = product;
          this.isdefaultData = result.address[0];

          delete result.productList;
          delete result.address;

          this.order = result;
          // step 状态
          this.countStep();

          // 物流加载
          if (result.logNum && result.status === "5") {
            // 延迟加载
            setTimeout(() => {
              this.doTrack(result.logNum);
            }, 200);
            return;
          }
        }
      });
    },

    // 修改地址
    exitAddress () {
      new Promise((resolve, reject) => {
        this.findAddress().then((res) => {
          const { status, result } = res.data;

          this.isdefaultData = result.filter(
            (item) => item.isdefault === true
          )[0];

          if (!this.isdefaultData?.adrid) {
            this.$message({
              message: "修改之后的地址不能为空",
              type: "warning",
              offset: 100,
            });

            return;
          }

          // 更新订单中的地址id
          let params = Object.assign({});
          params.orderNum = this.order.orderNum;
          params.addressId = this.isdefaultData.adrid;

          this.updateOrder(params);

          resolve();
        });
      })
        .then(() => {
          this.dialogVisible = false;
          this.$message({
            message: "修改成功",
            type: "success",
            offset: 100,
          });
        })
        .catch((err) => {
          this.dialogVisible = false;
          this.$message({
            message: "修改失败",
            type: "warning",
            offset: 100,
          });
        });
    },

    // 取消订单
    cancleOrder () {
      this.$confirm("确认取消此订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.updateOrder({
            orderNum: `${utils.Base64.decode(this.$route.query.orderNum)}`,
            status: "4",
          }).then((res) => {
            if (res.data.status === 200) {
              this.$message({
                type: "success",
                message: "订单已取消",
                offset: 100,
              });
              this.init();
            }
          });
        })
        .catch(() => {
          this.$message.error("系统错误");
        });
    },

    // 去支付
    goPay () {
      this.$router.push({
        name: "Pay",
        params: {},
        query: {
          orderNum: utils.Base64.encode(this.order.orderNum),
        },
      });
    },

    /**
     * @description 确认收货
     */
    getThings (formName) {
      console.log(this.productList);
      console.log(formName);
      this.$refs[formName].validate((valid) => {
        console.log(valid);
        if (!valid) return;

        // 获取 pid 列表 用于更新销量
        let pidArr = new Array();
        this.productList.forEach((item) => {
          pidArr.push(item.pid);
        });

        // 校验验证码
        this.jadgeCode({
          validcode: this.getThingsInfo.validcode,
          codeId: this.codeId,
          email: this.userInfo.email,
        }).then((res) => {
          if (res.data.status === 1035) {
            console.log(pidArr);
            // 确认收货
            this.confirmReceipt({
              orderNum: `${utils.Base64.decode(this.$route.query.orderNum)}`,
              pidArr,
            }).then((res) => {
              if (res.data.status === 200) {
                setTimeout(() => {
                  this.$message({
                    type: "success",
                    message: res.data.msg,
                    offset: 100,
                  });
                  this.init();
                  this.isGetThings = false;
                }, 500);
              } else {
                this.$message({
                  type: "warning",
                  message: res.data.msg,
                  offset: 100,
                });
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: "验证码错误",
              offset: 100,
            });
          }
        });
      });
    },

    /**
     * @description 发送验证码
     */
    sendCode () {
      let time = 60;
      this.text = `${time}s后重新发送`;
      this.isSend = true;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          timer = null;
          this.text = "发送验证码";
          this.isSend = false;
        } else {
          time--;
          this.text = `${time}s后重新发送`;
        }
      }, 1000);

      // 发送验证码
      this.sendEmail({
        email: this.userInfo.email,
      })
        .then((res) => {
          if (res.data.status == 1010) {
            this.codeId = res.data.cid;
            this.$message({
              message: res.data.msg,
              type: "success",
              offset: 100,
            });
            return;
          }
          this.$message.error(res.data.msg);
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },

    /**
     * @description 验证验证码
     */
    validCode (rule, value, callback) {
      if (!value) {
        return callback(new Error("验证码不能为空"));
      }
      setTimeout(() => {
        if (!this.reg.codeReg.test(value)) {
          callback(new Error("验证码必须为6位数字"));
        } else {
          callback();
        }
      }, 400);
    },
  },

  mounted () {
    this.init();
  },
};
</script>
  
  <style lang="scss" scoped>
.order {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  background: $workspaceBgColor;
  padding-bottom: 60px;

  .content {
    display: inline-block;
    width: $mainWidth;
    height: 100%;
    background: rgb(255, 255, 255);
    color: $primaryTextColor;
    margin-top: 30px;

    .orderHead {
      font-size: 20px;
      padding: 40px;
      .title {
        font-size: 40px;
        color: $normalTextColor;
        margin-bottom: 40px;
      }

      .box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;

        .button {
          .b {
            font-size: 18px;
            line-height: 18px;
            padding: 10px 40px;
            margin-right: 10px;
            cursor: pointer;
            text-align: center;
          }

          .cancle {
            border: 1px solid rgb(224, 221, 221);
          }
          .goPay {
            background: $headNavColor-active;
            color: white;
          }
        }
      }

      .wait {
        .stepTitle {
          margin-bottom: 30px;
          color: $headNavColor-active;
        }

        .close {
          color: $normalTextColor;
        }
        .step {
          width: 1400px;
          transform: translateX(-125px);
          /deep/.el-step__head.is-finish {
            color: $success;
            border-color: $success;
          }
          /deep/.el-step__title.is-finish {
            color: $success;
          }
          /deep/.el-step__description.is-finish {
            color: $subTextColor;
          }
        }
      }
    }

    .message {
      padding: 40px;

      .address {
        .button {
          padding: 8px 25px;
          border: 1px solid rgb(224, 221, 221);
          // color: white;
          // border-radius: 4px;
          cursor: pointer;
        }
        /deep/.el-descriptions__title {
          font-size: 20px;
          font-weight: 400;
        }
      }

      .logs {
        width: 100%;
        font-size: 16px;
        margin: 10px 0 50px 0;
        .title {
          font-size: 20px;
          font-weight: 400;
        }

        .des {
          font-size: 14px;
          font-weight: 300;
          margin-top: 20px;
        }

        .logBox {
          width: 100%;
          height: auto;

          .content {
            width: 100%;
            height: auto;
          }
        }
      }

      .product {
        width: 100%;
        font-size: 16px;
        margin: 10px 0 50px 0;
        .title {
          font-size: 20px;
          font-weight: 400;
        }

        .des {
          font-size: 14px;
          font-weight: 300;
          margin-top: 20px;
        }

        .productList {
          height: 78px;
          padding: 10px;
          color: $primaryTextColor;
          // background: #7f9763;
          .img {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 58px;
            height: 58px;
            img {
              width: 100%;
            }
            // background: red;
          }

          .name,
          .price {
            font-size: 16px;
            font-weight: 400;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
          }
          .name {
          }

          .price {
          }

          .totle {
            text-align: center;
          }
        }
      }

      .setOrder {
        .detail {
          font-size: 16px;
          font-weight: 400;
          color: $primaryTextColor;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-end;

          div {
            line-height: 28px;
          }

          .other {
            margin-bottom: 20px;
          }

          .total {
            display: flex;
            justify-content: flex-start;
            color: $headNavColor-active;
            .apply {
              line-height: 70px;
            }
            .totalPrice {
              line-height: 48px;
              font-size: 48px;
            }
          }
        }
      }
    }
  }

  /deep/.el-dialog__body {
    padding: 20px 5px 0 10px;
  }

  .distitle {
    padding: 0 15px;
  }

  // 弹窗
  .form {
    padding: 0.9375rem;
    box-sizing: border-box;
    overflow: hidden;

    .send-code {
      width: 100%;
      display: flex;

      .el-button {
        padding: 0.75rem;
      }
    }

    .send {
      margin-left: 1.25rem;
    }
  }

  .form-group {
    margin-bottom: 0.9375rem;
  }

  .code-btn {
    margin-left: auto;
  }

  .register-btn {
    display: block;
    width: 100%;
  }

  .login-text {
    display: flex;
    align-items: center;
    justify-content: center;

    & > .link {
      cursor: pointer;
      color: $subTextColor;

      &:hover {
        color: $brandColor;
      }
    }
  }

  .form-group {
    margin-top: 3.125rem;
  }
}
</style>