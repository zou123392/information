<template>
  <main>.</main>
</template>

<script>
import { utils } from "@/utils/utils";
export default {
  name: "Comment",
  data() {
    return {
      orderData: [],
    };
  },

  // 订单数据已发送过来
  created() {
    // this.orderData = JSON.parse(utils.Base64.decode(this.$route.query.data));
    // console.log(this.orderData);
  },
};
</script >

<style lang="scss" scoped>
</style>