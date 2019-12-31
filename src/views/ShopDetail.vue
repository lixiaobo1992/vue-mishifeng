<template>
  <div class="page-shop-detail" :class="{ 'is-header': isShowHeader }">
    <!-- header -->
    <cm-header
      class="shop-header"
      :class="{ show: isShowHeader }"
      :left-options="{ backText: '' }"
      fixed
    >
      <span>{{ detailData.branch_name }}</span>
      <div
        slot="right"
        class="share-btn"
        @click="$store.dispatch('setShareMask', { isShow: true })"
      ></div>
    </cm-header>
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
      <!-- 头部信息 -->
      <div class="shop-box" :class="{ white: branchBg.isBg }" ref="shopTop">
        <div class="box-bg" :style="branchBg.style"></div>
        <div class="shop-content">
          <p class="shop-name">{{ detailData.branch_name }}</p>
          <div
            class="collect-box"
            :class="{ 'white-bg': detailData.favorite_status }"
            @click="collectBranch"
          >
            <span class="collect-btn">{{
              detailData.favorite_status ? '已收藏' : '我想去'
            }}</span>
            <img
              class="collect-img"
              src="https://img1.haoshiqi.net/miniapp/msf/seeding-icon_f572e1a6de.png"
            />
          </div>
          <div class="shop-label">
            <p v-if="detailData.labels && detailData.labels.length">
              <span v-for="item in detailData.labels" :key="item.id">{{
                item.name
              }}</span>
            </p>
            <span>{{ detailData.distance | distance }}</span>
          </div>
          <div class="shop-address">
            <div class="address" data-type="map" @click="gotoNext">
              <i class="icon-addres"></i>
              <p>{{ detailData.address }}</p>
            </div>
            <a
              :href="'tel:' + detailData.phone"
              class="icon-tel"
              @click.stop="trackEvent('c_store_phone')"
            ></a>
          </div>
        </div>
      </div>
      <!-- v2.4.0 店铺介绍 -->
      <div class="shop-header-box" v-if="detailData.description">
        <div class="shop-introduce-header">
          <span>店铺介绍</span>
        </div>
      </div>
      <div class="shop-cont">
        <div class="shop-introduce-box">
          {{ detailData.description }}
        </div>
        <div
          class="introduce-pop"
          v-if="detailData.description.length > 200"
        ></div>
      </div>
      <template v-if="activityProduct.length">
        <div class="list-header-box" data-tag="product">
          <div class="list-header" :style="productHeaderBoxStyle">
            <span>底价一元·探店福利·限量抢购</span>
          </div>
        </div>
        <div class="hot-product">
          <product-list :listData="activityProduct"></product-list>
        </div>
      </template>

      <div class="list-header-box" data-tag="article">
        <div class="list-header" :style="articleHeaderBoxStyle">
          <span>觅食笔记</span>
        </div>
      </div>
      <!-- 笔记list -->
      <div class="list-box">
        <water-fall
          ref="waterfall"
          @ontap="onArticleTap"
          @complete="onComplete"
        ></water-fall>
      </div>
      <div
        class="not-article"
        slot="not-data"
        data-type="publish"
        @click="gotoNext"
      >
        <img src="~assets/shop/tab_publish.png" alt="" />
        <p>第一个探店的人有额外奖励<br />现在就来写一篇觅食笔记吧</p>
      </div>
      <div
        class="finishedTip"
        slot="finishedTip"
        data-type="publish"
        @click="gotoNext"
      >
        <p>快来写下你的探店心得吧！</p>
        <img src="~assets/shop/tab_publish.png" alt="" />
      </div>
    </vue-scroll>
    <!-- end  -->
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import PullListMixin from '@/mixins/pull-list';
import api from '@/api';
import { Header, Scroll } from '@/ui';
import WaterFall from '@/components/WaterFall';
import ProductList from '@/components/ProductList';
// import shareIocn from '@/assets/shop/icon_share.png';
// import shareIocnWhite from '@/assets/shop/icon_share_white.png';
import { on, off } from '@/utils/event';
// import scroll from '@/utils/scroll';
import tongji from '@/utils/tongji';

export default {
  name: 'shop-detail',
  mixins: [PullListMixin],
  components: {
    [Header.name]: Header,
    [Scroll.name]: Scroll,
    [WaterFall.name]: WaterFall,
    [ProductList.name]: ProductList,
  },
  data() {
    return {
      id: this.$route.query.id,
      detailData: {},
      articleHeaderBoxStyle: {},
      productHeaderBoxStyle: {},

      activityList: [],
    };
  },
  beforeCreate() {
    //...
  },
  created() {
    console.log('shop-detail定位:');
    this.$showLoading();
    this.getGeo({
      name: 'shop-detail',
      success: res => {
        console.log('shopDetail.vue geo success:', res);
        // 可能需要 更新 城市
        this.getData();
      },
      fail: err => {
        console.log('shopDetail.vue geo fail:', err);
        this.getData();
      },
    });
    if (device.msf) {
      const that = this;
      const selectChannel = ['weixin', 'weixin_timeline', 'copy_link'];
      if (this.$version.gt('1.3.1')) {
        selectChannel.splice(2, 0, 'weibo');
      }
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
            const desc = `快来觅食蜂围观 @${that.detailData.branch_name} 百位美食达人千次探店测评，抢一元探店套餐！`,
              wbDesc = `快来@觅食蜂 围观@${that.detailData.branch_name} 百位美食达人千次探店测评，抢一元探店套餐 ${location.href} （觅食蜂，美食达人聚集地 https://m.mishifeng.com/download ）`;
            bridge.showShare({
              type: 0,
              title: '觅食蜂 美食达人聚集地',
              weixin_timeline: {
                title: desc,
              },
              weibo: {
                title: wbDesc,
              },
              desc: desc,
              link: location.href,
              url: location.href,
              imgUrl: that.detailData.branch_head_pic,
              success(res2) {
                console.log(res2);
              },
              onlySelectChannel: selectChannel,
            });
          }
          console.log(res);
        },
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 悬浮导航
      this.scrollHeader();
    });
  },
  beforeDestroy() {
    off(this.$el, 'scroll', () => {});
  },
  computed: {
    ...mapState({
      geoInfo: state => state.location.geoInfo,
    }),
    // 门店背景
    branchBg() {
      const { pic_list = [] } = this.detailData;
      if (pic_list.length) {
        return {
          isBg: true,
          // style: {
          //   backgroundImage: `url(${pic_list[0].pic})`,
          // },
        };
      }
      return {
        isBg: false,
        style: {},
      };
    },
    isShowHeader() {
      if (device.msf) {
        return false;
      }
      return true;
    },
    activityProduct() {
      if (device.msf && this.$version.lte('1.0.0')) {
        return [];
      }
      if (this.activityList && this.activityList.length) {
        return this.activityList;
      }
      return [];
    },
  },
  methods: {
    ...mapActions(['getGeo', 'setShareMask']),
    onComplete(data, index) {
      //....
    },
    getData() {
      this.$showLoading();
      //...
      this.initPullList();
      this.pullParams.branch_id = this.id || 6;
      this.getBranchDetail();
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.articleList.apply(this, rest);
    },
    afterPull(res) {
      const { data = {} } = res;
      let newList = data.list || []; // list 数据
      this.$nextTick(() => {
        this.$refs.waterfall.setDate(newList, 0);
      });
    },
    getBranchDetail() {
      api.branchDetail(
        {
          id: this.id,
        },
        res => {
          // console.log(res);
          const {
            branch_name, // 门店名
            branch_head_pic, // 门店logo
            cat_info, // 分类名
            cbd_info, // 商圈名
            phone, // 电话
            address, // 门店地址
            distance, // 距离
            favorite_status, // 是否收藏店铺  true / flase
            lat,
            lng,
            pic_list,
            description, // v2.4.0 店铺介绍
            activity_list = [],
          } = res.data;
          let labels = [];
          // cat_name 分类名
          if (cat_info) {
            labels.push(cat_info);
          }
          // cbd_name 商圈名
          if (cbd_info) {
            labels.push(cbd_info);
          }
          this.activityList = activity_list;
          this.detailData = {
            branch_name, // 门店名
            branch_head_pic,
            labels,
            phone, // 电话
            address, // 门店地址
            distance, // 距离
            favorite_status, // 是否收藏店铺  true / flase
            lat,
            lng,
            pic_list,
            description, // v2.4.0 店铺介绍
          };

          if (device.wechat) {
            const desc = `快来觅食蜂围观 @${this.detailData.branch_name} 百位美食达人千次探店测评，抢一元探店套餐！`;
            bridge.setShare({
              title: '觅食蜂 美食达人聚集地',
              weixin_timeline: {
                title: desc,
              },
              desc,
              link: location.href,
              imgUrl: this.detailData.branch_head_pic,
            });
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    gotoNext(e) {
      tongji.event('c_store_location');
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case 'map':
          //....
          // let label = '';
          // for (let i = i; i < this.detailData.labels.length; i++) {
          //   label += this.detailData.labels[i].name;
          // }
          this.$forward('map', {
            lng: this.detailData.lng,
            lat: this.detailData.lat,
            title: this.detailData.branch_name,
            address: this.detailData.address,
          });
          break;
        case 'publish':
          // 约定参数 orderId=x&branchId=x&activityId=x
          this.$forward('publish', { branch_id: this.id });
          break;
        default:
        // do nothing...
      }
    },
    scrollHeader() {
      // 悬浮导航
      const header = this.$el.querySelector('.shop-header');
      const headerRect = header.getBoundingClientRect();
      on(this.$el, 'scroll', () => {
        // console.log(this.$el.querySelectorAll('.list-header-box'));
        const headers = this.$el.querySelectorAll('.list-header-box');
        let headerTag = [];
        // 获取 header 项
        for (let item of headers) {
          const tag = item.dataset.tag;
          let itemRect = item.getBoundingClientRect();
          itemRect.tagKey = `${tag}HeaderBoxStyle`;
          headerTag.push(itemRect);
        }
        // console.log(headerTag);
        let tagKey = '';
        // 获取当前 headerkey
        for (let i = 0; i < headerTag.length; i++) {
          const tagItem = headerTag[i];
          if (tagItem.top <= headerRect.height) {
            tagKey = tagItem.tagKey;
          }
        }
        // console.log(tagKey);
        const isClear = headerTag.every(function(item) {
          return item.top > headerRect.height;
        });
        // console.log(isClear);
        if (isClear) {
          tagKey = '';
        }
        if (tagKey) {
          // console.log(tagKey);
          this[tagKey] = {
            position: 'fixed',
            transform: 'translateZ(0)',
            top: `${headerRect.height}px`,
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
          };
        } else {
          for (let i = 0; i < headerTag.length; i++) {
            this[headerTag[i].tagKey] = {};
          }
        }
        // 编列 所以项 判断 当前headerKey是否存在
        // no : 清空所有项
        // yes : 清空除 当前key 以外的数据
        for (let i = 0; i < headerTag.length; i++) {
          const tagItem = headerTag[i];
          if (tagKey) {
            if (tagItem.tagKey !== tagKey) {
              this[tagItem.tagKey] = {};
            }
          } else {
            this[tagItem.tagKey] = {};
          }
        }
      });
    },
    onArticleTap({ id, media_type }) {
      if (media_type == 2) {
        if (device.msf) {
          if (this.$version.gte('2.0.0')) {
            this.$forward('video-list', { id, type: 2 });
          } else {
            this.$forward('article', { id });
          }
        }
      } else {
        this.$forward('article', { id });
      }
    },
    trackEvent(type) {
      tongji.event(type);
    },
    // v2.2.0 版本 新增收藏按钮和逻辑
    collectBranch() {
      console.log('收藏');
      api.branchCollect(
        {
          branch_id: this.id,
        },
        res => {
          // 值是true 和false true是已收藏，false是没有收藏
          this.detailData.favorite_status = !this.detailData.favorite_status;
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
.white-bg{
  background: #fff !important;
  border: 1px solid #999;
}
.page-shop-detail{
  &.is-header{
    padding-top: 46px;
  }
  .shop-header{
    display: none;
    &.show{
      display: block;
    }
    .share-btn{
      width: 30px;
      height: 30px;
      background: url('~assets/shop/icon_share.png') no-repeat right center;
      background-size: 17px;
    }
  }
  .shop-box{
    height: 170px;
    width: 100%;
    position: relative;
    overflow: hidden;
    padding: 15px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
    .box-bg{
      position: absolute;
      left:0;
      top: 0;
      right:0;
      bottom: 0;
      z-index: 0;
      margin: -5px;
      background-image: url('https://img.mishifeng.com/FrZqzQ4RT3ib1cOg65T9IW64HwOz');
      background-position: center bottom;
      background-size: cover;
    }
    .shop-content{
      position: relative;
      z-index: 1;
      .shop-name{
        font-size: 20px;
        color: #fff;
        width: 270px;
        font-weight: bold;
        margin-top: 10px;
      }
      .collect-box{
        position: absolute;
        right: 0px;
        top: 0px;
        margin-top: 4px;
        width: 64px;
        height: 23px;
        line-height: 23px;
        background: #fde044;
        border-radius: 23px;
        font-size: 12px;
        color: #333;
        display: flex;
        .collect-btn{
          margin-left: 8px;
        }
        .collect-img{
          margin-top: 5px;
          margin-left: 3px;
          display: inline-block;
          width: 12px;
          height: 11px;
        }
      }
      .shop-label{
        display: flex;
        font-size: 12px;
        color: #fff;
        margin-top: 12px;
        p{
          flex: 1;
          span{
            margin-right: 10px;
          }
        }
      }
      .shop-address{
        border-top: 1PX solid #fff;
        margin-top: 20px;
        padding-top: 10px;
        display: flex;
        .address{
          flex: 1;
          display: flex;
          align-items: center;
          .icon-addres{
            display: inline-block;
            width: 14px;
            height: 18px;
            background: url('https://img.mishifeng.com/FijkZhmDFyQxcHDuN6TgjrPxqRNO') no-repeat center center;
            background-size: 100%;
            margin-right: 10px;
          }
          p{
            flex: 1;
            font-size: 12px;
            color: #fff;
          }
        }
        .icon-tel{
          display: inline-block;
          width: 30px;
          height: 30px;
          background: url('https://img.mishifeng.com/Fquu5z58lSsHiM9HVZAdi6iLwbIX') no-repeat center center;
          background-size: 18px;
          margin-left: 10px;
        }
      }
    }

    &.white{
      // .box-bg{
      //   filter: blur(5px);
      // }
      .shop-name{
        color: #fff;
      }
      .shop-label{
        color: #fff;
      }
      .shop-address{
        border-color: rgba(255,255,255, 0.7);
        .address{
          .icon-addres{
            background-image: url('~assets/shop/icon_location_white.png');
          }
          p{
            color: #fff;
          }
        }
        .icon-tel{
          background-image: url('~assets/shop/icon_info_phone_white.png');
        }
      }
    }
  }

  .list-header-box{
    box-sizing: content-box;
    padding-top: 10px;
    height: 36px;
    width: 100%;
    position: relative;
    z-index: 2;
    background-color: #fff;
    .list-header{
      position: relative;
      left: 0;
      top: 0;
      right:0;
      bottom: auto;
      width: 100%;
      font-size: 14px;
      color: #231815;
      text-align: center;
      height: 36px;
      min-height:36px;
      span{
        display: inline-block;
        height: 36px;
        line-height: 36px;
        border-bottom: 3px solid #fdcc02;
      }
    }
  }
  // v2.4.0 店铺介绍
  .shop-header-box{
    box-sizing: content-box;
    padding-top: 10px;
    height: 36px;
    width: 100%;
    position: relative;
    z-index: 2;
    .shop-introduce-header{
      position: relative;
      left: 0;
      top: 0;
      right:0;
      bottom: auto;
      width: 100%;
      font-size: 14px;
      color: #231815;
      text-align: center;
      height: 36px;
      min-height:36px;
      span{
        display: inline-block;
        height: 36px;
        line-height: 36px;
        border-bottom: 3px solid #fdcc02;
      }
    }
  }
  .shop-cont{
    position: relative;
    .shop-introduce-box{
      width: 355px;
      max-height: 177px;
      background: #FFFFFF;
      border-radius: 5px;
      margin: 0 auto;
      margin-top: 10px;
      font-size: 14px;
      color: #666;
      padding: 14px;
      text-indent: 28px;
      overflow-y: scroll;
    }
    .introduce-pop{
      position: absolute;
      width: 100%;
      height: 40px;
      background-image: linear-gradient(-180deg, rgba(255,255,255,.0) 39%, rgba(255,255,255,1) 100%);
      bottom: 0px;
      left: 0px;
    }
  }
  .hot-product{
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .list-box{
    background-color: #fff;
    padding: 0 10px;
  }

  >>>.not-article{
    width: 260px;
    height: 260px;
    margin: 20px auto 0 auto;
    text-align: center;
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15);
    border-radius: 20px;
    padding-top: 70px;
    img{
      width: 60px;
      margin-bottom: 15px;
    }
    p{
      flex:1 ;
      font-size: 14px;
      color: #4A4A4A;
      line-height: 22px;
    }
  }
  .finishedTip{
    text-align: center;
    margin: 20px auto;
    p{
      font-size: 14px;
      color: #4A4A4A;
    }
    img{
      width: 60px;
      height: 60px;
    }
  }
}
</style>
