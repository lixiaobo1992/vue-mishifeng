<template>
  <div class="small-box">
    <ul class="small-info-box">
      <li class="info-box" :data-id="item.id" @click="goNext($event)">
        <img class="info-img" :src="item.pic" />
        <div class="info-text-box">
          <p class="text-title">#{{ item.title }}#</p>
          <p class="text-count">{{ item.article_num }}条笔记</p>
        </div>
        <p class="right-arraw">></p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'theme-small-item',
  props: {
    item: {},
  },
  data() {
    return {};
  },
  methods: {
    goNext(e) {
      // console.log('今日讨论的详情页默认暂时跳转至觅小蜂的今日讨论笔记。');
      const { id } = e.currentTarget.dataset;
      console.log(id);
      this.$forward('theme-detail', {
        id,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.small-box{
  width: 100%;
  .small-info-box{
    width: 100%;
    overflow: hidden;
    .info-box{
      width: 100%;
      height: 60px;
      border-radius: 5px;
      box-shadow: 0 2px 6px 0 rgba(0,0,0,0.10);
      background: #fff;
      margin-bottom: 10px;
    }
    .info-img{
      float: left;
      width: 60px;
      height: 60px;
    }
    .info-text-box{
      float: left;
      margin-left: 11px;
    }
    .text-title{
      margin-top: 12px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
    .text-count{
      margin-top: 5px;
      font-size: 12px;
      color: #999;
    }
    .right-arraw{
      float: right;
      margin-right: 20px;
      line-height: 60px;
    }
  }
}
</style>
