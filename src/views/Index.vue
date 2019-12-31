<template>
  <div class="page-index">
    <div class="index-top">
      <div class="index-logo">
        <div class="yellow">
          <div class="header">
            <span class="left" data-page="city" @click="gotoNext">{{
              currentCity
            }}</span>
            <div class="center">觅食蜂</div>
            <span
              class="right"
              data-page="search-article"
              @click="gotoNext"
            ></span>
          </div>
          <div class="index-tag" v-if="isCTagsClass">
            <Tags
              :tags="tags"
              :curtIndex="curtTagIdx"
              @onTagClick="onTagClick"
            ></Tags>
          </div>
        </div>
      </div>
    </div>
    <div class="index-content">
      <div
        v-if="adsList && adsList.length && curtTagIdx == 0"
        class="index-swiper"
      >
        <ul class="theme-box">
          <li class="theme-li">
            <img
              class="theme-img"
              data-page="topic"
              @click="gotoNext"
              :src="interact.topic.image"
            />
            <p class="theme-text">#{{ interact.topic.title }}#</p>
          </li>
          <li class="theme-li">
            <img
              class="theme-img"
              data-page="discuss"
              @click="gotoNext"
              :src="interact.discuss.image"
            />
            <p class="theme-text">#{{ interact.discuss.title }}#</p>
          </li>
        </ul>
      </div>
      <div class="tags-radius" v-if="!isCTagsClass">
        <CircleTags
          :tags="tags"
          :curtIndex="curtTagIdx"
          @onTagClick="onTagClick"
        ></CircleTags>
      </div>
      <div class="index-article">
        <water-fall
          v-show="!showError"
          ref="waterfall"
          :init-data="initData"
          @ontap="onArticleTap"
          @oncomplete="onComplete"
        ></water-fall>
        <div class="loading flex-center" v-show="showLoading">
          <mt-spinner type="fading-circle" :size="20"></mt-spinner>
          <div class="loading-tip">加载中...</div>
        </div>
        <div class="error" v-show="showError">
          <img class="image" src="~@/assets/index/error_network.png" />
          <p class="text">暂时无法获取文章，点击屏幕重试一下</p>
        </div>
        <div class="finish" v-show="showFinish && !showError">
          <p>好厉害！看完了所有文章！<br />快来分享一下你的美食心得吧！</p>
          <img class="image" src="~@/assets/index/home_article_end.png" />
        </div>
      </div>
    </div>
    <!-- 邀请新人礼的toast -->
    <InvitePop
      :settingStatus="setInfo.settingStatus"
      :setType="setInfo.setType"
      :settingText="setInfo.settingText"
      :btnText="setInfo.btnText"
      @btnEvent="btnEvent"
    ></InvitePop>
    <!-- v2.4.0 公告 -->
    <div class="notice-cont" v-if="indexNoticeStatus">
      <Notice :noticeText="noticeText"></Notice>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { mapState, mapGetters, mapActions } from 'vuex';
import { Swiper, SwiperItem, Tags, Header, CircleTags } from '@/ui';
import Notice from '@/components/Notice';
import WaterFall from '@/components/WaterFall';
import { Spinner } from 'mint-ui';
import scroll from '@/utils/scroll';
import tongji from '@/utils/tongji';
import device from '@/utils/device';
import InvitePop from '@/components/InvitePop';
import { on, off } from '@/utils/event';

export default {
  name: 'index',
  components: {
    Swiper,
    SwiperItem,
    Tags,
    Header,
    WaterFall,
    Notice,
    [Spinner.name]: Spinner,
    InvitePop,
    [CircleTags.name]: CircleTags,
  },
  data() {
    return {
      isMSF: device.msf,
      adsRatio: 170 / 355,
      adsList: [],
      // titleStyle: '',
      // headerStyle: '',
      // logoStyle: '',
      // tagStyle: '',
      // 页面滚动dom
      pageScroller: null,
      // header头dom
      // domHeader: null,
      // tag标签dom
      // domTop: null,
      // header头实际位置及宽高
      // rectHeader: {},
      // 页面滚动高度
      scrollTop: 0,
      // touchstart初始位置
      // startY: 0,
      tags: [],
      curtTagIdx: 0,
      initData: {},
      isLoading: false,
      showLoading: false,
      showError: false,
      showFinish: false,
      setInfo: {
        settingStatus: false,
        setType: 3,
        settingText: `记得在7天内完成个人资料的填写<br/>才能领取到新手礼包哦～`,
        btnText: ['暂时放弃', '完善资料'],
      },
      isCTagsClass: false, //v2.4.0 控制顶部、swiper下的tab显示和隐藏
      interact: {}, // v2.4.0 互动版块
      articleData: {}, // v2.4.0 新增
      noticeText: '会员等级和蜂蜜折扣比例将在10/10号开始正式挂钩！钩钩钩', // v2.4.0 公告文案
    };
  },
  created() {
    // this.getIndex();
    // window.eventHub.$on('loca', val => {
    //   console.log(val);
    // });
    this.getData();
  },
  computed: {
    ...mapState({
      isSelectCity: state => state.location.isSelectCity,
      geoInfo: state => state.location.geoInfo,
      locationState: state => state.location.locationState,
      indexNoticeStatus: state => state.app.indexNoticeStatus, // v2.4.0 控制公告
    }),
    ...mapGetters(['currAddress']),
    currentCity() {
      const { code, text } = this.locationState;
      let currentCity = text;
      if (code === 2 || code === 3) {
        currentCity = this.currAddress.name;
      }
      return currentCity;
    },
  },
  mounted() {
    console.log(this.indexNoticeStatus, 'indexNoticeStatus');
    this.pageScroller = scroll.getScrollEventTarget(this.$el);
    this.pageScroller.addEventListener('scroll', this.onScroll, false);
    this.$nextTick(() => {
      // 悬浮导航
      on(this.$el, 'scroll', e => {
        const scrollTop = scroll.getScrollTop(this.$el);
        if (scrollTop >= 100) {
          this.isCTagsClass = true;
        } else if (scrollTop == 0) {
          this.isCTagsClass = false;
        }
      });
    });
    // this.pageScroller.addEventListener('touchstart', this.onTouchStart, false);
    // this.pageScroller.addEventListener('touchmove', this.onTouchMove, false);
    // this.$nextTick(() => {
    //   this.domHeader = this.$el.querySelector('.header');
    //   this.domTop = this.$el.querySelector('.index-top');
    //   this.rectHeader = this.domHeader.getBoundingClientRect();
    // });
  },
  methods: {
    ...mapActions(['getGeo', 'setIndexNoticeStatus']),
    getData() {
      // 获取定位
      console.log('index定位:');
      this.$showLoading();
      this.getGeo({
        name: 'index',
        success: res => {
          console.log('index.vue geo success:', res);
          if (!this.isSelectCity) {
            // 定位成功后发现 为选择城市 需要跳转选择城市
            this.$forward('city');
          } else {
            // 其他业务逻辑
            this.getIndex();
            this.getCategory();
            this.getNotice(this.geoInfo.id);
          }
        },
        fail: err => {
          console.log('index.vue geo fail:', err);
          if (!this.isSelectCity) {
            this.$forward('city');
          } else {
            //...
            this.getIndex();
            this.getCategory();
            this.getNotice(this.geoInfo.id);
          }
        },
      });
    },
    getIndex() {
      api.getIndex(
        {},
        res => {
          const { data } = res;
          this.adsRatio = data.ads.height / data.ads.width;
          this.adsList = data.ads.list;
          this.articleData = data.article;
          this.setArticleList(data.article.list, 0, 'reset');
        },
        err => {
          console.log(err);
        }
      );
    },
    // 2.4.0新增，获取tabs分类、话题
    getCategory() {
      api.getCategory(
        {},
        res => {
          const { data } = res;
          const tags = data.category;
          this.interact = data.interact;
          if (tags.length) {
            for (let item of tags) {
              Object.assign(item, {
                initData: null,
                page_num: 1,
                showFinish: false,
                page_serial: '',
                total_cnt: 0,
                total_page: 0,
              });
            }
            tags[0]['page_serial'] = this.articleData.page_serial;
            tags[0]['total_cnt'] = this.articleData.total_cnt;
            tags[0]['total_page'] = this.articleData.total_page;
            if (this.articleData.total_page <= 1) {
              tags[0]['showFinish'] = true;
              this.showFinish = true;
            } else {
              tags[0]['page_num'] = 2;
            }
          }
          this.tags = tags;
        },
        err => {}
      );
    },
    getArticleList() {
      const tagIdx = this.curtTagIdx;
      if (this.tags[tagIdx]['showFinish']) {
        return;
      }
      const tagId = this.tags[tagIdx]['id'];
      const page_num = this.tags[tagIdx]['page_num'];
      const page_serial = this.tags[tagIdx]['page_serial'];
      this.isLoading = true;
      let type = 'push';
      if (page_num == 1) {
        this.showLoading = false;
        // 第一页为reset
        type = 'reset';
      } else {
        this.showLoading = true;
      }
      let showLoading = !this.showLoading;
      // console.log(api.getCommonParams());
      api.articleList(
        {
          category_id: tagId,
          page_num,
          page_limit: 20,
          page_serial,
          need_pagination: 1,
          showLoading,
        },
        res => {
          console.log(res);
          this.setArticleList(res.data.list, tagIdx, type);
          this.tags[tagIdx]['page_serial'] = res.data.page_serial;
          this.tags[tagIdx]['total_cnt'] = res.data.total_cnt;
          this.tags[tagIdx]['total_page'] = res.data.total_page;
          if (page_num < res.data.total_page) {
            this.tags[tagIdx]['page_num']++;
            this.showFinish = false;
          } else {
            this.tags[tagIdx]['showFinish'] = true;
            this.showFinish = true;
          }
          this.isLoading = false;
          this.showLoading = false;
        },
        err => {
          console.log(err);
          this.isLoading = false;
          this.showLoading = false;
        }
      );
    },
    // onTouchStart(ev) {
    //   const touch = ev.touches[0];
    //   this.startY = Number(touch.pageY);
    // },
    // onTouchMove(ev) {
    //   const touch = ev.touches[0];
    //   const y = Number(touch.pageY);
    //   if (y - this.startY > 0 && this.scrollTop <= 0) {
    //     ev.preventDefault();
    //     ev.stopPropagation();
    //     console.log('down');
    //   }
    // },
    onScroll() {
      const scrollTop = scroll.getScrollTop(this.pageScroller);
      this.scrollTop = scrollTop;
      // // console.log(scrollTop);
      // const headerT = this.rectHeader.top;
      // const headerH = this.rectHeader.height;
      // const topH = this.domTop.getBoundingClientRect().height;
      // let scale = 1 - scrollTop / headerT;
      // let opacity = (scrollTop - 30) / 5;
      if (scrollTop < 0) {
        // ev.preventDefault();
        this.pageScroller.scrollTop = 0;
        return false;
      }
      // // 设置header固定
      // if (scrollTop >= headerT) {
      //   this.headerStyle = {
      //     position: 'fixed',
      //     top: 0,
      //     backgroundColor: '#FEDB4D',
      //   };
      // }
      // // 设置tag样式
      // if (scrollTop >= topH - headerH) {
      //   this.tagStyle = {
      //     position: 'fixed',
      //     top: `${headerH}px`,
      //     background: 'rgba(255, 255, 255, .85)',
      //     boxShadow: '0px 2px 4px rgba(0, 0, 0, .15)',
      //   };
      // } else {
      //   this.tagStyle = '';
      // }
      // // 设置logo动画
      // if (scrollTop >= 0 && scrollTop <= headerT) {
      //   this.headerStyle = '';
      //   this.logoStyle = { transform: `scale(${scale}) translateZ(0)` };
      // }
      // // 设置title显示
      // if (opacity < 0) {
      //   this.titleStyle = '';
      // } else if (opacity >= 0 && opacity <= 1) {
      //   this.titleStyle = { opacity: opacity };
      // } else {
      //   this.titleStyle = { opacity: 1 };
      // }
      /*****以上是动画部分，下面是数据处理*****/
      if (this.isLoading) {
        return;
      }
      const visibleHeight = scroll.getVisibleHeight(this.pageScroller);
      // console.log(visibleHeight);
      const reachBottom =
        this.pageScroller.scrollHeight - visibleHeight - scrollTop < 300;
      if (reachBottom) {
        this.onScrollToLower();
      }
    },
    handleChange(index) {
      console.log('index');
      tongji.event('c_home_banner', `value:{"bannnerId:${index}"}`);
      //this.$forward('profile');
    },
    onScrollToLower() {
      // console.log('加载更多');
      this.getArticleList();
    },
    onArticleTap({ id, index }) {
      this.$forward('/article', { id });
      tongji.event(
        'c_article',
        `{"index":${index},"value:"{"articleId":${id}, "tagId":${
          this.tags[index]['id']
        }}}`
      );
    },
    // 点击tag标签
    onTagClick(item, index) {
      // 暂时加载时禁止切换tag
      console.log(item, 'item');
      tongji.event('c_home_tag', `value:{tagId:${item.id}}`);
      if (this.isLoading) {
        return;
      }
      console.log(this.tags[index]['initData']);
      this.curtTagIdx = index;
      if (this.tags[index]['initData']) {
        // 历史数据重载
        this.initData = this.tags[index]['initData'];
        if (this.tags[index]['showFinish']) {
          this.showFinish = true;
        } else {
          this.showFinish = false;
        }
      } else {
        // 新标签请求加载
        console.log('list');
        this.getArticleList();
      }
    },
    // 瀑布流添加/重置数据
    setArticleList(data, index, type = 'push') {
      // type有push和reset
      // console.log(this.$refs);
      this.$refs.waterfall.setDate(data, type, index);
    },
    // 瀑布流渲染完成回调
    onComplete(data, index) {
      const curtTag = this.tags[index];
      if (curtTag) {
        curtTag.initData = data;
        this.tags.splice(index, 1, curtTag);
      }
    },
    gotoNext(e) {
      console.log(e);
      const { page, id } = e.target.dataset;
      console.log(page, id);
      // const pageEvent = ['c_home_city', 'c_home_search'][
      //   'city', 'search-article'
      // ];
      let pageEvent = '';
      switch (page) {
        case 'city':
          pageEvent = 'c_home_city';
          this.$forward(page);
          break;
        case 'search-article':
          pageEvent = 'c_home_search';
          this.$forward(page);
          break;
        case 'topic':
          this.$forward('theme-list', { type: 2 });
          break;
        case 'discuss':
          this.$forward('theme-list', { type: 1 });
          break;
      }
      tongji.event(pageEvent);
    },
    btnEvent(item) {
      console.log(item, 'item');
      switch (item.index) {
        case 0:
          this.setInfo.settingStatus = false;
          break;
        case 1:
          this.$forward('setting');
          break;
        default:
          break;
      }
    },
    // v2.4.0 获取公告
    getNotice(id) {
      api.getNotice(
        {
          zone_id: id,
        },
        res => {
          const { data } = res;
          console.log(data, 'getNotice');
          if (data.list.length) {
            this.setIndexNoticeStatus(true);
          } else {
            this.setIndexNoticeStatus(false);
          }
        },
        err => {
          console.log(err, 'getNotice');
        }
      );
    },
  },
  beforeDestroy() {
    this.pageScroller.removeEventListener('scroll', this.onScroll, false);
    off(this.$el, 'scroll', () => {});
    // this.pageScroller.removeEventListener(
    //   'touchstart',
    //   this.onTouchStart,
    //   false
    // );
    // this.pageScroller.removeEventListener('touchmove', this.onTouchMove, false);
  },
};
</script>

<style lang="stylus" scoped>
.page-index{
  width: 100%;
  background: #fff;
}
.index-top{
  position: fixed;
  z-index: 500;
  background: #FFF;
  width: 100%;
}
.index-logo{
  position: relative;
  .header{
    position: relative;
    display: flex;
    width: 100%;
    height: 46px;
  }
  .left{
    display: inline-block;
    font-size: 14px;
    line-height: 20px;
    padding: 16px 13px 10px 10px;
    background: url('~@/assets/index/nav_cityselect.png') no-repeat 100% 57%;
    background-size: 8px auto;
  }
  .right{
    display: inline-block;
    font-size: 14px;
    width: 15px;
    line-height: 20px;
    padding: 16px 30px 10px 13px;
    background: url('~@/assets/index/nav_search.png') no-repeat center center;
    background-size: 15px auto;
    box-sizing: content-box;
  }
  .center{
    flex: 1;
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    padding: 13px 10px 9px;
    color:#333;
    font-weight:500;
  }
}
.index-swiper{
  position: relative;
  left: 0;
  bottom: 0;
  padding: 10px 10px 0 10px;
  .theme-box{
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    .theme-li{
      width: 174px;
      height: 96px;
      position: relative;
      border-radius: 5px;
    }
    .theme-img{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 5px;
      background: #f60;
    }
    .theme-text{
      position: absolute;
      top: 50px;
      left: 16px;
      font-size: 12px;
      color: rgba(255,255,255,.8);
      width: 80px;
      line-height: 16px;
    }
  }
}
.cm-view-box-body{
  overflow: hidden;
}
.index-content{
  padding-top: 46px;
}
.index-tag{
  position: relative;
  width: 100%;
  padding: 0 10px;
}
.index-article{
  margin: 0 10px;
  .loading{
    padding: 8px 0;
  }
  .loading-tip {
    font-size: 12px;
    margin: 0 8px;
  }
  .error{
    padding: 70px 0 20px;
    color: #9B9B9B;
    font-size: 12px;
    text-align: center;
    .image{
      width: 53px;
      margin-bottom: 13px;
    }
  }
  .finish{
    padding: 10px 0 20px;
    color: #9B9B9B;
    font-size: 12px;
    text-align: center;
    .image{
      width: 12px;
      margin-top: 6px;
    }
  }
}
// v2.4.0
.notice-cont{
  position: fixed;
  top: 46px;
  left: 0;
  width: 100%;
}
@keyframes loading {
  0%,100%{
    background-position: 0% 0%;
  }
  33.3333%{
    background-position: 50% 0%;
  }
  66.6666%{
    background-position: 100% 0%;
  }
}
</style>
