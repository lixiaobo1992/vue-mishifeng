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
      <div class="tab-cont-box">
        <ul class="tab-box">
          <li
            class="tab-text-box"
            v-for="(tabsItem, tabsIndex) in tabsList"
            :key="tabsIndex"
            :data-type="tabsItem.tab_type"
            @click="tabSelect"
            :class="{ 'select-tab-border': list_type == tabsItem.tab_type }"
          >
            <span class="tab-text">{{ tabsItem.tab_name }}</span>
            <img class="tab-img" :src="tabsItem.tab_img" />
          </li>
        </ul>
      </div>
      <!-- shop-list -->
      <product-list :listData="currentProductList"></product-list>
      <DefaultPage
        :imgItem="imgItem"
        :fontItem="fontItem"
        v-show="!listData.length"
      ></DefaultPage>
    </vue-scroll>
    <!-- list  -->
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import PullListMixin from '@/mixins/pull-list';
import api from '@/api';
import { Scroll } from '@/ui';
import ProductList from '@/components/ProductList';
import { isEmptyObject } from '@/utils/base';
import { clone } from '@/utils';
import DefaultPage from '@/components/DefaultPage';
import searchDefault from '@/assets/img/Nothing.png';

export default {
  name: 'product-tab-list',
  mixins: [PullListMixin],
  components: {
    [Scroll.name]: Scroll,
    [ProductList.name]: ProductList,
    DefaultPage,
  },
  data() {
    return {
      tabsList: [
        {
          tab_name: '新品来袭',
          tab_img: 'https://img.mishifeng.com/FjMW1iUkLbxf-Z6ykUX87_UtkwcU',
          tab_type: 1,
        },
        {
          tab_name: '底价秒杀',
          tab_img: 'https://img.mishifeng.com/FggJKM3vP3IXGn7A4kSROrIhOd6z',
          tab_type: 2,
        },
      ],
      list_type: this.$route.query.type || '',
      tags: [
        {
          id: 0,
          name: '全部',
        },
      ],
      productList: {},
      currentTag: {
        id: 0,
        name: '全部',
      },
      value: '',
      imgItem: {
        src: searchDefault,
        width: 250,
        height: 200,
      },
      fontItem: {
        width: 240,
        desc:
          this.$route.query.type == 1
            ? '一大波新品正在赶来的路上，敬请期待～'
            : '底价商品将不定时在这里出现，抢到就是赚到！',
      },
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
        // 可能需要 更新 城市
        this.getData();
      },
      fail: err => {
        this.getData();
      },
    });
  },
  computed: {
    ...mapState({
      location: state => state.location,
    }),
    // 当前列表数据
    currentProductList() {
      if (isEmptyObject(this.productList)) {
        return this.productList['tag' + this.currentTag.id].list;
      }
      return [];
    },
  },
  methods: {
    ...mapActions(['getGeo', 'setSelectCity', 'setSelectAddress']),
    getData() {
      this.$showLoading();
      this.initPullList();
      // this.pullParams.page_limit = 5;
      this.pullParams.category_id = this.currentTag.id;
      this.pullParams.list_type = this.list_type;
      const { selectAddress } = this.location;
      if (isEmptyObject(selectAddress)) {
        this.pullParams.lng = selectAddress.lng;
        this.pullParams.lat = selectAddress.lat;
      }
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.activityList.apply(this, rest);
    },
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
    gotoNext(e) {
      const { type } = e.currentTarget.dataset;
      this.$forward(type);
    },
    // tab切换
    tabSelect(e) {
      const { type } = e.currentTarget.dataset;
      if (this.list_type == type) {
        return;
      } else {
        this.list_type = type;
        this.productList = {};
        this.getData();
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.select-tab-border{
  border-bottom: 2px solid #FDE044 !important;
}
.page-product{
  width: 100%;
}
.tab-cont-box{
  width: 100%;
  height: 40px;
  .tab-box{
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
    display: flex;
    justify-content: space-between;
    background: #fff;
    .tab-text-box{
      text-align: center;
      width: 50%;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #E2E2E2;
      display: flex;
      justify-content: center;
      align-items: center;
      .tab-img{
        width: 19px;
        height: 19px;
        margin-left: 5px;
      }
    }
  }
}
>>>.cm-header{
  padding-bottom: 0px;
}
.search-box {
  position :fixed;
  top:46px;
  z-index:99;
  width:100%;
  height:40px;
  >>>.cm-search-box.is-fixed {
    top:46px;
  }
}
>>>.tag-box{
  height:38px;
  margin-top:5px;
}
>>>.cm-search-input{
  height:26px;
  padding-left:10px;
}
>>>.page-scroll {
  margin-top: 3px;
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
