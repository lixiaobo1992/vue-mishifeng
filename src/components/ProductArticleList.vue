<template>
  <div class="product-box">
    <div class="product-article-list">
      <div
        class="article-box"
        v-for="(item, index) in productListData"
        :key="index"
      >
        <article-item
          :key="'product_' + index"
          :item="item"
          :index="index"
          :topStatus="true"
          :footerStatus="ArticleItemFooter"
        ></article-item>
        <div class="activity-box" v-if="index == 4">
          <article-activity-item
            v-if="activityListData.length"
            :listArray="activityListData"
          ></article-activity-item>
        </div>
        <div class="index-swiper-box" v-if="index == 6">
          <Swiper :ratio="adsRatio">
            <SwiperItem
              v-for="(swiperItem, index) in swiperList"
              :key="index"
              :data-link="swiperItem.link"
              :data-index="index"
              @click.native="$onUrlPage($event)"
              @change="handleChange(index)"
            >
              <img class="image" :src="swiperItem.pic" />
            </SwiperItem>
          </Swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem';
import ArticleActivityItem from '@/components/ArticleActivityItem';
import { Swiper, SwiperItem } from '@/ui';
import tongji from '@/utils/tongji';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'product-article-list',
  props: {
    listData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    activityList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    swiperList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    adsRatio: {
      type: Number,
    },
  },
  components: {
    [ArticleItem.name]: ArticleItem,
    [ArticleActivityItem.name]: ArticleActivityItem,
    Swiper,
    SwiperItem,
  },
  data() {
    return {
      productListData: [],
      activityListData: [],
      isMSF: device.msf,
      tongdunFingerprintStatus: false, //同盾设备指纹状态
      blackBox: '', //同盾设备指纹
      sessionId: '', //同盾验证成功的sessionId
      ArticleItemFooter: true,
    };
  },
  watch: {
    listData(newVal, oldVal) {
      this.productListData = [];
      setTimeout(() => {
        this.productListData = this.dealList(newVal);
      }, 0);
    },
    activityList(newVal, oldVal) {
      this.activityListData = this.priceFilter(newVal);
    },
  },
  computed: {
    ...mapState({
      logged: state => state.user.logged,
      userInfo: state => state.user.userInfo,
    }),
  },
  created() {
    //console.log(dealPrice(39000,100);
    this.productListData = this.dealList(this.listData);
    this.activityListData = this.priceFilter(this.activityList);
    const that = this;
    if (this.isMSF) {
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
    }
  },
  methods: {
    ...mapActions(['setShareMask']),
    dealList(list = []) {
      return list.map(item => this.filterItemData(item));
    },
    filterItemData(item) {
      return {
        activity: this.priceFilter(item.activity) || [],
        article: item.article || {},
        branch: this.handleDistance(item.branch) || {},
      };
    },
    // 处理价格小数
    priceFilter(activity) {
      return activity.map(item => {
        return {
          ...item,
          current_price: (item.current_price / 100).toFixed(2) || '',
          market_price: (item.market_price / 100).toFixed(2) || '',
          start_price: (item.start_price / 100).toFixed(2) || '',
        };
      });
    },
    // 处理距离字段
    handleDistance(data) {
      return {
        branch_name: data.branch_name,
        branch_log: data.branch_head_pic,
        id: data.id,
        is_collected: data.is_collected,
        distance: (data.distance / 1000).toFixed(2),
      };
    },
    // v2.4.0 新增swiper
    handleChange(index) {
      console.log('index');
      tongji.event('c_home_banner', `value:{"bannnerId:${index}"}`);
      //this.$forward('profile');
    },
  },
};
</script>

<style lang="stylus" scoped>
.product-article-list{
  padding: 13px 10px 0 10px;
}
.index-swiper-box{
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}
.image{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
