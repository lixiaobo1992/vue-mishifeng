<template>
  <div class="brach-address">
    <div class="addredd-info" @click="goMap">
      <Icon class="location" type="map"></Icon>
      <p class="address">{{ addressInfo.address }}</p>
    </div>
    <a
      :href="'tel:' + addressInfo.phoneNumber"
      class="icon-tel"
      @click.stop="telDetail()"
      >&nbsp;</a
    >
  </div>
</template>
<script>
import Icon from '@/ui/Icon';
import tongji from '@/utils/tongji';
/**
 * addressInfo: {
 *  lng: 121.11, 门店经度
 *  lat: 38.11, 门店纬度
 *  title: '', 门店名称
 *  address: '', 门店地址
 *  phoneNumber: 12345678,
 * }
 */
export default {
  name: 'branch-address',
  components: {
    Icon,
  },
  props: {
    addressInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      id: '',
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  methods: {
    goMap() {
      //let id = this.$route.query.id;
      tongji.event('c_good_location', `value:{storeId:${this.id}}`);
      this.$forward('map', this.addressInfo);
    },
    telDetail() {
      tongji.event('c_good_location', `value:{storeId:${this.id}}`);
    },
  },
};
</script>
<style lang="stylus" scoped>
.brach-address {
  display: flex;
  padding: 12px 0 12px 15px;
  align-items: center;
  position: relative;
  .addredd-info {
    flex: 1;
    display: flex;
    border-right: 1PX solid #F5F5F5;

    .location {
      width: 13px;
      height: 15px;
    }
    .address {
      font-size: 13px;
      color: #4A4A4A;
      margin-left: 4px;
      width: 100%;
      flex: 1;
    }
  }
  .icon-tel{
    display: block;
    width: 42px;
    background: url('~assets/shop/icon_info_phone.png') no-repeat center center;
    background-size: 13px;
  }
}
</style>
