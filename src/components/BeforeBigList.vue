<template>
  <div class="list-box">
    <p class="cont-title">往期话题</p>
    <div class="list-cont" v-for="(item, index) in list" :key="index">
      <theme-big-item :item="item"></theme-big-item>
    </div>
  </div>
</template>

<script>
import ThemeBigItem from '@/components/ThemeBigItem';
export default {
  name: 'before-big-list',
  components: {
    [ThemeBigItem.name]: ThemeBigItem,
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
};
</script>

<style lang="stylus" scoped>
.list-box{
  width: 100%;
  .cont-title{
    padding: 0 20px;
    padding-top: 13px;
    font-size: 18px;
    color: #171900;
    font-weight: bold;
    background: #fff;
  }
  .list-cont{
    background: #fff;
    padding: 0 20px;
    margin-bottom: 10px;
  }
}
</style>
