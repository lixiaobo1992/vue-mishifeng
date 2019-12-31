<template>
  <div class="ranking">
    <div class="avator" @click="goProfile(item.user_id)">
      <span class="rank-index">{{ index + 1 }}</span>
      <img :src="item.avatar" class="user-img" />
      <span class="nickname">{{ item.nickname }}</span>
    </div>
    <span class="ranking-con"
      >已贡献
      <p class="num">{{ item.zongzi_num }}</p>
      <img src="~assets/dumplings/rank-zongzi.png" class="user-left"
    /></span>
  </div>
</template>
<script>
export default {
  name: 'ranking-item',
  props: {
    item: Object,
    index: Number,
  },
  methods: {
    goProfile(id) {
      if (!id) {
        return;
      }
      this.$forward('profile', { id });
    },
  },
};
</script>
<style lang="stylus" scoped>
.ranking{
  display :flex;
  flex-direction : row;
  align-items :center;
  justify-content :space-between;
  width:94%;
  padding:5px;
  margin: 0 auto;
  border-bottom:1px solid #f5f5f5;
}
.avator{
  height:42px;
  border-radius:50%;
  align-items:center;
  line-height:42px;
  color:#999;
  display:flex;
  .user-img {
    height:32px;
    border-radius:50%;
    margin-left:5px;
    margin-right:5px;
  }
}
.rank-index {
  margin-right:8px;
  font-size:18px;
}
.nickname {
  font-size:14px;
  color:#333;
  height:42px;
  line-height:42px;
  margin-right:5px;
  margin-left:5px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  max-width:110px;
}
.ranking-con {
  font-size:12px;
  color:#666;
  height:42px;
  line-height:42px;
  vertical-align :middle;
  min-width:110px;
  .user-left {
    width:20px;
    height:25px;
    margin-top:-5px;
  }
  .num {
    color:#df5e51;
    display:inline;
    margin-left:5px;
    margin-right:5px;
  }
}
</style>
