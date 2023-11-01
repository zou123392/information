<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "App",

  methods: {
    ...mapMutations({
      updateWindowWidth: "updateWindowWidth",
      updateWindowHeight: "updateWindowHeight",
      updateWindowScrollWidth: "updateWindowScrollWidth",
      updateWindowScrollHeight: "updateWindowScrollHeight",
    }),
  },

  watch: {
    $route: function (to, from) {
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
  },

  mounted() {
    this.updateWindowWidth({
      w: window.innerWidth,
    });
    this.updateWindowHeight({
      h: window.innerHeight,
    });
    window.onresize = () => {
      this.updateWindowScrollWidth({
        sw: window.innerWidth,
      });
      this.updateWindowScrollHeight({
        sh: window.innerHeight,
      });
    };
  },
};
</script>

<style lang="scss">
#nprogress .bar {
  background: $headNavColor-active !important;
  z-index: 9999 !important;
}

#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 2px;
}

.atuo-img {
  display: block;
  width: 100%;
}

.box-shadow {
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}

.widget {
  background: $white;
  box-shadow: 0px 1px 3px 0px rgba($color: $black, $alpha: 0.1);
  padding: 25px 30px 30px;
  margin-bottom: 30px;
  border-radius: 2px;
}
</style>
