<template>
  <div>
    <!-- 默认地址 -->
    <div class="default">
      <el-descriptions class="margin-top" title="默认地址" :column="2" border>
        <template slot="extra"> </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            收件名
          </template>
          {{ isdefaultData?.consigneeName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ isdefaultData?.consigneePhone }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            收货地址
          </template>
          {{ isdefaultData?.addressName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            详细地址
          </template>
          {{ isdefaultData?.addressDetail }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-divider><i class="el-icon-edit"></i></el-divider>
    <i @click="addAddress" class="text-info el-icon-plus">新增</i>

    <el-table
      :data="addressList"
      border
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="收件人姓名">
        <template slot-scope="scope">
          <span v-if="Boolean(Number(scope.row.isAdd))">
            <el-input size="mini" v-model="scope.row.consigneeName"></el-input>
          </span>
          <span v-else>
            {{ scope.row.consigneeName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="收货人手机号">
        <template slot-scope="scope">
          <span v-if="Boolean(Number(scope.row.isAdd))">
            <el-input size="mini" v-model="scope.row.consigneePhone"></el-input>
          </span>
          <span v-else>
            {{ scope.row.consigneePhone }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span v-if="Boolean(Number(scope.row.isAdd))">
            <el-cascader
              :options="address"
              @change="handleChange($event, scope.$index)"
              clearable
              filterable
              ref="cascaderAddr"
              v-model="scope.row.logisticsMode"
            >
            </el-cascader>
          </span>
          <span v-else>
            {{ scope.row.addressName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址">
        <template slot-scope="scope">
          <span v-if="Boolean(Number(scope.row.isAdd))">
            <el-input size="mini" v-model="scope.row.addressDetail"></el-input>
          </span>
          <span v-else>
            {{ scope.row.addressDetail }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="_delete(scope.row, scope.$index)"
            type="text"
            style="color: red"
            v-if="!Boolean(Number(scope.row.isAdd)) && isAdd"
            >删除
          </el-button>

          <el-button
            @click="_edit(scope.row, scope.$index)"
            type="text"
            v-if="!Boolean(Number(scope.row.isAdd)) && scope.row.id"
            >编辑
          </el-button>

          <el-button
            v-if="
              !Boolean(Number(scope.row.isAdd)) &&
              isAdd &&
              !Boolean(Number(scope.row.isdefault))
            "
            @click="selectAddress(scope.row)"
            type="text"
            >选择该地址
          </el-button>
          <el-button
            @click="_edit(scope.row, scope.$index)"
            type="text"
            v-if="!Boolean(Number(scope.row.isAdd)) && scope.row.id == ''"
            >编辑
          </el-button>
          <el-button
            @click="_channel(scope.row, scope.$index)"
            style="color: #909399"
            type="text"
            v-if="Boolean(Number(scope.row.isAdd))"
            >取消
          </el-button>
          <el-button
            @click="save(scope.row)"
            type="text"
            v-if="Boolean(Number(scope.row.isAdd))"
            >保存</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import address from "@/config/address.json";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "Address",
  props: {
    isAdd: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      address: address[0].children,
      addressList: [],
      isdefaultData: [],
      da: "niihihi",
      isExit: false, //控制新增还是编辑 后台
    };
  },

  computed: {
    ...mapState({}),
  },

  methods: {
    ...mapMutations({
      updateAddress: "address/updateAddress",
    }),
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      addAddressOne: "address/addAddress",
      findAddress: "address/findAddress",
      updateAddress: "address/updateAddress",
      deleteAddress: "address/deleteAddress",
    }),

    handleChange(val, index) {
      let label = this.getCascaderObj(val, this.address);
      this.addressList[index].addressName = label.join("/");
      // this.addressList[index].province = val[0] + ":" + label[0];
      // this.addressList[index].city = val[1] + ":" + label[1];
      // this.addressList[index].area = val[2] + ":" + label[2];
    },
    getCascaderObj(val, opt) {
      return val.map(function (value) {
        for (let itm of opt) {
          if (itm.value == value) {
            opt = itm.children;

            return itm.label;
          }
        }
        return null;
      });
    },

    // 编辑
    _edit(item, index) {
      this.addressList[index].logisticsMode = [];

      // if (this.addressList[index].addressName && this.addressList[index].addressName.length > 0) {
      //   this.addressList[index].logisticsMode[0] = this.addressList[
      //     index
      //   ].province.split(":")[0];
      //   this.addressList[index].logisticsMode[1] = this.addressList[
      //     index
      //   ].city.split(":")[0];
      //   this.addressList[index].logisticsMode[2] = this.addressList[
      //     index
      //   ].area.split(":")[0];
      // }

      item.isAdd = true;
      this.isExit = true;
    },

    // 添加
    addAddress() {
      let form = {
        id: null,
        // logisticsMode: "", //三级地理
        consigneeName: "", //收获名
        consigneePhone: "", //手机好
        addressDetail: "", //详细地址
        isAdd: true,
      };
      let list = this.addressList.filter((add) => add.id == null);
      if (list && list.length > 0) {
      } else {
        this.addressList.push(form);
      }
    },

    setAddressList(list) {
      // this.addressList = [];
      // this.addressList.unshift(...list);
      // let obj = {};
      // let peon = this.addressList.reduce((cur, next) => {
      //   obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
      //   return cur;
      // }, []); //数组对象去重
      // peon.forEach((val) => {
      //   val.isAdd = false;
      // });
      // this.addressList = JSON.parse(JSON.stringify(peon));
    },

    _delete(item, index) {
      this.$confirm("确定要删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteAddress({ adrid: item.adrid }).then((res) => {
            if (res.data.status === 200) {
              this.getAllAddress();
              this.$message({
                type: "success",
                message: "删除成功",
              });
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 取消
    _channel(item, index) {
      // item.isAdd = false;
      this.getAllAddress();
    },

    //保存
    save(item) {
      if (
        !item.addressName ||
        !item.consigneeName ||
        !item.consigneePhone ||
        !item.addressDetail
      ) {
        return this.$message({
          message: "不能为空",
          type: "warning",
          offset: 100,
        });
      }

      item.id = "";
      item.isAdd = false;

      if (this.isExit) {
        //编辑
        if (item.isdefault === false) delete item.isdefault;

        this.updateAddress(item).then((res) => {
          if (res.data.status === 1060) {
            this.$message({
              message: "修改地址成功",
              type: "success",
            });
            this.getAllAddress();
          } else {
            this.$message.error("修改失败");
          }
        });
      } else {
        this.addAddressOne(item).then((res) => {
          if (res.data.status === 1060) {
            this.$message({
              message: "新增地址成功",
              type: "success",
            });
            this.getAllAddress();
          } else {
            this.$message.error("创建失败");
          }
        });
      }

      this.isExit = false;
      // this.$emit("saveAddressList", JSON.parse(JSON.stringify(this.addressList)));
    },

    // 设为默认地址
    selectAddress(data) {
      data.isdefault = true;
      this.updateAddress(data).then((res) => {
        if (res.data.status === 1060) {
          this.$message({
            message: "修改地址成功",
            type: "success",
          });
          this.getAllAddress();
        } else {
          this.$message.error("修改失败");
        }
      });
    },

    // 默认地址选中状态
    tableRowClassName({ row, rowIndex }) {
      if (row.isdefault === true) {
        return "success-row";
      }
      return "";
    },

    // 获取所有地址
    async getAllAddress() {
      let res = await this.findAddress();
      if (res.data.status === 1060) {
        this.isdefaultData = res.data.result.filter((item) => {
          return item.isdefault === true;
        })[0];
        this.addressList = res.data.result;
        this.$forceUpdate();
      }
    },
  },

  created() {},
  mounted() {
    this.getAllAddress();
  },
};
</script>
<style lang="scss" scoped>
.default {
  margin-bottom: 20px;
}

.text-info {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 13px;
  // border: 1px solid black;
  border-radius: 6px;
  cursor: pointer;
  background: $headNavColor-active;
  color: #ffffff;
}

/deep/.el-button--text {
  padding: 0 10px;
  color: #9b331b;
}

/deep/.el-button + .el-button,
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0 !important;
}

/deep/.el-table .warning-row {
  background: oldlace;
}

/deep/.el-table .success-row {
  background: #f0f9eb;
}
</style>