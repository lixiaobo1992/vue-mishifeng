<template>
  <div class="comment-item">
    <div class="left-icon" @click="goProfile(item.id)" v-if="timeStatus">
      <Avatar
        :src="item.avatar"
        :size="40"
        bg="#fff"
        :navSatus="item.userType"
        :navsrc="vipsrc"
        :maskColor="bgavatar"
        class="avatar"
      >
      </Avatar>
    </div>
    <div class="comment-desc" @click.stop="reply(item)">
      <div class="conent">
        <span class="cm-user-name">{{ item.userName }}</span>
        <div class="cm-like-box" v-if="likesStatus" @click.stop="isLike(item)">
          <span class="like-number">{{ item.likesNum }}</span>
          <img
            src="../assets/img/good-icon.png"
            v-if="item.isPraise"
            class="like-ok"
          />
          <img
            src="../assets/img/good-icon-no.png"
            v-if="!item.isPraise"
            class="like-no"
          />
        </div>
        <sub class="content-sub" v-show="!timeStatus" @click.stop="reply(item)">
          :&nbsp;{{ item.content }}</sub
        ><br /><i v-html="item.time" class="times" v-show="timeStatus"></i>
      </div>
      <!-- <div class="times"></div> -->
      <div class="user-desc">
        <div class="user-name floor" v-show="timeStatus">
          <p class="inline" v-show="item.reply_to_userName">
            <i class="reply-to">回复</i
            ><i class="blue">@{{ item.reply_to_userName }}</i
            >:
          </p>
          {{ item.content }}
        </div>
      </div>
      <div class="reply-detail" v-show="item.count && timeStatus">
        <reply-item
          v-for="(itemSub, ind) in item.replayList"
          :key="ind"
          :itemSub="itemSub"
          v-show="replyStatus"
        >
        </reply-item>
        <span
          class="textleft"
          v-show="item.count > 0"
          @click.stop="goDetail(item.arctileId, item.replyPid)"
          >查看{{ item.count }}条回复</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar';
import ReplyItem from '@/components/ReplyItem';
import api from '@/api';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import tongji from '@/utils/tongji';
import vipsrc from '@/assets/img/vip.png';
export default {
  name: 'comment-item',
  components: {
    Avatar,
    ReplyItem,
  },
  props: {
    item: Object,
    bgavatar: String,
    timeStatus: {
      type: Boolean,
      default: true,
    },
    replyStatus: {
      type: Boolean,
      default: true,
    },
    likesStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      comments: [],
      isMSF: device.msf,
      parms: {},
      text: '',
      placeholder: '来，一起聊聊你的想法',
      //bgavatar: '#fff',
      vipsrc: vipsrc,
    };
  },
  methods: {
    goProfile(id) {
      tongji.event('c_user_icon', `value:{primaryCommentAuthorId:${id}}`);
      if (!id) {
        return;
      }
      this.$forward('profile', { id });
    },
    goDetail(id, pid) {
      tongji.event('c_more_secondary_comments');
      this.$forward('comment-detail', {
        id,
        pid,
      });
    },
    reply(item) {
      //console.log(item.id, item.name, item.pid, item.arctileId, 'pid');
      console.log(item.userName, item.replyPid, item.arctileId, 'item');
      if (this.isMSF && this.$version.gt('1.4.4')) {
        //document.activeElement.blur(); // ios隐藏键盘
        //this.$refs.comment.blur(); // android隐藏键盘
        const that = this;
        bridge.showKeyboard({
          keyboardType: 'default',
          returnType: 'send',
          placeholder: '回复 ' + item.userName + '',
          reply_to: item.id,
          userName: item.userName,
          reply_pid: item.replyPid,
          id: item.arctileId,
          success(res) {
            console.log(res);
            const { data } = res;
            that.text = data.content;
            console.log(data, 'data');
            that.parms = data;
            that.onEnter();
            //that.getComment();
            that.$emit('onEnterReply', data);
          },
        });
      } else {
        this.parms = {
          reply_to: item.id,
          userName: name,
          reply_pid: item.replyPid,
          id: item.arctileId,
        };
        // this.placeholder = '回复' + name;
        const data = {
          type: 1,
          placeholder: '回复' + item.userName,
          user_id: item.id,
          reply_pid: item.replyPid,
        };
        console.log(data, 'userData');
        this.$emit('onEnterReply', data);
      }
    },
    onEnter() {
      const val = this.text;
      console.log(val, 'val');
      if (val == '') {
        console.log('不需要调接口');
        return;
      }
      document.activeElement.blur();
      api.commentCreate(
        this.parms,
        res => {
          this.text = '';
          console.log(res);
          const { data } = res;
          if (!data) {
            return;
          }
          this.$emit('onEnter', data);
        },
        err => {
          console.log(err);
        }
      );
    },
    // 2.1版本 点赞
    isLike(item) {
      console.log(item, 'item');
      let { isPraise, replyPid } = item;
      let parms = {
        comment_id: replyPid,
      };
      api.setPraise(
        parms,
        res => {
          console.log(res, 'setPraise');
          if (!isPraise) {
            // 没有点赞
            this.item.isPraise = true;
          } else {
            // 已点赞
            this.item.isPraise = false;
          }
          this.item.likesNum = res.data.likes_num;
        },
        err => {
          console.log(err);
        }
      );
    },
  },
  computed: {},
};
</script>

<style lang="stylus" scoped>
.avatar{
  display: block;
}
.comment-item {
  padding: 10px 0;
  display: flex;
  font-size: 14px;
  color: #231815;
  line-height: 20px;
  overflow: hidden;
  // &:first-child{
  //   background : #fff;
  // }
}
.left-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}
.comment-item .comment-desc {
  margin-left: 10px;
  flex: 1;
  overflow :hidden;
  .conent {
    color:#333;
    font-family :'PingFangSC-Regular';
    position :relative;
    // display:-webkit-box;
    white-space :normal;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    text-overflow :ellipsis;
    line-height:18px;
    overflow:hidden;
    .cm-user-name{
      float: left;
    }
    .cm-like-box{
      float: right;
      .like-number{
        font-size: 12px;
      }
      .like-ok{
        width: 14px;
        height: 14px;
        margin-left: 4px;
      }
      .like-no{
        width: 14px;
        height: 14px;
        margin-left: 4px;
      }
    }
  }
  .content-sub {
    font-size: 14px;
    color:#666;
    bottom:0;
  }
}
.user-desc {
  display: flex;
  color: #333;
  font-size: 14px;
  line-height: 17px;
}
.user-name {
  margin-right: 15px;
  white-space: nowrap;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  position:relative;
  color:#333;
  font-weight:400;
  -webkit-line-clamp :2;
  display :-webkit-box;
  -webkit-box-orient: vertical;
  .reply {
    position :absolute;
    left:0;
    top:0;
    width:320px;
    height: 100%;
    display: block;
    opacity :0;
  }
}
.times {
  white-space: nowrap;
  font-size:12px;
  color:#ccc;
  transform :scale(0.85);
  display :inline-block;
  margin-left:-4px;
  font-family :'PingFangSC-Regular';
  line-height:16px;
}
.reply-detail {
  background : #f6f6f6;
  border-radius :3px;
  padding:8px;
  margin-top:10px;
  margin-right:20px;
  .textleft {
    display :block;
    text-align:right;
    color:#628DB7;
    width:100%;
    font-size:12px;
    font-family :'PingFangSC-Regular';
    line-height:16px;
    padding-top:5px;
  }
}
.blue {
  color:#628DB7;
}
.reply{
  color:#151515;
}
p.inline{
  display:inline;
}
.floor{
  white-space: normal;
}
>>>.bottom-nav {
    height: 0.16rem;
    width: 0.16rem;
    bottom: -0.01rem;
    right: 0.03rem;
}
</style>
