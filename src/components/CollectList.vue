<template>
  <div class="product-box">
    <div class="product-list">
      <!-- item -->
      <collect-item
        v-for="(item, index) in productListData"
        :key="'product_' + index + item.pid"
        :item="item"
        :index="index"
        @btnEvent="btnEvent"
      ></collect-item>
    </div>
  </div>
</template>

<script>
import CollectItem from '@/components/CollectItem';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import tongji from '@/utils/tongji';
export default {
  name: 'collect-list',
  props: {
    listData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    [CollectItem.name]: CollectItem,
  },
  data() {
    return {
      productListData: [],
      isMSF: device.msf,
      tongdunFingerprintStatus: false, //同盾设备指纹状态
      blackBox: '', //同盾设备指纹
      sessionId: '', //同盾验证成功的sessionId
    };
  },
  watch: {
    listData(newVal, oldVal) {
      this.productListData = this.dealList(newVal);
    },
  },
  created() {
    this.productListData = this.dealLis(this.listData);
    const that = this;
    if (this.isMSF) {
      bridge.getAppConfig({
        success(res) {
          const { data } = res;
          console.log(res, 'res');
          that.tongdunFingerprintStatus = data.tongdunFingerprint;
          if (that.tongdunFingerprintStatus) {
            bridge.getSystemInfo({
              success(res) {
                const { data } = res;
                that.blackBox = data.blackBox;
                console.log(res, 'res2', that.blackBox);
              },
            });
          }
        },
      });
    }
  },
  methods: {
    dealList(list = []) {
      return list.map(item => this.filterData(item));
    },
    filterData(item) {
      console.log(item, 'filterPriceData');
      return {
        ...item,
        star: Number(item.star),
        activity: this.filterPrice(item.activity),
      };
    },
    filterPrice(list = []) {
      return list.map(item => {
        console.log(item, 'filterPrice');
        return {
          current_price: (item.current_price / 100).toFixed(2),
          market_price: (item.market_price / 100).toFixed(2),
          id: item.id,
          name: item.item_name,
          pic: item.item_pic,
          left_stock: item.left_stock,
        };
      });
    },
    goBooking(item) {
      // 去详情
      const value = `index:${item.index},value:{goodId:${item.pid}}`;
      tongji.event('c_good', value);
      this.$forward('product-detail', { id: item.pid });
    },
  },
};
</script>

<style lang="stylus" scoped></style>
