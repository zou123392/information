<template>
  <main class="talk">
    <div class="talk_item"
         :class="{ 'talk--active': currentIndex === talkActive }"
         @click="read">
      <el-badge v-if="unCount > 0"
                :value="unCount">
        <div class="imgBox2">
          <img :src="talkItem.avatar"
               alt="talkItem.nickName" />
        </div>
      </el-badge>
      <div v-else
           class="imgBox2">
        <img :src="talkItem.avatar"
             alt="talkItem.nickName" />
      </div>
      <div class="textbox">
        <div class="nameBox">
          <div class="name">
            {{ talkItem.nickName }}
          </div>
          <div class="time">
            {{ time }}
          </div>
        </div>
        <div class="message">{{ newMsg }}</div>
      </div>
    </div>
  </main>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { utils } from "@/utils/utils";
export default {
  name: "talkItem",
  data () {
    return {
      // oneUnTalkCount
      unCount: 0,
      newText: "",
      isRead: false, //是否是发送，用于控制已读
    };
  },

  props: ["talkItem", "currentIndex"],

  computed: {
    ...mapState({
      talkActive: (state) => state.talk.talkActive,
      UnTalkCount: (state) => state.talk.UnTalkCount,
    }),
    time () {
      return utils.formatTime(this.talkItem.updatedAt, "{y}-{m}-{d}");
    },

    newMsg () {
      return this.newText || this.talkItem.newMsgOne;
    },
  },

  methods: {
    ...mapMutations({
      updateUnTalkCount: "talk/updateUnTalkCount",
      userInfo: "user/userInfo",
    }),
    ...mapActions({
      updateTalkMessage: "talk/updateTalkMessage",
      findOneUnTalkCount: "talk/findOneUnTalkCount",
    }),

    // 初始化消息数量
    init () {
      this.findOneUnTalkCount({
        talkUserId: this.talkItem.talkUserId,
        replyUserId: this.userInfo.userId,
      }).then((res) => {
        if (res.data.status === 200) {
          this.unCount = res.data.result;
        }
      });
    },

    // 更新消息数量 已读
    read () {
      if (this.isRead) {
        this.updateTalkMessage({ talkUserId: this.talkItem.talkUserId }).then(
          (res) => {
            if (res.data.status === 200) {
              let UnTalkCount = this.UnTalkCount - this.unCount;
              this.updateUnTalkCount({ UnTalkCount });
              this.unCount = 0;
              this.isRead = false
            }
          }
        );
      }
    },
  },

  created () {
    this.init();
  },

  // 接收消息
  sockets: {
    unReadCount (item) {
      // 控制消息是否发给当前用户   
      if (item.talkUserId === this.talkItem.talkUserId) {
        this.unCount = item.count;
        this.newText = item.newText;
        this.isRead = true
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/comment.scss';
.talk {
  height: 100%;
  width: 100%;

  .talk_item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 80px;
    font-size: 16px;
    padding: 16px;
    box-sizing: border-box;
    background: #3d3d3d;
    transition: all 0.3s ease 0s;

    /deep/.el-badge__content.is-fixed {
      top: 10px !important;
      right: 15px !important;
    }
    .imgBox2 {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 47px;
      height: 47px;
      border-radius: 50%;
      overflow: hidden;
      box-sizing: border-box;
      background: rgb(255, 255, 255);

      img {
        width: 100%;
        border-radius: 50%;
      }
    }

    .textbox {
      height: 100%;
      flex: 1;
      font-size: 16px;
      margin-left: 20px;

      .nameBox {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        .name {
          width: 100px;
          font-weight: 400;
          color: white;

          @include ellipsis(1, nowrap);
        }
        .time {
          text-align: right;
          font-size: 12px;
          color: $subTextColor;
        }
      }

      .message {
        width: 215px;
        color: $subTextColor;
        @include ellipsis(1, nowrap);
      }
    }
  }

  .talk_item:hover {
    background: #2e2e2e;
    cursor: pointer;
  }

  .talk--active {
    background: #2e2e2e;
  }
}
</style>