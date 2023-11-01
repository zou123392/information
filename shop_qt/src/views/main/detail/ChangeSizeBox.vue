<template>
  <main class="changeSize">
    <div class="box"
         :style="{ width: width + 'px', height: height + 'px' }"
         @mousemove="move($event)"
         @mouseleave="leave">
      <img class="boxImg"
           :src="pic"
           alt="" />
      <div v-show="isShow"
           ref="check"
           :style="{
          top: top + 'px',
          left: left + 'px',
          width: watchWidth + 'px',
          height: watchWidth + 'px',
        }"
           class="check"></div>
    </div>

    <div v-show="isShow"
         class="watchBox"
         :style="{ width: watchBox.width + 'px', height: watchBox.height + 'px' }">
      <img ref="watchBoxImg"
           :style="{
          width: imgWidth + 'px',
          height: imgHeight + 'px',
        }"
           class="watchBoxImg"
           :src="pic"
           alt="" />
    </div>
  </main>
</template>
<script>
export default {
  name: "ChangeSizeBox",
  data () {
    return {
      isShow: false,
      check: null,
      watchWidth: 250, //需要放大的区域
      cursorMask: { transform: "" },
      top: 0,
      left: 0,
      // 右边固定区域大小
      height: 520,
      width: 520,
      watchBox: {
        //左边放大盒子
        width: 650,
        height: 650,
      },
      locked: false,
    };
  },
  props: {
    pic: {
      required: true,
    }

  },
  methods: {
    move (e) {
      if (this.locked) return;
      this.locked = true;
      this.isShow = true;
      const { offsetX, offsetY } = e;
      setTimeout(() => {
        this.left =
          offsetX - this.watchWidth / 2 > 0
            ? offsetX + this.watchWidth / 2 >= this.width
              ? this.width - this.watchWidth
              : offsetX - this.watchWidth / 2
            : 0;
        this.top =
          offsetY - this.watchWidth / 2 > 0
            ? offsetY + this.watchWidth / 2 >= this.height
              ? this.height - this.watchWidth
              : offsetY - this.watchWidth / 2
            : 0;

        this.$refs.watchBoxImg.style.top =
          (-this.watchBox.height / this.watchWidth) * this.top + "px";
        this.$refs.watchBoxImg.style.left =
          (-this.watchBox.width / this.watchWidth) * this.left + "px";
        this.locked = false;
      }, 0);
    },

    leave () {
      this.top = 0;
      this.left = 0;
      this.isShow = false;
    },
  },
  computed: {
    //放大区域图片
    imgWidth () {
      return (this.width / this.watchWidth) * this.watchBox.width;
    },
    imgHeight () {
      return (this.height / this.watchWidth) * this.watchBox.height;
    },
  },
};
</script>
<style lang="scss" scoped>
.changeSize {
  display: flex;
  .box {
    position: relative;
    width: 300px;
    height: 300px;
    border: 1px solid rgb(152, 152, 152);
    cursor: move;

    .boxImg {
      width: 100%;
      height: 100%;
    }
    .check {
      position: absolute;
      width: 50px;
      height: 50px;
      background-color: rgba(139, 137, 137, 0.5);
      // border: 1px solid rgb(83, 83, 83);
      /** 穿透，没有这会卡顿 （相当于看得见摸不着） */
      pointer-events: none;
      cursor: move;
    }
  }

  .watchBox {
    position: relative;
    width: 200px;
    height: 200px;
    overflow: hidden;
    margin-left: 1px;
    border: 1px solid rgb(202, 199, 199);
    background: #ffffff;

    .watchBoxImg {
      position: absolute;
      top: 0;
      left: 0;
      width: 0px;
      height: 0px;
    }
  }
}
</style>