<template>
  <div class="signIn-model" v-show="honeyStatus">
    <div class="model-con">
      <div class="left-img"></div>
      <div class="right-con" v-if="!textStatus">
        <p>+{{ honeyNum }}g</p>
      </div>
      <div class="right-con" v-else><p>已签到！</p></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Honey',
  props: {
    honeyNum: Number, //蜂蜜数量
    honeyStatus: {
      type: Boolean, //是否显示弹窗
      default: false,
    },
    textStatus: {
      type: Boolean, //提示文字是否显示
      default: false,
    },
    // duration: {
    //   type: Number,
    //   default: 1,
    // },
  },
  methods: {
    // setTimer(duration = 1) {
    //   this.timer = setInterval(() => {
    //     this.$props.signStatus = false;
    //   }, duration * 1000);
    // },
  },
};
</script>
<style lang="stylus" scoped>
.signIn-model {
  width:100%;
  height:100%;
  z-index:999;
  position:fixed;
  top:0;
  bottom:0;
  display:block;
  .model-con {
    width:160px;
    height:75px;
    background:rgba(0,0,0,.6);
    position:relative;
    right:0;
    left:0;
    margin:-38px auto;
    top:50%;
    border-radius:5px;
    .left-img {
      background-image:url('~assets/profile/honey-model@2x.png');
      background-size:77px auto;
      background-repeat:no-repeat;
      width:77px;
      height:105px;
      position:absolute;
      bottom:10px;
      left:6px;
    }
    .right-con {
      position:absolute;
      width:110px;
      height:76px;
      top:20px;
      right:-10px;
      text-align:center;
      font-size:14px;
      color:#fff;
      span{
        display:block;
        height:24px;
        line-height:24px;
      }
      p {
        margin-top:10px;
        font-size:16px;
      }
    }
    .close {
      width:24px;
      height:24px;
      background-image:url('~assets/profile/close@3x.png');
      background-size:20px 20px;
      background-repeat:no-repeat;
      position:absolute;
      z-index: 999;
      right:-12px;
      top:-32px;
    }
  }
}
</style>
