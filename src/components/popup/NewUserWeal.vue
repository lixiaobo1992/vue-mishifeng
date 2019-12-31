<template>
  <div class="bg">
    <div class="header-box">
      <img
        src="https://img.mishifeng.com/Fk1-HFS4EuiZrGShKNuUiNRZ9IdR"
        class="header-img"
      />
      <p class="header-title">新人专享福利</p>
      <p class="header-text">1.首单付多少返多少哦！</p>
      <p class="header-text">2.有效期为7天，最多返5000g蜂蜜</p>
      <div class="get-weal" @click="getWeal">立即领取</div>
    </div>
  </div>
</template>
<script>
import api from '@/api';
import { mapActions } from 'vuex';
export default {
  name: 'new-user-weal',
  props: {},
  methods: {
    ...mapActions(['setNewUserMealStatus']),
    getWeal() {
      api.getUserWeal(
        {
          benefit_type: 1,
        },
        res => {
          console.log(res, 'getUserWeal');
          this.setNewUserMealStatus(false);
        },
        err => {
          console.log(err, 'getUserWeal');
        }
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
.bg {
  background: rgba(0,0,0,0.8);
  height:100%;
  width:100%;
  position :absolute;
  top:0;
  right:0;
  z-index:999;
}
.header-box {
  background :#fcfcfc;
  width: 250px;;
  position: fixed;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  z-index: 999;
  border-radius: 5px;
  .header-img{
    width: 250px;
    height: 140px;
  }
  .header-title{
    font-size: 18px;
    color: #333;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
  }
  .header-text{
    margin-left: 20px;
    font-size: 14px;
    color: #FFBF00;
    margin-top: 5px;
  }
  .get-weal{
    width: 130px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #171900;
    font-size: 16px;
    background: #FDE044;
    box-shadow: 0 1px 4px 0 rgba(253,224,68,0.53);
    border-radius: 21px;
    margin: 30px auto;
  }
}
</style>
