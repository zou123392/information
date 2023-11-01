<template>
  <main>
    <div v-show="$route.name !== 'Search'"
         class="search">
      <el-form :inline="true">
        <el-form-item class="search-item">
          <el-input v-model="keyWord"
                    prefix-icon="el-icon-search"
                    placeholder="搜索商品"
                    @keyup.enter.native="search()" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="search"> 搜索 </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="search2"
         v-show="$route.name === 'Search'">
      <el-form :inline="true">
        <el-form-item class="search-item">
          <el-input v-model="keyWord"
                    prefix-icon="el-icon-search"
                    placeholder="请输入您要搜索的商品名"
                    @change="search" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @keyup.enter.native="search()">
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>

  </main>

</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "searchInput",
  data () {
    return {
      restaurants: [],
      keyWord: '',
      // searchCondition: {
      //   name: "",
      //   type_id: "-1",
      // },
    };
  },
  computed: {
    ...mapState({
      searchKeyWord: (state) => state.home.searchKeyWord
    }),


  },

  mounted () { },

  watch: {
    searchKeyWord (val) {
      this.keyWord = val
    }
  },

  methods: {
    ...mapMutations({
      updateSearchKeyWord: 'home/updateSearchKeyWord'
    }),
    ...mapActions({}),

    /**
     * @description 搜索
     */
    search () {
      // 去掉空格
      this.updateSearchKeyWord({ 'searchKeyWord': this.keyWord.replace(/\s*/g, "") })
      if (this.$route.name !== 'Search') {
        this.$router.push({
          name: 'Search'
        })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: center;
  background-color: $white;
  padding: 0;
  border-radius: 3px;
  // box-shadow: -1px 3px 6px rgba(0, 0, 0, 0.12);
  // position: sticky;
  // top: -1px;
  // z-index: 9999;

  /deep/ .el-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;

    &.el-form--inline {
      .el-form-item {
        margin-right: 0px;

        &:last-of-type {
          margin-right: 0;
        }
      }
    }

    .el-form-item {
      height: 38px;
      margin-bottom: 0;
      display: flex;
      align-items: center;

      .el-input,
      .el-input__inner {
        width: 190px;
        height: 32px;
        line-height: 40px;
        border-radius: 4px 0 0 4px;
        border-right: none;
        border-color: $headNavColor-active;
        box-sizing: border-box;
      }

      .el-button {
        height: 100%;
        line-height: 32.5px;
        padding: 0 15px;
        border-radius: 0px 4px 4px 0px;
        transform: translate(0px, 1px);
      }
      .el-button--primary {
        height: 33px;
      }
      .el-button--primary {
        background-color: #fe3a3ad8;
        border-color: $subTextColor;
      }
      .el-button--primary:hover {
        background-color: $headNavColor-active;
      }
    }
  }
}

.search2 {
  width: $mainWidth;
  display: flex;
  justify-content: flex-start;
  background-color: $white;
  padding: 40px 190px;
  border-radius: 3px;
  top: -1px;
  z-index: 9999;

  /deep/ .el-form {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.el-form--inline {
      .el-form-item {
        margin-right: 10px;

        &:last-of-type {
          margin-right: 0;
        }
      }
    }

    .el-form-item {
      margin-bottom: 0;
      display: flex;
      align-items: center;

      .el-input,
      .el-input__inner {
        width: 600px;
        height: 50px;
        line-height: 50px;
        border-color: $headNavColor-active;
        box-sizing: border-box;
      }

      .el-button {
        height: 50px;
        padding: 15px 30px;
      }

      .el-button--primary {
        background-color: #fe3a3ad8;
        border-color: $subTextColor;
      }
      .el-button--primary:hover {
        background-color: $headNavColor-active;
      }
    }
  }
}
</style>