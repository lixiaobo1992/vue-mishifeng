<template>
  <div class="notice-box">
    <div class="notice-text clearfix" v-html="html"></div>
  </div>
</template>
<script>
export default {
  name: 'notice-text',
  props: {
    html: {
      type: String,
      default: '',
    },
  },
};
</script>
<style scoped lang="stylus">
.notice-box{
  width: 100%;
  padding: 15px 0;
  overflow: hidden;
  >>>.notice-text{
    font-size: 13px;
    color: #4A4A4A;
    text-align: justify;
    line-height: 24px;
    word-wrap:break-word;
  }
}
</style>
