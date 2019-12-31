<template>
  <div
    class="page-profile"
    :class="{ profile: !isMSF }"
    v-show="userStatus"
    ref="appProfile"
  >
    <Header
      ref="profileHeader"
      class="my-header"
      :left-options="{ showBack: false }"
      :title="''"
      :fixed="true"
      v-if="!isMSF"
      :style="headerStyle"
    >
      <span class="my-header-right" slot="right" v-if="isSelf">
        <img
          src="~assets/profile/service.png"
          class="service"
          @click="goNext('goService')"
        />
        <img
          src="~assets/profile/setting.png"
          class="setting"
          @click="goNext('goSetting')"
        />
      </span>
      <span class="header-right-share" slot="right" @click="onShare" v-else>
        <img src="~assets/shop/icon_share.png" alt="" />
      </span>
    </Header>
    <Scroll
      class="my-scroll"
      v-model="pullLoading"
      :isLoading="isLoading"
      :finished="finished"
      :listLen="listData.length"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck"
    >
      <div
        class="profile-top"
        ref="appHeader"
        :class="{ topHeader: latestVersion }"
      >
        <div class="content">
          <div class="user-avatar">
            <Avatar
              :src="avatar"
              :size="80"
              maskColor="#FEDB00"
              :navType="navType"
              :navSatus="navSatus"
              class="avatar"
            >
            </Avatar>
          </div>
          <div class="heat">
            <div class="info-name">
              <div class="name-text">{{ nickname }}</div>
              <div
                class="level-box"
                v-for="(levelItem, LevelIndex) in levelList"
                :key="LevelIndex"
              >
                <img
                  v-if="userLevel === levelItem.level"
                  class="name-level"
                  :src="levelItem.image"
                />
              </div>
            </div>
            <div class="heat-info">
              <div
                class="info"
                v-for="(item, index) in fansInfo"
                :key="index"
                @click="goFansList(index)"
                v-show="fansInfo"
              >
                <p class="info-num">{{ item.num }}</p>
                <p class="info-title">{{ item.title }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="personal-desc">{{ introduction }}</div>
        <span class="signHoney" v-if="isSelf" ref="signHoney">
          <img src="~assets/profile/jar.png" class="jar" />
          <p>{{ signInText }}</p>
        </span>
        <span
          class="isfollow Follow"
          v-else
          :class="{ isFollowed: isFollowed }"
          @click="goNext('follow')"
          ><i>+</i>{{ followBtnText }}</span
        >
        <div class="bg-square"></div>
      </div>
      <div v-show="!hidePage">
        <div v-if="isSelf" class="sign-in" ref="signIn">
          <div class="sign-content">
            <div class="sign-item" @click="goNext('getMore')">
              <div class="profile-icon">
                <img src="~assets/profile/honey@429.png" />
                <sup v-if="this.honey > 0"
                  >{{ this.honey }}g
                  <i v-if="this.honey >= 9999" class="add-sign">+</i></sup
                >
              </div>
              <p>我的蜂蜜</p>
            </div>
            <div class="sign-item" @click="goNext('goOrder')">
              <div class="profile-icon">
                <img src="~assets/profile/order@429.png" />
              </div>
              <p>我的订单</p>
            </div>
            <div class="sign-item" @click="goNext('goGift')">
              <div class="profile-icon">
                <img src="~assets/profile/gift-profile@2x.png" />
              </div>
              <p>邀请有礼</p>
            </div>
            <div class="sign-item" @click="goNext('goLevel')">
              <div class="profile-icon">
                <img src="~assets/profile/bee-no@429.png" />
              </div>
              <p>我的等级</p>
            </div>
            <div
              class="sign-item"
              @click="goNext('goSetting')"
              v-show="!isNewVersion"
            >
              <div class="profile-icon"><Icon type="setting"></Icon></div>
              <p>账号设置</p>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-tags" :style="tagsBoxStyle">
        <Tags
          :tags="tags"
          :center="true"
          :curtIndex="curtIndex"
          @onTagClick="onTagClick"
        ></Tags>
      </div>
      <div class="profile-list">
        <WaterFall
          ref="waterfall"
          :has-cover="hasCover"
          :init-data="initData"
          @ontap="onArticleTap"
          @ondelete="onDelete"
          @oncomplete="onComplete"
        ></WaterFall>
      </div>
      <div class="profile-no-data" slot="not-data">
        <DefaultPage :imgItem="imgItem" :fontItem="fontItem"></DefaultPage>
      </div>
      <div
        class="profile-finished-tip"
        slot="finishedTip"
        v-if="curtIndex == 0 && isSelf"
      >
        <div>继续分享你的觅食心得吧！</div>
        <div class="tip-icon">
          <img class="image" src="~assets/index/home_article_end.png" />
        </div>
      </div>
    </Scroll>
    <!-- 蜂蜜弹窗 -->
    <HoneyToast :honeyNum="todayHoney" :honeyStatus="signStatus"></HoneyToast>
    <!-- 邀请新人礼的toast -->
    <InvitePop
      :settingStatus="setInfo.settingStatus"
      :setType="setInfo.setType"
      :settingText="setInfo.settingText"
      :btnText="setInfo.btnText"
      @btnEvent="btnEvent"
      v-if="type == 3 && isSelf && isTimeStatus"
    ></InvitePop>
  </div>
</template>

<script>
import api from '@/api';
import { Header, Scroll, Tags } from '@/ui';
import Icon from '@/ui/Icon';
import Avatar from '@/components/Avatar';
import WaterFall from '@/components/WaterFall';
import PullListMixin from '@/mixins/pull-list';
import { mapState, mapActions } from 'vuex';
import { on, off } from '@/utils/event';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import wechat from '@/utils/bridge/wechat';
import scroll from '@/utils/scroll';
import jsReport from '@/config/js-report';
import DefaultPage from '@/components/DefaultPage';
import HoneyToast from '@/components/HoneyToast';
import InvitePop from '@/components/InvitePop';
import store from '@/store';
import defaultLike from '@/assets/img/no-like.png';
import defaultNote from '@/assets/img/no-note.png';
import defaultAvatar from '@/assets/login/default-avatar.png';

import tongji from '@/utils/tongji';

const fansInfo = [
  { title: '粉丝', num: 0 },
  { title: '关注', num: 0 },
  { title: '赞', num: 0 },
  { title: '收藏', num: 0 },
];
export default {
  name: 'profile',
  mixins: [PullListMixin],
  components: {
    Header,
    Scroll,
    Avatar,
    WaterFall,
    Tags,
    Icon,
    DefaultPage,
    HoneyToast,
    InvitePop,
  },
  data() {
    return {
      isMSF: device.msf,
      tags: [],
      tagsBoxStyle: '',
      headerStyle: {
        backgroundColor: 'rgba(255,255,255,0)',
      },
      avatar: '',
      navsrc: '',
      fansInfo,
      nickname: '',
      introduction: '',
      navSatus: false,
      isSelf: true,
      honey: 0,
      isSignIn: false, // 是否签到
      isFollowed: false, // 是否关注
      nickName: '',
      inquiryUserId: '', // 被查询的用户id
      hidePage: true,
      curtIndex: 0, //当前被选中tag
      initData: {}, // 缓存数据
      listData: [],
      hasCover: true, // 是否显示删除遮罩
      keepSignDays: 0,
      requestInfo: [
        {
          pageNum: 1,
          finished: false,
        },
        {
          pageNum: 0,
          finished: false,
        },
      ], // 0觅食笔记 1收藏列表
      signStatus: false,
      todayHoney: 1,
      timer: null,
      article_tab_num: {
        favorite_num: 0,
        article_num: 0,
      },
      isNewVersion: false,
      latestVersion: false,
      imgItem: {
        src: defaultNote,
        width: 200,
        height: 160,
      },
      fontItem: {
        desc: '第一篇觅食笔记有额外奖励<br />现在就来写一篇吧!',
      },
      headerTop: 60,
      userStatus: true,
      setInfo: {
        settingStatus: true,
        setType: 3,
        settingText: `记得在<sub>7天</sub>内完成个人资料的填写才能领取到新手礼包哦～`,
        btnText: ['我知道了'],
      },
      isTimeStatus: false,
      type: 1,
      // 默认 我的笔记  4 我的笔记  5 我的收藏   视频播放跳转详情需要
      tagsType: 4,
      // 2.1 新增 达人类型
      navType: 0,
      levelList: [
        // v2.4.0等级列表
        {
          level: 1,
          image: 'https://img.mishifeng.com/FgY5XT2DOQPbe9DikpyOHsXltMcN',
        },
        {
          level: 2,
          image: 'https://img.mishifeng.com/FobnFz2hIEYX93jUsZ2vZ20Yrf_T',
        },
        {
          level: 3,
          image: 'https://img.mishifeng.com/FjMiAxVy_1QJBJ88i32P7MI-TJUb',
        },
        {
          level: 4,
          image: 'https://img.mishifeng.com/FoPcuQ2ZdOXo6f_neo3XROREd9dm',
        },
        {
          level: 5,
          image: 'https://img.mishifeng.com/Fv4AympZ5RM4f2S-GgedxnOD845C',
        },
        {
          level: 6,
          image: 'https://img.mishifeng.com/Fog7ZsXSvEaLUViwe-K3MHc7CP54',
        },
        {
          level: 7,
          image: 'https://img.mishifeng.com/FiUTqDr4AFMCFVi7tPHFVsDDVf1p',
        },
        {
          level: 8,
          image: 'https://img.mishifeng.com/FpWmuysyqR_cXUT5pSjO_kikdAMt',
        },
      ],
      userLevel: 1, // v2.4.0 用户当前等级
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      logged: state => state.user.logged,
      showShareMask: state => state.app.showShareMask,
      shareMaskType: state => state.app.shareMaskType,
    }),
    followBtnText() {
      return this.isFollowed ? '已关注' : '关注';
    },
    signInText() {
      return this.isSignIn ? `连签${this.keepSignDays}天` : '签到领蜂蜜';
    },
  },
  filters: {
    dateFilter(val) {
      let created_at = Date.parse(new Date());
      let regTime = this.userInfo.created_at;
      let numDay = 24 * 3600;
      val = Math.floor((created_at - regTime) / numDay);
      return val;
    },
  },
  created() {
    this.inquiryUserId = this.$route.query.id || '';
    this.type = this.$route.query.type || 1;
    this.isSelf =
      (this.inquiryUserId && this.userInfo.id == this.inquiryUserId) ||
      !this.inquiryUserId;
    this.initPullList();
    this.pullParams = Object.assign(this.pullParams, {
      inquiry_user_id: this.inquiryUserId,
    });
    this.isMSF && this.initBridge();
    this.getProfile();
    this.isNewVersion = this.$version.gt('1.3.1');
    this.isMSF &&
      bridge.getSystemInfo({
        success(res) {
          const { data } = res;
          console.log(data.navBarH, 'data');
        },
      });
  },
  mounted() {
    const that = this;
    if (!this.logged && device.wxapp) {
      this.setUserLoginLayer(true);
      return;
    }
    if (this.isMSF) {
      let scrollTop =
        parseInt(that.headerTop) + parseInt(that.$refs.appHeader.offsetHeight);
      bridge.onPageShow({
        success(res) {
          that.getProfile();
          that.initBridge();
        },
      });
      if (this.$version.gt('1.4.4')) {
        bridge.setNavigationBar({
          data: {
            scrollTop: scrollTop, //滚动距离 显示或隐藏 导航栏
          },
          success(res) {
            console.log(res);
          },
        });
        that.latestVersion = false;
        bridge.vueLoadFinish({
          success(res) {
            console.log(res);
          },
        });
      } else {
        that.$refs.appProfile.style.paddingTop = -that.appHeader + 'px';
        that.$refs.appHeader.style.marginTop = -60 + 'px';
        that.latestVersion = true;
      }
      console.log(this.userInfo, 'this.userInfo');
    }
    this.$nextTick(() => {
      // 悬浮导航
      if (!device.msf) {
        on(this.$el, 'scroll', e => {
          const scrollTop = scroll.getScrollTop(this.$el);
          const opacity = scrollTop / 150;
          if (opacity <= 1.5) {
            let style = {
              backgroundColor: `rgba(254,219,0,${opacity})`,
            };
            if (opacity >= 1.4) {
              style.boxShadow = `0px 2PX 4PX rgba(0, 0, 0, ${opacity / 10})`;
            }
            this.headerStyle = style;
          }
        });
      }
    });
    this.timeDay();
  },
  methods: {
    ...mapActions(['setShareMask', 'setUserLoginLayer']),
    closeSign() {
      this.signStatus = false;
    },
    setTimer() {
      this.timer = setTimeout(() => {
        [this.isSignIn, this.signStatus] = [true, false];
      }, 3000);
    },
    timeDay() {
      let created_at = Date.parse(new Date()) / 1000;
      let regTime = this.userInfo.created_at;
      let numDay = 24 * 3600;
      let val = Math.floor((created_at - regTime) / numDay);
      this.isTimeStatus = val > 7 ? false : true;
      console.log(this.isTimeStatus, 'this.isTimeStatus');
    },
    noDataText() {
      this.fontItem.desc =
        this.isSelf && !this.curtIndex
          ? '第一篇觅食笔记有额外奖励<br />现在就来写一篇吧!'
          : '没有收藏的你一定是个假吃货～';
      this.imgItem.src =
        this.isSelf && !this.curtIndex ? defaultNote : defaultLike;
    },
    // 请求个人中心接口
    getProfile() {
      console.log('getprofiles');
      // 在觅食蜂 app 中，如果未登录，并且访问自己，return
      if (!this.logged && this.isSelf) {
        // app.login();
        jsReport({
          value: 'api.getProfile incomplete',
          userInfo: this.$store.state.user.userInfo,
        });
        return;
      }
      api.getProfile(
        {
          inquiry_user_id: this.inquiryUserId,
          need_pagination: true,
          page_num: 1,
          page_limit: 20,
        },
        res => {
          this.curtIndex = 0;
          const { data } = res,
            that = this;
          that.avatar = data.avatar || defaultAvatar;
          that.nickName = data.nickname;
          that.selfUserId = data.user_id;
          that.userLevel = data.level_id; // v2.4.0 用户等级
          that.introduction =
            data.introduction || '这个人有点害羞,还没想好怎么介绍自己。';
          that.nickname = data.nickname || '这个人有点害羞,还没有昵称。';
          that.navSatus = data.quality_user > 0 ? true : false;
          that.navType = data.quality_user;
          if (data.article_tab_num) {
            that.article_tab_num = data.article_tab_num;
          }
          [that.hasCover, that.tags, that.isSignIn] = [
            that.isSelf,
            that.initTags(data.article.total_page),
            data.has_daily_bonus,
          ];
          if (!that.isSignIn && !this.inquiryUserId) {
            that.signIn();
          }
          that.fansInfo.forEach((item, index) => {
            item.num = this.dealFansInfoNum(index, data);
          });
          // v2.4.0 用户蜂蜜数量展示逻辑
          let honey = data.total_honey;
          if (Number(honey) >= 9999) {
            that.honey = 9999;
          } else {
            that.honey = honey;
          }
          [that.isFollowed, that.keepSignDays] = [
            data.is_followed,
            data.keep_sign_days,
          ];
          that.pullParams = Object.assign(that.pullParams, {
            serial: data.article.page_serial || '',
          });
          that.setArticleList(data.article.list, 'reset', 0);
          that.dealPullParam();
          [that.hidePage, that.listData, that.isLoading] = [
            false,
            data.article.list,
            false,
          ];
        },
        err => {
          console.log(err);
          if (err.errno == 9610051) {
            if (this.isMSF) {
              bridge.login({
                success(res) {
                  //..
                  console.log(res);
                  const { data } = res;
                  store.commit('SET_USERINFO', data);
                },
                fail(err) {
                  console.log('app 登录失败！', err);
                  // mini.forward('/index');
                  this.showToast('登录失败，请重试！');
                },
              });
            } else {
              this.$forward('login');
            }
          }
          this.userStatus = false;
        }
      );
    },
    // 初始化tags数据
    initTags(totalPage) {
      const tags = this.isSelf
        ? [
            { name: '我的笔记·' + this.article_tab_num.article_num },
            { name: '我的收藏·' + this.article_tab_num.favorite_num },
          ]
        : [{ name: '觅食笔记' }];
      for (const item of tags) {
        Object.assign(item, {
          initData: null,
          pageNum: 1,
          finished: false,
        });
      }
      if (tags.length == 2) {
        tags[1].pageNum = 0;
      }
      tags[0].finished = totalPage < 2;
      return tags;
    },
    // 列表接口
    pullModel(...rest) {
      if (this.curtIndex) {
        api.favoriteList.apply(this, rest);
      } else {
        api.myArticleList.apply(this, rest);
      }
    },
    // 接口请求完成
    afterPull(res) {
      const { data } = res;
      const { list = [] } = data;
      let type =
        this.tags[this.curtIndex]['initData'] == null ? 'reset' : 'push';
      this.setArticleList(list, type, this.curtIndex);
    },
    // 数据处理完成
    afterPullData() {
      let curtIndex = this.tags[this.curtIndex],
        that = this;
      [curtIndex.pageNum, curtIndex.finished] = [
        that.pullParams.page_num,
        that.finished,
      ];
    },
    // set瀑布流数据
    setArticleList(data, type = 'push', index) {
      // type有push和reset
      this.$refs.waterfall.setDate(data, type, index);
    },
    // 处理 0.粉丝、1.关注、2.赞、3.收藏数量
    dealFansInfoNum(num, data) {
      switch (num) {
        case 0:
          return data.fans_num;
        case 1:
          return data.follow_num;
        case 2:
          return data.likes_num;
        case 3:
          return data.favorite_num;
      }
    },
    // 点击切换tags
    onTagClick(item, index) {
      this.curtIndex = index;
      this.dealPullParam();
      this.tagsType = index ? 5 : 4;
      const tabAction = ['c_my_articles', 'c_my_collection'][index];
      tongji.event(tabAction);
      if (this.tags[index]['initData'] || this.finished) {
        this.initData = this.tags[index].initData;
        this.listData = this.initData.lists;
      } else {
        this.onScrollToLower();
      }
      this.noDataText();
    },
    // 处理请求信息
    dealPullParam() {
      this.finished = this.tags[this.curtIndex].finished;
      this.pullParams.page_num = this.tags[this.curtIndex].pageNum + 1;
    },
    // 部分点击事件
    goNext(type) {
      const value = `value:{followed:${this.isFollowed}}`;
      switch (type) {
        case 'getMore': // 我的蜂蜜
          tongji.event('c_my_honey');
          this.$forward('honey-note');
          break;
        case 'sign': // 签到领积分
          if (this.isSignIn) {
            this.signStatus = true;
            this.setTimer();
            return;
          }
          this.signIn();
          break;
        case 'follow': // 关注／取消关注
          //value = `value:{follow:${this.isFollowed}}`;
          tongji.event('c_follow', value);
          this.toFollow();
          break;
        case 'goOrder': // 订单列表
          tongji.event('c_my_orders');
          if (this.isMSF && !this.$version.gt('1.0.0')) {
            bridge.showToast({
              content: '当前版本不支持该功能，请升级更高版本哦',
            });
            return;
          }
          this.$forward('order');
          break;
        case 'goSetting': // 设置页面
          tongji.event('c_my_setting');
          this.$forward('setting');
          break;
        case 'goService': // 客服页面
          this.$forward('service');
          break;
        case 'goGift':
          tongji.event('c_my_invite');
          api.getInviteCode(
            {},
            res => {
              const { data } = res;
              console.log(data.invite_code);
              if (data.invite_code) {
                this.$forward('invite-register', {
                  pageType: 3,
                  shareCode: encodeURIComponent(data.invite_code),
                  userName: encodeURIComponent(this.nickname),
                });
              }
            },
            err => {}
          );
          break;
        case 'goLevel': // 我的权益
          tongji.event('c_my_level');
          this.$forward('honey-level');
          break;
        default:
          break;
      }
    },
    // 跳转粉丝、关注列表
    goFansList(index) {
      if (index == 2 || index == 3) return;
      // 2粉丝 1关注  埋点  自己的主页粉丝 c_follower,关注的人 c_following 别人的主页c_follower,c_following
      const type = [2, 1][index],
        actionId = ['c_follower', 'c_following '][index];
      // console.log(actionId, 'actionId');
      // console.log(type, 'type');
      tongji.event(actionId);
      this.$forward('follow', {
        type,
        user_id: this.inquiryUserId,
      });
    },
    // 签到领积分
    signIn() {
      api.dailyBonus(
        {},
        res => {
          const { data } = res;
          let honey = 0;
          honey += data.honey;
          if (Number(honey) >= 9999) {
            this.honey = 9999;
          } else {
            this.honey = honey;
          }
          this.keepSignDays = data.days;
          // this.$showToast(
          //   `已连续签到${this.keepSignDays}天，获得${data.honey}g蜂蜜`
          // );
          if (!this.isSignIn) {
            this.todayHoney = data.honey;
            this.signStatus = true;
            //this.isSignIn = true;
          }
          this.setTimer();
        },
        err => {}
      );
    },
    // 关注／取消关注
    toFollow() {
      api.toggleFollow(
        {
          follow_user_id: this.inquiryUserId,
        },
        res => {
          const { data } = res;
          const { result = '' } = data;
          // 1:新增关注关系 2:重新关注(之前关注关系被移除) 3:移除关注关系
          switch (result) {
            case 1:
            case 2:
              this.isFollowed = true;
              break;
            case 3:
              this.isFollowed = false;
              break;
          }
        },
        err => {}
      );
    },
    // 点击进入文章详情页
    onArticleTap({ id, index, user_id, media_type }) {
      const value = `index:${index},value:{articleId:${id}}`;
      tongji.event('c_article', value);
      if (!id) {
        this.$showToast('缺少参数');
        return;
      }

      if (media_type == 2) {
        if (device.msf) {
          if (this.$version.gte('2.0.0')) {
            let query = { id, type: 4, member: user_id };
            if (this.isSelf && this.tagsType == 5) {
              query = { id, type: 5, member: this.selfUserId };
            }
            this.$forward('video-list', query);
          } else {
            this.$forward('article', { id });
          }
        }
      } else {
        this.$forward('article', { id });
      }
    },
    // 点击删除文章 `  09
    onDelete(id, index) {
      if (this.curtIndex) {
        api.toggleFavorite(
          {
            id: id,
            user_id: this.userInfo.id,
          },
          res => {
            const { data } = res;
            if (data.status == 2) {
              this.$refs.waterfall.deleteItem(index);
            }
          },
          err => {}
        );
      } else {
        api.articleDelete(
          {
            article_id: id,
          },
          res => {
            const { data } = res;
            if (data && data.result == 'success') {
              this.$refs.waterfall.deleteItem(index);
            }
          },
          err => {}
        );
      }
    },
    btnEvent(item) {
      console.log(item, 'item');
      this.setInfo.settingStatus = false;
    },
    onComplete(initData, index) {
      this.tags[index].initData = initData;
      this.listData = this.listData.concat(initData.lists);
    },
    // 分享
    onShare() {
      // 显示分享提示
      this.setShareMask({ isShow: true });
      wechat.setShare(this.getShareInfo());
    },
    // 设置分享信息
    getShareInfo() {
      const desc = `快来觅食蜂围观 @${this.nickName} 觅食笔记 抢一元探店套餐！`,
        wbDesc = `快来@觅食蜂 围观@${this.nickName} 抢一元探店套餐！ ${location.href} （觅食蜂，美食达人聚集地 https://m.mishifeng.com/download ）`,
        defaultChannel = ['weixin', 'weixin_timeline', 'copy_link'];
      if (this.$version.gt('1.3.1')) {
        defaultChannel.splice(2, 0, 'weibo');
      }
      return {
        title: '觅食蜂 美食达人聚集地',
        weixin_timeline: {
          title: desc,
        },
        weibo: {
          title: wbDesc,
        },
        desc,
        imgUrl: this.avatar,
        link: `${window.location.origin}/profile?id=${this.inquiryUserId}`,
        url: `${window.location.origin}/profile?id=${this.inquiryUserId}`,
        onlySelectChannel: defaultChannel,
      };
    },
    // 挂载bridge
    initBridge() {
      const that = this;
      const rightBtn = that.isSelf
        ? this.$version.gt('1.3.1')
          ? [
              {
                id: 2,
                type: 'service',
                icon: 'service',
                text: '客服',
                color: '',
                fontSize: '',
              },
              {
                id: 4,
                type: 'setting',
                icon: 'setting',
                text: '设置',
                color: '',
                fontSize: '',
              },
            ]
          : [
              {
                id: 2,
                type: 'service',
                icon: 'service',
                text: '客服',
                color: '',
                fontSize: '',
              },
            ]
        : [
            {
              id: 3,
              type: 'share',
              icon: 'share',
              text: '分享',
              color: '',
              fontSize: '',
            },
          ];
      bridge.addNavigationBarMenu({
        right: rightBtn,
        success(res) {
          console.log(res);
          const { data } = res;
          if (data && data.type == 'share') {
            bridge.showShare(
              Object.assign(
                {
                  type: 0,
                  onlySelectChannel: [
                    'weixin',
                    'weixin_timeline',
                    // 'weibo',
                    // 'qq',
                    // 'qZone',
                  ],
                  success(res2) {
                    console.log(res2);
                  },
                },
                that.getShareInfo()
              )
            );
          } else if (data && data.type == 'service') {
            that.$forward('service');
          } else {
            that.$forward('setting');
          }
        },
      });
    },
  },
  beforeDestroy() {
    // 移除了监听事件
    if (this.isMSF) {
      const id = this.isSelf ? 2 : 3;
      bridge.removeNavigationBarMenu({
        ids: [id],
        success(res) {
          console.log(res);
        },
        fail() {},
        complete() {},
      });
      bridge.offPageShow({});
    }
    clearInterval(this.timer);
    off(this.$el, 'scroll', () => {});
  },
};
</script>
<style lang="stylus" scoped>
.page-profile {
  background: #FFF;
  padding-bottom: 20px;
}
.my-header {
  position: fixed;
  width: 100%;
  padding: 2px 0;
  z-index: 600;
  background:rgba(255,255,255,0);
  border:none;
  &:after{
    border:none;
  }
}

>>>.cm-header .cm-header-title>span {
  color:#171900;
}
.my-header-right {
  color: #231815;
  line-height: 1;
  .service {
    width: 24px;
    height: 24px;
    line-height:24px;
  }
  .setting {
    width: 24px;
    height: 24px;
    line-height:24px;
    margin-left:5px;
  }
}
.header-right-share {
  position: relative;
  display: block;
  opacity: 0.6;
  width: 50px;
  height: 100%;
  img {
    position: absolute;
    display: block;
    width: 18px;
    height: 18px;
    top: 50%;
    margin-top: -9px;
    right: 0;
  }
}
.profile {
  position: relative;
}
.profile-top {
  position: relative;
  padding: 64px 16px 33px 10px;
  background: url('~assets/profile/bitmap.png') no-repeat;
  overflow:hidden;
  background-size:100% 100%;
}
.content {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  align-content: center;
}
.user-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin-right: 9px;
}
.avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
}
.heat {
  position: relative;
  padding-top: 21px;
  flex: 1;
  font-size: 10px;
  color: #231815;
  text-align: center;
  overflow: hidden;
}
.heat-info {
  display: flex;
  margin-bottom: 15px;
  margin-top:8px;
  text-align:justify;
}
.info {
  padding-right:20px;
  text-align:center;
}
.info-num {
  font-size: 14px;
  margin-bottom: 3px;
  color:#231815;
  font-weight:bold;
}
.info-title {
  font-size:10px;
  color:#110C00;
}
.info-name {
  display: flex;
  .name-text{
    text-align: justify;
    font-size: 16px;
    color: #171900;
    height:22px;
    font-weight :bold;
  }
  .name-level{
    width: 35px;
    height: 12px;
    margin-top: 3px;
  }
}
.personal-desc {
  text-align: justify;
  word-wrap: break-word;
  word-break: normal;
  font-size:12px;
  padding-left:10px;
  color:#231815;
}
.bg-square {
  width:100%;
  height:90px;
  background-image :url('~assets/profile/bg@2x.png');
  background-size:100%;
  background-repeat:no-repeat;
  position:absolute;
  bottom:-20px;
  left:0;
  opacity :.4;
  z-index:90;
}
.sign-in {
  position: relative;
  height: 70px;
  margin: 0 15px;
  .sign-content {
    position: absolute;
    display: flex;
    height: 80px;
    bottom: 10px;
    left: 0;
    width: 100%;
    background: #FFFFFF;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    align-content: space-between;
    z-index:200;
    .sign-item {
      position: relative;
      flex: 1;
      text-align: center;
      padding: 15px 0;
      sup {
        position: absolute;
        top: -9px;
        left: 25px;
        line-height: 1;
        padding: 2px 9px 2px 4px;
        font-size: 8px;
        background: #FA5914;
        box-shadow: 0 2px 6px 0 rgba(0,0,0,0.12);
        border-radius: 24px 24px 24px 7px;
        color: #FFFFFF;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 0;
          border-width:0 0 4px 10px;
          border-style:solid;
          border-color:transparent transparent transparent #FF7A2F;
        }
      }
      .profile-icon {
        position: relative;
        width: 26px;
        height: 26px;
        margin: 0 auto 7px;
        font-size: 26px;
        img {
          width:26px;
          height:auto;
        }
        .add-sign{
          font-size: 8px;
          color: #fff;
          position: absolute;
          right: 3px;
          top: 1px;
        }
      }
      p {
        font-size: 12px;
        line-height: 17px;
        color: #666;
      }
    }
  }
}
.interested {
  position: relative;
  width: 100%;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
  font-size: 14px;
  color: #212121;
}
.interested-btn {
  width: 100%;
  text-align: center;
  background: linear-gradient(to right, #fedc00 30%, #fed100 100%);
  line-height: 40px;
}
.interested-disabled {
  background: none;
}
.profile-tags{
  width: 100%;
  z-index: 300;
}
.profile-list {
  position: relative;
  margin: 0 15px;
  background:#f5f6f9;
}
.tag-container {
  display: inline-block;
  position: relative;
}
.signHoney {
  height:30px;
  line-height:30px;
  font-size:12px;
  color:#231815;
  position:absolute;
  top:114px;
  right:-10px;
  background:#fff;
  border-radius:15px;
  padding:0 10px;
  z-index:99;
  .jar {
    width:18px;
    height:18px;
    vertical-align :text-bottom;
  }
  p{
    display:inline;
    padding-left:5px;
    padding-right:12px;
  }
}
span.isfollow {
  width:66px;
  height:26px;
  line-height:28px;
  position:absolute;
  top:80px;
  right:10px;
  text-align:center;
  border-radius: 13px;
  font-size: 14px;
  &.Follow {
    background: #FFFBE8;
    color: #171900;
    i {
      padding-right:3px;
    }
  }
  &.isFollowed {
    background:none;
    border:1px solid #FFf;
    color: #fff;
    i {
      display:none;
    }
  }
}
>>>.profile-no-data {
  position: relative;
  text-align: center;
  font-size: 14px;
  color: #4A4A4A;
}
>>>.no-data-icon {
  position: relative;
  width: 100%;
  height: 141px;
}
>>>.no-data-icon img{
  position: absolute;
  display: block;
  left: 50%;
  margin-left: -83px;
  width: 166px;
  height: 100%;
}
>>>.no-data-text {
  padding: 15px 0 0 0;
  line-height: 22px;
}
>>>.profile-finished-tip {
  font-size: 12px;
  width: 100%;
  text-align: center;
  padding: 16px 0;
  .tip-icon {
    margin-top: 6px;
  }
}
>>>.tag-item {
  color:#232815;
}
>>>.tag-active {
  padding:4px 8px 0;
  position:relative;
  color:#231815;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background-image: linear-gradient(90deg, #FFB500 10%, #FDE044 68%);
    border-radius: 3PX;
  }
}
>>>.tag-li {
  padding:0 50px;
}
>>>.tag-line {
  background:none;
}
>>>.default-page {
  margin-top:40px;
}
.topHeader{
  background-image: linear-gradient(90deg,#fedc00 0%,#fed100 70%);
}
>>>.box-text sub{
  font-size:14px;
  bottom:0;
  color: #FDCC02;
}
>>>.bottom-nav{
  height:27px;
  width:80px;
  line-height:27px;
  bottom:-4px;
}
</style>
