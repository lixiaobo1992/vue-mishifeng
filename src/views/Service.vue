<template>
  <div class="page-service">正在连接客服...</div>
</template>

<script>
import api from '@/api';
import { stringify } from 'kit-qs';

export default {
  data() {
    return {};
  },
  created() {
    api.getOpenIm(
      {},
      res => {
        // {
        //   nonce: 123
        //   signature: "xxx"
        //   timestamp: 1245
        //   web_token: "xxx"
        // }
        const { data } = res;
        const { userInfo = {} } = this.$store.state.user;
        data.c_name = userInfo.nickname;
        let udeskUrl = `https://iqianggou.udesk.cn/im_client/?web_plugin_id=59049&${stringify(
          data
        )}`;
        console.log(udeskUrl);
        this.$forward(udeskUrl, { replace: true });
      },
      err => {
        console.log(err);
      }
    );
  },
};
</script>

<style lang="stylus" scoped>
.page-service {
  text-align: center;
  padding: 100px 10px 100px;
}
</style>
