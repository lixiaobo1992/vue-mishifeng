<template>
  <div class="rankingList">
    <RankingItem
      v-for="(item, index) in rankingData"
      :item="item"
      :index="index"
      :key="'rank' + index"
    ></RankingItem>
  </div>
</template>
<script>
import RankingItem from '@/components/dumpling/RankingItem';
export default {
  name: 'ranking-item',
  components: {
    RankingItem,
  },
  props: {
    rankingData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  //data() {},
  methods: {},
};
</script>
<style lang="stylus" scoped>
.rankingList{
  font-size:14px;
  background: #fff;
  width: 100%;
  height: auto;
  position: absolute;
  overflow-y: scroll;
  padding-bottom:50px;
}
</style>
