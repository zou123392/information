<template>
  <main>
    <div class="leftNav" @mouseenter="enter()" @mouseleave="leave()">
      <ul>
        <li
          v-for="(item, index) in leftNav"
          :key="index"
          class="item"
          :class="{ 'item--active': currentIndex === index }"
          @mouseenter="enterItem(item, index)"
          @mouseleave="leaveItem"
          @click="gosearch(item)"
        >
          <div class="item__text">{{ item.title }}</div>
          <i class="el-icon-arrow-right arrow"></i>
        </li>
      </ul>
      <div
        v-show="isShowSub"
        class="subNav"
        :style="{ width: subWidth + 'px' }"
      >
        <ul v-for="(child, index) in productList" :key="index">
          <li
            v-for="(item, index) in child"
            :key="index"
            class="subNavList"
            @click="goDetail(item)"
          >
            <div class="imgbox">
              <img :src="item.img" :alt="item.name" />
            </div>
            <div class="subNavList__title">{{ item.name }}</div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "LeftNav",
  data() {
    return {
      isShowSub: false,
      baseSubWidth: 265,
      subWidth: 0,
      listcount: 0,
      currentIndex: null,
      timer: null, //定时器
      leftNav: [],
      productList: [],
    };
  },
  methods: {
    ...mapMutations({
      updateDetail: "product/updateDetail",
    }),
    ...mapActions({
      getTypes: "product/getTypes",
      getProductByTypeId: "product/getProductByTypeId",
    }),

    enter() {
      // this.subWidth = this.baseSubWidth * 2
      // this.isShowSub = true
    },
    leave() {
      this.isShowSub = false;
      this.currentIndex = null;
    },

    enterItem(item, index) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getProductByTypeId({ typeId: item.typeId })
          .then((res) => {
            if (res.status === 200) {
              console.log(res.data.result);
              let dataList = res.data.result;
              // let dataList = new Array(13);

              this.productList = [];
              let width = 0;
              let count = 0;

              if (dataList.length > 6) {
                console.log(dataList);
                console.log(dataList.length);
                console.log(18 > dataList.length > 6);
                while (18 > dataList.length && dataList.length > 6) {
                  this.productList.push(dataList.splice(0, 6));
                  console.log(++count, "次", this.productList);
                }

                if (dataList.length > 0) {
                  this.productList.push(dataList);
                }

                console.log(this.productList);
              } else {
                this.productList.push(dataList);
              }

              width = this.baseSubWidth * this.productList.length;

              if (this.productList[0].length === 0) {
                width = 0;
              }

              this.$nextTick(() => {
                console.log(this.productList.length);
                console.log(width);
                this.subWidth = width;
              });

              this.currentIndex = index;
              this.isShowSub = true;
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

        return;
      }, 100);
    },

    leaveItem() {
      clearTimeout(this.timer);
    },

    gosearch(item) {
      this.$router.push({
        name: item.routeName,
      });
    },

    goDetail(item) {
      this.updateDetail({
        detail: item,
      });
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
  computed: {
    ...mapState({
      types: (state) => state.product.types,
    }),

    isActive(index) {
      return function () {
        return this.currentIndex === index;
      };
    },
  },
  created() {
    this.getTypes().then((res) => {
      this.leftNav = res.data.result.splice(0, 9);
      this.leftNav.push({ id: 999, title: "全部商品", routeName: "Search" });
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/comment.scss";
.leftNav {
  position: relative;
  width: 234px;
  height: 460px;
  max-height: 460px;
  padding: 20px 0;
  background: rgba(0, 0, 0, 0.6);

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 42px;
    font-size: 14px;
    font-weight: 600px;
    color: white;
    line-height: 42px;
    padding: 0 20px 0 30px;
    cursor: pointer;
    transition: color 0.2s ease 0s;
    // background: #b2d344;
  }

  .subNav {
    position: absolute;
    top: 0;
    left: 234px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    height: 460px;
    width: auto;
    width: 530px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
    // transition: all 0.2s ease 0s;
    ul {
      min-width: 265px;
      width: 265px;
      border: none;
    }

    background: rgb(255, 255, 255);
    .subNavList {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 265px;
      padding: 18px 20px;
      cursor: pointer;

      .imgbox {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        overflow: hidden;

        img {
          width: 40px;
          margin-right: 12px;
        }
      }

      &__title {
        font-size: 14px;
        font-weight: 600;
        line-height: 40px;
        color: $primaryTextColor;
        padding: 0 5px;
        @include ellipsis(1, nowrap);
        transition: color 0.2s ease 0s;
      }
    }
    .subNavList:hover .subNavList__title {
      color: $headNavColor-active;
    }
  }

  .item--active {
    background-color: $headNavColor-active;
  }
  .subNav--active {
  }
}
</style>