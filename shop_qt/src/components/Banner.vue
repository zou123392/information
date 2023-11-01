<template>
  <div class="homeBanner">
    <div class="banner">
      <!-- Swiper -->
      <swiper :options="swiperOption"
              @swiper="onSwiper"
              @slideChange="onSlideChange"
              @mouseenter.native="mosEnter"
              @mouseleave.native="mosLeave"
              ref="banner"
              class="swiper-p2 swiper-no-swiping">

        <swiper-slide v-for="item in bannerList"
                      :key="item.id">
          <div class="picBox ">
            <div class="picBox__item swiper-lazy "
                 :data-background="item.url">
              <!-- 加载背景 -->
              <div class="my-lazy-preloader"></div>
            </div>

          </div>
        </swiper-slide>

        <!-- 分页器 -->
        <div class="swiper-pagination"
             slot="pagination"></div>

        <!-- 切换按钮 -->
        <div class="swiper-button-prev arrow1"
             slot="button-prev"></div>
        <div class="swiper-button-next arrow2"
             slot="button-next"></div>

      </swiper>
    </div>

  </div>
</template>
<script>

export default {
  name: 'Banner',
  props: {
    bannerList: { type: Array, required: true },
    effect: { type: String, default: 'fade' }
  },
  data () {
    return {
      // swiper 配置
      swiperOption: {
        slidesPerView: 1,
        // 设置轮播可循环
        loop: true,
        // 设置纵向切换
        // direction: "vertical"
        // 切换方式
        effect: this.effect,
        // 设置分页器
        pagination: {
          el: '.swiper-pagination',
          // 设置点击可切换
          clickable: true
        },
        // 设置前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        // 设置自动轮播
        autoplay: {
          // pauseOnMouseEnter: false,
          disableOnInteraction: false,
          delay: 3000 // 2.5秒切换一次
        },
        lazy: {//延迟加载
          loadPrevNext: true,
          preloaderClass: 'my-lazy-preloader',
        },
      },

    }
  },
  methods: {
    onSwiper () {
    },
    onSlideChange () { //swiper-slide切换时触发
    },

    mosEnter () {
      this.$refs.banner.$swiper.autoplay.stop()
    },
    mosLeave () {
      this.$refs.banner.$swiper.autoplay.start()
    }
  }

}
</script>
<style lang="scss" scoped>
// 轮播图
.homeBanner {
  position: relative;
  display: flex;
  justify-content: center;
  height: 460px;
  overflow: hidden;
  // background: pink;
  .banner {
    width: $mainWidth;
    height: 100%;
    cursor: pointer;
    .picBox {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: $headNavItemBg;

      &__item {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;

        .my-lazy-preloader {
          position: absolute;
          width: 100%;
          height: 100%;
          border: none !important;
          background: #e0dede;
        }
      }
    }
  }

  /* swiper 样式 */
  .swiper-p2 {
    position: relative;
    height: 100%;
    --swiper-theme-color: #ffffff; /* 箭头样颜色 */
    --swiper-preloader-color: #00ff33; /* 单独设置预加载圆圈的颜色 */

    .box {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateX(-125%);
      width: 500px;
      height: 50px;
      background: #b5f179;

      /* 箭头样式 */
      .arrow1,
      .arrow2 {
        // display: none;
        position: relative !important;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 600;
        color: #757575;
        width: 25px;
        height: 25px;
        transition: background-color 0.3s ease 0s;
      }
      .arrow1 {
        transform: translate(15px, -50%);
      }
      .arrow2 {
        transform: translate(145px, -50%);
      }
    }

    .arrow1:hover,
    .arrow2:hover {
      font-weight: 600;
      color: white;
      background-color: rgba(80, 78, 78, 0.5);
    }
  }

  :deep(.swiper-pagination) {
    width: auto;
    // padding: 0 15px;
    // margin-right: 25px;
  }
  :deep(.swiper-pagination-clickable .swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 15px;
  }

  :deep(.swiper-pagination-bullet-active) {
    background: $headNavColor-active;
  }

  // // 左右箭头
  :deep(.swiper-button-prev) {
    // width: 50px;
    left: 234px;
    padding: 28px 18px;
    color: #757575;
    // background: pink;
  }
  :deep(.swiper-button-next) {
    // width: 50px;
    padding: 28px 18px;
    color: #757575;
    // background: pink;
  }
  :deep(.swiper-button-prev:after) {
    font-weight: 400 !important;
    font-size: 28px !important;
  }
  :deep(.swiper-button-next:after) {
    font-weight: 400 !important;
    font-size: 28px !important;
  }
  /** 圆圈 */
  :deep(.swiper-container-horizontal > .swiper-pagination-bullets) {
    left: 1080px;
    bottom: 20px;
  }
}
</style>