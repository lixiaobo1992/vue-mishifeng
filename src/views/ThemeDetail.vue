<template>
  <div
    class="page-theme-detail"
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
      <span class="header-right-share" slot="right" @click="onShare">
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
        class="detail-top"
        ref="appHeader"
        :class="{ topHeader: latestVersion }"
        :style="{ backgroundImage: 'url(' + detailData.bg_pic + ')' }"
      >
        <div class="content-bg">
          <div class="content">
            <div class="cont-info-box">
              <img class="info-img" :src="detailData.bg_pic" />
              <div class="info-text">
                <p class="text-title">#{{ detailData.title }}#</p>
                <p class="text-time">
                  活动时间:
                  <sub class="sub-time"
                    >{{ detailData.start_time }}-{{ detailData.end_time }}</sub
                  >
                </p>
                <span
                  class="text-status"
                  data-type="prize"
                  :data-status="detailData.status"
                  @click="goNext"
                  :class="{
                    'gray-btn': detailData.status == 2 && detailData.link == '',
                  }"
                  >{{ detailData.statusText }}</span
                >
              </div>
              <span class="rule-box" data-type="rule" @click="goNext"
                >活动规则</span
              >
            </div>
            <div class="cont-hint-text">
              <div class="hint-text">
                {{ detailData.description }}
                <sub
                  class="text-expand"
                  @click="toggleDecStatus(detailData.descStatus)"
                  >展开</sub
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="prize-box" v-show="detailData.status == 1">
        <p class="prize-title">奖项设置</p>
        <p class="prize-hint-text">
          {{ detailData.prize }}
          <!-- 觅食蜂根据笔记互动值评选，选取10位优质笔记用户，
          获得觅食蜂达人推荐资源曝光，可以获得达人推荐（以上获奖用户的笔记均可以获得觅食蜂的首页资源推荐）
          可以获得达人推荐（以上获奖用户的笔记均可以获得觅食蜂的首页资源推荐） -->
          <!-- <sub class="text-expand">展开</sub> -->
        </p>
      </div>
      <div class="article-box">
        <img
          class="article-img"
          src="https://img.mishifeng.com/FlhlXbUkuLZlQp1D3G-e3e50phJm"
        />
        话题笔记
      </div>
      <div class="theme-detail-list">
        <water-fall
          ref="waterfall"
          @ontap="onArticleTap"
          @oncomplete="onComplete"
        ></water-fall>
      </div>
      <!-- 发布笔记按钮 -->
      <div class="aricle-btn" data-type="publish" @click="goNext">
        <img
          class="aricle-img"
          src="https://img.mishifeng.com/FohRfMkB7fPUioFBKSvpyrzJw5jN"
          alt=""
        />
        <p class="aricle-text">写笔记</p>
      </div>
      <div v-if="popupStatus">
        <RulePopup
          :cont="detailData.rule"
          :onPopup="onPopup"
          @onPopup="onPopup"
        >
        </RulePopup>
      </div>
    </Scroll>
  </div>
</template>

<script>
import api from '@/api';
import { Header, Scroll } from '@/ui';
import Icon from '@/ui/Icon';
import Avatar from '@/components/Avatar';
import WaterFall from '@/components/WaterFall';
import RulePopup from '@/components/popup/RulePopup';
import PullListMixin from '@/mixins/pull-list';
import { mapState, mapActions } from 'vuex';
import { on, off } from '@/utils/event';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import scroll from '@/utils/scroll';
import { formatDate } from '@/utils/base/date';
export default {
  name: 'theme-detail',
  mixins: [PullListMixin],
  components: {
    Header,
    Scroll,
    Avatar,
    WaterFall,
    Icon,
    RulePopup,
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
      nickname: '',
      introduction: '',
      isSelf: true,
      keepSignDays: 0,
      signStatus: false,
      todayHoney: 1,
      timer: null,
      article_tab_num: {
        favorite_num: 0,
        article_num: 0,
      },
      isNewVersion: false,
      latestVersion: false,
      headerTop: 60,
      userStatus: true,
      isTimeStatus: false,
      detailData: {
        description: '',
      },
      popupStatus: false, // 规则弹层
      pullParams: {
        page_num: 1,
      },
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      logged: state => state.user.logged,
      showShareMask: state => state.app.showShareMask,
      shareMaskType: state => state.app.shareMaskType,
    }),
  },
  created() {},
  mounted() {
    const that = this;
    const id = this.$route.query.id;
    if (this.isMSF) {
      let scrollTop =
        parseInt(that.headerTop) + parseInt(that.$refs.appHeader.offsetHeight);
      bridge.onPageShow({
        success(res) {
          that.getTopicDetail(id);
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
    this.getTopicDetail(id);
    this.timeDay();
  },
  methods: {
    ...mapActions(['setShareMask']),
    onShare() {
      this.setShareMask({ isShow: true });
    },
    // 获取详情
    getTopicDetail(id) {
      api.getTopicDetail(
        {
          id,
        },
        res => {
          const { data } = res;
          const desc =
            '觅食蜂根据笔记互动值评选，选取10位优质笔记用户，获得觅食蜂达人推荐资源曝光，可以获得达人推荐（以上获奖用户的笔记均可以获得觅食蜂的首页资源推荐）可以获得达人推荐（以上获奖用户的笔记均可以获得觅食蜂的首页资源推荐';
          this.detailData = {
            bg_pic: data.bg_pic,
            bg_pic_height: data.bg_pic_height,
            bg_pic_width: data.bg_pic_width,
            // description: data.description,
            description: desc,
            descStatus: desc.length > 60,
            end_time: formatDate(data.end_time, 'Y-M-D'),
            link: data.link || '',
            prize: data.prize || '',
            rule: data.rule || '',
            start_time: formatDate(data.start_time, 'Y-M-D'),
            tag_id: data.tag_id,
            title: data.title || '',
            statusText:
              data.end_time > res.timestamp ? '活动进行中…' : '有奖公示',
            status: data.end_time > res.timestamp ? 1 : 2, // 1为活动进行中状态， 2为有奖公示状态
          };
          this.getArticleList(data.tag_id);
        },
        err => {
          console.log(err, 'err');
        }
      );
    },
    //处理字符串,是否显示展开
    dealString(str, maxlength, strSts = true) {
      if (str.length > maxlength && strSts) {
        const showStr = str.substring(0, maxlength) + '...';
        return showStr;
      } else {
        return str;
      }
    },
    //展开收缩
    toggleDecStatus(status) {
      console.log(status, 'status');
      this.detailData.descStatus = !status;
      this.dealString(this.detailData.description, 50, status);
    },
    // 接口请求完成
    afterPull(res) {
      const { data } = res;
      const { list = [] } = data;
      this.setArticleList(list);
    },
    // 获取文章列表
    getArticleList(id) {
      api.articleList(
        {
          page_num: this.pullParams.page_num,
        },
        res => {
          console.log(res, 'res');
          const { list = [] } = res.data;
          this.dealArticleList(list);
        },
        err => {
          console.log(err);
        }
      );
    },
    dealArticleList(list = []) {
      let newList = list.map(item => {
        return {
          id: item.id,
          pic: item.pic,
          width: item.width,
          height: item.height,
          ratio: item.height / item.width,
          title: item.title,
          level_id: item.level_id,
          user_avatar: item.user_avatar,
          user_nickname: item.user_nickname,
          likes_num: item.likes_num,
          user_id: item.user_id,
          quality_user: item.quality_user == 1 ? true : false,
        };
      });
      this.$nextTick(() => {
        this.$refs.waterfall && this.$refs.waterfall.setDate(newList, 'reset');
      });
    },
    onComplete(data) {
      this.listData = this.listData.concat(data);
    },
    pullModel(...rest) {
      api.articleList.apply(this, rest);
    },
    // 数据处理完成
    afterPullData() {
      this.pullParams.page_num = this.pullParams.page_num + 1;
    },
    onArticleTap({ id, media_type }) {
      this.playAuth = '';
      if (media_type == 2) {
        if (device.msf) {
          if (this.$version.gte('2.0.0')) {
            this.$forward('video-list', { id, type: 3 });
          } else {
            this.$forward('article', { id });
          }
        }
      } else {
        this.$forward('article', { id });
      }
    },
    // 瀑布流添加/重置数据
    setArticleList(data, index, type = 'push') {
      this.$refs.waterfall.setDate(data, type, index);
    },
    // 点击事件汇总
    goNext(e) {
      const { type, status } = e.currentTarget.dataset;
      switch (type) {
        case 'rule':
          this.popupStatus = true;
          break;
        case 'prize':
          if (status == 2 && !this.detailData.link) {
            this.$showToast('有奖公示即将发布～敬请期待!');
          } else {
            this.$forward(this.detailData.link);
          }
          break;
        case 'publish':
          this.$forward('publish');
          break;
        default:
          break;
      }
    },
    // 监听规则弹层传参
    onPopup(data) {
      // this.popupStatus
      this.popupStatus = !this.popupStatus;
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
.gray-btn{
  background: #ccc !important;
  color: #fff !important;
}
.page-theme-detail {
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
.detail-top {
  position: relative;
  padding: 64px 16px 33px 10px;
  background: rgba(0,0,0,.5);
  overflow:hidden;
  background-size:100% 100%;
  height:208px;
  width:100%;
  .content-bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background: -webkit-linear-gradient(top, rgba(0,0,0,.8) 0%,rgba(0,0,0,.6) 100%);
    // filter: grayscale(100%);
    height:100%;
    width:100%;
  }
  .content{
    position: relative;
    height: 100%;
    width: 100%;
    align-content: center;
    margin-top:30px;
  }
  .cont-info-box{
    display: flex;
    padding-left: 20px;
    position: relative;
    .info-img{
      width: 80px;
      height: 80px;
    }
    .info-text{
      margin-left: 10px;
    }
    .text-title{
      font-size: 18px;
      color: #fff;
      font-weight: bold;
    }
    .text-time{
      margin: 4px 0;
      height: 20px;
      font-size: 14px;
      color: rgba(255,255,255,0.50);
    }
    .sub-time{
      color:rgba(255,255,255,0.50);
      font-size:12px;
    }
    .text-status{
      color: #171900;
      font-size: 14px;
      background: #FDE044;
      border-radius: 3px;
      padding: 4px 12px 4px 12px;
    }
    .rule-box{
      position: absolute;
      right: -8px;
      top: 0;
      font-size: 12px;
      color: #FFBF00;
      background: rgba(255,255,255,.16);
      width: 72px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      border-radius: 14px 0 0 14px;
    }
  }
  .cont-hint-text{
    width: 320px;
    line-height: 18px;
    font-size: 12px;
    color: #fff;
    padding: 15px;
    background: rgba(255,255,255,0.14);
    border-radius: 5px;
    margin: 0 auto;
    margin-top: 15px;
    .hint-text{
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      // -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    sub.text-expand{
      color:#FFBF00;
    }
  }
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
.prize-box{
  width: 100%;
  height: 140px;
  background: #fff;
  padding: 0 16px;
  padding-top: 15px;
  position: relative;
  .prize-title{
    font-size: 18px;
    color: #333;
    font-weight: bold;
    text-align: center;
  }
  .prize-hint-text{
    margin-top: 10px;
    font-size: 14px;
    color: #333;
    text-indent: 28px;
    line-height: 18px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}
.prize-box:before {
  content: '';
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 15px solid #fff;
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: rotate(270deg);
  margin-left: -8px;
}
.article-box{
  margin-top: 5px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-weight: bold;
  .article-img{
    width: 20px;
    height: 20px;
  }
}
.theme-detail-list{
  position: relative;
  margin: 0 15px;
  background: #fff;
}
.aricle-btn{
  position: fixed;
  right: 32px;
  bottom: 50px;
  width: 60px;
  height: 60px;
  background: #FFBF00;
  border-radius: 30px;
  box-shadow: 0 2px 7px 0 rgba(0,0,0,0.19);
  text-align: center;
  z-index:99;
  .aricle-img{
    width: 22px;
    height: 22x;
    margin: 0 auto;
    margin-top: 8px;
  }
  .aricle-text{
    font-size: 10px;
    color: #FFFFFF;
    margin-top: 5px;
  }
}
  sub {
    font-size: 12px;
    color: #4897CC;
    bottom:0;
  }
</style>
