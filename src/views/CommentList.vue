<template>
  <div class="page-message" :class="{ header: isMSF }">
    <Header
      ref="profileHeader"
      class="my-header"
      :left-options="{ showBack: false }"
      :title="''"
      :fixed="true"
      v-if="!isMSF"
    >
      <img class="icon-right" src="~assets/img/right.png" @click="goback()" />
      <span>{{ messageTitle }}</span>
    </Header>
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck"
    >
      <div
        class="block-list"
        :class="{ 'block-list-type': page.front_type == 4 }"
      >
        <div class="list">
          <template>
            <MessageItem
              v-for="(item, index) in listData"
              :key="index"
              :item="assignObj(item, index)"
              @toggleFollow="toggleFollow"
              v-show="listData"
              :queryType="page.front_type"
            ></MessageItem>
          </template>
        </div>
        <DefaultPage
          :imgItem="imgItem"
          :fontItem="fontItem"
          v-if="!listDataStatus"
        ></DefaultPage>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import bridge from '@/utils/bridge';
import device from '@/utils/device';

import Avatar from '@/components/Avatar';
import MessageItem from '@/components/MessageItem';
import { Scroll } from '@/ui';

import PullListMixin from '@/mixins/pull-list';
import api from '@/api';

import DefaultPage from '@/components/DefaultPage';
import messageDefault from '@/assets/img/no-message.png';
import Header from '@/ui/Header';
import defaultAvatar from '@/assets/login/default-avatar.png';
import tongji from '@/utils/tongji';

const typeArr = [
  { type: 1, title: '收藏的赞和收藏' },
  { type: 2, title: '收到的评论' },
  { type: 3, title: '粉丝列表' },
  { type: 4, title: '通知消息' },
  { type: 5, title: '关注消息' },
];
export default {
  mixins: [PullListMixin],
  components: {
    Avatar,
    MessageItem,
    [Scroll.name]: Scroll,
    DefaultPage,
    Header,
  },
  data() {
    return {
      hasMore: true,
      avatar: '',
      imgItem: {
        src: messageDefault,
        width: 250,
        height: 200,
      },
      fontItem: {
        width: 240,
        desc: '你还没有收到任何消息哦～',
      },
      listData: [],
      totalPage: 1,
      page: {
        page_num: 1, // 当前页
        page_limit: 20, //条目数量
        need_pagination: 1,
        front_type: 0,
        page_cursor: '', //添加游标
      },
      isMSF: device.msf,
      messageTitle: '全部消息',
      listDataStatus: true,
    };
  },
  created() {
    this.page.front_type = parseInt(this.$route.query.type) || 1;
    this.messageTitle = this.flterTitle(this.page.front_type);
  },
  mounted() {
    // 默认进入消息列表，消除未读消息标记
    this.appConfig.unread = 0;
    this.setAppConfig(this.appConfig);
    //const that = this;
    this.isMSF && this.initBridge();
    this.getMessageData();
  },
  computed: {
    ...mapState({
      appConfig: state => state.app.appConfig,
    }),
  },
  beforeDestroy() {
    if (this.isMSF) {
      bridge.disableRefresh(); // 禁止 下拉刷新
      bridge.offPullRefresh(res => {
        console.log('app off PullRefresh', res);
      });
      bridge.offPageShow({});
    }
  },
  methods: {
    ...mapActions(['setAppConfig']),
    flterTitle(type) {
      let title = typeArr.find(item => item.type == type);
      return title.title || '全部消息';
    },
    getMessageData() {
      let params = this.page;
      api.messageList(
        params,
        res => {
          this.page.page_cursor = res.data.age_cursor;
          let list = res.data.list;
          if (!list.length) {
            this.listDataStatus = false;
            return;
          }
          let type = parseInt(this.page.front_type);
          this.totalPage = res.data.total_page;
          let listFilter = [];
          switch (type) {
            case 1: //收藏和点赞
              listFilter = list.filter(item => {
                return item.type == 2 || 3;
              });
              break;
            case 2: //文章被评论
              listFilter = list.filter(item => {
                return item.type == 4 || 10;
              });
              break;
            case 3: // 用户关注消息
              listFilter = list.filter(item => {
                return item.type == 1;
              });
              break;
            case 4: // 用户通知消息
              listFilter = list.filter(item => {
                return item.type == 6 || 7 || 8 || 9 || 11;
              });
              break;
            case 5: // 用户关注消息
              listFilter = list.filter(item => {
                return item.type == 1 || 5;
              });
              break;
            default:
              listFilter = list;
              break;
          }
          if (this.isMSF) {
            const that = this;
            bridge.setNavigationBar({
              title: that.messageTitle,
              color: '#171900',
              success(res) {
                console.log(res);
              },
            });
            if (this.page.page_num == 1) {
              this.listData = [];
            }
            bridge.stopRefresh();
          }
          this.listData = this.listData.concat(listFilter);
          this.listData.forEach(item => {
            return {
              type: item.type, // 消息类型
              sender_nickname: item.sender_nickname, // 对方昵称
              sender_avatar: item.sender_avatar || defaultAvatar, // 对方头像
              status: item.status, // 消息状态，1未读 2已读 3作废
              title: item.title, // 内容
              is_followed: item.is_followed,
              sender_id: item.sender_id, // 对方id
              article_id: item.article_id, //文章id
              created_at: item.created_at, // 创建
              content: item.content, // 评论内容
              system_link: item.system_link,
              article_title: item.article_title,
              quality_user: item.sender_quality_user == 1 ? true : false,
            };
          });
        },
        error => {
          this.listDataStatus = false;
        }
      );
    },
    initBridge() {
      const that = this;
      bridge.enableRefresh(); // 开启刷新
      // 监听下拉刷新
      bridge.onPullRefresh({
        success(res) {
          that.onRefresh();
        },
      });
    },
    goback() {
      this.$back();
    },
    onScrollToLower() {
      if (this.totalPage > this.page.page_num) {
        this.page.page_num++;
        !this.isMSF && this.$showLoading();
        setTimeout(() => {
          this.getMessageData();
        }, 2000);
      } else {
        this.finishedTip = '没有更多数据了!';
        this.finished = true;
      }
    },
    onRefresh() {
      this.page.page_num = 1;
      !this.isMSF && this.$showLoading();
      setTimeout(() => {
        this.getMessageData();
      }, 2000);
    },
    toggleFollow(result, index, listType) {
      let followed = result == 3 ? false : true;
      const value = `value:{ followerId:${this.listData[index].sender_id}},followed:${followed}`;
      tongji.event('c_notification_msg', value);
      this.$set(this.listData[index], `is_followed`, followed);
    },
    assignObj(item, index, listType) {
      return Object.assign(item, {
        index,
        listType,
      });
    },
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
  span{
    color:#231815;
    font-size:17px;
    font-family: PingFangSC-Semibold;
  }
}
.page-message {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top:44px;
}
.header {
  padding-top:15px;
}
.block-list{
  padding-right: 15px
}
.block-list-type {
  padding-right:0;
}
.message-block{
  margin-bottom: 10px;
}
.block-title{
  padding-left: 15px
}
.block-title .title{
  width: 100%;
  border-bottom: 1px solid #e2e2e2;
  font-size: 14px;
  line-height: 30px;
}
.is-finish{
  width: 100%;
  text-align: center;
  line-height: 40px;
}
>>>.vue-pull-scroll .not-data {
  display:none;
}
>>>.default-page {
  padding-left:15px;
}
</style>
