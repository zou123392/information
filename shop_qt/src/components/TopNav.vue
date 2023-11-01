<template>
  <!-- 顶部导航 -->
  <div class="top">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-house"></i>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.meta.name !== '首页'">
        {{ `${$route.meta.name}` }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="loginAndRegister">
      <span :class={islogin:!isLogin,login:true}
            @click="goRoute('Login')">你好，{{ `${isLogin ? userInfo.nickName : '请登录'}` }}</span>
      <span class="register"
            v-if="!isLogin"
            @click="goRoute('Register')">免费注册</span>
      <template v-if="isShow">
        <span v-for="item in topNav"
              :key="item.value"
              class="topNav">{{ item.value }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'TopNav',
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.user.isLogin,
      userInfo: state => state.user.userInfo,
      topNav: state => state.header.topNav
    }),

    isShow () {
      return this.isLogin || document.cookie
    }
  },
  methods: {
    /**
     * @description 路由跳转
    */
    goRoute (route) {
      if (this.isLogin) return
      this.$router.push({ name: route })
    },

  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/comment.scss';
.top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  background-color: $navBgColor;
  /deep/ .el-breadcrumb {
    width: 750px;
    background-color: $navBgColor;
    font-size: 14px;
    padding: 3px 10px;
  }
  /deep/ .el-breadcrumb__item > .el-breadcrumb__inner {
    color: $white;
  }
  /deep/.el-breadcrumb__inner.is-link {
    font-weight: 700;
    color: rgb(255, 255, 255);
    cursor: pointer;
  }
  /deep/ .el-breadcrumb__item > .el-breadcrumb__separator {
  }

  .loginAndRegister {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 270px;
    padding: 3px 10px;
    font-size: 14px;
    color: $white;
    overflow: hidden;
    cursor: pointer;
    .login {
      text-align: right;
      width: 40%;
      @include ellipsis(1, nowrap);
    }
    .islogin:hover {
      color: rgb(199, 30, 30);
    }
    .register {
      margin: 0 20px;
      color: rgb(199, 30, 30);
    }

    .topNav {
      margin: 0 5px;
      width: auto;
      overflow: hidden;
    }
    .topNav:hover:nth-child(odd) {
      color: rgb(199, 30, 30);
    }
  }
}
</style>