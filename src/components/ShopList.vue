<template>
  <div class="probe-shop-list">
    <!-- item -->
    <shop-item
      v-for="(item, index) in listData"
      :key="'shop_' + index + item.id"
      :item="item"
    ></shop-item>
  </div>
</template>

<script>
import ShopItem from '@/components/ShopItem';
export default {
  name: 'shop-list',
  props: {
    listData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    [ShopItem.name]: ShopItem,
  },
};
</script>

<style lang="stylus" scoped>
/*list*/
.probe-shop-list{
  padding:10px 10px 0 10px;
}
</style>
