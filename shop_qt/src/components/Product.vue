<template>
  <div class="card">
    <el-card
      @click.native="goDetail"
      :body-style="{ padding: '0px' }"
      shadow="hover"
    >
      <el-image :src="productItem.img" lazy> </el-image>
      <div class="card-body">
        <h4 class="card-title">{{ productItem.name }}</h4>
        <ul class="list-inline product-meta">
          <li class="list-inline-item">
            <i class="el-icon-price-tag"></i>
            <span>{{ productItem.title }}</span>
          </li>
          <li class="list-inline-item">
            <i class="el-icon-alarm-clock"></i>
            <span>{{ date }}</span>
          </li>
        </ul>
        <p class="card-text">{{ productItem.desc }}</p>
        <!-- <div class="product-ratings">
          <el-rate
            v-model="rate"
            disabled
            text-color="#ff9900"
            score-template="{value}"
          >
          </el-rate>
        </div> -->
      </div>
    </el-card>

    <div
      class="delete"
      v-if="this.$route.name === 'Personal'"
      @click="deleteProduct"
    >
      <i class="el-icon-delete del"></i>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "Product",

  props: {
    productItem: {
      type: Object,
    },
  },

  computed: {
    date() {
      let date = new Date(this.productItem.updated_at);
      date = `${date.getFullYear()}年${
        date.getMonth() + 1
      }月${date.getDate()}日`;
      return date;
    },

    rate() {
      return this.productItem.rate - 0;
    },
  },

  methods: {
    ...mapMutations({}),

    /**
     * @description 删除 用户商品
     */
    deleteProduct() {
      // 删除成功 触发父组件 重新加载数据
      this.$emit("del", this.productItem.pid);
    },

    /**
     * @description 去往详情页
     */
    goDetail() {
      let routeName = "";
      this.productItem.is_self === "1"
        ? (routeName = "Detail2")
        : (routeName = "Detail");

      this.$router.push({
        name: routeName,
        query: {
          pid: utils.Base64.encode(this.productItem.pid),
        },
      });
    },
  },
};
</script>

<style lang="scss"
       scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 285px;
  word-wrap: break-word;
  background-color: $white;
  background-clip: border-box;
  cursor: pointer;
  user-select: none;

  .el-image {
    width: 100%;
    height: 220px;
  }

  .card-body {
    flex: 1 1 auto;
    padding: 20px;

    .card-title {
      font-size: 18px;
      margin-bottom: 5px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-meta {
      margin-bottom: 15px;

      .list-inline-item {
        display: inline-block;
      }

      li {
        margin-right: 15px;
        font-size: 12px;
        color: $subTextColor;

        i {
          margin-right: 2px;
        }
      }
    }

    .card-text {
      height: 42px;
      vertical-align: inherit;
      color: $normalTextColor;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5;
      margin-bottom: 15px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }
  }
  .product-ratings {
    position: absolute;
    top: 0;
    left: 0;
  }

  .delete {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    // height: 2px;
    padding: 5px 20px;
    width: 250px;
    text-align: center;
    background: #504a4a80;
    transition: all 0.3s ease 0s;
    // pointer-events: none;

    .del {
      font-size: 22px;
      color: red;
    }
  }
}
.card:hover .delete {
  transform: translate(-50%, 0);
  opacity: 1;
  // animation: showDel 1.4s infinite linear;
  // animation-iteration-count: 1;
}

@keyframes showDel {
  0% {
    transform: translate(-50%, -100%);
    opacity: 0;
  }

  20% {
    transform: translate(-50%, -80%);
    opacity: 0.1;
  }
  40% {
    transform: translate(-50%, -60%);
    opacity: 0.2;
  }
  60% {
    transform: translate(-50%, -40%);
    opacity: 0.4;
  }
  80% {
    transform: translate(-50%, -20%);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style>
