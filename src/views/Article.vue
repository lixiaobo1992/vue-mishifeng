<template>
  <div class="article-page">
    <div class="block" v-show="!articleStatus">
      <!--文章大图 swiper-->
      <ali-player
        class="play-box"
        @play="play"
        @requestFullScreen="requestFullScreen"
        @cancelFullScreen="cancelFullScreen"
        :vid="videoId"
        v-if="videoId && !isWechat"
        :playauth="playAuth"
        :playsinline="playsInline"
        :cover="swiperList[0]"
        ref="player"
      ></ali-player>
      <div
        class="article-swiper"
        v-if="
          (videoId && isWechat) ||
            (!videoId && !isWechat) ||
            (!videoId && isWechat)
        "
        :style="styles"
      >
        <Swiper
          :ratio="ratio"
          :continuous="true"
          :showIndicators="false"
          :auto="6000"
          :speed="500"
          @change="handleChange"
          :prevent="false"
        >
          <SwiperItem
            class="swiper-block"
            v-for="(item, index) in swiperList"
            :key="index"
            @click.stop="swiperItem(index)"
          >
            <div
              v-if="videoId && index == 0 && isWechat"
              class="swiper-video-btn"
              @click.stop="imgPlay()"
            >
              <img
                src="../assets/img/article/play-icon.png"
                class="play-icon"
              />
            </div>
            <img :src="item" alt="" class="swiper-image" />
          </SwiperItem>
          <p class="swiper-indi" slot="footer">
            {{ curIndex }}/{{ swiperList && swiperList.length }}
          </p>
        </Swiper>
      </div>
      <!-- 审核状态 v-show="articleDesc.articleStatus == 2"-->
      <div class="verify-box" v-show="articleDesc.article_status === 2">
        <div class="verify-status">
          <span class="verify-text"
            >笔记正在审核，审核结果预计在48小时内通知您哦!</span
          >
        </div>
      </div>
      <!--文章信息-->
      <div class="article-content">
        <FollowItem
          class="article-author"
          :style="tagsBoxStyle"
          :item="authorItem"
          @toggleFollow="toggleFollow"
          ref="follow"
        ></FollowItem>
        <div class="article-recmmend" v-show="articleDesc">
          <img
            src="~assets/img/art-recommend.png"
            class="img-recommend"
            v-show="articleDesc.recommend == 1"
          />
          <img
            src="~assets/img/selected-recommend.png"
            class="img-recommend"
            v-show="articleDesc.high_quality == 1"
          />
        </div>
        <p class="article-title">{{ articleDesc.title }}</p>
        <div class="article-text" v-html="articleDesc.content"></div>
        <div class="article-star">
          <div class="star-title">推荐指数:</div>
          <star class="score" :scoreMax="50" :value="starVal"></star>
        </div>
        <div
          class="article-tag"
          v-if="articleDesc.tags && articleDesc.tags.length"
        >
          <div
            class="tag-item"
            v-for="item in articleDesc.tags"
            :key="item.id"
            :class="{ disabled: item.state == 2 }"
            @click="tagsClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="article-publish-info">
          <div
            class="publish-address"
            @click="goMap"
            v-if="
              articleDesc.article_status != 2 && articleDesc.article_status != 4
            "
          >
            <Icon
              v-if="articleDesc.address"
              class="article-location"
              type="article-location"
            ></Icon>
            <span>{{ articleDesc.address }}</span>
          </div>
          <div
            class="publish-address"
            v-if="
              articleDesc.article_status == 2 || articleDesc.article_status == 4
            "
          >
            <Icon class="article-location" type="article-location"></Icon>
            <span>{{ articleDesc.branch_tmp_name }}</span>
          </div>
          <div class="publish-time">
            发布于 {{ articleDesc.time | formatDate('M-D') }}
          </div>
        </div>
      </div>
      <!--产品信息 || 店铺信息-->
      <!--产品信息-->
      <!-- <product-list
        v-if="activityProduct.length"
        :listData="activityProduct"
      ></product-list> -->
      <!--店铺信息-->
      <div class="merchant-block" v-if="merchant.show">
        <branch-info :branchInfo="branchInfo"></branch-info>
        <branch-address :addressInfo="addressInfo"></branch-address>
        <!-- 店铺活动商品 -->
        <div class="merchant-activity-box">
          <div class="article-goods-box" v-if="activityList.length > 0">
            <ul class="goods-cont-box">
              <li
                class="goods-li-box"
                v-for="(activityItem, activityIndex) in activityList"
                :key="activityIndex"
                :data-id="activityItem.id"
                data-type="product-detail"
                @click="goPage"
              >
                <dl class="goods-info-box">
                  <dt class="goods-img-box">
                    <img class="goods-img" :src="activityItem.pic" alt="" />
                  </dt>
                  <dd class="goods-text-box">
                    <p class="text-title">{{ activityItem.name }}</p>
                    <p class="text-price">
                      <span class="current-price"
                        >￥{{ activityItem.current_price }}</span
                      >
                      <span class="original-price"
                        >￥{{ activityItem.market_price }}</span
                      >
                    </p>
                  </dd>
                  <img
                    class="right-arrows"
                    src="https://img.mishifeng.com/FgqP_woduNe3vbTRExhImQ-_tPAA"
                  />
                </dl>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!--赞|评论|收藏-->
      <div class="article-sub-tab">
        <div class="sub-title">
          <div
            class="switch-btn"
            :class="{ active: currentSubTab == 2 }"
            @click="funcSwitchTab(2)"
          >
            评论 &middot; {{ comment_num }}
          </div>
          <div
            class="switch-btn"
            :class="{ active: currentSubTab == 1 }"
            @click="funcSwitchTab(1)"
          >
            点赞 &middot; {{ like_num }}
          </div>
          <div
            class="switch-btn"
            :class="{ active: currentSubTab == 3 }"
            @click="funcSwitchTab(3)"
          >
            收藏 &middot; {{ favorite_num }}
          </div>
        </div>
        <div class="sub-tab-box">
          <div class="sub-tab-item like-block" v-show="currentSubTab == 1">
            <template v-if="likeList.length > 0">
              <div
                class="avatar-item"
                v-for="(item, index) in likeList"
                :key="index"
                @click="goProfile(item.user_id)"
              >
                <Avatar
                  :src="item.avatar"
                  :size="32"
                  bg="white"
                  class="avatar"
                  :navsrc="vipsrc"
                  :navSatus="item.quality_user == 1 ? true : false"
                >
                </Avatar>
              </div>
            </template>
            <div class="item-empty" v-else>成为第一个点赞的人吧！</div>
          </div>
          <div class="sub-tab-item comment-block" v-show="currentSubTab == 2">
            <template v-if="comments.length > 0">
              <CommentItem
                v-for="(item, index) in comments"
                :key="index"
                :item="item"
                :timeStatus="commentsInfo.timeStatus"
                :replyStatus="commentsInfo.replyStatus"
              >
              </CommentItem>
              <div class="more-comments">
                <div class="more-com-btn" @click="goCommentsList()">
                  查看全部{{ comment_num }}条评论
                </div>
              </div>
            </template>
            <div class="item-empty" v-else>成为第一个评论的人吧！</div>
          </div>
          <div class="sub-tab-item like-block" v-show="currentSubTab == 3">
            <template v-if="favoriteList.length > 0">
              <div
                class="avatar-item"
                v-for="(item, index) in favoriteList"
                :key="index"
                @click="goProfile(item.user_id)"
              >
                <Avatar
                  :src="item.avatar"
                  :size="32"
                  bg="white"
                  class="avatar"
                  :navsrc="vipsrc"
                  :navSatus="item.quality_user == 1 ? true : false"
                >
                </Avatar>
              </div>
            </template>
            <div class="item-empty" v-else>成为第一个收藏的人吧！</div>
          </div>
        </div>
      </div>
      <!--更多觅食笔记-->
      <div class="recommend-box">
        <div class="recommend-title">
          <span class="title-content">
            <Icon class="more-note-icon" type="more-note"></Icon>
            <span> 更多觅食笔记 </span><i></i>
          </span>
        </div>
        <div class="recommend-list">
          <water-fall ref="waterfall" @ontap="onArticleTap"></water-fall>
        </div>
      </div>
    </div>
    <!--页面底部按钮-->
    <div
      class="footer-bar-box"
      :class="!isMSF && !isWxApp ? '' : 'footer-bar-bottom'"
    >
      <FooterBar
        :list="footerBarList"
        @footerBarClick="footerBarClick"
        v-show="footerBarList.length"
        @addFooterComment="onEnter"
      ></FooterBar>
    </div>
    <!--msf App 右上角按钮-->
    <AppBottomBtn
      :btnList="btnList"
      @appBottomBtnClick="appBottomBtnClick"
      :showBottomBtn="showBottomBtn"
      @toggleAppBottomBtn="toggleAppBottomBtn"
    ></AppBottomBtn>
    <!--缺省页-->
    <div class="block-default" v-show="articleStatus">
      <DefaultPage :imgItem="imgItem" :fontItem="fontItem"></DefaultPage>
    </div>
    <!--蜂蜜弹窗-->
    <HoneyToast :honeyNum="todayHoney" :honeyStatus="signStatus"></HoneyToast>
    <!-- 编辑功能上线 -->
    <div
      class="notice-shade shade"
      v-if="noticeStatus && isSelf"
      @click="setNoticeMask"
    >
      <img
        src="~assets/img/article/edit-notice.png"
        class="shard-arrow"
        alt=""
      />
    </div>
    <div v-if="!isMSF && !isWxApp">
      <DownloadNav></DownloadNav>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Swiper, SwiperItem } from '@/ui';
import Avatar from '@/components/Avatar';
import AddComment from '@/components/AddComment';
import AliPlayer from '@/components/AliPlayer';
import Star from '@/components/Star';
import FollowItem from '@/components/FollowItem';
import CommentItem from '@/components/CommentItem';
import WaterFall from '@/components/WaterFall';
import FooterBar from '@/components/FooterBar';
import AppBottomBtn from '@/components/AppBottomBtn';
import BranchInfo from '@/components/BranchInfo';
import BranchAddress from '@/components/BranchAddress';
import ProductList from '@/components/ProductList';
import DefaultPage from '@/components/DefaultPage';
import HoneyToast from '@/components/HoneyToast';
import DownloadNav from '@/components/DownloadNav';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
// import { isEmptyObject, isArray } from '@/utils/base';
import api from '@/api';
import scroll from '@/utils/scroll';

import tongji from '@/utils/tongji';
// 导入图片
import articleDefault from '@/assets/img/no-article.png'; // 缺省页
import branchDefault from '@/assets/img/honey_icon.png';
import defaultAvatar from '@/assets/login/default-avatar.png';
import Icon from '@/ui/Icon';
import { dateFilter } from '@/utils/base/filter-date';
import vipsrc from '@/assets/img/vip.png';
export default {
  components: {
    Swiper,
    SwiperItem,
    FollowItem,
    CommentItem,
    WaterFall,
    FooterBar,
    Avatar,
    Star,
    AddComment,
    BranchInfo,
    BranchAddress,
    AppBottomBtn,
    [ProductList.name]: ProductList,
    Icon,
    DefaultPage,
    HoneyToast,
    'ali-player': AliPlayer,
    DownloadNav,
  },
  data() {
    return {
      ratio: 1, // swiper 显示比例
      swiperList: [],
      curIndex: 1, // 当前 swiper
      firstPic: '', // 文章首图

      authorItem: {}, // 作者信息
      articleDesc: {}, // 文章信息
      merchant: {}, // 商家信息
      activityList: [], // v2.3.0 文章附带活动商品
      comments: [], //  评价列表
      commentsInfo: {
        timeStatus: false,
        replyStatus: false,
      },
      // 门店信息
      branchInfo: {
        starObj: {},
      },
      footerBarList: [],
      currentSubTab: 2, // 默认显示评论
      like_num: 0,
      favorite_num: 0,
      comment_num: 0,
      favoriteList: [],
      likeList: [],
      starObj: {},
      starVal: 12,
      articleId: 0,
      userAvatar: '',
      btnList: [
        {
          id: 1,
          text: '举报内容',
          color: '#ff3b30',
        },
      ],
      showBottomBtn: false,
      signStatus: false,
      todayHoney: 120,
      timer: null,
      tagsBoxStyle: '',
      isMSF: device.msf,
      isWechat: device.wechat,
      isWxApp: device.wxapp,
      isSelf: false,
      isNewVersion: false,
      articleStatus: false,
      imgItem: {
        src: articleDefault,
        width: 250,
        height: 200,
      },
      fontItem: {
        width: 180,
        desc: '哎呀,文章已被删除！！',
      },
      noticeStatus: false,
      styles: {
        height: '',
      },
      vipsrc,
      // 视频id
      videoId: '',
      playAuth: '',
      // 视频播放盒子的展示或隐藏，默认隐藏
      playStatus: false,
      playsInline: true,
      // 视频状态  -- 放大 true  ， 正常 false
      videoStatus: false,
      screenHeight: '',
    };
  },
  watch: {
    $route(val, oldVal) {
      console.log(this.videoStatus, 'videoStatus');
      if (!this.videoStatus) {
        if (val.query.id != oldVal.query.id) {
          this.getDetail();
          let dom = scroll.getScrollEventTarget(this.$el);
          scroll.setScrollTop(dom, 0);
        }
      } else {
        this.cancelFullScreen();
      }
    },
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    }),
    // activityProduct() {
    //   if (device.msf && this.$version.lte('1.0.0')) {
    //     return [];
    //   }
    //   if (this.activity) {
    //     // 有可能是数组
    //     if (isArray(this.activity)) {
    //       return [];
    //     }
    //     if (isEmptyObject(this.activity)) {
    //       return [this.activity];
    //     }
    //   }
    //   return [];
    // },
  },
  created() {
    const that = this;
    if (!this.$route.query.id) {
      return;
    }
    this.isNewVersion = this.$version.gt('1.3.1');
    this.articleId = Number(this.$route.query.id);
    //  bd66975c32e44eef8ea6437e2902168e
    // this.videoId = this.$route.query.videoId || '';
    this.$showLoading();
    this.getGeo({
      name: 'article',
      success: res => {
        console.log('article.vue geo success:', res);
      },
      fail: err => {
        console.log('article.vue geo fail:', err);
      },
    });
    this.getComment();
    this.getDetail();
    if (that.isMSF) {
      bridge.onTogglefollow({
        success(res) {
          console.log('onTogglefollow');
          let result = that.authorItem.followed;
          let type = result == true ? 2 : 1;
          that.$refs.follow.goNext(that.authorItem.id, '1', type);
        },
      });
      this.initBridge();
    }
  },
  // 组件销毁前调用
  beforeDestroy() {},
  mounted() {
    this.screenHeight = document.documentElement.clientHeight;
    if (this.isMSF) {
      bridge.vueLoadFinish({
        success(res) {
          console.log(res);
        },
      });
    }
  },
  methods: {
    ...mapActions(['getGeo', 'setShareMask']),
    setTimer() {
      this.timer = setTimeout(() => {
        this.signStatus = false;
      }, 3000);
    },
    getComment() {
      api.commentList(
        {
          id: this.$route.query.id,
        },
        res => {
          let { list = [], userinfos, article_info } = res.data;
          let filterComments =
            list &&
            list.map(item => {
              return {
                avatar: userinfos[item.user_id]
                  ? userinfos[item.user_id].avatar_url
                  : defaultAvatar,
                userName: userinfos[item.user_id]
                  ? userinfos[item.user_id].nickname
                  : '觅食蜂',
                content: item.content,
                time: dateFilter(item.created_at),
                id: item.user_id,
                replyPid: item.id,
                arctileId: item.article_id,
                replayList:
                  item.sub_comment.list.map(replayItem => {
                    return {
                      user_nickname: userinfos[item.user_id]
                        ? userinfos[item.user_id].nickname
                        : '觅食蜂',
                      reply_nickname: userinfos[replayItem.user_id]
                        ? userinfos[replayItem.user_id].nickname
                        : '觅食蜂',
                      isAuthor_replay:
                        replayItem.user_id == article_info.user_id, //回复人是否是作者
                      isAuthor_user: item.user_id == article_info.user_id, //被回复人是否是作者
                      content: replayItem.content, //内容
                      replay_user_id: replayItem.user_id, //回复人
                      user_id: item.user_id, //被回复人
                      total_cnt: item.sub_comment.total_cnt,
                    };
                  }) || [],
                count: item.sub_comment.total_cnt,
              };
            });
          this.comments = filterComments.slice(0, 2);
        },
        err => {
          console.log(err);
        }
      );
    },
    getDetail() {
      api.articleDetail(
        {
          id: this.$route.query.id,
        },
        res => {
          const { data = {} } = res;
          this.dealData(data);
          this.videoId = data.video_id || '';
          if (data.video_id) {
            this.getPlayAuth(data.video_id);
          }
          this.getCommendList();
          if (device.wechat) {
            const desc =
              '快来觅食蜂围观 @' +
              this.authorItem.name +
              ' 觅食笔记，抢一元探店套餐！';
            bridge.setShare({
              title: this.articleDesc.title || '觅食蜂 美食探索进行时',
              weixin_timeline: {
                title: desc,
              },
              desc,
              link: location.href,
              imgUrl: this.firstPic,
            });
          }
        },
        err => {
          console.log(err);
          this.articleStatus = true;
        }
      );
    },
    getCommendList() {
      api.articleInterestList(
        {
          id: this.$route.query.id,
        },
        res => {
          let { list = [] } = res.data;
          this.dealInterestList(list);
        },
        err => {
          console.log(err);
        }
      );
    },
    setHeaderBar() {
      if (this.isMSF) {
        let height = this.$el.querySelector('.article-author').offsetHeight;
        height = device.iphone ? height : 0;
        const tagsTop = this.$el.querySelector('.article-swiper').offsetHeight;
        let scrollTop = height + tagsTop;
        bridge.setNavigationBar({
          data: {
            followed: this.authorItem.followed, //是否被我关注
            b: this.authorItem.followed,
            user_nickname: this.authorItem.name,
            user_avatar: this.authorItem.avatar,
            desc: `${this.authorItem.article}篇觅食笔记, ${this.authorItem.fans} 位粉丝`,
            e: `${this.authorItem.article}篇觅食笔记, ${this.authorItem.fans} 位粉丝`,
            scrollTop: scrollTop, //滚动距离 显示或隐藏 导航栏
            target_url: '/profile?id=' + this.authorItem.id,
            user_id: this.authorItem.id,
            recommend: this.articleDesc.recommend,
            qualityUser: parseInt(this.authorItem.qualityUser),
          },
          success(res) {
            console.log(res);
          },
        });
      }
    },
    dealData(data) {
      const that = this;
      if (device.msf) {
        bridge.addNavigationBarMenu({
          success(res) {
            if (res.data.id == 2) {
              that.shareAppBottom();
            }
          },
          right: [
            {
              id: 2,
              icon: 'bg_more',
              text: '更多',
              color: '#ff0000',
              fontSize: '',
            },
          ],
        });
      }
      if (data.video_id && this.isWechat) {
        this.swiperList.push(data.pic);
      } else {
        this.swiperList = data.pics || [];
      }
      this.firstPic = data.pic || '';
      // 作者信息
      this.isSelf = data.is_self;
      this.authorItem = {
        avatar: data.avatar,
        followed: data.followed || false,
        name: data.nickname || '觅食蜂',
        article: data.article_num,
        fans: data.fans_num,
        id: data.user_id,
        qualityUser: data.quality_user,
        level: data.level_id,
      };
      if (this.isMSF) {
        that.isSelf &&
          bridge.getStorage({
            key: 'noticed',
            success(res) {
              if (res.data.noticed == undefined) {
                that.noticeStatus = true;
                bridge.setStorage({
                  key: 'noticed',
                  data: { noticed: true },
                  success(res) {
                    console.log(res);
                  },
                });
              }
            },
          });
      }
      // 文章详情信息
      this.articleDesc = {
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        address: data.address,
        time: data.created_at,
        recommend: data.recommend,
        high_quality: data.high_quality,
        article_type: data.article_type,
        article_status: data.status,
        video_id: data.video_id || '',
        branch_tmp_name: data.branch_tmp_name || '',
      };
      this.setHeaderBar();
      // 商家信息
      this.branchInfo = {
        id: data.branch_id,
        branchLogo: data.branch_head_pic || branchDefault,
        branchName: data.branch_name,
        articleNum: data.branch_article_count,
        starVal: data.branch_star,
      };
      this.addressInfo = {
        lng: data.branch_lng,
        lat: data.branch_lat,
        title: data.branch_name,
        address: data.branch_address,
        phoneNumber: data.branch_phone,
      };
      this.merchant = {
        show: data.branch_id && data.branch_lng && data.branch_lat,
        id: data.branch_id,
      };
      this.activityList = this.filterPrice(data.activity_list); // v2.3.0 文章附带活动商品
      // 文章地址信息
      this.mapQuery = {
        lng: data.lng,
        lat: data.lat,
        title: data.title,
        address: data.address,
      };
      this.userAvatar = data.avatar;

      this.like_num = data.likes_num; // 点赞数
      this.comment_num = data.comment_num; // 评论数
      this.favorite_num = data.favorite_num; // 收藏数

      // 评分
      this.starVal = data.star;

      this.footerBarList = [
        {
          iconType: data.favorite_status ? 'like' : 'unlike',
          content: this.dealNum(data.favorite_num),
          type: 'shoucang',
        },
        {
          iconType: data.likes_status ? 'favorite' : 'unfavorite',
          content: this.dealNum(data.likes_num),
          type: 'dianzan',
        },
      ];
      if (!this.isMSF) {
        this.footerBarList.unshift({
          iconType: 'share',
          content: '',
          type: 'fenxiang',
        });
      }
    },
    dealInterestList(list = []) {
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
    // 处理图片自适应信息
    dealSwiperInfo(list) {
      const picList = list || [];
      for (let item of list) {
        picList.push(item.pic);
      }
    },

    funcSwitchTab(index) {
      this.currentSubTab = index;
      const eventVal = ['c_list_like', 'c_list_comment', 'c_list_collect'][
        index - 1
      ];
      tongji.event(eventVal);
      switch (index) {
        case 1:
          this.getLikeList();
          break;
        case 2:
          // this.switchTab = 'comments';
          break;
        case 3:
          this.getFavoriteList();
          break;
        default:
          console.log('点击按钮');
      }
    },
    // 请求点赞列表
    getLikeList() {
      // 当存在的时候不需要请求接口
      api.articleLikesList(
        {
          id: this.$route.query.id,
        },
        res => {
          this.likeList = res.data.list.slice(0, 16);
          this.switchTab = 'like';
        },
        err => {
          console.log(err);
        }
      );
    },
    // 请求收藏列表
    getFavoriteList() {
      // 当存在的时候不需要请求接口
      api.articleFavoriteList(
        {
          id: this.$route.query.id,
        },
        res => {
          this.favoriteList = res.data.list.slice(0, 16);
          // this.switchTab = 'fav';
        },
        err => {
          console.log(err);
        }
      );
    },
    //点赞
    toggleLikes(index) {
      const self = this;
      tongji.event('c_like', `value:{articleId:${self.articleId}}`);
      api.toggleLike(
        {
          id: this.$route.query.id,
        },
        res => {
          const imgSrc = res.data.status == 1 ? 'favorite' : 'unfavorite';
          const num = this.dealNum(res.data.likes_num);
          self.$set(self.footerBarList[index], `iconType`, imgSrc);
          self.$set(self.footerBarList[index], `content`, num);
          self.like_num = res.data.likes_num;
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
    //收藏
    toggleFavorite(index) {
      tongji.event('c_collect', `value:{articleId:${self.articleId}}`);
      api.toggleFavorite(
        {
          id: this.$route.query.id,
        },
        res => {
          const self = this;
          const imgSrc = res.data.status == 1 ? 'like' : 'unlike';
          const num = this.dealNum(res.data.favorite_num);
          self.$set(self.footerBarList[index], `iconType`, imgSrc);
          self.$set(self.footerBarList[index], `content`, num);
          self.favorite_num = res.data.favorite_num;
          console.log(res);
          if (res.data.status == 1 && res.data.honey) {
            self.signStatus = true;
            self.todayHoney = res.data.honey;
            this.setTimer();
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    toggleFollow(result) {
      let followed = result == 3 ? false : true;
      tongji.event('c_follow', `value:{followed:${followed}}`);
      this.authorItem.followed = followed;
      this.setHeaderBar();
    },
    appBottomBtnClick(id) {
      // const that = this;
      //that.shareAppBottom();
    },
    shareAppBottom() {
      if (device.msf) {
        const defaultChannel = ['weixin', 'weixin_timeline', 'copy_link'];
        if (this.isNewVersion) {
          defaultChannel.splice(2, 0, 'weibo');
          defaultChannel.push('report');
        }
        if (this.isSelf && this.isNewVersion) {
          defaultChannel.splice(-1, 1, 'delete');
          defaultChannel.push('article_update');
        }
        const desc =
          '快来觅食蜂围观 @' +
          this.authorItem.name +
          ' 觅食笔记，抢一元探店套餐！';
        const wbDesc = `快来觅食蜂围观@${this.authorItem.name} 觅食笔记，抢一元探店套餐! ${location.href} （觅食蜂，美食达人聚集地 https://m.mishifeng.com/download )`;
        bridge.showShare({
          type: 0,
          title: this.articleDesc.title || '觅食蜂 美食探索进行时',
          weixin_timeline: {
            title: desc,
          },
          weibo: {
            title: wbDesc,
          },
          desc,
          link: location.href,
          imgUrl: this.firstPic,
          url: location.href,
          onlySelectChannel: defaultChannel,
          success(res2) {
            console.log(res2);
          },
        });
        tongji.event('c_article_share');
      }
    },
    doReport() {
      api.articleReport(
        {
          article_id: this.$route.query.id,
        },
        res => {
          bridge.showToast({
            content: res.data.content,
          });
        },
        err => {
          console.log(err);
        }
      );
    },
    handleChange(index) {
      this.curIndex = index + 1;
    },
    swiperItem(index) {
      tongji.event('c_article_banner', `value:{"bannnerId:${index}"}`);
    },
    footerBarClick(type, index) {
      switch (type) {
        case 'dianzan':
          this.toggleLikes(index);
          break;
        case 'shoucang':
          this.toggleFavorite(index);
          break;
        case 'pinglun':
          tongji.event('c_comment_more');
          this.goCommentsList();
          break;
        case 'fenxiang':
          this.setShareMask({ isShow: true });
          break;
        default:
          console.log('点击按钮');
          break;
      }
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
    onEnter(data) {
      let time = Date.parse(new Date());
      const comment = {
        avatar: data.avatar,
        userName: data.nickname || '觅食蜂',
        content: data.content,
        time: dateFilter(time / 1000),
      };
      this.comments = [comment, ...this.comments].slice(0, 5);
      this.comment_num = this.comment_num + 1;
      //this.getComment();
      window.scroll(0, 0);
      window.innerHeight = window.outerHeight = this.screenHeight;
      this.$set(this.footerBarList[1], `content`, data.comment_num);
    },
    toggleAppBottomBtn(val = false) {
      this.showBottomBtn = val;
    },
    goBranch(id) {
      this.$forward('shop-detail', { id });
    },
    goCommentsList() {
      this.$forward('comments', {
        id: this.articleId,
      });
    },
    tagsClick(item) {
      if (item.state == 2) {
        return;
      }
      tongji.event('c_article_tag', `value:{tagId:${item.id}}`);
      this.$forward('search-article', { keyword: item.name });
    },
    goMap() {
      tongji.event('c_article_location');
      this.$forward('map', this.mapQuery);
    },
    goProfile(id) {
      if (!id) {
        return;
      }
      this.$forward('profile', { id });
    },
    dealNum(num) {
      if (parseInt(num) > 9999) {
        return '9999+';
      } else {
        return num;
      }
    },
    setNoticeMask() {
      console.log('1');
      this.noticeStatus = false;
    },
    // 获取视频播放凭证
    getPlayAuth(videoId) {
      console.log('获取视频播放凭证');
      api.articlePlayAuth(
        {
          video_id: videoId,
        },
        res => {
          const { list } = res.data;
          if (!list && !list.length) return;
          const { play_auth, video_id } = list[0];
          this.playAuth = play_auth;
          this.videoId = video_id;
          this.playStatus = true;
        },
        err => {}
      );
    },
    imgPlay() {
      const isWeiXin = device.wechat;
      if (isWeiXin) this.$showToast('请在App环境下预览');
    },
    // 视频播放
    play() {
      const player = this.$refs.player.instance;
      player && player.play();
    },
    // 视频放大
    requestFullScreen() {
      this.videoStatus = true;
    },
    // 视频取消放大
    cancelFullScreen() {
      console.log('视频取消放大回调');
      const player = this.$refs.player.instance;
      if (this.videoStatus) {
        player && player.fullscreenService.cancelFullScreen();
        this.videoStatus = false;
      }
    },
    // 初始化返回按键的监听
    initBridge() {
      const that = this;
      bridge.onBack({
        success(res) {
          if (that.videoStatus) {
            that.cancelFullScreen();
          } else {
            bridge.navigateBack({
              success(res) {
                console.log(res, 'res');
              },
            });
          }
        },
      });
    },
    // 过滤价格
    filterPrice(list = []) {
      return list.map(item => {
        return {
          current_price: (item.current_price / 100).toFixed(2),
          market_price: (item.market_price / 100).toFixed(2),
          id: item.id,
          name: item.item_name,
          pic: item.item_pic,
          left_stock: item.left_stock,
          branch_id: item.branch_id,
        };
      });
    },
    // 跳转
    goPage(e) {
      const { type, id } = e.currentTarget.dataset;
      this.$forward(type, {
        id,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.footer-bar-bottom{
  bottom: 0px !important;
}
.footer-bar-box{
  position: fixed;
  bottom: 50px;
  z-index: 100;
  left: 0px;
  width: 100%;
  height: 50px;
}
.article-page{
  background-color: #F6F7F9;
  padding-bottom: 55px;
  overflow-y:auto;
}
.play-box{
  width: 100%;
  height: 100%;
}
/* 文章banner */
.article-swiper{
  position: relative;
  .swiper-video-btn{
    position: absolute;
    width: 80px;
    height: 80px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 71;
    .play-icon{
      width: 100%;
      height: 100%;
    }
  }
  .swiper-image{
    width: 100%;
    height: 100%;
  }
  .swiper-indi{
    position: absolute;
    right: 15px;
    bottom: 10px;
    background: rgba(35,24,21,0.50);
    border-radius: 4px;
    color: #fff;
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    padding: 0 12px;
    z-index: 60;
  }
}
.block{
  background:#f5f6f9;
}
.article-swiper {
  width:100%;
  min-height:200px;
}
/* 文章信息 */
.article-content{
  padding:0 15px 15px;
  margin-bottom: 10px;

  .article-author{
    margin-bottom: 15px;
  }
  .article-recmmend{
    width:70px;
    height:59px;
    position:absolute;
    right:10px;
    line-height:54px;
    text-align:center;
    font-size:13px;
    display:block;
    margin-top:-14px;
    .img-recommend {
      width:52px;
      height:44px;
    }
  }
  .article-title{
    font-weight: 500;
    font-size: 16px;
    color: #333;
    line-height:28px;
  }
  .article-text{
    font-size: 14px;
    color: #333;
    line-height: 22px;
    padding: 10px 0 30px 0;
    overflow-y:scroll;
    position:relative;
  }
  .article-star{
    font-size: 14px;
    color: #666;
    line-height: 22px;
    margin-bottom: 10px;
    display: flex;
    height: 22px;
    align-items: center;

    .star-title{
      margin-right: 10px;
      color:#333;
      font-size:14px;
    }
    .score{
      flex: 1;
      position: relative;
      margin-top:-5px;
    }
  }

  .article-tag{
    display: flex;
    margin-bottom: 15px;
    flex-wrap: wrap;

    .tag-item{
      margin-right: 8px;
      font-size: 12px;
      color: #333;
      text-align: center;
      line-height: 22px;
      padding: 0 14px;
      margin-bottom: 5px;
      border: 1px solid #FEF6CA ;
      border-radius: 15px;
      background-color:#fef6ca;
    }
  }

  .article-publish-info{
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #4A4A4A;
    .publish-address{
      display: flex;
      align-items: center;
      line-height: 14px;
      padding-right: 5px;
      color:#333;
      .article-location {
        font-size: 14px;
        margin-right: 5px;
      }
    }
    .publish-time{
      min-width: 80px;
      text-align: center;
      display: flex;
      align-items: flex-end;
      color:#ccc;
    }
  }
}


.disabled{
  border: 1px solid #e2e2e2;
}

/* 商家block */
.merchant-block{
  margin: 10px 0;
  background: #fff;

  .merchant-title{
    line-height: 35px;
    text-align: center;
    width: 100%;
    border-bottom: 1px solid #e2e2e2;
    font-size: 14px;
    font-weight: 500;

    span{
      display: inline-block;
      border-bottom: 3px solid #fccb2f;
    }
  }
  // 门店信息
  .merchant-desc{
    position: relative;
    font-size: 10px;
    display: flex;
    padding: 15px;

    .merchant-avatar{
      width: 40px;
      height: 40px;
      background-color: #e2e2e2;
      flex-shrink: 0;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .merchant-info{
      flex: 1;
      margin-left: 10px;
      position: relative;
      overflow: hidden;
      .merchant-name{
        font-weight: 500;
        font-size: 14px;
        color: #212121;
      }
      .merchant-address{
        display: flex;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        p{
          flex: 1;
          color: #999;
        }
        span{
          color: #999;
        }
      }
    }
  }
  /*门店活动列表*/
  .merchant-activity-box{
    width: 100%;
    .article-goods-box{
      padding: 14px 14px 10px 14px;
      width: 100%;
      height: 80px;
      background: #fff;
      border-top: 1px solid #F5F5F5;
    }
    .goods-cont-box{
      height: 57px;
      overflow-x: scroll;
      white-space: nowrap;
      margin-block-start: 0;
      margin-block-end: 0;
      padding-inline-start: 0;
    }
    .goods-li-box{
      display: inline-block;
      width: 232px;
      height: 52px;
      margin-right: 10px;
      border-radius: 3px;
      background: #f8f8f8;
      .goods-info-box{
        width: 100%;
        height: 52px;
        display: flex;
        margin-block-start: 0;
        margin-block-end: 0;
        position: relative;
      }
      .goods-img-box{
        width: 52px;
        height: 52px;
      }
      .goods-img{
        width: 100%;
        height: 100%;
      }
      .goods-text-box{
        width: 180px;
        height: 52px;
        margin-left: 5px;
      }
      .text-title{
        margin-top: 4px;
        width: 100%;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .text-price{
        width: 180px;
        height: 20px;
        line-height: 20px;
      }
      .current-price{
        font-size: 14px;
        color: #FFBF00;
        font-weight: bold;
      }
      .original-price{
        margin-left: 4px;
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
      }
      .right-arrows{
        position: absolute;
        width: 12px;
        height: 14px;
        right: 5px;
        top: 19px;
      }
    }
  }
}
/*文章底部tab*/
.article-sub-tab{
  padding: 0 10px;
  .sub-title{
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #999999;
    margin: 0 15px;
    .switch-btn{
      position: relative;
      padding: 5px 10px 2px;
      color:#333;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 0;
        background-image: linear-gradient(90deg, #FFB500 10%, #FDE044 68%);
        border-radius: 3PX;
      }
    }
    .active {
      font-size: 14px;
      color: #333333;
      font-weight: 600;
      &::after{
        height: 4PX;
      }
    }
  }

  .sub-tab-box{
    .comment-block{
      margin-top: 15px;
      .add-comment{
        margin: 10px 0;
      }
    }
    .like-block{
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      margin-top: 20px;
      padding-bottom: 20px;
      .avatar-item{
        width: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        margin-bottom: 10px;
      }
    }
    .more-comments{
      width: 100%;
      text-align: center;
      padding: 10px 0;
      font-size: 12px;
      color: #628DB7;
      line-height: 24px;
      .more-com-btn{
        width: 100%;
        font-family: 'PingFangSC-Regular';
        font-size:13px;
      }
    }
    .item-empty{
      font-size: 13px;
      color: #4A4A4A;
      text-align: center;
      width: 100%;
      padding-bottom: 10px;
    }
  }
}


/* 更多觅食笔记 */
.recommend-box{
  width: 100%;
  margin-bottom: 10px;
}
.recommend-title{
  width: 100%;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  color: #231815;
  padding: 12px 0 17px 0;
  background: #fff;
  .title-content {
    position: relative;
    display: inline-block;
    span {
      vertical-align: middle;
    }
    .more-note-icon {
      vertical-align: middle;
      font-size: 16px;
    }
    i {
      position: absolute;
      width: 100%;
      height: 3PX;
      left: 0;
      bottom: -5px;
      background-image: linear-gradient(90deg, #FFB500 10%, #FDE044 68%);
      border-radius: 3PX;
    }
  }
}
.recommend-list {
  padding: 0 10px;
  background:#f5f6f9;
}

.article-content, .article-sub-tab {
  background: #fff;
  margin-bottom: 10px;
  position:relative;
}
.block-default{
  display:flex;
  height:auto;
}
.notice-shade {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.5);
  color: #FDCC02;
  font-size: 12px;
}
.shade {
  padding-top: 102px;
  .share-block{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .shade-logo {
      height: 90px;
      padding: 0 5px;
      margin-right: 11px;
      img {
        display: block;
        height: 100%;
      }
    }

    .shade-content {
      .shade-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        margin-right: 20px;
      }
    }

    &.bargain-share{
      .shade-content{
        width: 250px;
        margin-right: 38px;
        .shade-title {
          text-align: center;
        }
      }
    }
  }

  .shard-arrow {
    position: absolute;
    top: 30px;
    right: 12px;
    height: 200px;
    display: block;
  }
}
>>>.floor {
  padding-top:15px;
}
>>>.comment-item {
  padding:4px 0;
}
.verify-box{
  background: #fff;
  padding: 0.1rem 0.14rem 0.05rem;
}
.verify-status {
  padding:9px 15px 10px 32px;
  font-size:12px;
  text-align:center;
  border-radius:14.5px;
  color:#444440;
  line-height:18px;
  background: url("~assets/img/article/check-status.png") no-repeat center center;
  background-size:100% 100%;
  min-height:44px;
  .verify-text{
    position:relative;
    text-align:left;
    display:block;
    padding-left:20px;
    &:after{
      content:'';
      position:absolute;
      top:1px;
      left:0;
      width:14px;
      height:14px;
      background-image: url("~assets/img/clock.png");
      background-size:100% 100%;
      background-repeat:no-repeat;
    }
  }
}
</style>
