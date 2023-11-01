<template>
  <header
    class="aHeader"
    :style="{ backgroundColor: `${adBg}` }"
    @click="goLink"
    v-show="isShow"
  >
    <div class="imgBox">
      <img
        src="@/assets/testMage/advertisement.jpeg"
        alt=""
        class="aImg"
        @load="imgComepent"
      />
      <i class="cancelBtn el-icon-close" @click.stop="cancel"></i>
    </div>
  </header>
</template>

<script>
export default {
  name: "Advertisement",
  data() {
    return {
      adBg: "rgb(131, 211, 9)",
      isShow: false,
    };
  },
  methods: {
    goLink() {},
    // 取消
    cancel() {
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 300000);
    },
    //图片加载完成再展示
    imgComepent() {
      this.isShow = true;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.aHeader {
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10000;
  overflow: hidden;
  cursor: pointer;
  .imgBox {
    position: relative;
    .aImg {
      height: 100%;
      color: rgb(131, 211, 9);
      background-color: greenyellow;
    }
    .cancelBtn {
      position: absolute;
      top: 4px;
      right: 0;
      font-size: 24px;
      color: rgb(230, 230, 230);
      background: rgba(199, 199, 199, 0.5);
    }
  }
}
</style>