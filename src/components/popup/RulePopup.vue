<template>
  <div class="rule-bg-box" @click="goNext">
    <div class="rule-box">
      <p class="rule-title">规则说明</p>
      <p class="rule-text">
        {{ cont }}
      </p>
      <span class="rule-btn" @click="goNext">我知道了</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'rule-popup',
  props: {
    cont: {
      type: String,
    },
  },
  methods: {
    goNext() {
      console.log('关闭');
      this.$emit('onPopup', false);
    },
  },
};
</script>
<style lang="stylus" scoped>
.rule-bg-box{
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,.3);
  position: fixed;
  top: 0;
  left: 0;
  z-index:99;
  .rule-box{
    width: 330px;
    height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 10px;
    .rule-title{
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      text-align: center;
    }
    .rule-text{
      margin-top: 10px;
      padding: 0 20px;
      font-size: 12px;
      text-indent: 24px;
      line-height: 20px;
      height: 280px;
      overflow-y: scroll;
    }
    .rule-btn{
      position: absolute;
      bottom: 10px;
      width: 80px;
      height: 30px;
      line-height: 30px;
      left: 50%;
      margin-left: -40px;
      background: #FFBF00;
      border-radius: 5px;
      text-align center;
      font-size: 14px;
    }
  }
}
</style>
