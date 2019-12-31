<template>
  <div class="big-box">
    <div class="big-info-box">
      <div class="info-box" :data-id="item.id" @click="goNext($event)">
        <img class="info-img" :src="item.pic" />
        <div class="info-text-box">
          <p class="text-title">#{{ item.title }}#</p>
          <p class="text-hint">
            {{ item.description }}
          </p>
          <p class="text-count">
            <img
              src="https://img.mishifeng.com/FlhlXbUkuLZlQp1D3G-e3e50phJm"
              class="count-icon"
            />{{ item.comment_num }}条讨论
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'theme-big-item',
  props: {
    item: {},
  },
  data() {
    return {};
  },
  methods: {
    goNext(e) {
      const { id } = e.currentTarget.dataset;
      this.$forward('theme-detail', {
        id,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.big-box{
  width: 100%;
  .big-info-box{
    width: 100%;
    overflow: hidden;
    .info-box{
      width: 100%;
      height: 100px;
      display: flex;
      border-radius: 5px;
      background: #fff;
      margin: 15px 0;
    }
    .info-img{
      width: 100px;
      height: 100px;
    }
    .info-text-box{
      margin-left: 11px;
    }
    .text-title{
      margin-top: 12px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
    .text-hint{
      margin-top: 5px;
      font-size: 12px;
      color: #666;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      height: 42px;
    }
    .text-count{
      margin-top: 5px;
      font-size: 12px;
      height: 16px;
      line-height: 16px;
      color: #999;
      display: flex;
      .count-icon{
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>
