<template>
  <footer class="footer"
          :style="{height: footerHeight + 'px'}">
    <p class="copy">{{`Copyright © 2022-${new Date().getFullYear()} 浙江科技学院`}}</p>
  </footer>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'Footer',
  computed: {
    ...mapState({
      footerHeight: state => state.footer.footerHeight
    })
  }
}

</script>

<style lang="scss"
       scoped>
.footer {
  padding: 70px 0;
  background-color: $navBgColor;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .logo {
    width: 160px;
    color: $white;
  }

  .copy {
    text-align: center;
    margin-top: 40px;
    color: $placeholderTextColor;
    font-family: 'Muli', sans-serif;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
