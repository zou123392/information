<template>
  <div class="headerMain">
    <div
      class="header"
      :style="{ height: `${$route.name === 'Search' ? 125 + 'px' : ''}` }"
    >
      <div class="logo" @click="$router.push({ name: 'Home' })">LOGO</div>
      <template v-if="$route.name !== 'Search'">
        <!-- 导航 -->
        <nav class="navBox">
          <div @mouseleave="leave" class="navBoxCenter">
            <img src="@/assets/testMage/gif.gif" class="gif" />
            <!--导航列表  -->

            <div v-for="item in nav" :key="item.typeId" class="littleBox">
              <div @mouseover="enter(item)" class="text">{{ item.title }}</div>
            </div>
            <!-- 下拉栏 -->
            <section>
              <nav :class="{ 'subNav--active': isShowSubNav }" class="subNav">
                <div class="subNav__box">
                  <div
                    v-for="item in productList"
                    :key="item.pid"
                    class="subNav__box__item"
                    @click="goDetail(item)"
                  >
                    <div class="boxImg">
                      <img :src="item.img" :alt="item.name" />
                    </div>
                    <p class="boxTitle">{{ item.name }}</p>
                    <div class="price">NT$&nbsp;{{ price(item) }}</div>
                  </div>
                </div>
              </nav>
            </section>
          </div>
        </nav>
        <div v-show="$route.name !== 'Personal'" class="search">
          <search-input />
        </div>
        <div class="language"></div>
      </template>
      <template v-else>
        <search-input />
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
import SearchInput from "./searchInput.vue";
export default {
  name: "Header",
  data() {
    return {
      isShowSubNav: false,
      nav: [],
      productList: [],
      active: "0",
      timer: null,
    };
  },
  computed: {
    ...mapState({
      types: (state) => state.product.types,
    }),

    price() {
      return function (item) {
        return utils.formatPrice((item.discount / 10) * item.price, 0);
      };
    },
  },

  methods: {
    ...mapMutations({
      updateDetail: "product/updateDetail",
    }),
    ...mapActions({
      getProductByTypeId: "product/getProductByTypeId",
      getTypes: "product/getTypes",
    }),

    enter(item) {
      clearTimeout(this.timer);
      setTimeout(() => {
        this.getProductByTypeId({ typeId: item.typeId })
          .then((res) => {
            if (res.status === 200) {
              this.productList = res.data.result;
              if (this.productList.length > 6) {
                this.productList = this.productList.splice(0, 6);
              }
            }
          })
          .then(() => {
            if (this.productList.length !== 0) {
              this.isShowSubNav = true;
            }
            if (this.productList.length === 0) {
              setTimeout(() => {
                this.isShowSubNav = false;
              }, 0);
            }
          });
      }, 200);
    },

    leave() {
      setTimeout(() => {
        this.isShowSubNav = false;
      }, 210);
    },
    goDetail(item) {
      this.updateDetail({
        detail: item,
      });
      this.isShowSubNav = false;
      let routeName = "";
      item.is_self === "1" ? (routeName = "Detail2") : (routeName = "Detail");

      this.$router.push({
        name: routeName,
        query: {
          pid: utils.Base64.encode(item.pid),
        },
      });
    },
  },
  components: { SearchInput },

  created() {
    this.getTypes().then((res) => {
      this.nav = res.data.result.splice(0, 5);
    });
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.headerMain {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  border-top: 1px solid rgba(176, 176, 176, 0.6);

  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    // width: 100%;
    width: 1250px;
    height: 85px;
    .logo {
      font-size: 32px;
      font-weight: 700px;
      cursor: pointer;
    }

    .navBox {
      // display: flex;
      overflow: hidden;
      width: 900px;
      .navBoxCenter {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 44px;
        height: 100%;
        max-width: 1000px;
        .gif {
          box-sizing: border-box;
          height: 100%;
          cursor: pointer;
        }
        .littleBox {
          height: 100%;
          padding: 0 15px;
          .text {
            font-size: 16px;
            font-weight: 500;
            line-height: 85px;
            cursor: pointer;
            transition: all 0.2s ease 0s;
          }
          .text:hover {
            color: $headNavColor-active;
          }
        }

        /** 下拉栏 */
        section {
          position: absolute;
          top: 70px;
          left: 0;
          width: 100%;
          height: auto;
          background-color: $subNavBg;
          box-shadow: 2px 7px 16px 1px #6e696930;

          z-index: 2000;
          .subNav {
            display: flex;
            justify-content: center;
            width: 100%;
            height: 0;
            margin: 0 auto;
            overflow: hidden;
            transition: all 0.2s ease 0s;
            background-color: $subNavBg;

            &__box {
              display: flex;
              width: $mainWidth;

              &__item {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                width: 16.5%;
                height: auto;
                padding: 10px 0;
                overflow: hidden;
                cursor: pointer;

                .boxImg {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 180px;
                  height: 110px;
                  overflow: hidden;
                  img {
                    height: 100%;
                  }
                }
                .boxTitle {
                  text-align: center;
                  line-height: 22px;
                  font-size: 16px;
                  font-weight: 400;
                  padding: 10px 0;
                }
                .price {
                  font-size: 16px;
                  line-height: 16px;
                  color: $headNavColor-active;
                }
              }
            }
          }

          /** 激活样式 */
          .text--active {
            color: $headNavColor-active;
          }
          .subNav--active {
            border-top: 1px solid rgba(176, 176, 176, 0.6);
            height: 200px;
          }
        }
      }
    }

    .search {
      transform: translate(0, 0);
    }
  }
}
</style>