<template>
  <main class="search">
    <div class="top"
         v-show="!searchKeyWord">
      <div class="box"
           :class="{'open--active':isOpen}">
        <div class="kinds">分类</div>
        <div class="all"
             @click="checkAll"
             :class="{'type--active':typeActive === -1}">全部</div>
        <div class="kindBox">
          <span v-for="(item,index) in typeArr"
                :key="item?.id"
                @click="checkType(item,index)"
                :class="{'type--active':typeActive === index}">{{ item?.title }}</span>
        </div>
        <div class="arrow">
          <i class=" icon"
             :class="isOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
             @click="open"></i>
        </div>
      </div>
    </div>

    <div class="resultbox">
      <div class="searchTop"
           v-show="searchKeyWord">搜索『<span>{{searchKeyWord}}</span>』的結果</div>
    </div>

    <div class="main">
      <div class="content">
        <div class="orderList">
          <div class="left">
            <!-- <div class="left__item">新品</div>
            <div class="left__item">推荐</div> -->
            <div class="left__item"
                 v-for="item in smallNav"
                 :key="item.key"
                 :class="{ 'leftItem--active': item.key === smallActive }"
                 @click="sortFun(item)">
              <div class="title">{{ item.title }}</div>
              <i v-if="item.key > 1"
                 class="sort"
                 :class="`${sort ? 'el-icon-top' : 'el-icon-bottom'}`"></i>
            </div>
          </div>
          <div class="right">
            <el-checkbox v-model="nav.checked"
                         v-for="nav in rigthNav"
                         :key="nav.key"
                         @change="checkSelf(nav)">{{ nav.title }}</el-checkbox>
            <!-- <el-checkbox v-model="checked2">显示特惠商品</el-checkbox> -->
          </div>
        </div>

        <div class="cardList">
          <div class="cardList__item"
               v-for="item in searchList"
               :key="item.pid">
            <card :cardData="item" />
          </div>

          <div v-show="searchList?.length === 0"
               class="empty">
            <el-empty :image-size="250"
                      description="空空如也"></el-empty>
          </div>
        </div>

        <!-- 分页组件 -->
        <el-pagination background
                       v-if="pagination.total > pagination.pageCount"
                       layout="prev, pager, next"
                       :total="pagination.total"
                       :pager-count="pagination.page"
                       :page-size="pagination.pageCount"
                       @current-change="currentChange">
        </el-pagination>
      </div>
    </div>
  </main>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import { utils } from "@/utils/utils";
import card from "./card.vue";

export default {
  name: "search",
  data () {
    return {
      isOpen: false,
      typeActive: -1,
      typeArr: [],
      checked1: false,
      checked2: false,
      sort: true,
      // searchKeyWord: "",
      searchList: [],
      smallActive: "0", //排序
      smallNav: [
        {
          title: "新品",
          key: "0",
          news: "1",
        },
        {
          title: "推荐",
          key: "1",
          recommend: "1",
        },
        {
          title: "价格",
          key: "2",
          price: "1",
        },
      ],
      rigthNavActive: '1',
      rigthNav: [{
        title: '显示私人商品',
        key: '0',
        isSelf: '1',
        checked: false,
      }, {
        title: '一天内发布',
        key: '2',
        oneDay: '',
        checked: false,
      },],
      pagination: {
        total: 0,
        pageCount: 12,
        page: 5,
        offset: 0,
      },
    };
  },
  components: { card },

  computed: {
    ...mapState({
      searchKeyWord: (state) => state.home.searchKeyWord,
      types: (state) => state.product.types
    }),
  },

  watch: {
    searchKeyWord (val) {
      this.init()
    }
  },

  methods: {
    ...mapMutations({
      // updateSearchKeyWord: 'home/updateSearchKeyWord'
    }),
    ...mapActions({
      searchInput: "product/searchInput",
      getTypes: "product/getTypes",
    }),

    open () {
      this.isOpen = !this.isOpen
    },

    checkAll () {
      if (this.typeActive === -1) return
      this.init()
      this.typeActive = -1
    },

    // 选择types
    checkType (item, index) {
      if (this.typeActive === index) return
      let params = {}
      params.typeId = item.typeId
      this.init(params)
      this.typeActive = index
    },

    // 排序
    sortFun (val) {
      if (val.key === this.smallActive && val.key !== '2') return
      let pArr = JSON.parse(JSON.stringify(val))
      this.smallActive = pArr.key;
      new Promise((resolve, reject) => {
        if (pArr.key === "2") {
          //价格需要控制
          this.sort ? pArr.price = 2 : pArr.price = 1
          this.sort = !this.sort
        }
        delete pArr.title;
        delete pArr.key;

        // let now = new Date().getTime()
        // let oneDay = 24 * 60 * 60 * 1000
        // let diff = now - oneDay
        // let diffTime = new Date(diff)

        // // 右侧 勾选状态下的情况
        // if (this.rigthNav[0].checked || this.rigthNav[1].checked) {
        //   this.rigthNav[1].checked ? pArr.oneDay = diffTime : ''
        //   this.rigthNav[0].checked ? pArr.isSelf = '1' : ''
        //   // this.init(pArr);
        //   // return
        // }

        this.init(pArr);
      });
    },

    // 过滤官方 与 一天内发布
    checkSelf (item) {
      new Promise((resolve, reject) => {
        // 加上左侧的条件
        let params = JSON.parse(JSON.stringify(this.smallNav[this.smallActive]))
        // let now = new Date().getTime()
        // let oneDay = 24 * 60 * 60 * 1000
        // let diff = now - oneDay
        // let diffTime = new Date(diff)

        if (item.checked) {
          if (params.key === "2") {
            //价格需要控制
            this.sort ? params.price = 2 : params.price = 1
          }
          delete params.title
          delete params.key

          // 勾选的条件
          // if (item.key === '0') {
          //   params.isSelf = item.isSelf
          // } else {
          //   params.oneDay = diffTime
          // }
        }

        // 勾选状态下的情况
        // if (this.rigthNav[0].checked || this.rigthNav[1].checked) {
        //   this.rigthNav[1].checked ? params.oneDay = diffTime : ''
        //   this.rigthNav[0].checked ? params.isSelf = '1' : ''
        //   this.init(params);
        //   return
        // }

        this.init(params);
      });

      // console.log(item.checked);
      // // item.checked = !item.checked
      // console.log(item);
      // this.init()
    },

    // sort 是与数据库匹配的对象
    init (sort) {
      let params = Object.assign({
        offset: this.pagination.offset,
        count: this.pagination.pageCount,
      });

      let now = new Date().getTime()
      let oneDay = 24 * 60 * 60 * 1000
      let diff = now - oneDay
      let diffTime = new Date(diff)

      // 右侧 勾选状态下的情况
      if (this.rigthNav[0].checked || this.rigthNav[1].checked) {
        this.rigthNav[1].checked ? params.oneDay = diffTime : ''
        this.rigthNav[0].checked ? params.isSelf = '1' : ''
      }

      this.searchKeyWord ? params.keyWord = this.searchKeyWord : ''
      sort ? params = Object.assign(params, sort) : params.recommend = '1'

      this.searchInput(params).then((res) => {
        if (res.data.status === 1070) {
          this.searchList = res.data.result[0].productList;
          this.pagination.total = res.data.result[0].rows
        }
      });
    },

    /**
     * @description 切换分页数据
     * @param {number} e 页码
     */
    async currentChange (e) {
      // 累加偏移量
      this.pagination.offset = (e - 1) * this.pagination.pageCount;
      await this.init();
    },
  },

  async created () {
    // this.searchKeyWord = this.$route.query.keyWord;
    this.keyWord = this.searchKeyWord;
    await this.init();
    let res = await this.getTypes()

    this.typeArr = res?.data?.result
  },

  mounted () {

  },
};
</script>

<style lang="scss" scoped>
@import './search.scss';
</style>