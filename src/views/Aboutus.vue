<template>
  <div class="about">
    <div class="header">
      <img src="~/assets/honey/icon@2x.png" />
      <span class="header-txt">当前版本{{ version }}</span>

      <span class="account"
        ><img
          src="~/assets/honey/weixin-2.png"
          class="weibo-img"
        />官方公众号:觅食蜂</span
      >
      <span class="weibo"
        ><img
          src="~/assets/honey/weibo.png"
          class="weibo-img"
        />官方新浪微博:觅食蜂</span
      >
    </div>
    <div class="line"></div>
    <ul class="items">
      <li @click="goType(1)">
        <span class="txtleft">社区规范 </span
        ><span><img src="~/assets/honey/more.png" class="more"/></span>
      </li>
      <li @click="updateVersion()">
        <span class="txtleft">检查更新 </span
        ><span
          ><i v-show="updateStatus">New</i
          ><img src="~/assets/honey/more.png" class="more"
        /></span>
      </li>
      <li @click="goType(2)">
        <span class="txtleft">服务条款 </span
        ><span><img src="~/assets/honey/more.png" class="more"/></span>
      </li>
      <li @click="goType(4)">
        <span class="txtleft">隐私政策 </span
        ><span><img src="~/assets/honey/more.png" class="more"/></span>
      </li>
      <li @click="logOut">
        <span class="txtleft">注销账号 </span
        ><span><img src="~/assets/honey/more.png" class="more"/></span>
      </li>
    </ul>
    <!-- <DownloadNav></DownloadNav> -->
  </div>
</template>
<script>
import { mapActions } from 'vuex';
// import DownloadNav from '@/components/DownloadNav';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
export default {
  components: {
    // DownloadNav,
  },
  data() {
    return {
      version: '',
      updateStatus: false,
      versionCode: '',
      isMSF: device.msf,
    };
  },
  created() {
    this.version = 'V' + process.env.VUE_APP_VERSION;
    const that = this;
    console.log(bridge, 'bridge');
    if (this.isMSF) {
      bridge.getSystemInfo({
        success(res) {
          const { data } = res;
          that.version = 'V' + data.versionName;
        },
      });
      bridge.getAppConfig({
        success(res) {
          const { data } = res;
          console.log(res, 'res');
          console.log(data.update.canUpdate, 'data.update.canUpdate');
          if (!data.update.canUpdate) {
            console.log(
              '已经是最新版本',
              data.versionCode,
              data.latestVersionCode
            );
          } else {
            console.log('不是最新版本');
            that.updateStatus = true;
          }
        },
      });
      bridge.disableRefresh();
    }
  },
  methods: {
    ...mapActions(['Logout']),
    //检查更新
    updateVersion() {
      console.log('1');
      console.log(bridge, 'bridge');
      this.isMSF &&
        bridge.checkUpdate({
          success(res) {
            console.log('3');
          },
        });
      console.log('2');
    },
    goType(type) {
      switch (type) {
        // case 1:
        default:
          this.$forward('static', { id: type });
          break;
      }
    },
    // //服务条款
    // goServe() {
    //   this.$forward('static', { id: 2 });
    // },
    // //隐私政策
    // goPrivacy() {
    //   this.$forward('static', { id: 4 });
    // },
    //注销登录
    logOut() {
      const that = this;
      // this.Logout().then(function() {
      //   that.$forward('index');
      // });
      that.$showAlert(
        '注销账号',
        '为了为了您的账户安全，请先将所有订单完成消费，然后联系客服协助注销'
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
.mint-msgbox-message {
  color:#333 !important;
}
.line {
  height:5px;
  background :#f1f1f5;
  margin-top:20px;
}
.header {
  display:flex;
  flex-direction :column;
  justify-content :center;
  align-items :center;
  padding:15px 0 20px;
  img {
    width:80px;
    height:80px;
    &.weibo-img {
      width:22px;
      height:22px;
      vertical-align :text-bottom;
      margin-right:3px;
    }
  }
}
span {
  font-size: 12px;
  color: #333;
  &.header-txt {
    margin-top:15px;
    opacity :.8;
    color: #999;
  }
  &.account {
    margin-top:30px;
  }
  &.weibo {
    margin-top:5px;
  }
  &.txtleft {
    color:#666;
    font-size:14px;
  }
}
.items {
  padding:0;
  margin:0;
  li {
    display:flex;
    flex-direction :row;
    justify-content :space-between;
    padding:5px 0;
    margin:0 15px;
    border-bottom :1px solid #e3e3e3;
    line-height:40px;
    color:#666;
    i {
      line-height:15px;
      background:#FF0000;
      border-radius :7.5px;
      padding:0 10px;
      color:#fff;
    }
  }
}
img.more {
  width:16px;
  height:16px;
}
</style>
