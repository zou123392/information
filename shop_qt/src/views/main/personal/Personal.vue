<template>
  <section class="profile">
    <el-row :style="{ 'max-width': container + 'px' }">
      <el-col :span="6"
              class="mr-30">
        <!-- 用户编辑 -->
        <div class="widget user-profile">
          <div class="profile-thumb">
            <el-image class="rounded-circle"
                      :src="userInfo?.avatar"
                      fil="cover"
                      :preview-src-list="[userInfo?.avatar]"></el-image>
          </div>
          <h5 class="text-center">{{ userInfo?.nickName }}</h5>
          <p>用户ID: {{ userInfo?.userId }}</p>
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="small"
                     @click="showEditorView"
                     v-if="!isSwitch">编辑个人资料</el-button>
        </div>

        <!-- 侧边栏 -->
        <div class="widget user-menu">
          <div class="item"
               v-for="(item, index) in menu"
               :key="index"
               :class="{ active: index === active }"
               @click="selectMenu(index, item)">
            <div class="flex">
              <span :class="item.icon"></span>
              <span class="text">{{ item?.name }}</span>
            </div>
            <span class="num"
                  v-if="item.count">{{
              item.count > 99 ? "99+" : item.count
            }}</span>
          </div>
        </div>
      </el-col>

      <!-- 右边展示栏 -->
      <el-col :span="18">
        <div class="widget my-adslist">
          <h3 class="widget-header">{{ title }}</h3>
          <el-divider></el-divider>

          <!-- 商品展示 -->
          <div class="user-product">
            <div v-show="active === 0 || active === 5"
                 class="content">
              <!-- 我的商品 与收藏 列表 -->
              <Product class="product"
                       v-for="(item, index) in myProductList"
                       :key="index"
                       :productItem="item"
                       v-on:del="deleteProduct" />
              <section class="emtype"
                       v-if="myProductList.length === 0">
                <!-- <i class="el-icon-info emtype-icon"></i> -->
                <el-empty :image-size="250"
                          :description="`还没有${menu[active]?.name}`"></el-empty>
              </section>
            </div>

            <!-- 我的订单 -->
            <section v-show="active === 1"
                     class="order">
              <!-- 头部导航 -->
              <div class="head">
                <template v-for="(item, index) in orderHeadNav">
                  <span :key="item.key">
                    <span @click="choiceOrder(item)"
                          :class="{ 'head--active': orderActive === item.key }">{{ item.name }}</span>
                    <el-divider v-if="index < 6"
                                direction="vertical"></el-divider>
                  </span>
                </template>
              </div>

              <!-- 主要表单 -->
              <template v-if="orderActive !== 6">
                <div v-for="(item, index) in orderList"
                     :key="index">
                  <section class="mainForm">
                    <el-row :gutter="20">
                      <el-col :span="24">
                        <div class="title"
                             :class="{
                            change: item.status === '0' || item.status === '1',
                            success: item.status === '5' || item.status === '6',
                          }">
                          {{ statusText(item) }}
                        </div>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <!-- item.logNum -->
                      <el-col :span="24">
                        <div v-if="item.logNum"
                             class="logNum">
                          <!-- <el-divider content-position="left">
                        物流单号
                      </el-divider> -->
                          <span class="logTitle">物流单号：</span>
                          <span class="num">{{ item.logNum }}</span>
                          <el-divider></el-divider>
                        </div>
                        <div class="msg">
                          <!-- <span class="time">2023-05-08 11:15</span> -->
                          <span class="time">{{ item.createdAt }}</span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="name">{{
                            item?.address[0]?.consigneeName
                          }}</span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="orderNum">订单编号：{{ item?.orderNum }}</span>
                          <span class="total">总计：NT$&nbsp;<span class="price">{{
                              item?.totalPrice
                            }}</span></span>
                        </div>
                      </el-col>
                    </el-row>

                    <el-divider></el-divider>

                    <el-row :gutter="20">
                      <el-col :span="18">
                        <div v-for="pro in item.productList"
                             :key="pro.pid"
                             class="productList">
                          <div class="pic">
                            <img :src="pro.detail_img"
                                 :alt="pro.name" />
                          </div>
                          <div class="name">{{ pro.name }}</div>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="button">
                          <div class="b gopay"
                               v-if="hasCoummentP(item)"
                               @click="goComment(item)">
                            发布评价
                          </div>
                          <div class="b gopay"
                               v-if="item.status === '0' || item.status === '1'"
                               @click="goPay(item)">
                            去支付
                          </div>

                          <div class="b orderDetail"
                               @click="goOrderDetail(item)">
                            订单详情
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </section>
                </div>
              </template>

              <!-- 评论订单 -->
              <section v-if="orderActive === 6"
                       class="commentOrder">
                <el-row class="content"
                        :gutter="24">
                  <el-col :span="15">
                    <div class="productList">
                      <div class="pic">
                        <img src="@/images/advertisement.jpeg"
                             alt="" />
                      </div>
                      <div class="name">{{ "item.name" }}</div>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="time">
                      {{ "2023-05-23 11:03:34" }}
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="option">查看评价</div>
                  </el-col>
                </el-row>
              </section>

              <!-- 订单为空时 -->
              <el-empty v-show="!orderList && orderActive != 6"
                        :image-size="250"
                        :description="`还没有${orderHeadNav[orderActive].name}`">
              </el-empty>
            </section>

            <!-- 分页组件 -->
            <el-pagination background
                           v-if="pagination.total > pagination.pageCount"
                           layout="prev, pager, next"
                           :total="pagination.total"
                           :pager-count="pagination.page"
                           :page-size="pagination.pageCount"
                           @current-change="currentChange">
            </el-pagination>
          </div>

          <!-- 编辑用户 -->
          <div class="user-layout"
               v-if="isSwitch && !isSLogistics">
            <div class="upload">
              <i class="el-icon-s-custom upload-icon"
                 title="上传头像"></i>
              <div class="upload-btn">
                <el-button size="mini"
                           type="primary">
                  上传头像
                  <UploadFile class="upload-none"
                              :size="3 * 1024"
                              @upload="handleAvatarSuccess($event)" />
                </el-button>
                <div class="el-upload__tip">
                  只能上传jpg、jpeg、png、gif文件，且不超过3M
                </div>
              </div>
            </div>
            <div class="item"
                 v-for="(item, index) in user"
                 :key="index">
              <label :for="item.id">{{ item?.name }}</label>
              <el-input :placeholder="item.tip"
                        :id="item.id"
                        size="medium"
                        :disabled="item.disabled"
                        v-model="userInfo[item.id]">
                <el-tooltip slot="suffix"
                            :content="
                    index !== 0
                      ? `修改${item?.name}`
                      : `${item?.name}做为登录方法，不可修改`
                  "
                            placement="right">
                  <i class="el-input__icon icon el-icon-edit-outline"
                     @click="editorUserInfo(item)"></i>
                </el-tooltip>
              </el-input>
            </div>
          </div>

          <!-- 物流查询 -->
          <div v-if="isSLogistics"
               class="log">
            <div class="search">
              <el-form :inline="true">
                <!--单号输入框。-->
                <el-form-item class="search-item">
                  <el-input id="YQNum"
                            v-model="num"
                            prefix-icon="el-icon-search"
                            placeholder="输入物流单号"
                            clearable />
                </el-form-item>
                <!--用于调用脚本方法的按钮。-->
                <el-form-item>
                  <el-button type="primary"
                             @click="doTrack"> 查询 </el-button>
                </el-form-item>
              </el-form>
            </div>
            <p class="text">示例：RR123456789CN</p>
            <el-divider content-position="center">{{
              isTrue ? "物流结果" : "物流单号在已完成订单中查看"
            }}</el-divider>
            <!--用于显示查询结果的容器。-->
            <div class="content"
                 id="YQContainer"></div>
          </div>

          <!-- 我的收货地址 -->
          <section v-show="active === 3"
                   class="address">
            <Address />
          </section>

          <!-- 发布商品 -->
          <section v-show="active === 4"
                   class="putProducts">
            <post-trade />
          </section>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import { utils } from "@/utils/utils";

export default {
  name: "Personal",
  components: {
    Product: () => import("@/components/Product.vue"),
    UploadFile: () => import("@/components/UploadFile.vue"),
    PostTrade: () => import("./PostTrade.vue"),
    Address: () => import("@/components/Address.vue"),
  },
  data () {
    return {
      active: 0,
      title: "",
      isSwitch: false,
      isSLogistics: false,
      num: "", //物流单号
      isTrue: false, //展示
      myProductList: [], //我的发布
      //订单数据
      orderActive: 0,
      orderList: [],
      orderHeadNav: [
        {
          name: "有效订单",
          key: 0,
          status: [0, 1, 2, 5], //0创建，1待支付，2待发货，5发货成功
        },
        {
          name: "待支付",
          key: 1,
          status: [0, 1],
        },
        {
          name: "待发货",
          key: 2,
          status: [2],
        },
        {
          name: "已发货",
          key: 3,
          status: [5],
        },
        {
          name: "已完成",
          key: 4,
          status: [6],
        },
        {
          name: "已关闭",
          key: 5,
          status: [3, 4],
        },
        {
          name: "待评价商品",
          key: 6,
          status: [],
        },
      ],
      menu: [
        {
          name: "我的发布",
          icon: "el-icon-user",
          count: 0,
        },
        {
          name: "我的订单",
          icon: "el-icon-tickets",
          count: 0,
        },
        {
          name: "物流查询",
          icon: "el-icon-truck",
          count: "",
        },
        {
          name: "收货地址",
          icon: "el-icon-office-building",
          count: "",
        },
        {
          name: "发布商品",
          icon: "el-icon-position",
          count: "",
        },
        {
          name: "我的收藏",
          icon: "el-icon-star-off",
          count: 0,
        },
        {
          name: "购物车",
          icon: "el-icon-shopping-cart-1",
          count: 0,
        },
        {
          name: "退出",
          icon: "el-icon-setting",
          isLogout: true,
          path: "/login",
        },
      ],
      user: [
        {
          id: "email",
          icon: "el-icon-edit-outline",
          value: "请输入您的邮箱",
          name: "邮箱",
          pattern:
            /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          errorMessage: "请正确填写您的邮箱格式",
          disabled: true,
        },
        {
          id: "nickName",
          icon: "el-icon-edit-outline",
          tip: "请输入您的昵称",
          name: "昵称",
          pattern: /[^\\x00-\\xff]/g,
          errorMessage: "请正确填写您的昵称",
          disabled: true,
        },
        {
          id: "phone",
          icon: "el-icon-edit-outline",
          tip: "请输入您的手机号",
          name: "手机号",
          pattern:
            /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          errorMessage: "请正确填写您的手机号码！",
          disabled: true,
        },
        {
          id: "sex",
          icon: "el-icon-edit-outline",
          tip: "请输入您的性别",
          name: "性别",
          pattern: /^男$|^女$|^保密$/,
          errorMessage: "请正确填写您的性别 - (男、女、保密)",
          disabled: true,
        },
      ],
      pagination: {
        total: 0,
        pageCount: 3,
        page: 5,
        offset: 0,
      },
    };
  },
  computed: {
    ...mapState({
      container: (state) => state.container,
      userInfo: (state) => state.user.userInfo,
      products: (state) => state.product.products,
    }),

    // 状态文字
    statusText () {
      return function (item) {
        let flag = item.status;
        return flag === "0" || flag === "1"
          ? "待支付"
          : flag === "2"
            ? "待发货"
            : flag === "3" || flag === "4"
              ? "已关闭"
              : flag === "5"
                ? "已发货"
                : "已完成";
      };
    },

    // 订单是否有未评价的商品
    hasCoummentP () {
      return function (item) {
        console.log(item);
        let arr = item.productList.filter((item) => this.orderHeadNav[this.orderActive].status.includes(6) && item.is_comment === "0");
        return arr.length;
      };
    },
  },
  async mounted () {
    this.$route.query.active
      ? (this.active = Number(this.$route.query.active))
      : 0;

    await this.initSearchData();
    this.title = this.menu[this.active]?.name;
  },
  methods: {
    ...mapMutations({
      updateTopNav: "header/updateTopNav",
      updateIsLogin: "user/updateIsLogin",
      updateUserInfo: "user/updateUserInfo",
      updateProducts: "product/updateProducts",
      updateCartList: "cart/updateCartList",
      updateCartCount: "cart/updateCartCount",
    }),
    ...mapActions({
      count: "product/count",
      search: "product/search",
      removeProduct: "product/removeProduct",
      shopcartCount: "cart/shopcartCount",
      shopcartProducts: "cart/shopcartProducts",
      likeCount: "product/likeCount",
      findLike: "product/findLike",
      removeLike: "product/removeLike",
      findOrderBySome: "order/findOrderBySome",
      findNoPayOrder: "order/findNoPayOrder",
      updateOrder: "order/updateOrder",
      setUserInfo: "user/setUserInfo",
      getUserInfo: "user/getUserInfo",
    }),

    /**
     * @description 初始化搜索商品数据
     */
    async initSearchData () {
      this.pagination.offset = 0;
      switch (this.active) {
        case 0:
          this.myProducts();
          break;
        case 1:
          this.myOrder();
          break;
        case 2:
          this.myLogistics();
          break;
        case 3:
          this.myAddress();
          break;
        case 4:
          this.putProduct();
          break;
        case 5:
          this.likeProducts();
          break;
        case 6:
          this.shopcart();
          break;
      }
      await this.getProductCount();
    },

    /**
     * @description 退出登录
     */
    logout () {
      this.$confirm("是否退出帐户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          new Promise((resolve, reject) => {
            // 清除cookie
            this.$cookies.keys().map((cookieName) => {
              this.$cookies.remove(cookieName);
            });

            // 清除session
            sessionStorage.clear();

            this.updateIsLogin({
              isLogin: false,
            });
            this.updateUserInfo({
              userInfo: {},
            });

            this.updateCartList({
              cartList: {},
            });
            this.updateCartCount({
              cartCount: 0,
            });

            resolve();
          }).then(() => {
            this.updateTopNav({
              topnav: [
                {
                  name: "登录",
                  key: "1",
                  path: "/login",
                  isShow: false,
                  children: [],
                },
                {
                  name: "注册",
                  key: "2",
                  path: "register",
                  isShow: false,
                  children: [],
                },
              ],
            });

            this.$message({
              type: "success",
              message: "退出成功",
              offset: 100,
            });
            this.$router.push({
              name: "Home",
            });
          });
        })
        .catch(() => {
          this.active = -1;
        });
    },

    /**
     * @description 选择菜单项
     * @param {number} index 选择下标
     * @param {object} item 菜单项
     */
    selectMenu (index, item) {
      if (this.active === index) return;
      this.active = index;
      this.pagination.offset = 0;
      if (item.isLogout) {
        this.logout();
        return;
      }
      this.title = this.menu[this.active]?.name;
      this.pagination.total = this.menu[index].count;
      this.isSwitch = false;
      this.isSLogistics = false;
      switch (this.active) {
        case 0:
          this.myProducts();
          break;
        case 1:
          this.myOrder();
          break;
        case 2:
          this.myLogistics();
          break;
        case 3:
          this.myAddress();
          break;
        case 4:
          this.putProduct();
          break;
        case 5:
          this.likeProducts();
          break;
        case 6:
          this.shopcart();
          break;
      }
    },

    /**
     * @description 显示编辑个人信息
     */
    showEditorView () {
      if (this.title === "编辑个人信息") return;
      this.title = "编辑个人信息";
      this.isSwitch = true;
      this.active = -1;
    },

    /**
     * @description 上传头像
     * @param {e: object} e 事件对象
     */
    handleAvatarSuccess (e) {
      this.setUserInfo({
        userId: this.userInfo.userId,
        avatar: e.base64.replace(/^data:image\/[a-z]+;base64,/, ""),
        imgType: e.type,
      }).then((res) => {
        if (res.data.status === 1042) {
          this.$message({
            type: "success",
            message: "头像上传成功",
            offset: 100,
          });
          this.getUserInfo();
        }
      });
    },

    /**
     * @description 编辑用户信息
     * @param {object} item 编辑项
     */
    editorUserInfo (item) {
      if (item.id === "email") return;
      this.$prompt(item.tip, `${item.name}修改`, {
        confirmButtonText: "保存",
        cancelButtonText: "放弃修改",
        inputPattern: item.pattern,
        inputErrorMessage: item.errorMessage,
      })
        .then(({ value }) => {
          if (this.userInfo[item.id] === value) {
            return this.$message({
              type: "warning",
              message: "该信息不能和原来的一样",
              offset: 100,
            });
          }
          let info = {};
          info[item.id] = value;
          info["userId"] = this.userInfo.userId;
          this.setUserInfo(info)
            .then((res) => {
              if (res.data.status === 1042) {
                this.getUserInfo().then((result) => {
                  this.updateUserInfo({
                    info: result.data.data.result[0],
                  });
                });
                this.$message({
                  type: "success",
                  message: `已成功修改${item.name}`,
                  offset: 100,
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg,
                  offset: 100,
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: res.data.msg,
                offset: 100,
              });
            });
        })
        .catch(() => { });
    },

    /**
     * @description 商品数目
     */
    async getProductCount () {
      this.pagination.total = this.menu[this.active].count;
      // 我的商品
      await this.count({
        status: "上架",
        userId: this.userInfo.userId,
      })
        .then((res) => {
          if (res.data.status == 1080) {
            this.menu[0].count = res.data.result[0].count;
          }
        })
        .catch(() => { });
      // 收藏商品
      await this.likeCount({
        userId: this.userInfo.userId,
      }).then((res) => {
        if (res.data.status === 1166) {
          this.menu[5].count = res.data.result;
        }
      });
      // 购物车商品
      await this.shopcartCount({
        userId: this.userInfo.userId,
      }).then((res) => {
        if (res.data.status === 1176) {
          this.menu[6].count = res.data.result;
        }
      });
    },

    /**
     * @description 用户商品(当前用户发布的)
     */
    myProducts () {
      let params = Object.assign({
        offset: this.pagination.offset,
        count: this.pagination.pageCount,
      });
      params.userId = this.userInfo.userId;
      params.status = "上架";
      this.search(params)
        .then((res) => {
          if (res.data.status === 1034) {
            this.$router.push({
              name: "Login",
            });
          }
          if (res.data.status == 1070) {
            res.data.data.result.map((v, i) => {
              v.img = res.data.data.url + v.img;
              v.detail_img = res.data.data.url + v.detail_img;
              v.avatar = res.data.data.url + v.avatar;
              v.num = i + 1;
              v.updated_at = utils.formatDate(
                v.updated_at,
                "yyyy-MM-dd hh:mm:ss"
              );
            });

            this.myProductList = res.data.data.result;
            this.updateProducts({
              products: res.data.data.result,
            });
          }
        })
        .catch(() => { });
    },

    /**
     * @description 子组件触发事件 删除自己发布的商品 或者取消收藏
     */
    deleteProduct (val) {
      this.active === 0 ? this.delProduct(val) : this.delLike(val);
      console.log(val);
    },

    delProduct (val) {
      this.removeProduct({ pid: val }).then((res) => {
        if (res.data.status === 1110) {
          this.getProductCount();
          this.myProducts();
          this.$message({
            type: "success",
            message: "删除成功",
            offset: 100,
          });
        }
      });
    },

    delLike (val) {
      this.removeLike({
        pid: val,
      }).then((res) => {
        if (res.data.status === 1160) {
          this.getProductCount();
          this.likeProducts();
          this.$message({
            message: "已删除收藏商品",
            type: "success",
            offset: 100,
          });
        }
      });
    },

    /**
     * @description 用户收藏商品
     */
    likeProducts () {
      let params = Object.assign({
        offset: this.pagination.offset,
        count: this.pagination.pageCount,
      });
      params.userId = this.userInfo.userId;
      this.findLike(params).then((res) => {
        if (res.data.status === 1034) {
          this.$router.push({
            name: "Login",
          });
        }
        if (res.data.status === 1165) {
          res.data.result.forEach((v) => {
            v.img = res.data.url + v.img;
            v.detail_img = res.data.url + v.detail_img;
            v.avatar = res.data.url + v.avatar;
            v.updated_at = utils.formatDate(
              v.updated_at,
              "yyyy-MM-dd hh:mm:ss"
            );
          });

          this.myProductList = res.data.result;
          this.updateProducts({
            products: res.data.result,
          });
        }
      });
    },

    /**
     * @description 用户加购商品
     */
    shopcart () {
      this.$router.push({
        name: "Cart",
      });
    },

    /**
     * @description 切换分页数据
     * @param {number} e 页码
     */
    async currentChange (e) {
      // 累加偏移量
      this.pagination.offset = (e - 1) * this.pagination.pageCount;
      if (this.active === 0) {
        this.myProducts();
      }

      if (this.active === 1) {
        // 分页时查询当前子导航下的 status 数据
        this.getOrder(this.orderHeadNav[this.orderActive].status);
      }

      if (this.active === 5) {
        this.likeProducts();
      }
      if (this.active === 6) {
        this.shopcart();
      }
    },

    /**
     * @description 物流状态
     */
    myLogistics () {
      this.isSLogistics = true;
    },

    // 物流工具
    doTrack () {
      if (this.num === "") {
        this.$alert("请输入物流单号", "提示", {
          confirmButtonText: "确定",
        });
        return;
      }

      this.isTrue = true;
      let vm = this;
      YQV5.trackSingle({
        //必须，指定承载内容的容器ID。
        YQ_ContainerId: "YQContainer",
        //可选，指定查询结果高度，最大为800px，默认为560px。
        YQ_Height: 560,
        //可选，指定运输商，默认为自动识别。
        YQ_Fc: "0",
        //可选，指定UI语言，默认根据浏览器自动识别。
        YQ_Lang: "en",
        //必须，指定要查询的单号。
        YQ_Num: vm.num,
      });
    },

    /**
     * @description 我的收货地址
     */
    myAddress () { },

    /**
     * @description 上传商品
     */

    putProduct () { },

    /**
     * @description 查询我的订单
     * @params 所有有效订单 待支付 代发货 已完成 已关闭
     */
    myOrder () {
      this.getOrder();
      this.orderActive = 0;
    },

    getOrder (val) {
      // let orderStatus = [-1, 1];
      let orderStatus;

      val ? (orderStatus = val) : (orderStatus = [0, 1, 2, 5]);

      new Promise((resolve, reject) => {
        this.findOrderBySome({
          status: orderStatus,
          limitNum: this.pagination.pageCount,
          offsetNum: this.pagination.offset,
        }).then((res) => {
          let { result } = res.data;
          this.pagination.total = result?.count;

          // 将每个订单的商品图片路径补全
          let orderArr = result?.orderList;

          orderArr?.forEach((item) => {
            item.createdAt = utils.formatDate(
              item.createdAt,
              "yyyy-MM-dd hh:mm"
            );

            item.productList?.forEach((p) => {
              p.img = res.data.url + p.img;
              p.detail_img = res.data.url + p.detail_img;
              p.avatar = res.data.url + p.avatar;
              p.updated_at = utils.formatDate(
                p.updated_at,
                "yyyy-MM-dd hh:mm:ss"
              );
              p.created_at = utils.formatDate(
                p.created_at,
                "yyyy-MM-dd hh:mm:ss"
              );
            });
          });

          this.orderList = orderArr;
        });
      }).then((res) => { });
    },

    // 关闭订单
    async closeOrder (val) {
      let params = Object.assign({});
      params.status = 4;
      params.orderNum = val.orderNum;
      await this.updateOrder(params);
    },

    // 前往详情页 前先查看订单是否超时
    goOrderDetail (item) {
      let flag =
        utils.timeOut(item.createdAt, 0.5) &&
        (item.status === "0" || item.status === "1");

      // 超时则关闭订单
      if (flag) {
        this.closeOrder(item);
        this.$message("订单已失效");
        this.getOrder(this.orderHeadNav[this.orderActive].status);

        return;
      }

      this.$router.push({
        name: "OrderDetail",
        query: { orderNum: utils.Base64.encode(item.orderNum) },
      });
    },

    // 控制 订单小导航栏
    async choiceOrder (item) {
      if (item.key === 6) {
        // 获取已评价订单
      } else {
        await this.getOrder(item.status);
      }

      this.orderActive = item.key;
    },

    // 去支付
    goPay (val) {
      let flag = utils.timeOut(val.createdAt, 0.5);

      // 超时则关闭订单
      if (flag) {
        this.closeOrder(val);
        this.$message("订单已失效");
        this.getOrder(this.orderHeadNav[this.orderActive].status);

        return;
      }

      this.$router.push({
        name: "Pay",
        query: { orderNum: utils.Base64.encode(val.orderNum) },
      });
    },

    // 取评价界面
    goComment (item) {
      this.$router.push({
        name: "Comment",
        query: {
          data: utils.Base64.encode(JSON.stringify(item)),
        },
      });
    },
  },
};
</script>


<style lang="scss"
       scoped>
@import './personal.scss';
</style>
