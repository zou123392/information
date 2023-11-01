<template>
  <div class="product-list">
    <div class="title">处理订单</div>
    <div>
      <el-form :inline="true"
               :model="searchCondition">
        <el-form-item label="订单号">
          <el-input v-model="searchCondition.orderNum"
                    placeholder="输入订单号"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="支付时间">
          <el-date-picker v-model="searchCondition.payTime"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="创建日期">
          <el-date-picker v-model="searchCondition.createdAt"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"
                     @click="initOrderData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData"
                border
                style="width: 100%">
        <el-table-column prop="num"
                         label="序号"
                         width="80"
                         align="center">
        </el-table-column>
        <el-table-column prop="orderNum"
                         label="订单号"
                         width="180"
                         align="center">
        </el-table-column>
        <el-table-column prop="name"
                         label="收件人昵称"
                         width="180"
                         align="center">
        </el-table-column>
        <el-table-column prop="phone"
                         label="收件人电话"
                         width="180"
                         align="center">
        </el-table-column>
        <el-table-column prop="productCount"
                         label="商品总数"
                         width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="address"
                         label="收货地址"
                         width="200"
                         align="center">
        </el-table-column>
        <el-table-column prop="payTime"
                         label="支付日期"
                         width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="createdAt"
                         label="创建日期"
                         width="100"
                         align="center">
        </el-table-column>

        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.isInputLogNum"
                       type="primary"
                       size="mini"
                       @click="inputlog(scope.row)">录入物流号</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination background
                       v-if="pagination.total>pagination.pageCount"
                       layout="prev, pager, next"
                       :total="pagination.total"
                       :pager-count="pagination.page"
                       :page-size="pagination.pageCount"
                       @current-change="currentChange">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="物流单号录入"
               :visible.sync="dialogVisible"
               width="30%"
               :before-close="handleClose">
      <span>
        <el-input placeholder="请输入物流单号"
                  v-model="inputLogNum"
                  clearable>
        </el-input>

      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"
                   @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  utils
} from '@/utils/utils'
import {
  mapActions,
  mapState,
} from 'vuex'

export default {
  name: "HandleOrder",
  data () {
    return {
      dialogVisible: false,
      isInputLogNum: false,
      inputLogNum: '',
      choiceOrder: '',
      //商品列表数据
      tableData: [],

      //搜索条件
      searchCondition: {
        orderNum: "",
        payTime: '',
        createdAt: '',
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
    }
  },

  computed: {
    ...mapState({
      types: state => state.product.types
    })
  },

  mounted () {
    if (this.$route.query.orderNum) {
      this.searchCondition.orderNum = this.$route.query.orderNum
    }
    this.initOrderData()
  },

  methods: {
    ...mapActions({
      findOrderBySome: 'order/findOrderBySome',
      adminUpdateOrder: 'order/adminUpdateOrder'
    }),

    // 获取数据
    initOrderData () {
      console.log(this.searchCondition);
      let params = Object.assign({
        offsetNum: this.pagination.offset,
        limitNum: this.pagination.pageCount,
        status: [2]
      }, this.searchCondition)
      this.findOrderBySome(params).then((res) => {
        if (res.data.status === 200) {
          const { rows, count } = res.data.result
          this.pagination.total = count

          rows.forEach((item, index) => {
            item.num = ++index
            item.name = item.address[0].consigneeName
            item.phone = item.address[0].consigneePhone
            item.address = item.address[0].addressName.replaceAll('/', ' ') + ' ' + item.address[0].addressDetail
            item.payTime = utils.formatDate(item.payTime, 'yyyy-MM-dd ')
            item.createdAt = utils.formatDate(item.createdAt, 'yyyy-MM-dd ')
          });
          this.tableData = rows
        }

      })
    },

    handleClose (done) {
      this.choiceOrder = ''
      this.inputLogNum = ''
      done()
    },

    // 打开弹窗
    inputlog (val) {
      this.dialogVisible = true
      this.choiceOrder = val.orderNum
    },

    cancel (val) {
      this.dialogVisible = false
      this.inputLogNum = ''
      this.choiceOrder = ''
      console.log(val);
    },

    // 更新订单信息
    confirm () {
      this.adminUpdateOrder({
        orderNum: [this.choiceOrder],
        status: 5,
        logNum: this.inputLogNum,
        sendTime: new Date()
      }).then((res => {
        if (res.data.status === 200) {
          this.$message({
            message: '物流单号录入成功',
            type: 'success',
            offset: 100
          })
          let timer = setTimeout(() => {
            this.dialogVisible = false
            this.inputLogNum = ''
            this.choiceOrder = ''

            clearTimeout(timer)
          }, 300);
        }
      }))
      console.log(this.choiceOrder);
    },

    /**
     * @description 切换分页数据
     * @param {number} e 页码
     */
    currentChange (e) {
      // 累加偏移量
      this.pagination.offset = (e - 1) * this.pagination.pageCount
      this.searchProduct(this.searchCondition)
    }
  }
}

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
