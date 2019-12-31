<template>
  <div class="page-product-detail">
    <!--顶部 header-->
    <div
      class="header-box"
      v-if="isHeader"
      :class="{ show: isHeader }"
      :style="headerStyle"
    >
      <span class="icon-left" data-type="back" @click="goNext"></span>
      <h1>&nbsp;</h1>
      <span class="icon-right" data-type="share" @click="goNext"></span>
    </div>

    <!--产品swiper-->
    <div class="min-product">
      <!-- 活动商品简介 -->
      <div class="public-block activity-product-info">
        <p class="product-title">{{ productInfo.title }}</p>
        <div
          class="product-status"
          :class="productInfo.left_stock > 0 ? 'action' : ''"
        >
          <i>抢</i>
          <p>{{ saleStatusTip }}</p>
        </div>
        <div
          class="product-status"
          :class="productInfo.left_stock > 0 ? 'action' : ''"
        >
          <i>抵</i>
          <p>
            可以蜂蜜抵扣最多<span>%</span>的支付金额<img
              class="doubt-icon"
              data-type="notice"
              @click="goNext"
              src="https://img.mishifeng.com/FubmRzqcbAM_5uB_SJkOawrE_QZd"
            />
          </p>
        </div>
        <div class="product-price">
          <div class="price-hint">
            <span>￥{{ productInfo.currentPrice | price }}</span>
            <span class="price-hint-text" data-type="hint" @click="goNext"
              >设置价格提醒</span
            >
          </div>
          <del>￥{{ productInfo.marketPrice | price }}</del>
        </div>
        <span
          class="btn-text"
          :class="{
            cheng: bargainBtnObj.bargainBtnState == 2,
            lv: bargainBtnObj.bargainBtnState == 3,
            lan: bargainBtnObj.bargainBtnState == 4,
          }"
          :data-status="bargainBtnObj.bargainBtnState"
          @click="bargainBtn"
          >{{ bargainBtnObj.bargainBtnText }}</span
        >
      </div>

      <!--店铺信息-->
      <div class="branch-box">
        <branch-info :branchInfo="branchInfo"></branch-info>
        <branch-address :addressInfo="addressInfo"></branch-address>
      </div>
      <!-- 店铺关联的文章 -->
      <div class="article-box" v-if="articleList.length">
        <div class="article-list-box">
          <ArticleItem
            v-for="(articleItem, articleIndex) in articleList"
            :key="articleIndex"
            :item="articleItem"
            :footerStatus="ArticleItemFooter"
          ></ArticleItem>
        </div>
        <p
          class="more-article-text"
          data-type="shop-detail"
          :data-id="branchInfo.id"
          @click="goNext"
        >
          查看所有探店笔记
        </p>
      </div>
      <!--菜单-->
      <div class="public-block menu-box clearfix">
        <div class="block-title">
          <img
            class="article-icon"
            src="https://img.mishifeng.com/Fo4d7VBQRENh4Q_WGfk_c2axm12O"
          />
          <span>菜单</span>
          <span class="article-lint"></span>
        </div>
        <!-- v2.2.0 菜单图片，点击放大 -->
        <ul class="img-cont-box">
          <li
            class="img-info-box"
            v-for="(picItem, picIndex) in picList"
            :data-index="picIndex"
            @click="bigImg"
            :key="picIndex"
          >
            <img class="img-box" :src="picItem.pic" />
          </li>
        </ul>
        <!--列表-->
        <div class="menu-list">
          <div
            class="menu-item"
            v-for="(munuItem, index) in menuData"
            :key="'item_' + index"
          >
            <div class="menu-title">{{ munuItem.name }}</div>
            <div class="menu-item-desc">
              <p
                class="desc-item"
                v-for="(item, childIndex) in munuItem.items"
                :key="'childitem_' + childIndex"
              >
                <span>{{ item.name }}</span>
                <small v-if="item.price">￥{{ item.price }}</small>
              </p>
            </div>
          </div>
        </div>
        <!--介绍-->
        <div
          class="menu-introduction"
          v-html="productDesc"
          v-show="productDesc"
        ></div>
      </div>

      <!--购买须知-->
      <div class="public-block notice-box">
        <div class="block-title"><span>购买须知</span></div>
        <div class="notice-tag" v-if="special_tips.length">
          <ul class="clearfix">
            <li
              v-for="(item, index) in special_tips"
              :key="'item_' + index + item.id"
            >
              <i :style="{ backgroundImage: 'url(' + item.icon + ')' }"></i>
              <span>{{ item.text }}</span>
            </li>
          </ul>
        </div>
        <notice-text :html="tips"></notice-text>
      </div>
    </div>

    <!-- 抢购按钮 -->
    <div
      class="buy-btn"
      data-type="buy"
      :class="{ action: btnStatus.btnCode == 1 }"
      @click="goNext"
    >
      {{ btnStatus.btnText }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import NoticeText from '@/components/NoticeText';
import BranchAddress from '@/components/BranchAddress';
import BranchInfo from '@/components/BranchInfo';
import ArticleItem from '@/components/ArticleItem';
import api from '@/api';
import store from '@/store'; // v2.2.0
import mini from '@/utils/mini'; // v2.2.0
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import { dealPrice } from '@/utils';
import { on, off } from '@/utils/event';
import scroll from '@/utils/scroll';
import tongji from '@/utils/tongji';
export default {
  components: {
    NoticeText,
    BranchAddress,
    BranchInfo,
    ArticleItem,
  },
  data() {
    return {
      activity_id: this.$route.query.id,
      isHeader: false,
      headerStyle: {
        backgroundColor: 'rgba(255,255,255,1)',
      },
      picList: [], // swiperList 改为 picList   v2.2.0
      curIndex: 1,

      productInfo: {},
      saleStatusTip: '',
      addressInfo: {},

      branchInfo: {
        starObj: {},
      },
      menuData: [],
      special_tips: [], // 须知项
      tips: '',

      productDesc: '',
      //
      //   hasCover: false, // 是否显示删除遮罩
      articleList: [],

      btnStatus: {},
      ArticleItemFooter: false, // v2.2.0 控制组件底部展示和隐藏
      bargainBtnObj: {}, // v2.2.0 砍价按钮状态及文案
      tongdunFingerprintStatus: false, // v2.2.0 同盾设备指纹状态
      blackBox: '', // v2.2.0 同盾设备指纹
      sessionId: '', // v2.2.0 同盾验证成功的sessionId
    };
  },
  created() {
    this.$showLoading();
    this.getGeo({
      success: res => {
        this.getData();
      },
      fail: err => {
        this.getData();
      },
    });

    if (device.msf) {
      const that = this;
      bridge.addNavigationBarMenu({
        right: [
          {
            type: 'share',
            id: 1,
            icon: 'share',
            text: '分享',
            color: '',
            fontSize: '',
          },
        ],
        success(res) {
          console.log(res);
          if (res.data.type === 'share') {
            const {
              marketPrice,
              currentPrice,
              title,
              item_pic,
            } = that.productInfo;
            bridge.showShare({
              type: 1,
              title,
              weixin_timeline: {
                title: `最低1折起，快来砍价！${that.branchInfo.branchName}:${title}`,
              },
              desc: `原价¥${dealPrice(marketPrice, 100)}， 现在只要¥${dealPrice(
                currentPrice,
                100
              )}!快来帮我，最低只要1折起！`,
              link: `${location.origin}/bargain?id=${that.activity_id}&publisher=${that.userInfo.id}`,
              url: location.href,
              imgUrl: item_pic,
              success(res2) {
                console.log(res2);
              },
              onlySelectChannel: [
                'weixin',
                'weixin_timeline',
                // 'qq',
                // 'qzone',
                // 'weibo',
                'copy_link',
                // 'image',
              ],
            });
          }
          console.log(res);
        },
      });
      bridge.getAppConfig({
        success(res) {
          const { data } = res;
          that.tongdunFingerprintStatus = data.tongdunFingerprint;
          if (that.tongdunFingerprintStatus) {
            bridge.getSystemInfo({
              success(res) {
                const { data } = res;
                that.blackBox = data.blackBox;
              },
            });
          }
        },
      });
    } else {
      // 不是 app 内嵌环境 显示header
      this.isHeader = true;
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 悬浮导航
      if (!device.msf) {
        on(this.$el, 'scroll', e => {
          const scrollTop = scroll.getScrollTop(this.$el);
          const opacity = scrollTop / 150;
          if (opacity <= 1.5) {
            let style = {
              backgroundColor: `rgba(255,255,255,${opacity})`,
            };
            if (opacity >= 1.4) {
              style.boxShadow = `0px 2PX 4PX rgba(0, 0, 0, ${opacity / 10})`;
            }
            this.headerStyle = style;
          }
        });
      }
    });
  },
  computed: {
    ...mapState({
      logged: state => state.user.logged,
      userInfo: state => state.user.userInfo,
    }),
  },
  beforeDestroy() {
    //...
    off(this.$el, 'scroll', () => {});
  },
  methods: {
    ...mapActions(['setShareMask', 'getGeo', 'setImagesBigStatus']),
    // v2.2.0 修改跳转逻辑
    goNext(e) {
      tongji.event('c_good_buy');
      const { type, id = 0 } = e.currentTarget.dataset;
      switch (type) {
        case 'back':
          this.$back();
          break;
        case 'share':
          this.setShareMask({ isShow: true, type: 2 });
          break;
        case 'buy':
          if (device.wxapp) {
            this.$showToast('请前往觅食蜂app使用该功能');
            return;
          }
          if (this.btnStatus.btnCode == 1) {
            // 用户是否登录
            if (!this.logged) {
              this.$forward('login');
              return;
            }
            // 调用接口
            this.payment();
          } else {
            console.log(this.btnStatus.btnText);
          }
          break;
        case 'hint':
          this.$showToast('该功能只能在app端使用哦～');
          break;
        case 'notice':
          this.setShareMask({ isShow: true, type: 6 });
          break;
        default:
          this.$forward(type, {
            id,
          });
          break;
        //
      }
    },

    payment() {
      api.orderPayment(
        {
          activity_id: this.activity_id,
        },
        res => {
          //..
          // const that = this;
          const { order_id = 0, order_tips = '' } = res.data;
          if (order_id != 0) {
            this.$showConfirm({
              // title: '提醒提醒提醒提醒提醒提醒提醒提醒提醒提醒',
              message: order_tips,
              confirmButtonText: '继续支付',
              cancelButtonText: '取消订单',
              callback: res => {
                // ...
                console.log(res);
                if (res == 'confirm') {
                  // 去抢购
                  this.$forward('order-pay', {
                    id: this.activity_id,
                  });
                } else if (res == 'cancel') {
                  //..取消订单
                  this.cancelOrder(order_id);
                } else if (res == 'error') {
                  //...
                }
              },
            });
          } else {
            // 去抢购
            this.$forward('order-pay', {
              id: this.activity_id,
            });
          }
        },
        err => {
          //..
          // 特殊错误码处理
          // 91230012   今日已抢购三次该商品而未支付，明天请尽早支付噢
          // 91220003   活动已经下架
          // 91220005   活动已经售卖完
          // 91220004   商品被人下单还未付款哦，一会儿再来看看吧~
          // 91230007	  您近期已经购买过该活动
          // 91310001	  活动门店不存在
          if (err.errno == 91220003 || err.errno == 91220005) {
            // 1 立即抢购 2 已抢光 3 已下架
            let btnText = '立即抢购';
            let btnCode = 1;
            if (err.errno == 91220003) {
              btnText = '已下架';
              btnCode = 3;
            } else if (err.errno == 91220005) {
              btnText = '已抢光';
              btnCode = 2;
            }
            this.btnStatus = {
              btnText,
              btnCode,
            };
          }
        }
      );
    },
    cancelOrder(oid) {
      if (!oid) {
        return;
      }
      api.cancelOrder(
        {
          order_id: oid,
        },
        res => {
          //..
          this.$showToast('已取消未支付订单，您可以继续抢购了');
        },
        err => {
          //..
        }
      );
    },
    getData() {
      this.getProductdetail();
    },
    getProductdetail() {
      let pid = this.activity_id || '681054';
      // console.log(pid);

      api.activitydetail(
        { activity_id: pid },
        res => {
          const { data = {} } = res;
          // console.log(res);

          // this.onlineStatus = data.online_status; // 活动在线状态，1=在线，2=下线
          this.dealImage(data.pic_list); //v2.2.0 活动商品图片列表
          let btnText = '立即抢购';
          let btnCode = 1; // 1 立即抢购 2 已抢光 3 已下架
          if (data.online_status == 2) {
            btnText = '已下架';
            btnCode = 3;
          } else if (data.left_stock <= 0) {
            btnText = '已抢光';
            btnCode = 2;
          }
          this.btnStatus = {
            btnText,
            btnCode,
          };

          let productInfo = {
            title: data.item_name,
            item_pic: data.item_pic,
            currentPrice: data.current_price, // 当前价
            marketPrice: data.market_price, // 原价
            bargainCount: data.bargain_count || 0, // 当前砍价人数
            left_stock: data.left_stock || 0, // 当前库存
          };

          this.productInfo = productInfo;

          this.productDesc =
            data.description && data.description.replace(/\\n/g, '<br />');

          this.saleStatusTip = data.activity_sale_status;
          //
          let branch = data.branch || {};
          this.branchInfo = {
            id: branch.id,
            branchLogo: branch.branch_head_pic,
            branchName: branch.branch_name,
            articleNum: branch.article_count,
            starVal: branch.star,
          };
          this.addressInfo = {
            lng: branch.lng,
            lat: branch.lat,
            title: branch.branch_name,
            address: branch.address,
            phoneNumber: branch.phone,
          };
          this.menuData = data.menus;
          this.special_tips = data.special_tips;
          this.tips = data.tips;

          // v2.2.0 新增砍价按钮逻辑
          this.getBtnState(data);

          if (device.wechat) {
            bridge.setShare({
              title: data.item_name,
              weixin_timeline: {
                title: `最低1折起，快来砍价！${branch.branch_name}:${data.item_name}`,
              },
              desc: `原价¥${dealPrice(
                data.market_price,
                100
              )}， 现在只要¥${dealPrice(
                data.current_price,
                100
              )}!快来帮我砍价，最低只要1折起！`,
              link: `${location.origin}/bargain?id=${this.activity_id}&publisher=${this.userInfo.id}`,
              imgUrl: data.item_pic,
            });
          }
          if (device.wxapp) {
            const shareData = {
              desc: 'test',
              title: `仅¥${dealPrice(
                data.current_price,
                100
              )}抢门市价¥${dealPrice(
                data.market_price,
                100
              )}，就差你帮我砍一刀啦～`,
              imgUrl: data.item_pic,
              link: `${location.origin}/bargain?id=${this.activity_id}&publisher=${this.userInfo.id}`,
            };
            window.wx.miniProgram.postMessage({ data: shareData });
          }
          this.getArticleList();
        },

        err => {}
      );
    },
    // 获取文章列表，v2.2.0改版 废弃 activityProduct 这个接口，调用 articleParagraphlist 接口
    getArticleList() {
      api.articleParagraphlist(
        {
          type: 1,
          branch_id: this.branchInfo.id,
        },
        res => {
          const { list = [] } = res.data;
          this.articleList = list;
          // if (list.length) {
          //   this.setArticleList(list, 0, 1);
          // }
        },
        error => {}
      );
    },
    onArticleTap({ id, index }) {
      if (!id) {
        this.$showToast('缺少参数');
        return;
      }
      this.$forward('article', { id });
    },

    // v2.2.0 处理图片数据格式
    dealImage(list = []) {
      list.forEach(value => {
        let obj = {};
        obj.pic = value;
        this.picList.push(obj);
      });
    },
    // v2.2.0 图片放大
    bigImg(e) {
      const { index } = e.currentTarget.dataset;
      this.setImagesBigStatus({
        imageStatus: true,
        imgArray: this.picList || [],
        index,
      });
    },
    // v2.2.0 获取按钮状态
    getBtnState(data) {
      let bargainBtnText = '已抢光';
      let bargainBtnState = 1; // 1 已抢光, 2 砍价, 3 再砍, 4 马上抢
      if (data.is_sold) {
        bargainBtnState = 1;
        bargainBtnText = '已抢光';
      } else if (Number(data.current_price) <= Number(data.floor_price)) {
        bargainBtnText = '马上抢';
        bargainBtnState = 4;
      } else if (data.is_bargained) {
        //当前用户是否已经砍过价
        // 是否已经砍过价
        bargainBtnText = '再砍';
        bargainBtnState = 3;
      } else {
        bargainBtnText = '砍价';
        bargainBtnState = 2;
      }

      this.bargainBtnObj = {
        bargainBtnText,
        bargainBtnState,
      };
    },
    // v2.2.0 增加砍价逻辑
    bargainBtn(e) {
      const { status } = e.currentTarget.dataset;
      if (!this.logged) {
        // ios手机内调用navigateTo方法导致崩溃，紧急修复，在app内使用bridge.login方法
        if (device.msf) {
          bridge.login({
            success(res) {
              const { data } = res;
              store.commit('SET_USERINFO', data);
            },
            fail(err) {
              console.log('app 登录失败！', err);
              // mini.forward('/index');
              mini.showToast('登录失败，请重试！');
            },
          });
        } else {
          this.$forward('login');
        }
        return;
      }
      // 1 已抢光, 2 砍价, 3 再砍, 4 马上抢 5 已下架
      switch (status) {
        case '2':
          this.bargain();
          break;
        case '3':
          this.againBargain();
          break;
        default:
          break;
      }
    },
    // v2.2.0 砍价
    bargain() {
      const that = this;
      this.$showLoading('正在砍价中...');
      api.bargain(
        {
          activity_id: this.activity_id,
          showLoading: false,
          black_box: this.sessionId ? '' : this.blackBox,
          afs_session_id: this.sessionId,
        },
        res => {
          console.log(res);
          const { data } = res;
          this.$hideLoading();
          // 处理按钮
          this.getBtnState(data);
          this.productInfo = {
            currentPrice: data.current_price,
            bargainCount: data.bargain_count,
            left_stock: this.productInfo.left_stock - 1,
            item_pic: this.productInfo.item_pic,
            marketPrice: this.productInfo.marketPrice,
            title: this.productInfo.title,
          };
          // newItem.isload = false;
          // newItem.is_bargained = true; // 是否砍价
          // newItem.bargained = reduce; // 砍价的金额
          // newItem.index = currentItem.index;
          this.sessionId = '';
        },
        err => {
          console.log(err);
          this.$hideLoading();
          // currentItem.isload = false;
          // 特殊错误码处理
          // 91220003  活动已经下架
          // 91220013  已经是最低价，不能再砍了
          // 91220014  您今天已经砍过价啦, 请不要重复操
          // 91220004  活动已售完，不可以再砍价啦
          if (
            err.errno == 91220003 ||
            err.errno == 91220013 ||
            err.errno == 91220004 ||
            err.errno == 91220014
          ) {
            let bargainBtnText = '已抢光';
            let bargainBtnState = 1; // 1 已抢光, 2 砍价, 3 再砍, 4 马上抢 5 已下架
            if (err.errno == 91220003) {
              bargainBtnState = 5;
              bargainBtnText = '已下架';
            } else if (err.errno == 91220013 || err.errno == 91220014) {
              bargainBtnState = 4;
              bargainBtnText = '马上抢';
            }
            this.bargainBtnObj = {
              bargainBtnText,
              bargainBtnState,
            };
            // currentItem.btnStatus = {
            //   btnText,
            //   btnState,
            // };
          } else if (
            (err.errno == 9125103 && this.isMSF) ||
            (err.errno == 9125102 && this.isMSF)
          ) {
            bridge.securityGuard({
              success(res) {
                const { data } = res;
                if (data && data.sessionID) {
                  that.sessionId = data.sessionID;
                  that.bargain();
                  that.sessionId = '';
                }
              },
            });
          }

          // this.productListData.splice(
          //   currentItem.index,
          //   1,
          //   Object.assign({}, currentItem)
          // );
        }
      );
    },
    // v2.2.0 在砍
    againBargain() {
      tongji.event('c_product_share');
      if (device.wechat || device.msf) {
        const { currentPrice, marketPrice, title, item_pic } = this.productInfo;
        const { branchName } = this.branchInfo;
        const pid = this.activity_id;
        const shareData = {
          title: title,
          weixin_timeline: {
            title: `最低1折起，快来砍价！${branchName}:${title}`,
          },
          desc: `原价¥${dealPrice(marketPrice, 100)}， 现在只要¥${dealPrice(
            currentPrice,
            100
          )}!快来帮我，最低只要1折起！`,
          link: `${location.origin}/bargain?id=${pid}&publisher=${this.userInfo
            .id || 0}`,
          imgUrl: item_pic,
        };
        if (device.wechat) {
          this.setShareMask({ isShow: true, type: 2 });
          bridge.setShare(shareData);
        } else if (device.msf) {
          bridge.showShare({
            ...shareData,
            url: location.href,
            success(res2) {
              console.log(res2);
            },
            onlySelectChannel: [
              'weixin',
              'weixin_timeline',
              // 'qq',
              // 'qzone',
              // 'weibo',
              'copy_link',
              // 'image',
            ],
          });
        }
      } else {
        this.$showToast({
          message: '您的客户端不支持分享，手动分享此页面吧～',
          duration: 3000,
        });
      }
    },
  },
};
</script>

<style scoped lang="stylus">
.min-product {
  min-height:600px;
  margin-top: 44px;
}
.page-product-detail {
  position: relative;
  padding-bottom: 55px;
}
.header-box{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height:44px;
  line-height :44px;
  overflow: hidden;
  z-index: 3;
  align-items: center;
  padding: 0 15px;
  display: none;
  background-color: rgba(255,255,255,1);
  border-bottom: 1px solid rgba(225,225,225,1);
  &.show{
    display: flex;
  }
  h1{
    flex: 1;
  }
  span{
    width:30px;
    height:30px;
    background-size :30px 30px;
    background-repeat :no-repeat;
    &.icon-left {
      background-image: url('~assets/order/the_arrow@2x.png');
    }
    &.icon-right {
      background-image: url('~assets/order/partager@2x.png');
    }
  }
}



.public-block{
  background-color: #fff;
  position: relative;
  padding: 0 15px;
}
.block-title{
  border-bottom: 1px solid #E2E2E2;
  display: flex;
  justify-content: center;
  text-align: center;
  padding-top: 10px;
  position: relative;
  .article-icon{
    width: 12px;
    height: 14px;
    margin-top: 6px;
  }
  span{
    display: inline-block;
    font-size: 14px;
    color: #231815;
    line-height: 30px;
    font-weight: bold;
    padding: 0 3px;
  }
  .article-lint{
    position: absolute;
    bottom: 5px;
    left: 50%;
    margin-left: -27px;
    width: 54px;
    height:3px;
    border-radius: 3px;
    background-image: linear-gradient(-90deg, #FDE044 10%, #FFB500 68%);
  }
}

// v2.2.0 图片放大
.img-cont-box{
  height: 85px;
  overflow-x: scroll;
  white-space: nowrap;
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
  margin-top: 10px;
  .img-info-box{
    display: inline-block;
    width: 80px;
    height: 80px;
    margin-right: 4px;
    border-radius: 3px;
    .img-box{
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }
}

// 活动产品信息
.activity-product-info{
  padding: 13px 15px;
  margin-bottom: 10px;
  position: relative;
  .product-title{
    font-size: 17px;
    color: #231815;
    line-height: 24px;
    font-weight: bold;
  }
  .product-status{
    display: flex;
    align-items: center;
    margin-top: 8px;
    &.action{
      i{
        background: #FF5B00;
      }
      p{
        color: #4A4A4A;
      }
    }
    i{
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      vertical-align: middle;
      background: #C2C1C1;
      border-radius: 4px;
      font-size: 11px;
      color: #FFFFFF;
      margin-right: 8px;
    }
    p{
      font-size: 13px;
      color: #9D9D9D;
      display: flex;
      align-items: center;
    }
    span{
      color: #ffbf00;
    }
    .doubt-icon{
      margin-left: 3px;
      display: inline-block;
      width: 17px;
      height: 17px;
      border-radius: 17px;
      text-align: center;
      line-height: 17px;
    }
  }
  .product-price{
    margin-top: 10px;
    .price-hint{
      display: flex;
      align-items: center;
    }
    span{
      font-size: 20px;
      color: #FFBF00;
      font-weight: bold;
      margin-right: 8px;
    }
    .price-hint-text{
      display: inline-block;
      background-image: linear-gradient(-117deg, #41352F 13%, #1F1815 88%);
      border-radius: 5px;
      font-size: 10px;
      color: #fff;
      padding: 2px;
    }
    del{
      display: block;
      font-size: 12px;
      color: #9B9B9B;
    }
  }
  .btn-text{
    position: absolute;
    border-radius: 14px;
    height: 28px;
    width: 56px;
    text-align: center;
    line-height: 28px;
    background-color: #B3B3B3;
    color: #fff;
    border: none;
    font-size: 12px;
    bottom: 17px;
    right: 10px;
    &.cheng{
      background-image: linear-gradient(68deg, #FFA32F 34%, #FF5D02 89%);
    }
    &.lv{
      background-image: linear-gradient(-265deg, #8DCE40 0%, #429321 100%);
    }
    &.lan{
      background-image: linear-gradient(-90deg, #ED192A 18%, #FF2E02 64%);
    }
  }
}

.branch-box{
  margin-bottom: 10px;
  background-color: #fff;
  .address{
    height: 40px;
    padding:0 15px;
  }
}

.article-box{
  width: 100%;
  overflow: hidden;
  background: #fff;
  .article-list-box{
    width: 100%;
    overflow: hidden;
    >>> .product-article-cont{
      margin-bottom: 10px;
    }
  }
  .more-article-text{
    color: #628DB7;
    font-size: 12px;
    text-align: center;
    line-height: 30px;
  }
}

.menu-box{
  margin-bottom: 10px;
  .menu-list{
    .menu-item{
      margin-top: 15px;
      overflow: hidden;
      .menu-title{
        background: #F5F5F5;
        border-radius: 4px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        font-size: 13px;
        color: #4A4A4A;
        margin-bottom: 15px;
      }
      .menu-item-desc{
        .desc-item{
          display: flex;
          font-size: 13px;
          color: #4A4A4A;
          line-height: 18px;
          margin-bottom: 10px;
          span{
            flex: 1;
          }
        }
      }
    }
  }

  .menu-introduction{
    position: relative;
    font-size: 13px;
    color: #4A4A4A;
    line-height: 20px;
    background: #F5F5F5;
    border-radius: 8px;
    padding: 10px 15px;
    margin: 10px 0 22px 0;
  }
}


.notice-box{
  margin-bottom: 5px;
  .notice-tag{
    margin-top: 15px;
    border-bottom: 1PX solid #E2E2E2;
    ul{
      margin: 0;
      padding: 0;
      li{
        list-style: none;
        width: 33.333%
        float: left;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        i{
          display: inline-block;
          width: 14px;
          height: 14px;
          background-size: 13px auto;
          margin-right: 6px;
        }
        span{
          flex: 1;
          font-size: 13px;
          color: #4A4A4A;
        }
      }
    }
  }
}

.buy-btn{
  background: #DDDDDD;
  font-size: 17px;
  color: #FFFFFF;
  text-align: center;
  height: 49px;
  line-height: 49px;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index:999;
  &.action{
    background: #FF5B00;
    box-shadow: 0 -1px 0 0 rgba(0,0,0,0.13);
  }
}

.menu-box {
  margin-top: 10px;
}
</style>
