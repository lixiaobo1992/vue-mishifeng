<template>
  <div class="page-download">
    <img :src="bgImg" alt="" class="bgImg" />
    <div class="download-btn" @click="downloadClick">
      <img src="~/assets/honey/ios.png" class="ios-img" />iPhone版下载
    </div>
    <div class="download-btn and-download" @click="downloadClick">
      <img src="~/assets/honey/Android.png" class="and-img" />Android版下载
    </div>
  </div>
</template>

<script>
import { loadImg } from '@/utils';
import device from '@/utils/device';

export default {
  data() {
    return {
      bgImg: '',
      downurl: '',
      isMsf: device.msf,
    };
  },
  created() {
    this.bgImg = loadImg('app_download@2x.png');
    this.generateUrl();
    console.log('1');
  },
  mounted() {
    setTimeout(() => {
      this.downloadClick();
    }, 500);
  },
  methods: {
    generateUrl() {
      const { query = {} } = this.$route;
      // schema标准格式 mishifeng://native/path?quary
      // 直接唤醒 app
      if (!this.isMsf) {
        const schemaHome =
          device.system == 'iphone'
            ? 'mishifeng://native/'
            : 'mishifeng://native?key.jump.scheme=https%3A%2F%2Fm.mishifeng.com%2Findex';
        this.callapp = query.callapp || schemaHome;
        location.href = this.callapp;
      }
      const defaultDownurl =
        'https://sj.qq.com/myapp/detail.htm?apkName=com.doweidu.mishifeng';
      let downurl = '';

      if (device.system == 'iphone' && query.ios_url) {
        downurl = query.ios_url || '';
      } else if (device.system == 'android') {
        downurl = query.android_url || '';
      }

      if (!downurl) {
        if (device.wechat) {
          downurl = defaultDownurl;
        } else {
          downurl =
            device.system == 'iphone'
              ? 'https://itunes.apple.com/cn/app/id1435026988?mt=8'
              : defaultDownurl;
        }
      }
      this.downurl = downurl;
    },
    downloadClick() {
      //location.href = this.downurl;
      location.replace(this.downurl);
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-download {
  width: 100%;
  height: 100%;
  background-color: #fdda5b;
}
img.bgImg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.download-btn{
  position: absolute;
  width: 280px;
  padding-left:54px;
  line-height: 46px;
  border-radius: 26px;
  top: 490px;
  left: 50%;
  margin-left: -140px;
  background-color: #FF5300 ;
  font-size:20px;
  color: #fff;
  box-shadow: 0 0.02rem 0.03rem 0 rgba(0, 0, 0, .15);
}
.and-download {
  top: 550px;
  padding-left:50px;
}
img.and-img {
  width:32px;
  height:32px;
  margin-top:-2px;
  margin-right :5px
}
img.ios-img {
  width:22.8px;
  height:22.8px;
  margin-top:-8px;
  margin-right :5px
}
</style>
