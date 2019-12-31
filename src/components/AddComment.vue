<template>
  <div class="add-comment-block">
    <div class="left-icon mr-right" v-if="showAvatar">
      <Avatar :src="userAvatar" :size="40" bg="" class="avatar"></Avatar>
    </div>
    <div class="input">
      <span
        :class="{ appInput: isMSF }"
        v-if="isMSF && isNewVersion"
        @click="handleInput($event)"
      ></span>
      <input
        type="text"
        name="comment"
        id="comment"
        :placeholder="placeholder"
        v-model="text"
        @keydown.enter="onEnter"
        ref="comment"
      />
    </div>
    <!--蜂蜜弹窗-->
    <HoneyToast :honeyNum="todayHoney" :honeyStatus="signStatus"></HoneyToast>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar';
import HoneyToast from '@/components/HoneyToast';
import api from '@/api';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import tongji from '@/utils/tongji';
import vipsrc from '@/assets/img/vip.png';
export default {
  name: 'AddComment',
  props: {
    articleId: Number,
    userAvatar: String,
    userType: Boolean,
    placeholder: String,
    userName: String,
    userId: Number,
    replyPid: Number,
    showAvatar: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Avatar,
    HoneyToast,
  },
  data() {
    return {
      text: '',
      signStatus: false,
      todayHoney: 1,
      isMSF: device.msf,
      isNewVersion: true,
      parms: {},
      vipsrc: vipsrc,
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.isNewVersion = this.$version.gt('1.4.3');
    let queryParm = this.$route.query;
    if (queryParm.id && queryParm.pid) {
      this.parms = {
        reply_to: parseInt(this.userId),
        //userName: this.userName,
        reply_pid: parseInt(queryParm.pid),
        id: this.articleId || queryParm.id,
      };
    } else {
      this.parms = {
        id: this.articleId || queryParm.id,
      };
    }
  },
  methods: {
    setTimer() {
      this.timer = setInterval(() => {
        this.signStatus = false;
      }, 3000);
    },
    closeSign() {
      this.signStatus = false;
    },
    handleInput(e) {
      tongji.event('c_bottom_more');
      if (this.isMSF) {
        document.activeElement.blur(); // ios隐藏键盘
        this.$refs.comment.blur(); // android隐藏键盘
        //this.$refs.comment.style.display = 'none';
        const that = this;
        bridge.showKeyboard({
          keyboardType: 'default',
          returnType: 'send',
          placeholder: '来，一起聊聊你的想法',
          success(res) {
            const { data } = res;
            that.text = data.content;
            that.onEnter();
          },
        });
      }
    },
    onEnter() {
      const val = this.text;
      if (val == '') {
        return;
      }
      console.log(this.userId, 'userid');
      if (this.userId) {
        this.parms = Object.assign(this.parms, {
          content: val,
          reply_to: this.userId,
          reply_pid: this.replyPid,
        });
      }
      this.parms = Object.assign(this.parms, {
        content: val,
      });
      document.activeElement.blur();
      api.commentCreate(
        this.parms,
        res => {
          this.text = '';
          const { data } = res;
          if (!data) {
            return;
          }
          if (this.userId) {
            data.type = 1;
          } else {
            data.type = 0;
          }
          data.placeholder = '写下你的想法吧';
          data.userId = 0;
          this.$emit('onEnter', data);
          if (res.data.status == 1 && res.data.honey) {
            this.signStatus = true;
            this.todayHoney = res.data.honey;
            this.setTimer();
          }
        },
        err => {
          console.log(err);
        }
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
.signIn-model {
  width: 100%;
  height: 100%;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  .model-con {
    width:190px;
    height:76px;
    background:rgba(0,0,0,.6);
    position:relative;
    right:0;
    left:0;
    margin:-38px auto;
    top:50%;
    border-radius:5px;
    .left-img {
      background-image:url('~assets/profile/honey-model@2x.png');
      background-size:80px 80px;
      background-repeat:no-repeat;
      width:80px;
      height:80px;
      position:absolute;
      top:-26px;
    }
    .right-con {
      position:absolute;
      width:110px;
      height:76px;
      top:14px;
      right:0;
      text-align:center;
      font-size:14px;
      color:#fff;
      span{
        display:block;
        height:24px;
        line-height:24px;
      }
      p {
        margin-top:15px;
      }
    }
    .close {
      width:24px;
      height:24px;
      background-image:url('~assets/profile/close@3x.png');
      background-size:20px 20px;
      background-repeat:no-repeat;
      position:absolute;
      z-index: 999;
      right:-12px;
      top:-32px;
    }
  }
}
.add-comment-block{
  display: flex;
  align-items: center;
  font-size: 14px;
  background-color: #fff;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.mr-right {
  margin-right: 10px;
}
.input {
  flex: 1;
  position: relative;
}
.input input {
  border: none;
  background: #f2f2f2;
  border-radius: 4px;
  width: 100%;
  height: 30px;
  font-size: 12px;
  padding: 5px 8px;
  line-height: 20px;
}
.appInput {
  width:100%;
  height:100%;
  position:absolute;
  top:0;
  left:0;
  z-index:99;
}
</style>
