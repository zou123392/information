<template>
  <div class="product-list">
    <div class="title">订单列表</div>
    <div>
      <el-form :inline="true"
               :model="searchCondition">
        <el-form-item label="订单号">
          <el-input v-model="searchCondition.orderNum"
                    placeholder="订单号码"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="searchCondition.logNum"
                    placeholder="物流单号"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchCondition.status"
                     placeholder="订单状态">
            <el-option v-for="(item, index) in statusArr"
                       :key="index"
                       :label="item.title"
                       :value="item.status"></el-option>
          </el-select>
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
        <el-table-column prop="logNum"
                         label="物流单号"
                         width="180"
                         align="center">
        </el-table-column>
        <el-table-column prop="buyer"
                         label="买家"
                         width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="phone"
                         label="联系电话"
                         width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="productCount"
                         label="商品总数"
                         width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="payWay"
                         label="支付类型"
                         width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="totalPrice"
                         label="支付金额"
                         width="100"
                         align="center">
        </el-table-column>
        <el-table-column prop="status"
                         label="订单状态"
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
            <el-button type="primary"
                       size="mini"
                       v-if="(scope.row.status) === '待处理'"
                       @click="handleOrder(scope.row)">处理</el-button>
            <el-button type="danger"
                       size="mini"
                       @click="removeOrder(scope.row, scope.$index)">删除</el-button>
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
  name: "Order",
  data () {
    return {
      statusArr: [
        {
          id: 0,
          title: '待支付',
          status: [0, 1]
        },
        {
          id: 1,
          title: '已取消',
          status: [3, 4]
        },
        {
          id: 2,
          title: '待处理',
          status: [2]
        },
        {
          id: 3,
          title: '已发货',
          status: [5]
        },
        {
          id: 4,
          title: '已完成',
          status: [6]
        },
      ],

      //商品列表数据
      tableData: [],

      //搜索条件
      searchCondition: {
        orderNum: "",
        logNum: '',
        payTime: '',
        status: [],
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
        limitNum: this.pagination.pageCount
      }, this.searchCondition)
      this.findOrderBySome(params).then((res) => {
        if (res.data.status === 200) {
          const { rows, count } = res.data.result
          this.pagination.total = count

          rows.forEach((item, index) => {
            item.num = ++index
            item.logNum ? '' : item.logNum = '未更新'
            item.buyer = item.address[0].consigneeName
            item.phone = item.address[0].consigneePhone
            item.address = item.address[0].addressName.replaceAll('/', ' ') + ' ' + item.address[0].addressDetail
            item.payTime = utils.formatDate(item.payTime, 'yyyy-MM-dd ')
            item.createdAt = utils.formatDate(item.createdAt, 'yyyy-MM-dd ')
            item.payWay ? '' : item.payWay = '线下交易'

            for (let val of this.statusArr) {
              if (val.status.includes(Number(item.status))) {
                item.status = val.title
                break
              }
            }
          });
          this.tableData = rows
        }

      })
    },

    // 跳转处理订单
    handleOrder (row) {
      console.log(row);
      this.$router.push({
        name: 'HandleOrder',
        query: { orderNum: row.orderNum }
      })
    },

    // 删除订单
    removeOrder (item, index) {
      // console.log(orderNum, index);

      console.log(item);
      if (['已发货', '待处理', '待支付'].includes(item.status)) {
        this.$message({
          type: 'info',
          message: '订单处于未完成状态，不允许删除',
          offset: 100
        });
        return
      }

      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.adminUpdateOrder({
          orderNum: item.orderNum,
          isDelete: 1,
        }).then((res => {
          if (res.data.status === 200) {
            this.$message({
              message: '订单删除成功',
              type: 'success',
              offset: 100
            })
            this.tableData.splice(index, 1)
          }
        }))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

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
