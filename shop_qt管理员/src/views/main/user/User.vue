<template>
  <div class="product-list">
    <div class="title">处理订单</div>
    <div>
      <el-form :inline="true" :model="searchCondition">
        <el-form-item label="id号">
          <el-input
            v-model="searchCondition.userId"
            placeholder="用户id"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="searchCondition.email"
            placeholder="输入邮箱"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker
            v-model="searchCondition.createdAt"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="initUserData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="num" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="userId" label="id" width="180" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="180" align="center">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="昵称"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="isCatch"
          label="账号状态"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              v-show="scope.row.isCatch === '异常'"
              trigger="hover"
              placement="top"
            >
              <p>此用户存在违规行为</p>
              <div slot="reference" class="name-wrapper">
                <el-tag type="danger">{{ scope.row.isCatch }}</el-tag>
              </div>
            </el-popover>
            <el-tag size="medium" v-show="scope.row.isCatch === '正常'">{{
              scope.row.isCatch
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="注册时间"
          width="100"
          align="center"
        >
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="showMask(scope.row)"
              >删除</el-button
            >
            <el-button
              v-if="scope.row.isCatch === '正常'"
              type="warning"
              size="mini"
              @click="freezeUser(scope.row)"
              >冻结</el-button
            >
            <el-button
              v-else
              type="primary"
              size="mini"
              @click="thawUser(scope.row)"
              >解封</el-button
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
    <el-dialog
      title="安全验证"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>
        <el-input
          placeholder="请输入管理员密码"
          v-model="inputPassword"
          clearable
        >
        </el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delCancel">取 消</el-button>
        <el-button type="primary" @click="delConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { utils } from "@/utils/utils";
import { mapActions, mapState } from "vuex";

export default {
  name: "User",
  data() {
    return {
      dialogVisible: false,
      isUserInfo: false,
      inputPassword: "",
      delUserId: "",

      //商品列表数据
      tableData: [],

      //搜索条件
      searchCondition: {
        userId: "",
        email: "",
        createdAt: "",
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
    this.initUserData();
  },

  methods: {
    ...mapActions({
      getUserList: "user/getUserList",
      changeUser: "user/changeUser",
      deleteUser: "user/deleteUser",
    }),

    // 获取数据
    initUserData() {
      console.log(this.searchCondition);
      let params = Object.assign(
        {
          offsetNum: this.pagination.offset,
          limitNum: this.pagination.pageCount,
        },
        this.searchCondition
      );
      this.getUserList(params).then((res) => {
        if (res.data.status === 200) {
          const { rows, count } = res.data.result;
          this.pagination.total = count;

          rows.forEach((item, index) => {
            item.num = ++index;
            item.phone ? item.phone : (item.phone = "未填写");
            item.createdAt = utils.formatDate(item.createdAt, "yyyy-MM-dd ");
          });
          this.tableData = rows;
        }
      });
    },

    handleClose(done) {
      done();
    },

    // 删除账号
    showMask(val) {
      console.log(val);
      this.delUserId = val.userId;
      this.dialogVisible = true;
    },

    // 确定删除
    delConfirm() {
      this.deleteUser({
        password: this.inputPassword,
        userId: this.delUserId,
      }).then((res) => {
        console.log(res);
        if (res.data.status === 1110) {
          this.inputPassword = "";
          setTimeout(() => {
            this.$message({
              message: res.data.msg,
              type: "success",
              offset: 100,
            });
            this.dialogVisible = false;
          }, 300);
        } else {
          setTimeout(() => {
            this.$message({
              message: res.data.msg,
              type: "warning",
              offset: 100,
            });
          }, 300);
        }
      });
    },

    // 取消删除
    delCancel(val) {
      this.dialogVisible = false;
      this.inputPassword = "";
      console.log(val);
    },

    // 冻结账号
    freezeUser(val) {
      console.log(val);
      this.changeUser({ userId: val.userId, isCatch: "异常" })
        .then((res) => {
          if (res.data.status === 200) {
            this.$message({
              message: "成功冻结账号",
              type: "success",
              offset: 100,
            });

            this.initUserData();
          }
        })
        .catch(() => {
          this.$message({
            message: "冻结账号失败",
            type: "warning",
            offset: 100,
          });
        });
    },

    // 解封账号
    thawUser(val) {
      this.changeUser({ userId: val.userId, isCatch: "正常" })
        .then((res) => {
          if (res.data.status === 200) {
            this.$message({
              message: "账号已解封",
              type: "success",
              offset: 100,
            });
            this.initUserData();
          }
        })
        .catch(() => {
          this.$message({
            message: "账号解封失败",
            type: "warning",
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
      this.searchProduct(this.searchCondition);
    },
  },
};
</script>

<style lang="scss"
       scoped>
.product-list {
  background-color: #fff;
  padding: 15px;
  min-height: 800px;

  .title {
    font-size: 18px;
    height: 40px;
    line-height: 40px;
    margin-bottom: 15px;
  }

  .pagination-box {
    margin-top: 50px;
    text-align: center;
  }

  .img-box {
    width: 40px;
    height: 40px;
    background-color: #ddd;
    margin: 0 auto;
    overflow: hidden;
    img {
      width: 100%;
    }
  }

  .post {
    margin-bottom: 20px;
  }
}
</style>
