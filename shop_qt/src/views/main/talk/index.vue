<template>
  <main class="talk">
    <div class="content">
      <div class="container">
        <div class="left">
          <div class="left_head">
            <div class="imgBox">
              <img :src="userInfo?.avatar" :alt="userInfo?.nickName" />
            </div>
            <div class="name">
              {{ userInfo?.nickName }}
            </div>
          </div>

          <!-- 左侧消息栏 -->
          <div class="left_content">
            <div
              v-for="(item, index) in talkList"
              :key="item.talk_user_id"
              class="left_item"
              @click="talkWithOther(index)"
            >
              <talk-item
                :talkItem="item"
                :currentIndex="index"
                ref="leftItem"
              />
            </div>
          </div>
        </div>

        <!-- 右侧对话栏 -->
        <div v-if="this.talkActive > -1" class="right">
          <!-- {{ talking }} -->
          <div class="right_head">{{ talking?.nickName }}</div>
          <div
            class="right_content"
            ref="msgContent"
            @mousewheel="scrollLoadData"
          >
            <div class="isend" v-show="isEnd">消息已全部加载</div>
            <div
              class="right_item"
              v-for="msg in talkMessageList"
              :key="msg.talkId"
            >
              <div class="time" v-show="msg.showTime">
                {{ time(msg) }}
              </div>
              <!-- 对方回复 -->
              <div v-if="msg?.other === '1'" class="messagebox">
                <div class="imgbox3">
                  <img :src="talking.avatar" :alt="talking?.nickName" />
                </div>

                <p class="text">
                  {{ msg.text }}
                </p>
              </div>

              <!-- 我的发送 -->
              <div
                v-else
                class="messagebox"
                :style="{ 'justify-content': 'flex-end' }"
              >
                <p class="text2">
                  {{ msg.text }}
                </p>
                <div class="imgbox3">
                  <img :src="userInfo?.avatar" :alt="userInfo?.nickName" />
                </div>
              </div>
            </div>
          </div>
          <div class="input" @click="inputFoucs">
            <textarea
              ref="textarea"
              placeholder=""
              maxlength="300"
              @input="countText"
              v-model="text"
              :disabled="disabled"
              @keyup.enter="sendMsg"
              @keydown.enter.prevent=""
            />
          </div>
          <div class="enter">
            <div class="text1">{{ count }}/300</div>
            <div class="text1">按下Enter发送</div>
          </div>
        </div>

        <div v-else class="dontChioce">
          <p>同心共筑中国梦 合力共建网络强国</p>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { utils } from "@/utils/utils";
import talkItem from "./talkItem.vue";
export default {
  components: { talkItem },
  name: "talk",
  data() {
    return {
      // talkActive: -1,
      talkMessageList: [],
      text: "",
      count: 0, //发送字数
      disabled: true,
      isEnd: false, //消息是否全部加载完成
      timer: null,
      getNum: {
        offsetNum: 0,
        limitNum: 10,
        total: 0,
        page: 0,
      },
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      talkList: (state) => state.talk.talkList,
      talkActive: (state) => state.talk.talkActive,
      talking: (state) => state.talk.talking,
    }),

    time() {
      return function (t) {
        return utils.formatMessageTime(t.createdAt);
      };
    },
  },

  watch: {
    // 监听会话，处理再次赋值
    talkMessageList(newVal, oldVal) {
      newVal = utils.showDiffTime(newVal);
    },
  },

  methods: {
    ...mapMutations({
      updateTalkList: "talk/updateTalkList",
      updatetalking: "talk/updatetalking",
      updateUnTalkCount: "talk/updateUnTalkCount",
      updateTalkActive: "talk/updateTalkActive",
    }),
    ...mapActions({
      initTalk: "talk/initTalk",
      updateTalk: "talk/updateTalk",
      addTalkMessage: "talk/addTalkMessage",
      findTalkMessage: "talk/findTalkMessage",
      getUserInfoByUserId: "user/getUserInfoByUserId",
    }),

    // 初始化会话
    init() {
      // this.$socket.emit('init', this.userInfo.userId)
      this.initTalk().then((res) => {
        let { status, result } = res.data;
        result.forEach((item) => {
          // 此会话不是当前用户发出
          if (item.replyUserId === this.userInfo.userId) {
            item.replyUserId = item.createBy;
            item.createBy = this.userInfo.userId;
          }

          // 获取谈话用户信息
          this.getUserInfoByUserId({ userId: item.replyUserId }).then((res) => {
            item.avatar = res.data.result[0].avatar;
            //  这俩不是响应式，不知为啥
            this.$set(item, "nickName", res.data.result[0].nickName);
            this.$set(item, "email", res.data.result[0].email);
          });
        });

        this.updateTalkList({ talkList: result });
        // 路由跳转之后初始化talking 以及一些处理
        if (this.$route.query.talkId) {
          let index = 0;
          this.disabled = false;

          for (let item of result) {
            if (item.talkUserId === this.$route.query.talkId) {
              this.updatetalking({ talking: item });

              this.talkWithOther(index);
              break;
            }
            index++;
          }
        }
      });
    },

    // 获取会话内容
    talkWithOther(index) {
      if (this.talkActive === index) return;

      this.isEnd = false; //换个对话时重置
      this.talkMessageList = [];
      this.updateTalkActive({ talkActive: index });
      this.updatetalking({ talking: this.talkList[this.talkActive] });

      let params = Object.assign(this.getNum, {
        talkUserId: this.talking?.talkUserId,
      });
      this.initMsg(params,index);
      this.$nextTick(() => {
        this.$refs.msgContent.scrollTop = 1;
        console.log(this.$refs.msgContent.scrollTop);
        this.$refs.textarea.focus();
        this.disabled = false;
      });
    },

    // 获取消息
    initMsg(params,currentIndexMsg) {
      // 处理消息渲染位置
      this.findTalkMessage(params).then((res) => {
        console.log(res);
        res.data.result.rows.forEach((item, index) => {
          if (item.replyUserId === this.userInfo.userId) {
            item.other = "1";
          }
        });

        if (res.data.result.count === 0) return;
        this.getNum.total = res.data.result.count;
        this.getNum.offsetNum = 0;
        this.getNum.page = 1;

        this.talkMessageList.push(...res.data.result.rows.reverse());
      });
    },

    // 滚动加载消息 节流
    scrollLoadData(e) {
      if (this.timer) return;
      this.timer = setTimeout(() => {
        this.prescrollHeight = this.$refs.msgContent.scrollHeight;

        if (this.$refs.msgContent.scrollTop === 0 && !this.isEnd) {
          ++this.getNum.page;

          if (this.getNum.offsetNum > this.getNum.total) {
            this.getNum.offsetNum = this.getNum.total;
            this.isEnd = true;
          }
          this.getNum.offsetNum = this.getNum.page * this.getNum.limitNum;

          let params = Object.assign(this.getNum, {
            talkUserId: this.talking?.talkUserId,
          });
          // 处理消息渲染位置
          this.findTalkMessage(params).then((res) => {
            res.data.result.rows.forEach((item, index) => {
              if (item.replyUserId === this.userInfo.userId) {
                item.other = "1";
              }
            });

            if (res.data.result.count === 0) return;
            this.talkMessageList.unshift(...res.data.result.rows.reverse());
            this.$nextTick(() => {
              this.$refs.msgContent.scrollTop =
                this.$refs.msgContent.scrollHeight - this.prescrollHeight;
            });
          });
        }
        this.timer = false;
      }, 500);
    },

    inputFoucs() {
      if (this.talkActive < 0) return;
      this.disabled = false;
      // 标记当前消息中是否有未读消息
      let flag = this.talkMessageList[this.talkMessageList.length-1]?.isRead === "0" && this.talkMessageList[this.talkMessageList.length-1]?.other === '1'
      if(flag){
        this.$refs.leftItem[this.talkActive].isRead = true
        this.$refs.leftItem[this.talkActive].read(); //触发已读操作
      }
    },

    // 发送消息
    sendMsg() {
      if (this.text.length <= 0 || this.talkActive < 0) return;
      let params = Object.assign({
        text: this.text,
        talkUserId: this.talking.talkUserId,
        replyUserId: this.talking.replyUserId,
      });

      this.addTalkMessage(params).then((res) => {
        let { status, result } = res.data;
        let sendData = Object.assign({}, result);

        this.talkMessageList.push(result);
        this.$refs.leftItem[this.talkActive].newText = this.text; //更新己方最新消息展示（右侧）

        this.$nextTick(() => {
          this.$refs.msgContent.scrollTop = this.$refs.msgContent.scrollHeight;
        });

        // 更新会话最新消息
        this.updateTalk({
          newMsgOne: this.text,
          talkUserId: this.talking.talkUserId,
        }).then((res) => {});
        this.$socket.emit("chat message", sendData);
        this.text = "";
        this.count = 0;
      });
    },

    // 计算输入字数
    countText() {
      if (this.count > 300) {
        this.text = this.text.slice(0, 300);
      } else {
        this.disabled = false;
      }
      this.count = this.text.length;
    },
  },

  // 接收消息
  sockets: {
    recerveMsg(msg) {
      if (this.talkActive < 0) return;
      msg.replyUserId = this.userInfo.userId ? (msg.other = "1") : "";
      // this.talkList[this.talkActive];
      msg.talkUserId === this.talking.talkUserId ? this.talkMessageList.push(msg) : '';//在当前页面时将新消息push进去
      let UnTalkCount = this.UnTalkCount + msg.unReadCount;
      this.updateUnTalkCount({ UnTalkCount });

      // this.$nextTick(() => {
      //   // this.$refs.msgContent.scrollTop = this.$refs.msgContent.scrollHeight;
      // });
    },
  },

  created() {
    this.init();
  },

  mounted() {
    const body = window.document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";
  },
  beforeDestroy() {
    const body = window.document.getElementsByTagName("body")[0];
    body.style.overflow = "auto";
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/comment.scss";

.talk {
  width: 100%;
  height: 100%;
  background: $workspaceBgColor;
  .content {
    position: relative;
    margin: 0 auto;
    width: $mainWidth;
    height: 100vh;
    overflow: hidden;
    // background: pink;
    .container {
      position: absolute;
      top: 25px;
      left: 15px;
      right: -90px;
      bottom: 140px;
      display: flex;
      box-sizing: border-box;
      border-radius: 16px;
      overflow: hidden;

      .left {
        width: 28%;
        background: #3d3d3d;
        height: 100%;
        overflow-y: hidden;
        padding: 12px 0 0 0;
        .left_head {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 70px;
          font-size: 16px;
          padding: 16px;
          border-bottom: 1px solid rgba(230, 230, 230, 0.6);

          .imgBox {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 47px;
            height: 47px;
            border-radius: 50%;
            box-sizing: border-box;
            // overflow: hidden;
            background: rgb(255, 255, 255);
            cursor: pointer;

            img {
              width: 100%;
              border-radius: 50%;
            }
          }
          .name {
            width: 160px;
            font-size: 16px;
            font-weight: 400;
            color: white;
            margin-left: 20px;
            @include ellipsis(1, nowrap);
          }
        }
        .left_content {
          overflow-y: auto;
          height: 100%;
          font-size: 14px;
          color: white;

          .left_item {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            height: 80px;
            font-size: 16px;
            margin-bottom: 2px;
            box-sizing: border-box;
            background: #3d3d3d;
            overflow: hidden;
          }
        }

        ::-webkit-scrollbar {
          width: 8px !important;
          height: 100%;
        }

        ::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        width: 65%;
        background: #ffffff;
        height: 100%;
        overflow-y: hidden;
        border-radius: 0 16px 16px 0;
        color: $normalTextColor;

        .right_head {
          font-size: 16px;
          font-weight: 600;
          text-align: left;
          line-height: 70px;
          padding-left: 10px;
          height: 70px;
          width: 100%;
          border-bottom: 1px solid rgba(176, 170, 170, 0.6);
        }
        .right_content {
          position: relative;
          font-size: 14px;
          font-weight: 300;
          padding: 20px 10px 10px 10px;
          overflow-y: scroll;
          width: 100%;
          height: 100%;
          flex: 1;
          border-bottom: 1px solid rgba(184, 179, 179, 0.6);

          .isend {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            padding: 5px;
            font-size: 12px;
            color: #999;
            width: 100%;
            text-align: center;
          }

          .right_item {
            padding: 10px 0;

            .time {
              font-size: 12px;
              color: #999;
              width: 100%;
              text-align: center;
              padding-bottom: 8px;
            }
            .messagebox {
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              width: 100%;
              height: auto;
              .imgbox3 {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                overflow: hidden;
                background: #e8e8e8;

                img {
                  width: 100%;
                  border-radius: 50%;
                }
              }
            }

            .text {
              position: relative;
              margin-left: 12px;
              padding: 4px 12px;
              line-height: 28px;
              min-width: 52px;
              max-width: 500px;
              height: auto;
              font-size: 14px;
              color: #8b4513;
              // overflow: hidden;
              background: #f5f6f7;
            }
            .text::after {
              display: inline-block;
              content: "";
              position: absolute;
              top: 11px;
              right: 100%;
              border-right: 6px solid #f5f6f7;
              border-top: 6px solid transparent;
              border-bottom: 6px solid transparent;
              border-left: 6px solid transparent;
              width: 0;
              height: 0;
            }

            // 右侧
            .text2 {
              position: relative;
              margin-right: 12px;
              padding: 4px 12px;
              line-height: 28px;
              min-width: 52px;
              max-width: 500px;
              height: auto;
              font-size: 14px;
              color: #8b4513;
              background: #f5f6f7;
            }
            .text2::before {
              display: inline-block;
              content: "";
              position: absolute;
              top: 11px;
              left: 100%;
              border-left: 6px solid #f5f6f7;
              border-top: 6px solid transparent;
              border-bottom: 6px solid transparent;
              border-right: 6px solid transparent;
              width: 0;
              height: 0;
            }
          }
        }

        ::-webkit-scrollbar {
          width: 4px !important;
          height: 100%;
        }
        .input {
          width: 100%;
          height: 130px;
          padding: 10px 10px 0 10px;

          textarea {
            width: 100%;
            height: 100%;
            resize: none;
            background: #ffffff; /*将边框去掉*/
            border: 0; /*设置宽度高度*/
            font-size: 16px; /* placeholder位置 提示靠左靠右居中等 */
            text-align: left;
          }

          textarea:focus {
            outline: none;
            border: 0.1px solid var(--primary-color);
            box-shadow: -3px -3px blur 3px var(--primary-color);
          }

          // placeholder文字改变颜色和一行超出显示省略句号
          textarea::-webkit-input-placeholder {
            color: rgba(0, 0, 0, 0.25);
            line-height: 33px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 16px;
          }

          // placeholder改变滚动条样式
          textarea::-webkit-scrollbar {
            height: 0;
            width: 0;
            color: transparent;
          }

          input:-moz-placeholder,
          textarea:-moz-placeholder {
            font-size: 16px;
            line-height: 16px;
          }

          input:-ms-input-placeholder,
          textarea:-ms-input-placeholder {
            font-size: 16px;
            line-height: 16px;
          }

          input::-webkit-input-placeholder,
          textarea::-webkit-input-placeholder {
            font-size: 16px;
            line-height: 16px;
          }
        }

        .enter {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-size: 12px;
          color: #ccc;
        }
      }

      .dontChioce {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 65%;
        background: #ffffff;
        height: 100%;
        overflow-y: hidden;
        border-radius: 0 16px 16px 0;
        color: $normalTextColor;

        font-size: 25px;
        font-weight: 600;
        color: $normalTextColor;
      }
    }
  }
}
</style>