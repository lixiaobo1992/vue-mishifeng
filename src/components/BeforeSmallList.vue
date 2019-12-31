<template>
  <div class="list-box">
    <p class="cont-title">往期讨论</p>
    <div class="list-cont" v-for="(item, index) in list" :key="index">
      <theme-small-item
        :item="item"
        @click="goDetail(item.id)"
      ></theme-small-item>
    </div>
  </div>
</template>

<script>
import ThemeSmallItem from '@/components/ThemeSmallItem';
export default {
  name: 'before-small-list',
  components: {
    [ThemeSmallItem.name]: ThemeSmallItem,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    goDetail(id) {
      this.$forward('theme-detail', { id });
    },
  },
};
</script>

<style lang="stylus" scoped>
.list-box{
  width: 100%;
  padding: 0 16px;
  .cont-title{
    font-size: 18px;
    color: #171900;
    font-weight: bold;
  }
  .list-cont{
    margin-top: 10px;
  }
}
</style>
