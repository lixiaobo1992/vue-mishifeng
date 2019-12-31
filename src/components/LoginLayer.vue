<template>
  <div class="login-layer-box">
    <div class="login-box">
      <p class="login-hint-title">登录提醒</p>
      <p class="login-hint-text">
        亲爱的用户，为了更好的用户体验，请您授权登录！
      </p>
      <div class="login-btn-box">
        <span class="close-btn" data-type="close" @click="goNext"
          >取消登录</span
        >
        <span class="submit-btn" data-type="login" @click="goNext"
          >微信授权登录</span
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'login-layer',
  data() {
    return {};
  },
  computed: {
    ...mapState({
      userLoginLayerStatus: state => state.app.userLoginLayerStatus,
    }),
  },
  methods: {
    ...mapActions(['setUserLoginLayer']),
    goNext(e) {
      console.log(e);
      const { type } = e.target.dataset;
      switch (type) {
        case 'close':
          this.setUserLoginLayer(false);
          break;
        case 'login':
          this.setUserLoginLayer(false);
          this.$forward('/login', {
            c_redirect: location.href,
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.login-layer-box{
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,.3);
  position: fixed;
  z-index: 10;
  .login-box{
    width: 250px;
    height: 150px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
  }
  .login-hint-title{
    width: 100%;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    color: #333;
    background: #fde044;
    border-radius: 10px 10px 0 0;
  }
  .login-hint-text{
    padding: 0 10px;
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
  }
  .login-btn-box{
    width: 100%;
    padding: 0 10px;
    margin-top: 20px;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: center;
    span{
      width: 45%;
      font-size: 14px;
      text-align: center;
    }
    .submit-btn{
      background: #fde044;
      border-radius: 5px;
    }
  }
}
</style>
