<template>
  <main class="detail">
    <div class="content">
      <!-- 左边图片 -->
      <div class="left">
        <change-size-box :pic="message.detail_img"
                         class="cBox" />
      </div>

      <!-- 右边 -->
      <div class="right">
        <Card :message="message" />
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
import ChangeSizeBox from "./ChangeSizeBox.vue";
import Card from "./Card.vue";
export default {
  name: "Detail2",
  components: { ChangeSizeBox, Card },
  data () {
    return {
      message: [],
    };
  },

  computed: {
    ...mapState({
      container: (state) => state.container,
      // detail: state => state.product.detail,
      userInfo: (state) => state.user.userInfo,
    }),
  },

  watch: {
    '$route': function () {
      this.init()
    }
  },

  methods: {
    ...mapMutations({
      updateDetail: "product/updateDetail",
      updateActive: "header/updateActive",
    }),
    ...mapActions({
      getProductById: "product/getProductById",
      getUserInfo: "user/getUserInfo",
      like: "product/like",
      removeLike: "product/removeLike",
      findLike: "product/findLike",
      addShopcart: "cart/addShopcart",
      removeShopcart: "cart/removeShopcart",
      shopcartProducts: "cart/shopcartProducts",
    }),

    init () {
      let pid = utils.Base64.decode(this.$route.query.pid)
      this.getProductById({ pid }).then((res) => {
        console.log(res);
        if (res.data.status === 1070) {
          this.message = res.data.data.result[0]
          console.log(this.message);
        }
      })
    }
  },

  async created () {
    this.init()
  },
  mounted () { },
};
</script>

<style lang="scss" scoped>
@import './detail2.scss';
</style>