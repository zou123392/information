<template>
  <div class="product-list">
    <div class="title">商品列表</div>
    <div>
      <el-form :inline="true" :model="searchCondition">
        <el-form-item label="名称">
          <el-input
            v-model="searchCondition.name"
            placeholder="输入名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="searchCondition.typeId" placeholder="选择类型">
            <el-option
              v-for="(item, index) in typeData"
              :key="index"
              :label="item.title"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchCondition.status" placeholder="选择状态">
            <el-option label="选择状态" value="-1"></el-option>
            <el-option label="上架" value="上架"></el-option>
            <el-option label="下架" value="下架"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属">
          <el-select
            v-model="searchCondition.comment"
            placeholder="选择产品所属人"
          >
            <el-option label="选择所属" value="-1"></el-option>
            <el-option label="官方" value="官方"></el-option>
            <el-option label="用户" value="用户"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            v-model="searchCondition.updated_at"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="initSearchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="num" label="序号" width="60" align="center">
        </el-table-column>
        <el-table-column prop="img" label="图片" width="80" align="center">
          <template slot-scope="scope">
            <div class="img-box">
              <img class="auto-img" :src="scope.row.img" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="180" align="center">
        </el-table-column>
        <el-table-column prop="desc" label="描述" width="180" align="center">
        </el-table-column>
        <el-table-column prop="title" label="类型" width="100" align="center">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="180" align="center">
        </el-table-column>
        <el-table-column prop="seals" label="销量" width="180" align="center">
        </el-table-column>
        <el-table-column
          prop="likeCount"
          label="收藏数"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="rate" label="评分" width="100" align="center">
        </el-table-column>
        <el-table-column prop="isSelf" label="所属" width="180" align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updated_at"
          label="更新日期"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              @click="viewProduct(scope.row)"
              >查看</el-button
            >
            <el-button
              type="warning"
              size="mini"
              v-if="scope.row.status == '上架'"
              @click="updownSelf(scope.row, '下架')"
              >下架</el-button
            >
            <el-button
              type="info"
              size="mini"
              v-else
              @click="updownSelf(scope.row, '上架')"
              >上架</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="
                removeProduct(scope.row.pid, scope.row.user_id, scope.$index)
              "
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background
          v-if="pagination.total > pagination.pageCount"
          layout="prev, pager, next"
          :total="pagination.total"
          :pager-count="pagination.page"
          :page-size="pagination.pageCount"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { utils } from "@/utils/utils";
import { mapActions, mapState } from "vuex";

export default {
  name: "Products",
  data() {
    return {
      typeData: [],

      //商品列表数据
      tableData: [],

      //搜索条件
      searchCondition: {
        name: "",
        typeId: "-1",
        status: "-1",
        comment: "-1",
        updated_at: "",
      },

      //分页
      pagination: {
        //总数目
        total: 0,

        //每页显示的数目
        pageCount: 10,

        //最多显示页码数量
        page: 5,

        //偏移量
        offset: 0,
      },
    };
  },

  computed: {
    ...mapState({
      types: (state) => state.product.types,
    }),
  },

  mounted() {
    setTimeout(() => {
      this.typeData = JSON.parse(JSON.stringify(this.types));
      if (this.typeData[0].typeId !== "-1") {
        this.typeData.unshift({
          typeId: "-1",
          title: "选择类型",
        });
      }
    }, 200);

    this.initSearchData();
  },

  methods: {
    ...mapActions({
      searchInput: "product/searchInput",
      count: "product/count",
      remove: "product/remove",
      updown: "product/updown",
    }),

    /**
     * @description 初始化搜索商品数据
     */
    initSearchData() {
      this.pagination.offset = 0;
      // this.getProductCount()
      this.searchProduct();
    },

    /**
     * @description 搜索商品
     */
    searchProduct() {
      let params = Object.assign(
        {
          offset: this.pagination.offset,
          count: this.pagination.pageCount,
        },
        this.searchCondition
      );
      if (params.updated_at) {
        let year = params.updated_at.getFullYear();
        let month = params.updated_at.getMonth() + 1;
        let date = params.updated_at.getDate();
        params.updated_at = `${year}-${month}-${date}`;
      }
      params.status = params.status == "-1" ? "" : params.status;
      params.typeId = params.typeId == "-1" ? "" : params.typeId;
      this.searchInput(params)
        .then((res) => {
          console.log(res);
          if (res.data.status == 1070) {
            console.log(res.data.result);
            res.data.result[0].productList.map((v, i) => {
              v.img = res.data.url + v.img;
              v.num = ++i;
              v.detail_img = res.data.url + v.detail_img;
              v.updated_at = utils.formatDate(
                v.updated_at,
                "yyyy-MM-dd hh:mm:ss"
              );
              v.is_self === "1"
                ? (v.isSelf = "官方")
                : (v.isSelf = "用户 " + v.user_id);
              v.likeCount = v.like_count;
            });
          } else {
            this.$message.error(res.data.msg);
          }
          this.tableData = res.data.result[0].productList;
          this.pagination.total = res.data.result[0].rows;
        })
        .catch((err) => {});
    },

    /**
     * @description 上下架
     * @param {object} row 商品数据
     * @param {string} status 商品状态
     */
    updownSelf(row, status) {
      this.updown({
        pid: row.pid,
        status,
      })
        .then((res) => {
          if (res.data.status == 1090 && res.data.result[0] == 1) {
            row.status = status;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(() => {});
    },

    /**
     * @description 查看商品, 可以浏览商品详细信息和编辑商品
     * @param {string} pid 商品id
     */
    viewProduct(item) {
      this.$router.push({
        name: "PostTrade",
        query: {
          p: JSON.stringify(item),
        },
      });
    },

    /**
     * @description 删除商品
     * @param {string} pid 商品id
     */
    removeProduct(pid, user_id, index) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.remove({
            pid,
            userId: user_id,
          })
            .then((res) => {
              if (res.data.status == 1110) {
                this.$message({
                  message: res.data.msg,
                  type: "success",
                  offset: 100,
                });
                this.tableData.splice(index, 1);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            offset: 100,
          });
        });
    },

    /**
     * @description 切换分页数据
     * @param {number} e 页码
     */
    currentChange(e) {
      // 累加偏移量
      this.pagination.offset = (e - 1) * this.pagination.pageCount;
      this.searchProduct();
    },
  },
};
</script>

<style lang="scss"
       scoped>
@import "./products.scss";
</style>
