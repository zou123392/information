<template>
  <div class="post-trade">
    <!-- 定位组件 -->
    <div>
      <iframe id="geoPage"
              width="0"
              height="0"
              frameborder="0"
              style="display: none"
              scrolling="no"
              src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp"></iframe>
    </div>

    <!-- <el-divider><i class="el-icon-link title"> 发布 </i></el-divider> -->
    <div class="goods-info">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="商品名称"
                      prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品类型"
                      prop="type">
          <el-select v-model="ruleForm.type"
                     placeholder="请选择商品类型">
            <el-option v-for="(item, index) in types"
                       :key="index"
                       :label="item.title"
                       :value="item.typeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格"
                      prop="price">
          <el-input v-model="ruleForm.price"
                    type="number"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="商品图片"
                      prop="img">
          <UploadFile @upload="upload($event, 'img')"
                      :size="3 * 1024"
                      :img-src="ruleForm.img">
          </UploadFile>
        </el-form-item>
        <el-form-item label="详情图片"
                      prop="detailImg">
          <UploadFile @upload="upload($event, 'detailImg')"
                      :size="3 * 1024"
                      :img-src="ruleForm.detailImg">
          </UploadFile>
        </el-form-item>
        <el-form-item label="商品状态"
                      prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="上架"></el-radio>
            <el-radio label="下架"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品描述"
                      prop="desc">
          <el-input class="goods-detail"
                    type="textarea"
                    :rows="6"
                    resize="none"
                    maxlength="250"
                    show-word-limit
                    clearable
                    v-model="ruleForm.desc">
          </el-input>
        </el-form-item>
        <div class="block">
          <el-button @click="cancel('ruleForm')"> 取消 </el-button>
          <el-button type="primary"
                     @click="postTrade('ruleForm')">
            提交
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mutations } from "@/store/mutations";
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "PostTrade",

  components: {
    UploadFile: () => import("@/components/UploadFile.vue"),
  },

  data () {
    return {
      types: [],
      putaddress: "",
      ruleForm: {
        name: "",
        type: "",
        price: "",
        img: "",
        detailImg: "",
        status: "",
        desc: "",
      },

      // 图片类型
      imgTypes: {
        imgType: "",
        detailImgType: "",
      },

      rules: {
        name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择商品类型",
            trigger: "change",
          },
        ],
        price: [
          {
            required: true,
            validator: this.validPrice,
            trigger: "blur",
          },
        ],
        img: [
          {
            required: true,
            message: "请上传商品图片",
            trigger: "change",
          },
        ],
        detailImg: [
          {
            required: true,
            message: "请上传详情图片",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择商品状态",
            trigger: "change",
          },
        ],
        desc: [
          {
            required: true,
            message: "请填写商品描述",
            trigger: "blur",
          },
        ],
      },
    };
  },

  computed: {
    ...mapState({
      // types: state => state.product.types
    }),
  },

  created () {
    this.getTypes().then((res) => {
      this.types = res.data.result;
    });
    document.title = "发布中心";
  },

  methods: {
    ...mapMutations({}),
    ...mapActions({
      getTypes: "product/getTypes",
      postProduct: "product/postProduct",
    }),

    /**
     * @description 验证价格
     * @param {rule: RegExp} rule 校正正则
     * @param {value: string} value 校正值
     * @param {callback: Function} callback 回调函数
     */
    validPrice (rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入商品价格"));
      }
      setTimeout(() => {
        let reg = /^(([1-9]\d*)|0)(\.[0-9]{1,2})?$/;
        if (!reg.test(value)) {
          callback(new Error("价格只能填写数值"));
        } else {
          callback();
        }
      }, 400);
    },

    /**
     * @description 取消
     * @param {formName: object} formName 校正表单
     */
    cancel (formName) {
      this.$refs[formName].resetFields();
    },

    /**
     * @description 发布商品
     * @param {formName: object} formName 校正表单
     */
    postTrade (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.post();
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },

    /**
     * @description 发布商品
     */
    post () {
      let product = Object.assign({}, this.ruleForm, this.imgTypes);
      product.img = product.img.replace(/^data:image\/[a-z]+;base64,/, "");
      product.detailImg = product.detailImg.replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );
      product.putaddress = this.putaddress;
      this.postProduct(product).then((res) => {
        if (res.data.status == 1034) {
          this.$router.push({
            name: "Login",
          });
        }
        if (res.data.status == 1060) {
          this.$message({
            message: res.data.msg,
            type: "success",
            offset: 100,
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
            offset: 100,
          });
        }
      });
    },

    /**
     * @description 上传文件
     * @param {e: object} e 事件对象
     * @param {key: string} key 图片类型
     */
    upload (e, key) {
      this.ruleForm[key] = e.base64;
      this.imgTypes[key + "Type"] = e.type;
    },

    /**
     * @description 定位组件
     */
    getMap () {
      const vm = this; //将组件实例保存 或监听使用箭头函数
      window.addEventListener(
        "message",
        function (event) {
          if (event.data != null) {
            //会获取四次数据，前面没有数据
            if (event.data.module == "geolocation") {
              vm.putaddress = event.data.city;
            }
          }
        },
        false
      );
    },
  },

  mounted () {
    this.getMap();
  },
};
</script>

<style lang="scss"
       scoped>
.post-trade {
  overflow: auto;
  background-color: $white;
  border-radius: 3px;
  // padding-top: 85px;

  .title {
    font-weight: normal;
    font-size: 20px;
    color: $brandColor;
    text-align: center;
  }

  .goods-info {
    margin: 40px auto 50px;
    max-width: 500px;

    .block {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
