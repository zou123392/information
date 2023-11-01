<template>
  <div class="main"
       :style="{ position: `${isTop ? 'fixed' : 'relative'}` }">
    <div class="headNav">
      <!-- 左边 -->
      <div class="headNav__left">
        <nav class="toHome">
          <nav @click="$router.push({ name: 'Home' })">首页</nav>
          <i v-if="$route.meta.name !== '首页'">&nbsp;/&nbsp;{{ `${$route.meta.name}` }}</i>
        </nav>
      </div>
      <!-- 右边  `${isLogin ? loginList : list}`-->
      <div class="headNav__right">
        <div v-for="item in topnav"
             :key="item.key"
             class="box"
             :class="{ 'is--haveChild': item.isShow }"
             v-show="(!isTop && $route.name !== 'Personal') || $route.name === 'Search'"
             @mouseenter="enter(item)"
             @mouseleave="leave(item)">
          <div class="oneBox"
               @click="fatherNav(item)">
            <div class="box__text">{{ item.name }}</div>
            <i v-if="item.children?.length"
               class="el-icon-arrow-down box__arrow"></i>
          </div>

          <div :class="{ 'Cnav--active': item.key == navActive }"
               v-if="item.children?.length"
               class="box__Cnav">
            <ul>
              <li v-for="child in item.children"
                  :key="child.key"
                  @click.stop="goLink(child)">
                {{ child.name }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 顶部 -->
        <div v-show="(isTop || $route.name === 'Personal') && $route.name !== 'Search'"
             class="topInput">
          <el-input v-model="keyWord"
                    prefix-icon="el-icon-search"
                    placeholder="搜索商品"
                    clearable
                    @change="search" />
        </div>

        <!-- 消息 -->
        <div class="msgcontent"
             v-show="$route.name !=='Talk' && (userInfo && isLogin)">

          <el-badge is-dot
                    v-if="UnTalkCount>0">
            <i class="el-icon-message-solid msg"
               @click="goMsg"></i>
          </el-badge>
          <i class="el-icon-message-solid msg"
             v-else
             @click="goMsg"></i>

        </div>
        <!-- 小购物车 -->
        <div class="cartNav"
             @mouseenter="enterCart"
             @mouseleave="leaveCart">
          <div class="twoBox">
            <i class="cart"
               :class="
                cartCount > 0
                  ? 'el-icon-shopping-cart-full'
                  : 'el-icon-shopping-cart-2'
              "></i>
            <div class="twoBox__text">
              购物车（ {{ `${cartCount > 0 ? cartCount : 0}` }} ）
            </div>
          </div>
          <div class="cartList"
               :class="{ 'cart--active': isOpen }">
            <div class="littleProduct">
              <i v-show="isLoding"
                 class="el-icon-loading loding"></i>
              <littleProduct v-if="cartCount > 0 && !isLoding"></littleProduct>

              <div v-else
                   class="empty">
                您的购物车还没有任何东西
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import littleProduct from "@/components/littleProduct.vue";
import { mapMutations, mapState, mapActions } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "headNav",
  data () {
    return {
      // searchKeyWord: "",
      keyWord: '',
      isTop: false,
      isOpen: false,
      isLoding: false,
      navActive: -1,
      user: [],
      list: [],
      // cartList: [],
      pagination: {
        //分页组件
        total: 0,
        pageCount: 4,
        page: 5,
        offset: 0,
      },
      beforeLonginList: [
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
      loginList: [
        {
          name: "用户名",
          key: "0",
          path: "/personal",
          isShow: true,
          children: [
            {
              name: "个人中心",
              key: 0,
              path: "/personal",
            },
            {
              name: "发布商品",
              key: 4,
              path: "/personal",
            },
            {
              name: "物流查询",
              key: 2,
              path: "/personal",
            },
            {
              name: "退出登录",
              key: 5,
              isLogout: true,
              path: "/home",
            },
          ],
        },
        {
          name: "语言",
          key: "2",
          isShow: true,
          path: "",
          children: [
            {
              name: "中文",
              key: "1",
              path: "",
            },
            {
              name: "English",
              key: "2",
              path: "",
            },
          ],
        },
        {
          name: "我的订单",
          key: "1",
          path: "/personal",
          isShow: false,
          children: [],
        },
      ],
    };
  },
  components: { littleProduct },
  computed: {
    ...mapState({
      topnav: (state) => state.header.topnav,
      isLogin: (state) => state.user.isLogin,
      userInfo: (state) => state.user.userInfo,
      cartList: (state) => state.cart.cartList,
      cartCount: (state) => state.cart.cartCount,
      searchKeyWord: (state) => state.home.searchKeyWord,
      UnTalkCount: (state) => state.talk.UnTalkCount,
    }),
  },
  methods: {
    ...mapMutations({
      updateTopNav: "header/updateTopNav",
      updateIsLogin: "user/updateIsLogin",
      updateUserInfo: "user/updateUserInfo",
      updateCartList: "cart/updateCartList",
      updateCartCount: "cart/updateCartCount",
      updateSearchKeyWord: 'home/updateSearchKeyWord'
    }),
    ...mapActions({
      shopcartCount: "cart/shopcartCount",
      shopcartProducts: "cart/shopcartProducts",
      likeCount: "product/likeCount",
      getUserInfo: "user/getUserInfo",
    }),

    search () {
      if (this.$route.name !== 'Search') {
        this.$router.push({
          name: "Search",
          // query: { keyWord: this.searchKeyWord },
        });
      }

      this.updateSearchKeyWord({ 'searchKeyWord': this.keyWord.replace(/\s*/g, "") })
      this.keyWord = ''
    },

    login () {
      //登陆成功替换导航
      // 没有登录时
      setTimeout(() => {
        console.log(this.userInfo && this.isLogin);
        if (this.userInfo && this.isLogin) {
          this.loginList[0].name = this.userInfo.nickName;
          this.updateTopNav({ topnav: this.loginList });
          console.log(this.topnav);
        } else {
          this.updateTopNav({ topnav: this.beforeLonginList });
        }
      }, 400);
    },

    logout () {
      //退出登录事件
      this.$confirm("是否退出帐户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //还原导航
          this.updateTopNav({ topnav: this.beforeLonginList });

          this.updateIsLogin({
            isLogin: false,
          });
          this.updateUserInfo({
            userInfo: {},
          });
          this.updateCartList({
            cartList: {}
          })
          this.updateCartCount({
            cartCount: 0
          })
          // 清除cookie
          this.$cookies.keys().map((cookieName) => {
            this.$cookies.remove(cookieName);
          });

          // 清除session
          sessionStorage.clear();

          this.$message({
            type: "success",
            message: "退出成功",
            offset: 100,
          });
          if (this.$route.name === "Home") return;
          this.$router.push({
            path: "/home",
            query: {},
          });
        })
        .catch(() => { });
    },

    fatherNav (item) {
      if (item.path !== "") {
        this.$router.push({ path: item.path, query: { active: item.key } });
        return;
      }
    },

    goLink (item) {
      //子菜单处理事件
      this.navActive = -1;
      if (item.isLogout) {
        this.logout();

        return;
      }

      if (item.path !== "" && item.path !== this.$route.path)
        this.$router.push({
          path: item.path,
          query: { active: item.key },
        });
    },

    // 进入导航栏
    enter (item) {
      this.navActive = item.key;
    },

    // 离开导航栏
    leave () {
      this.navActive = -1;
    },

    // 前往消息页
    goMsg () {
      if (this.userInfo && this.isLogin) {
        this.$router.push({ name: 'Talk' })
      } else {
        this.$message({
          type: "warning",
          message: "请先登录",
          offset: 100,
        });
      }
    },

    enterCart () {
      this.isOpen = true;
      this.isLoding = true;
      let params = Object.assign({
        offset: this.pagination.offset,
        count: this.pagination.pageCount,
      });
      params.userId = this.userInfo?.userId;
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
        }

        this.isLoding = false;
      });
    },

    // 离开导航栏
    leaveCart () {
      this.isOpen = false;
    },

    scrolling () {
      //监听滚动条
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop >= 70) {
        this.isTop = true;
      }
      if (scrollTop < 70) {
        this.isTop = false;
      }
    },

    init () {
      this.shopcartCount().then((res) => {
        if (res.data.status === 1176) {
          this.updateCartCount({ cartCount: res.data.result });
        }
      });
    },
  },
  watch: {
    userInfo () {
      if (this.userInfo?.nickName) {
        this.user = this.userInfo;
      }
    },
  },
  created () {
    // this.cartCont = this.shopcartCount()
  },
  mounted () {
    this.login();
    this.init();
    // setInterval(() => { console.log(this.UnTalkCount) }, 2000)
    // 监听页面滚动事件
    window.addEventListener("scroll", this.scrolling);
  },
  beforeDestroy () {
    window.removeEventListener("scroll", this.scrolling);
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/comment.scss';
.main {
  display: flex;
  justify-content: center;
  background-color: $headNavBg;
  box-sizing: border-box;
  width: 100%;
  z-index: 2000;

  .headNav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 1250px;
    height: auto;
    font-size: 12px;
    // font-weight: 300;
    color: $headNavColor;
    background-color: $headNavBg;
    z-index: 2000;

    /** 左边 */
    &__left {
      color: $headNavColor;
      .toHome {
        cursor: pointer;
        display: flex;
      }
    }

    /** 右边 */
    &__right {
      display: flex;
      height: 28px;
      width: auto;
      color: $headNavColor;
    }
    /** 顶部输入框 */
    .topInput {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: auto;
      margin: 0 20px;
      /deep/ .el-input,
      .el-input__inner {
        width: 150px;
        // height: 25px !important;
        font-size: 12px;
        line-height: 40px;
        border-radius: 4px 0 0 4px;
      }
      /deep/.el-input--prefix .el-input__inner {
        height: 22px;
      }
    }

    .box {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: $headNavColor;
      padding: 0 20px;
      cursor: pointer;
      transition: all 0.2s ease 0s;
      // transition: all 0.2s 0s ease;
      // background: $headNavColor-active;
      .oneBox {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .oneBox:hover {
        color: $headNavColor-active;
      }
      &__text {
        text-align: center;
        @include ellipsis(1, nowrap);
        max-width: 100px;
        // height: 10px;
        // color: pink;
      }
      &__arrow {
        // color: $headNavColor;
        margin-left: 7px;
      }
      &__Cnav {
        position: absolute;
        top: 28px;
        left: 0;
        width: auto;
        // opacity: 0;
        height: 0;
        // min-width: 170px;
        // height: auto;
        color: $headNavColor;
        overflow: hidden;
        box-shadow: 2px 2px 3px $headNavColor;
        background-color: $headNavItemBg;
        transition: height 0.3s ease 0s;

        ul {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          width: 100%;

          li {
            width: 100%;
            height: 30px;
            text-align: left;
            line-height: 30px;
            padding: 0 20px;
            overflow: hidden;
          }
          li:hover {
            background-color: $headNavItemBg-active;
            color: $headNavColor-active;
          }
        }
      }
      .is-active {
        background-color: $headNavBg-active;
        color: $headNavColor-active;
      }
      .Cnav--active {
        // opacity: 1;
        min-width: 170px;
        height: auto;
        padding: 10px 0;
      }
    }
    .haveChild:hover {
      background-color: $headNavBg-active;
    }

    // .box:hover::before {
    //   height: 0;
    // }
    .box::before {
      content: '';
      width: 1px;
      height: 12px;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(100%, -50%);
      background-color: $headNavColor;
    }

    /** 购车 */
    .cartNav {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      height: auto;
      cursor: pointer;
      z-index: 2001;
      @include scrollbar(4px, 100%);

      .twoBox {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 20px;
        // background: pink;

        .cart {
          font-size: 18px;
          margin-right: 7px;
        }
      }

      .twoBox:hover {
        color: $headNavColor-active;
      }

      .cartList {
        position: absolute;
        top: 28px;
        right: 0;
        width: 300px;
        height: 0;
        box-sizing: border-box;
        // height: auto;
        overflow: hidden;
        background: white;
        box-shadow: -4px 5px 11px 0px #c9c3c3;
        transition: all 0.2s ease 0s;

        .littleProduct {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          min-height: 100px;
          .loding {
            font-size: 24px;
            color: $headNavColor-active;
          }
          .empty {
            font-size: 18px;
          }
        }
      }
      .cart--active {
        min-height: 100px !important;
        height: auto !important;
      }
    }
    .cartNav:hover {
      background-color: $headNavBg-active;
    }

    /** 消息 */
    .msgcontent {
      text-align: center;
      width: 50px;
      height: auto;
      /deep/.el-badge__content.is-fixed {
        position: absolute;
        top: 7px;
        right: 12px;
      }
      .msg {
        position: relative;
        height: 28px;
        width: 28px;
        font-size: 18px;
        line-height: 28px;
        text-align: center;
        cursor: pointer;
      }
    }

    // .cartNav:hover .cartList {
    //   // display: block;
    // }
  }

  // .is--haveChild {
  //   // background: #f89f9f;
  // }
  .is--haveChild:hover {
    background: #ffffff;
  }
}
</style>