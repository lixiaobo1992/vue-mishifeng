<template>
  <div class="item" :class="{ active: item.status == 1, type: queryType == 4 }">
    <div class="item-desc" :class="{ 'item-desc-type': queryType == 4 }">
      <div
        class="left-icon"
        @click="goProfile(item.sender_id)"
        v-if="queryType !== 4"
      >
        <Avatar
          :src="item.sender_avatar"
          :size="38"
          bg=""
          class="avatar"
          :navsrc="vipsrc"
          :navSatus="item.quality_user"
        >
        </Avatar>
      </div>
      <div
        class="content"
        :class="{ conType: queryType == 4 }"
        @click="goDetail(item)"
      >
        <div
          class="item-users ellipsis"
          :class="{ itemtype: !item.article_pic, userType: queryType == 4 }"
        >
          <b
            v-show="item.type != 7 && item.type != 8 && item.type != 9"
            v-if="item.sender_nickname"
            class="title"
            >{{ item.sender_nickname }}</b
          >
          <i :class="{ bold: queryType === 4 }">
            {{ item.title }}
          </i>
        </div>
        <div
          class="item-active ellipsis"
          :class="{ textType: queryType == 4 }"
          v-if="showDom"
        >
          {{ item.content }}
          <!-- <sub v-show="item.type == 7">点击去修改>>></sub> -->
        </div>
        <div
          class="item-active ellipsis"
          :class="{ textType: queryType == 4 }"
          v-else
        >
          {{ item.article_title }}
        </div>
        <div class="time" :class="{ timeType: queryType == 4 }">
          {{ item.publish_at | dateFilter }}
          <p v-show="item.type == 4">回复</p>
        </div>
      </div>
      <div class="right-icon" v-show="item.type == 1 || queryType !== 4">
        <div
          class="btn follow-btn"
          :class="{ 'btn-full': !item.is_followed }"
          v-if="item.type == 1"
          @click="
            toggleFollow(
              item.sender_id,
              item.index,
              item.is_followed,
              item.listType
            )
          "
        >
          {{ item.is_followed ? '已关注' : '回粉' }}
        </div>
        <div
          class="btn see-btn"
          v-else-if="item.type == 6 || item.type == 7 || item.type == 9"
          @click="goForward(item.system_link, item.type)"
          v-show="item.system_link"
        >
          <!-- && item.btnLink -->
          查看
        </div>
        <div
          class="right-image"
          @click="goDetail(item)"
          v-else
          v-show="item.article_pic"
        >
          <img :src="item.article_pic" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar';
// import { storage } from '@dwdjs/utils';
import api from '@/api';
import { formatDate } from '@/utils/base/date';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import tongji from '@/utils/tongji';
import vipsrc from '@/assets/img/vip.png';
export default {
  name: 'MessageItem',
  components: {
    Avatar,
  },
  props: {
    item: Object,
    queryType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      vipsrc,
      isMSF: device.msf,
    };
  },
  computed: {
    showDom() {
      return [6, 7, 8, 9, 17, 20, 21, 22, 23].includes(this.item.type);
    },
  },
  beforeMount() {
    console.log(this.props.queryType, 'queryType');
  },
  filters: {
    dateFilter(val) {
      let timestamp = Math.floor(Date.parse(new Date()) / 1000);
      let day = timestamp - val;
      let numDay = 24 * 3600;
      let days = Math.floor(day / numDay);
      if (days == 0 && formatDate(timestamp, 'M-D') == formatDate(val, 'M-D')) {
        val = '今天 ' + formatDate(val, 'H:F');
        return val;
      } else if (
        days == 0 &&
        formatDate(timestamp, 'M-D') !== formatDate(val, 'M-D')
      ) {
        val = '昨天';
        return val;
      } else {
        return formatDate(val, 'M-D');
      }
    },
  },
  methods: {
    toggleFollow(id, index, is_followed, listType) {
      const value = `value:{ followerId:${id}},followed:${is_followed}`;
      tongji.event('c_notification_msg', value);
      api.toggleFollow(
        {
          follow_user_id: id,
        },
        res => {
          console.log(res);
          const { result } = res.data;
          if (result) {
            this.$emit('toggleFollow', result, index, listType);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    goDetail(item) {
      const msgType = this.$props.queryType;
      const url =
        'https://topic.doweidu.com/?id=94e8d4f521202828b099e29f0a118cda&origin=msf&target_type=h5';
      switch (item.type) {
        case 1:
          tongji.event(
            'c_notification_msg',
            `value:{ followerId:${item.article_id}}`
          );
          this.$forward('profile', { id: item.receiver_id });
          break;
        case 4:
          this.$forward('comments', { id: item.article_id });
          break;
        case 5:
          tongji.event('c_user_icon', `value:{ followerId:${item.article_id}}`);
          if (item.media_type == 1) {
            this.$forward('article', { id: item.article_id });
          } else {
            if (this.isMSF) {
              const that = this;
              bridge.getNativePath({
                success(res) {
                  let { pathList } = res.data;
                  if (pathList.indexOf('video-list') >= 0) {
                    that.$forward('video-list', {
                      id: item.article_id,
                      type: 4,
                      member: msgType == 5 ? item.sender_id : item.receiver_id,
                    });
                  } else {
                    that.$forward('article', { id: item.article_id });
                  }
                },
              });
            } else {
              this.$forward('article', { id: item.article_id });
            }
          }
          break;
        case 6:
          // this.$forward('/festival/index');
          this.goForward(item.system_link, item.type);
          break;
        case 7:
          this.$forward('/festival/index');
          break;
        case 9:
          this.$forward('honey-detail');
          break;
        case 10:
          this.$forward('comment-detail', {
            id: item.article_id,
            pid: item.reply_pid,
          });
          break;
        case 11:
          this.$forward('profile', { id: item.invited_user_id });
          break;
        case 12:
          this.$forward('article', { id: item.related_id });
          break;
        case 13:
          this.$forward('/festival/index');
          break;
        case 14:
          this.$forward('/festival/index');
          break;
        case 15:
          this.$forward('/festival/index');
          break;
        case 16:
          this.$forward('/festival/index');
          break;
        case 17:
          this.$forward('publish', { id: item.related_id, edit: true });
          break;
        case 22:
          this.goForward(url);
          break;
        case 23:
          this.$forward('product');
          break;
        default:
          if (item.media_type == 1) {
            this.$forward('article', { id: item.article_id });
          } else {
            if (this.isMSF) {
              const that = this;
              bridge.getNativePath({
                success(res) {
                  let { pathList } = res.data;
                  if (pathList.indexOf('video-list') >= 0) {
                    that.$forward('video-list', {
                      id: item.article_id,
                      type: 4,
                      member: msgType == 5 ? item.sender_id : item.receiver_id,
                    });
                  } else {
                    that.$forward('article', { id: item.article_id });
                  }
                },
              });
            } else {
              this.$forward('article', { id: item.article_id });
            }
          }
          break;
      }
    },
    goProfile(id) {
      if (!id) {
        return;
      }
      tongji.event('c_user_icon', `value:{ relatedUserId:${id}}`);
      this.$forward('profile', { id });
    },
    goForward(url, type) {
      if (type == 9) {
        this.$forward('honey-note');
        return;
      }
      if (!url) return;
      this.$forward(url);
    },
  },
};
</script>

<style lang="stylus" scoped>
.item{
  padding-left: 10px;
  border-left: 5px solid #fff;
}
.type {
  padding-left:0;
  border-left:0;
}
.active{
  border-left: 5px solid #FDCC02;
  font-weight: 600;
}
.ellipsis{
  overflow: hidden;
  text-overflow: initial;
  white-space: inherit;
}
.textType{
  padding:5px 40px;
  color:#666;
}
.item-active{
  width: 100%;
  sub{
    bottom:0;
  }
}
.item-desc{
  border-bottom: 0.5px solid #e2e2e2;
  padding: 10px 0;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #110C00;
  line-height: 17px;
}
.item-desc-type{
  border-bottom: 5px solid #f1f1f5;
}
.left-icon{
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}
.avatar{
  display: block;
}
.content{
  height: 100%;
  padding: 0 10px;
  text-align: left;
  width: 100%;
}
.conType{
  padding:3px 0 0;
}
.title{
  padding-right:5px;
}
.item-users{
  color: #231815;
  font-weight: 600;
  line-height:18px;
  i,p{
    font-weight :normal;
    color: #110C00;
    font-size:14px;
    &.bold {
      font-weight:bold;
      position:relative;
      padding:0 40px;
      display :block;
      &:after{
        content:'';
        position:absolute;
        top:0;
        left:0;
        width:30px;
        height:15px;
        background-image:url('~assets/message/inform-left.png');
        background-size:100% auto;
        background-repeat:no-repeat
      }
    }
  }
  span{
    display :block;
  }
}
.itemtype{
  width:100%;
  white-space :normal;
}
.time {
  font-size: 12px;
  color: #9B9B9B;
}
.timeType {
  padding-left:40px;
  color:#999;
}
.item-users span{
  font-weight: normal;
  &.bold{
    font-weight: bold;
  }
}
.active .item-users span{
  font-weight: 600;
}
.right-icon{
  width:50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right-image{
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.right-image img{
  width: 100%;
  height: 100%;
}
.btn{
  text-align center
  font-size 13px
  color #171900
  border-radius 11px
  line-height:24px;
  width:68px;
  font-family: PingFangSC-Regular;
}
.follow-btn{
  border 1px solid #FDE044;
  color #FDBF00;
}
.btn-full{
  background-color #fdcc02
  color #171900
}
.see-btn{
  border 1px solid #fdcc02
  background-color #fdcc02
}
p{
  display :inline-block;
}
</style>
