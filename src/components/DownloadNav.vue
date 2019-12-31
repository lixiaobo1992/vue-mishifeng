<template>
  <div class="bottom-nav">
    <div class="nav-con">
      <span class="footer-txt">
        <img src="~/assets/honey/icon@2x.png" class="left-img" />
        {{ downLoadText }}
      </span>
      <span class="bottom-btn" @click="downloadEvent">立即打开</span>
    </div>
  </div>
</template>
<script>
import device from '@/utils/device';
import tongji from '@/utils/tongji';
export default {
  name: 'DownloadNav',
  props: {
    downLoadText: {
      type: String,
      default: '探店套餐1折抢',
    },
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    downloadEvent() {
      tongji.event('c_bargain_initiate');
      const { query = {} } = this.$route;
      if (device.system == 'iphone') {
        console.log('跳转app store');
        location.href =
          query.ios_url || 'https://itunes.apple.com/cn/app/id1435026988?mt=8';
      } else if (device.system == 'android') {
        console.log('跳转安卓应用市场');
        location.href =
          query.android_url ||
          'https://sj.qq.com/myapp/detail.htm?apkName=com.doweidu.mishifeng';
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.bottom-nav {
  position:fixed;
  height:50px;
  line-height:50px;
  bottom:0;
  width:100%;
  background :rgba(0,0,0,.8);
  z-index:999;
}
.nav-con{
  display:flex;
  flex-direction:row;
  padding:0 15px;
  align-items :center;
  justify-content :space-between;
  span.footer-txt {
    font-size: 16px;
    color: #FFF;
    letter-spacing: 1.2px;
    text-align: center;
  }
  span.bottom-btn {
    background: #FDE044;
    border-radius: 15.5px;
    font-size: 14px;
    color: #171900;
    letter-spacing: 1px;
    text-align: center;
    width:82px;
    height:28px;
    line-height:28px;
  }
  .left-img {
    height:30px;
    width:30px;
  }
}
</style>
