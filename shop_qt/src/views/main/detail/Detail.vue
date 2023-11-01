<template>
  <section class="detail">
    <el-row :style="{ 'max-width': container + 'px' }"
      ><el-col :md="16">
        <div class="product-details">
          <h1 class="product-title">
            {{ detailData.name
            }}<span
              @click="buyOpen"
              v-if="userInfo.userId !== detailData.user_id"
              >私信</span
            >
          </h1>
          <div class="product-meta">
            <ul class="list-inline">
              <li class="list-inline-item">
                <i class="el-icon-user"></i>
                <span>提供者：{{ detailData.email }}</span>
              </li>
              <li class="list-inline-item">
                <i class="el-icon-folder-opened"></i>
                <span>类别：{{ detailData.title }}</span>
              </li>
            </ul>
          </div>

          <el-image :src="img[0]" fit="contain" :preview-src-list="img">
          </el-image>
        </div>
      </el-col>
      <el-col :md="7">
        <div class="sidebar">
          <div class="widget price text-center">
            <h4>价格</h4>
            <p>NT${{ newPrice }}</p>
          </div>
          <div class="widget user">
            <el-image
              class="rounded-circle"
              :src="userAvatar"
              fit="cover"
              :preview-src-list="[userAvatar]"
            >
            </el-image>
            <h4>{{ detailData.email }}</h4>
            <div class="list-inline">
              <el-button
                v-if="userInfo.userId !== detailData.user_id"
                @click="handleLike"
                type="text"
                :icon="isLike ? 'el-icon-star-on' : 'el-icon-star-off'"
              >
                {{ isLike ? "已收藏" : "收藏" }}
              </el-button>
              <el-button
                v-else
                @click="$router.push({ name: 'Personal' })"
                type="text"
              >
                此商品是您自己发布的
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :style="{ 'max-width': container + 'px' }">
      <div class="content">
        <nav class="nav">
          <span class="nav-item">产品详情</span>
        </nav>
        <section class="tab-content">
          <el-divider class="tab-title" content-position="center"
            >产品描述</el-divider
          >
          <p>{{ detailData.desc }}</p>
        </section>
      </div>
    </el-row>
  </section>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "Detail",

  data() {
    return {
      isLike: false,
      isShopcart: false,
      detailData: {},
    };
  },

  computed: {
    ...mapState({
      container: (state) => state.container,
      detail: (state) => state.product.detail,
      userInfo: (state) => state.user.userInfo,
      isLogin: (state) => state.user.isLogin,
    }),

    newPrice() {
      return utils.formatPrice(
        (this.detailData.discount / 10) * this.detailData.price,
        0
      );
    },

    img() {
      let img = [];
      img.push(this.detailData.img, this.detailData.detail_img);
      return img;
    },

    userAvatar() {
      return this.detailData.avatar;
    },
  },

  watch: {
    $route: function () {
      this.init();
    },
  },
  async created() {
    this.init();
  },

  mounted() {},

  methods: {
    ...mapMutations({
      updateDetail: "product/updateDetail",
      updateActive: "header/updateActive",
      updatetalking: "talk/updatetalking",
    }),
    ...mapActions({
      getUserInfoByUserId: "user/getUserInfoByUserId",
      like: "product/like",
      findLike: "product/findLike",
      removeLike: "product/removeLike",
      getProductById: "product/getProductById",
      createTalk: "talk/createTalk",
    }),

    // 初始化数据
    init() {
      let pid = utils.Base64.decode(this.$route.query.pid);
      this.getProductById({ pid }).then((res) => {
        if (res.data.status === 1070) {
          const { result } = res.data.data;

          console.log(result[0]);
          this.getUserInfoByUserId({ userId: result[0].user_id }).then(
            (res) => {
              this.detailData = result[0];
              this.detailData.avatar = res.data.result[0].avatar;
              this.detailData.email = res.data.result[0].email;
            }
          );
          this.findLike({ pid }).then((res) => {
            res?.data?.result.length > 0
              ? (this.isLike = true)
              : (this.isLike = false);
          });
        }
      });
    },

    /**
     * @description 收藏处理
     */
    handleLike() {
      if (!this.isLike) {
        this.like({
          pid: utils.Base64.decode(this.$route.query.pid),
          userId: this.userInfo.userId,
        }).then((res) => {
          if (res.data.status === 1160) {
            this.isLike = true;
            this.$message({
              message: "收藏成功",
              type: "success",
              offset: 100,
            });
          }
        });
        return;
      }
      this.removeLike({
        pid: utils.Base64.decode(this.$route.query.pid),
        userId: this.userInfo.userId,
      }).then((res) => {
        if (res.data.status === 1160) {
          this.isLike = false;
          this.$message({
            message: "取消收藏成功",
            type: "success",
            offset: 100,
          });
        }
      });
    },

    /**
     * @description 跳转私聊
     */
    buyOpen() {
      if (this.userInfo && this.isLogin) {
        let replyUserId = this.detailData.user_id;
        this.createTalk({ replyUserId }).then((res) => {
          if (res.data.status === 200) {
            this.updatetalking({ talking: res.data.result[0] });
            setTimeout(() => {
              this.$router.push({
                name: "Talk",
                query: {
                  talkId: res.data.result[0]?.talkUserId,
                },
              });
            }, 400);
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "请先登录",
          offset: 100,
        });
      }
    },
  },
};
</script>

<style lang="scss"
       scoped>
@import "./detail.scss";
</style>
