<template>
  <div class="page-product is-header">
    <!-- header -->
    <cm-header
      class="shop-header show"
      :left-options="{ showBack: false }"
      fixed
    >
      <div
        slot="left"
        class="like-product"
        data-type="collect-product"
        @click="gotoNext"
      >
        <span class="like-go-text">想去的店</span>
      </div>
      <p class="currentAddress" data-type="search-shop" @click="gotoNext">
        <i class="icon-loaction"></i>
        <span>{{ currentAddress }}</span>
        <i class="icon-down"></i>
      </p>
      <div
        slot="right"
        class="search-btn"
        data-type="search-article"
        @click="gotoNext"
      >
        <img src="~assets/index/nav_search.png" alt="" />
      </div>
    </cm-header>
    <div
      class="product-tags"
      v-if="isCTagsClass"
      :class="{ boxshadow: isCTagsClass }"
    >
      <Tags :tags="tags" :curtIndex="curtIndex" @onTagClick="onTagClick"></Tags>
    </div>
    <!-- v2.4.0 新人福利公告 -->
    <div class="new-notice-box" v-if="newNoticeStatus">
      <img
        class="notice-icon"
        src="https://img.mishifeng.com/Fhr75c8ORB7bZCS_sOfSefJpFWQO"
      />
      <p class="notice-text">
        {{ newUserMealParam.top_tips }}
      </p>
    </div>
    <!-- 新品来袭、底价秒杀 tab -->
    <ul class="tab-box" :class="{ 'm-top-10': newNoticeStatus }">
      <li
        class="tab-text-box"
        @click="imgTabsBtn(tabItem.list_type)"
        v-for="(tabItem, index) in column"
        :key="index"
      >
        <img class="tab-img" :src="tabItem.image" />
      </li>
    </ul>
    <!-- 为你推荐 -->
    <div class="recommend-box">
      <span class="recommend-text">为你推荐</span>
      <img
        class="recommend-img"
        src="https://img1.haoshiqi.net/miniapp/msf/like-icon_c4186d3422.png"
      />
    </div>
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
      <div class="product-tags-radius" v-if="!isCTagsClass">
        <CircleTags
          :tags="tags"
          :curtIndex="curtIndex"
          @onTagClick="onTagClick"
        ></CircleTags>
      </div>
      <product-article-list
        :listData="currentProductList"
        :activityList="activityList"
        :swiperList="adsList"
        :adsRatio="adsRatio"
      ></product-article-list>
      <DefaultPage
        :imgItem="imgItem"
        :fontItem="fontItem"
        v-show="!listData.length"
      ></DefaultPage>
    </vue-scroll>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import PullListMixin from '@/mixins/pull-list';
import api from '@/api';
import { Header, Scroll, Tags, Search, CircleTags } from '@/ui';
import ProductArticleList from '@/components/ProductArticleList';
import { isEmptyObject } from '@/utils/base';
import { on, off } from '@/utils/event';
import scroll from '@/utils/scroll';
import { clone } from '@/utils';

import DefaultPage from '@/components/DefaultPage';
import searchDefault from '@/assets/img/Nothing.png';
import { storage } from '@dwdjs/utils';

import tongji from '@/utils/tongji';

export default {
  name: 'product',
  mixins: [PullListMixin],
  components: {
    [Header.name]: Header,
    [Scroll.name]: Scroll,
    [Tags.name]: Tags,
    [CircleTags.name]: CircleTags,
    [ProductArticleList.name]: ProductArticleList,
    Search,
    DefaultPage,
  },
  data() {
    return {
      tags: [
        {
          id: 0,
          name: '全部',
        },
      ],
      productList: {},
      isCTagsClass: false, // 分类导航 切换
      currentTag: {
        id: 0,
        name: '全部',
      },
      imgItem: {
        src: searchDefault,
        width: 250,
        height: 200,
      },
      fontItem: {
        width: 240,
        desc: '小蜜酱搜索不到,试试别的关键字吧~',
      },
      column: [],
      activityList: [], // v2.2.0 新增
      curtIndex: 0, // v2.2.0 tabs index
      adsRatio: 170 / 355, // v2.4.0 swiper
      adsList: [], // v2.4.0 swiper
      newNoticeStatus: false, //v2.4.0 新人权益公告
    };
  },
  beforeCreate() {
    //...
  },
  created() {
    this.$showLoading();
    this.getGeo({
      name: 'probe-shop',
      success: res => {
        console.log('probeShop.vue geo success:', res);
        // 可能需要 更新 城市
        this.getData();
      },
      fail: err => {
        console.log('probeShop.vue geo fail:', err);
        this.getData();
      },
    });
    this.getAdvertising();
  },
  mounted() {
    // this.scroller = scroll.getScrollEventTarget(this.$el);
    console.log(this.location, 'location-name');
    this.getActivityCategory();
    this.$nextTick(() => {
      // 悬浮导航
      on(this.$el, 'scroll', e => {
        const scrollTop = scroll.getScrollTop(this.$el);
        if (scrollTop >= 110) {
          this.isCTagsClass = true;
        } else if (scrollTop == 0) {
          this.isCTagsClass = false;
        }
      });
    });
  },
  computed: {
    ...mapState({
      location: state => state.location,
      logged: state => state.user.logged,
      newUserMealParam: state => state.newUserMealParam,
    }),
    ...mapGetters(['currAddress']),
    currentCity() {
      const {
        locationState: { code, text },
      } = this.location;
      let currentCity = text;
      if (code === 2 || code === 3) {
        currentCity = this.currAddress.name;
      }
      return currentCity;
    },
    currentAddress() {
      if (isEmptyObject(this.location.geoInfo)) {
        return this.location.geoInfo.address;
      }
      return '附近美食';
    },
    // 当前列表数据
    currentProductList() {
      if (isEmptyObject(this.productList)) {
        return this.productList['tag' + this.currentTag.id].list;
      }
      return [];
    },
  },
  beforeDestroy() {
    //...
    off(this.$el, 'scroll', () => {});
  },
  methods: {
    ...mapActions([
      'getGeo',
      'setSelectCity',
      'setSelectAddress',
      'setProductGuideLayer',
      'setNewUserMealParam',
    ]),
    getData() {
      this.$showLoading();
      this.initPullList();
      this.pullParams.category_id = this.currentTag.id;
      const { selectAddress } = this.location;
      if (isEmptyObject(selectAddress)) {
        this.pullParams.lng = selectAddress.lng;
        this.pullParams.lat = selectAddress.lat;
      }
      // v2.2.0 新增逻辑，判断用户版本和是否展示过探店弹层
      const guideLyaer = storage.get('guideLyaer');
      if (this.$version._version == '2.2.0' && guideLyaer != true) {
        this.setProductGuideLayer(true);
      }
      // v 2.4.0 先此方法中逻辑，先调用获取用户首单信息api，根据api返回设置store, 入参为true才会调用api，减少无效请求
      this.setNewUserMealParam(this.logged);
      this.onScrollToLower();
    },
    // 顶部图片tab 跳转
    imgTabsBtn(type) {
      this.$forward('product-tab-list', {
        type,
      });
    },
    // 分类接口
    getActivityCategory() {
      api.activityCategory(
        {},
        res => {
          const { category, column, ad } = res.data;
          this.adsRatio = ad.height / ad.width;
          this.adsList = ad.list || [];
          this.tags = category;
          this.column = column;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 列表接口
    pullModel(...rest) {
      api.activityBranch.apply(this, rest);
    },
    // afterPull(res) {
    //   if (this.pullParams.page_num === 1 && this.currentTag.id === 0) {
    //     const { category = [] } = res.data;
    //     if (category.length) {
    //       this.tags = category;
    //     }
    //   }
    // },
    afterPullData(res) {
      if (!isEmptyObject(this.productList)) {
        if (this.currentTag.id === 0) {
          let tempProductList = {};
          for (let i = 0; i < this.tags.length; i++) {
            const item = this.tags[i];
            let productItem = {
              list: [],
              page_num: 1, // 当前页
              finished: false, // 是否到底部
              page_serial: '',
            };
            if (i == 0) {
              productItem.list = this.listData;
              productItem.page_num = this.pullParams.page_num; // 当前页
              productItem.finished = this.finished;
              productItem.page_serial = this.pullParams.page_serial;
            }
            tempProductList['tag' + item.id] = productItem;
          }
          this.productList = tempProductList;
        }
      } else {
        const { list = [] } = res.data;
        let productItem = this.productList['tag' + this.currentTag.id];
        productItem = clone(productItem);
        productItem.list = this.value ? list : productItem.list.concat(list);
        productItem.page_num = this.pullParams.page_num; // 当前页
        productItem.finished = this.finished;
        productItem.page_serial = this.pullParams.page_serial;
        this.$set(this.productList, 'tag' + this.currentTag.id, productItem);
      }
    },
    onTagClick(item, index) {
      tongji.event('c_goodlist_tag', `value:{tagId:${item.id}`);
      this.currentTag = item;
      this.curtIndex = index;
      const currentItem = this.productList['tag' + item.id] || {};
      if (currentItem.list && currentItem.list.length) {
        this.pullParams.page_num = currentItem.page_num; // 当前页
        this.finished = currentItem.finished;
        this.page_serial = currentItem.page_serial;
      } else {
        this.getData();
      }
    },
    gotoNext(e) {
      const { type } = e.currentTarget.dataset;
      this.$forward(type);
    },
    // v2.2.0 广告列表
    getAdvertising() {
      api.activityList(
        {
          list_type: 3,
        },
        res => {
          const { list } = res.data;
          console.log(this.currentProductList, 'currentProductList');
          this.activityList = list;
        },
        err => {}
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
.m-top-55{
  margin-top: 55px !important;
}
.m-top-10{
  margin-top: 10px !important;
}

.page-product{
  background: #F6F7F9;
  .shop-header{
    .like-product{
      .like-go-text{
        background: url('https://img.mishifeng.com/FmuCvK8efjaIkW-kHMC7bmST-ztw') no-repeat 8px 2px;
        background-size: 89%;
        display: inline-block;
        padding: 0 20px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-size: 12px;
      }
    }
    .icon-down{
      display: inline-block;
      vertical-align: middle;
      width: 10px;
      height: 8px;
      background: url('~assets/index/nav_cityselect.png') no-repeat center center;
      background-size: 100%;
    }
    .currentCity{
      i.icon-down{
        margin-left: 5px;
      }
    }
    .currentAddress{
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 17px;
      color: #231815;
      .location-icon{
        width: 11px;
        height: 13px;
      }
      i.icon-loaction{
        display: inline-block;
        vertical-align: middle;
        width: 11px;
        height: 14px;
        background: url('https://img.mishifeng.com/Fj5oTVR9xyFYv7cACrmymhPFAfEZ') no-repeat center center;
        background-size: 100%;
      }
      i.icon-down{
        margin-left: 5px;
      }
      span{
        width: 90px;
        overflow: hidden;
        vertical-align: middle;
        font-weight: bold;
        padding: 0 5px;
      }
    }
    .search-btn{
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      img{
        width: 16px;
        display: inline;
      }
    }
  }
  .new-notice-box{
    margin: 0;
    display: flex;
    padding: 0 15px;
    height: 24px;
    line-height: 24px;
    margin-top: 46px;
    align-items: center;
    background: rgba(0,0,0,.8);
    .notice-icon{
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }
    .notice-text{
      font-size: 12px;
      color: rgba(255,255,255,0.80);
    }
  }
  .tab-box{
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    margin-top: 50px;
    .tab-text-box{
      text-align: center;
      width: 167px;
      height: 70px;
      .tab-img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .recommend-box{
    padding: 0 15px;
    margin-top: 10px;
    display: flex;
    height: 24px;
    line-height: 24px;
    .recommend-text{
      font-size: 16px;
      color: #171900;
      font-weight: bold;
    }
    .recommend-img{
      width: 16px;\
      height: 19px;
      margin-left: 4px;
      margin-top: 2px;
    }
  }
  .product-tags{
    height: 33px;
    width: 100%;
    background-color: #fff;
    position: fixed;
    z-index: 2;
    top: 45px;
    &.boxshadow{
      box-shadow: 0px 2PX 4PX rgba(0, 0, 0, 0.15);
    }
  }
  .product-tags-radius{
    height: 36px;
    width: 100%;
  }

}
>>>.cm-search-box .cm-search-bar .left-arrow {
  display:none;
}
>>> .default-page {
  margin-top:30%;
}
>>>.vue-pull-scroll .not-data {
  display:none;
}
</style>
