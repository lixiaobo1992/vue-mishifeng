x<template>
  <div class="page-message" :class="{ headerTop: isOldVersion }">
    <Header
      ref="profileHeader"
      class="my-header"
      :left-options="{ showBack: false }"
      :title="''"
      :fixed="true"
      v-if="!isMSF"
    >
      <img class="icon-right" src="~assets/img/right.png" @click="goBack()" />
      <span>收到的赞和收藏</span>
    </Header>
    <div class="list-item">
      <div class="item" @click="goMessage(1)">
        <div class="item-img">
          <img src="../assets/message/praise.png" /><i
            class="new dot"
            v-show="messageData.like_favorite.count"
          ></i>
        </div>
        <span>赞和收藏</span>
      </div>
      <div class="item" @click="goMessage(2)">
        <div class="item-img">
          <img src="../assets/message/comment@3x.png" />
          <i class="new dot" v-show="messageData.comment.count"></i>
        </div>
        <span>评论</span>
      </div>
      <div class="item" @click="goMessage(3)">
        <div class="item-img">
          <img src="../assets/message/fans@3x.png" />
          <i class="new dot" v-show="messageData.fans.count"></i>
        </div>
        <span>粉丝</span>
      </div>
    </div>
    <div class="line"></div>
    <div class="list-box">
      <div
        class="box"
        v-for="(item, index) in messageData.notice.list"
        :key="'notice_' + index"
        :item="item"
        @click="goMessage(4)"
      >
        <div class="box-img"><img src="../assets/message/news.png" /></div>
        <div class="center-text">
          <span class="bold ellipsis">通知消息</span>
          <p class="ellipsis">{{ item.title }}</p>
          <div class="line-box"></div>
        </div>
        <div class="right-desc">
          <span class="time">{{ item.created_at | dateFilter }}</span>
          <i class="new notice" v-show="messageData.notice.count"></i>
        </div>
      </div>
      <div
        class="box"
        v-for="(item, index) in messageData.follow.list"
        :key="'follow_' + index"
        :item="item"
        @click="goMessage(5)"
      >
        <div class="box-img"><img src="../assets/message/attention.png" /></div>
        <div class="center-text">
          <span class="bold ellipsis">关注消息</span>
          <p class="ellipsis">{{ item.title }}</p>
        </div>
        <div class="right-desc">
          <span class="time">{{ item.created_at | dateFilter }}</span>
          <i class="new notice" v-show="messageData.follow.count"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api';
import { dateFilter } from '@/utils/base/filter-date';
import Header from '@/ui/Header';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import tongji from '@/utils/tongji';
export default {
  components: {
    Header,
  },
  data() {
    return {
      messageData: {},
      isMSF: device.msf,
      isOldVersion: false,
    };
  },
  filters: {
    dateFilter(val) {
      return dateFilter(val, 1);
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    if (this.isMSF) {
      this.isOldVersion = this.$version.lte('1.4.4');
    }
  },
  methods: {
    goMessage(type) {
      const eventType = [
        {
          type: 'c_msg_like',
          getNewMsg: this.messageData.like_favorite.count ? 1 : 0,
        },
        {
          type: 'c_msg_comment',
          getNewMsg: this.messageData.comment.count ? 1 : 0,
        },
        {
          type: 'c_msg_follower',
          getNewMsg: this.messageData.fans.count ? 1 : 0,
        },
        {
          type: 'c_msg_system',
          getNewMsg: this.messageData.notice.count ? 1 : 0,
        },
        {
          type: 'c_follow_update',
          getNewMsg: this.messageData.follow.count ? 1 : 0,
        },
      ][type - 1];
      console.log(eventType, 'eventType');
      tongji.event(eventType.type, `value:{getNewMsg:${eventType.getNewMsg}}`);
      this.$forward('comment-list', { type });
    },
    goBack() {
      this.$back();
    },
    initData() {
      api.getMessage(
        {},
        res => {
          this.messageData = res.data;
        },
        err => {
          console.log(err, 'err');
        }
      );
    },
  },
  beforeDestroy() {
    bridge.offPageShow({});
  },
};
</script>
<style lang="stylus" scoped>
.icon-right{
  color: #fff;
  position: absolute;
  left: .15rem;
  top: .1rem;
  height: .2rem;
  width: .2rem;
  line-height: .5rem;
}
>>> .cm-header.is-fixed {
  background :url('~assets/img/header-bg.png') no-repeat;
  background-size:100% auto;
  background-position :center;
  span {
    font-size:17px;
    color:#231815;
    font-family: 'PingFangSC-Semibold';
  }
}
.page-message {
  width:100%;
  height:100%;
  background-color:#fff;
  padding-top:44px;
}
.list-item {
  display:flex;
  flex-direction :row;
  align-content :space-between;
}
.new {
  width:8px;
  height:8px;
  background :#FF5B00;
  border-radius:8px;
}
.item {
  flex :1;
  text-align :center;
  font-size:12px;
  color:#171900;
  .item-img {
    width:45px;
    height:45px;
    margin: 22px auto 8px;
    position: relative;
    border-radius :10px;
    img {
      width:45px;
      height:45px;
    }
  }
  .dot {
    position :absolute;
    top:-2px;
    right:-2px;
    border:1px solid #fff;
  }
}

.line{
  height:8px;
  width:100%;
  background :#F6F7F9;
  margin:8px auto;
}
.list-box {
  display :flex;
  flex-direction :column;
  margin: 15px 10px;
}
.box {
  display:flex;
  flex-direction :row;
  align-content :space-between;
  margin-bottom :10px;
  .box-img {
    width:40px;
    height:40px;
    margin-right:13px;
    display :block;
    img {
      width:40px;
      height:40px;
    }
  }
  .center-text {
    flex:1;
    position:relative;
    width:60%;
    .bold {
      font-size:14px;
      font-weight:bold;
      color:#231815;
      display :inline-block;
    }
    p{
      font-size:12px;
      color:#bbb;
      padding-top:8px;
      padding-bottom :15px;
    }
    .line-box {
      position :absolute;
      bottom:0;
      background :#E2E2E2;
      height:1px;
      transform: scaleY(0.5);
      width:120%;
      right:-55px;
      margin-top :12px;
    }
  }
  .right-desc {
    width:84px;
    height:40px;
    text-align :right;
    .time {
      color:#9b9b9b;
      font-size:12px;
      max-width:100%;
      overflow :hidden;
    }
    .notice {
      display:block;
      margin: 6px auto;
      line-height:20px;
    }
  }
}
.headerTop{
  padding-top:0;
}
</style>
