<template>
  <div class="iframe">
    <iframe
      v-show="iframeState"
      id="showIframe"
      frameborder="0"
      name="showHere"
      scrolling="auto"
      :src="dataurl"
      ref="iframeDom"
    >
    </iframe>
  </div>
</template>
<script>
import api from '@/api';
import { loadImg } from '@/utils';
export default {
  data() {
    return {
      type: 2,
      iframeState: true,
      dataurl: '',
    };
  },
  created() {
    this.type = this.$route.query.id || 1;
    this.headerBg = loadImg('rule/rule.png');
    console.log(this.$route.query.id, 'id');
    console.log(this.type, 'type');
    switch (this.type) {
      case 1:
        location.replace(
          'https://topic.doweidu.com/?id=dd643eaa3ee74871b6ebfb14f8032c72&origin=msf'
        );
        break;
      case 2: //服务条款
        api.staticContent(
          {
            q: 'terms_of_service',
          },
          res => {
            console.log(res);
            this.dataurl = res.data.url;
            //this.$forward(res.data.url, { replace: true });
            location.replace(res.data.url);
          },
          err => {
            console.log(err);
          }
        );
        console.log('2');
        break;
      case 4: //隐私政策
        api.staticContent(
          {
            q: 'terms_of_privacy',
          },
          res => {
            console.log(res);
            //this.agreementContent = res.data.content;
            this.dataurl = res.data.url;
            //this.$forward(res.data.url, { replace: true });
            location.replace(res.data.url);
          },
          err => {
            console.log(err);
          }
        );
        console.log('3');
        break;
    }
  },
  mounted() {
    const oIframe = document.getElementById('showIframe');
    const deviceWidth = document.documentElement.clientWidth;
    const deviceHeight = document.documentElement.clientHeight;
    console.log(deviceWidth, deviceHeight);
    oIframe.style.width = deviceWidth + 'px';
    oIframe.style.height = deviceHeight + 'px';
    console.log(this.$refs);
    console.log(oIframe.contentWindow.document.body); // contentWindow.document
    //oIframe.contentWindow.document.body.style.width = '320px';
  },
};
</script>
<style scoped lang="stylus">
iframe {
  min-width :320px;
}
.iframe {
  height:100%;
  max-width:100%;
  overflow-x :hidden;
  overflow-y :scroll;
}
#showIframe>>> pre {
  display: inline-block !important;
  font-size:14px;
  white-space :normal;
}
body {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}
</style>
