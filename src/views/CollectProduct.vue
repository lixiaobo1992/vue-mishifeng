<template>
  <div class="page-product is-header">
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
      <div class="collect-list">
        <collect-list :listData="listData"></collect-list>
      </div>
      <DefaultPage
        :fontItem="fontItem"
        :imgItem="imgItem"
        v-show="!listData.length"
      ></DefaultPage>
    </vue-scroll>
  </div>
</template>
<script>
import PullListMixin from '@/mixins/pull-list';
import api from '@/api';
import { Header, Scroll } from '@/ui';
import CollectList from '@/components/CollectList';
import DefaultPage from '@/components/DefaultPage';
import searchDefault from '@/assets/img/Nothing.png';

export default {
  name: 'collect-product',
  mixins: [PullListMixin],
  components: {
    [Header.name]: Header,
    [Scroll.name]: Scroll,
    [CollectList.name]: CollectList,
    DefaultPage,
  },
  data() {
    return {
      imgItem: {
        src: searchDefault,
        width: 250,
        height: 200,
      },
      fontItem: {
        width: 240,
        desc: '快去收藏你想去的店吧',
      },
    };
  },
  beforeCreate() {
    //...
  },
  created() {
    this.$showLoading();
    this.getData();
  },
  mounted() {
    // // this.scroller = scroll.getScrollEventTarget(this.$el);
    // this.$nextTick(() => {
    //   // 悬浮导航
    //   on(this.$el, 'scroll', e => {
    //     const scrollTop = scroll.getScrollTop(this.$el);
    //     // console.log(scrollTop);
    //     if (scrollTop == 20) {
    //       this.isTagsClass = false;
    //     } else if (!this.isTagsClass) {
    //       this.isTagsClass = true;
    //     }
    //   });
    // });
  },
  // computed: {
  //   // 当前列表数据
  //   currentProductList() {
  //     if (isEmptyObject(this.productList)) {
  //       return this.productList.list;
  //     }
  //     return [];
  //   },
  // },
  methods: {
    getData() {
      this.$showLoading();
      this.initPullList();
      this.pullParams.page_limit = 5;
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.favoriteBranchList.apply(this, rest);
    },
    gotoNext(e) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case 'city':
          this.$forward(type);
          break;
        case 'search-shop':
          this.$forward(type);
          break;
        case 'search-article':
          this.$forward(type);
          break;
        default:
        // do nothing...
      }
    },
  },
};
</script>
<style lang="stylus" scoped>

.page-product{
  background: #F6F7F9;
  .shop-header{
    .like-product{
      .like-go-text{
        background: url('https://img1.haoshiqi.net/miniapp/msf/line-icon_2eacf00e15.png') no-repeat -5px 15px;
        background-size: 100%;
        display: inline-block;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-size: 12px;
      }
      .airplane-icon{
        background: url('https://img1.haoshiqi.net/miniapp/msf/airplane-icon_582d6bc3d8.png') no-repeat center center;
        display: inline-block;
        width: 15px;
        height: 15px;
        background-size: 15px 15px;
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
      text-align: center;
      font-size: 17px;
      color: #231815;
      i.icon-loaction{
        display: inline-block;
        vertical-align: middle;
        width: 11px;
        height: 14px;
        margin-right: 5px;
        background: url('~assets/icon_location.png') no-repeat center center;
        background-size: 100%;
      }
      i.icon-down{
        margin-left: 5px;
      }
      span{
        vertical-align: middle;
        font-weight: bold;
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
  .tab-box{
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
    display: flex;
    justify-content: space-between;
    background: #fff;
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
    margin-top: 14px;
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
    height: 40px;
    width: 100%;
    background-color: #fff;
    &.boxshadow{
      box-shadow: 0px 2PX 4PX rgba(0, 0, 0, 0.15);
    }
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
.collect-list{
  width: 100%;
  padding: 0 10px;
}
</style>
