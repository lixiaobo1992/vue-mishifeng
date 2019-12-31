<template>
  <div class="share">
    <img src="~assets/dumplings/share-bg.png" class="share-bg" />
    <div class="banner">
      <img src="~assets/dumplings/share-banner-1.png" />
      <img src="~assets/dumplings/share-banner.png" v-if="camp_type == 2" />
    </div>
    <div class="tips">
      <div class="left-tips">
        <img src="~assets/dumplings/left-dumpling.png" class="img-type" />
      </div>
      <div class="right-tips">
        <img src="~assets/dumplings/right-dumpling.png" class="img-type" />
      </div>
      <ProgressBar
        :value="progressInfo.value"
        :totalNum="progressInfo.totalNum"
        v-show="progressInfo.totalNum"
      ></ProgressBar>
    </div>
    <div class="share-btn-list" v-show="camp_type == 2">
      <div class="btn btn-left" @click="support"></div>
      <div class="btn btn-right" @click="reject"></div>
    </div>
    <div class="share-btn-list" v-show="camp_type == 1">
      <div class="btn btn-left-1" @click="support"></div>
      <div class="btn btn-right-1" @click="reject"></div>
    </div>
    <DumplingConfirm
      :settingStatus="setInfo.settingStatus"
      :headerTitle="setInfo.headerTitle"
      :settingText="setInfo.settingText"
      :imgUrl="setInfo.imgUrl"
      :headerText="setInfo.headerText"
      :noticeText="setInfo.noticeText"
      :btnText="setInfo.btnText"
      @btnEvent="btnForward"
      @closeBox="btnClose"
    >
    </DumplingConfirm>
    <DownloadNav :downLoadText="'让你一元吃大餐'" v-if="!isMSF"></DownloadNav>
  </div>
</template>
<script>
import api from '@/api';
import ProgressBar from '@/components/dumpling/ProgressBar';
import DumplingConfirm from '@/components/dumpling/DumplingConfirm';
import DownloadNav from '@/components/DownloadNav';
import store from '@/store';
import { mapState, mapActions } from 'vuex';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import { storage } from '@dwdjs/utils';
//弹窗图片
import refuseImg from '@/assets/dumplings/refuse-support.png';
import failImg from '@/assets/dumplings/fail-support.png';
export default {
  name: '',
  components: {
    ProgressBar,
    DumplingConfirm,
    DownloadNav,
  },
  data() {
    return {
      progressInfo: {
        totalNum: 200,
        value: 80,
      },
      camp_type: 1,
      shareCode: '',
      setInfo: {
        settingStatus: false,
        headerTitle: '',
        headerText: '',
        imgUrl: '',
        settingText: `您已经选择过阵营啦！<br/>本次大战不支持更改阵营哦!`,
        noticeText: `你为好友收集了5份原材料`,
        btnText: ['进入战场'],
      },
      isMSF: device.msf,
    };
  },
  created() {
    this.shareCode = this.$route.query.code || 'H6F8ATN4';
    // console.log(this.$route.query.code, 'code1111');
    // let queryCode = this.$route.query.code;
    // console.log(typeof queryCode == 'undefined', '1111111');
    // if (typeof queryCode.toString == 'undefined') {
    //   this.shareCode = 'H6F8ATN4';
    // }
    this.getshareInfo();
    console.log(storage.get('clickSts'), 'clickSts');
    if (storage.get('clickSts') && !this.isMSF) {
      this.getSupport();
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      logged: state => state.user.logged,
    }),
  },
  methods: {
    ...mapActions(['setShareMask']),
    getshareInfo() {
      api.shareInfo(
        { share_code: this.shareCode },
        res => {
          const { data } = res;
          // this.shareInfo = {
          //   camp_type: data.share_user_camp_type,
          //   sweet_num: data.sweet_num,
          //   salty_num: data.salty_num,
          // };
          console.log(data, 'data');
          this.camp_type = data.share_user_camp_type;
          this.progressInfo.totalNum =
            Number(data.sweet_num) + Number(data.salty_num);
          this.progressInfo.value = data.salty_num;
        },
        err => {
          console.log(err);
        }
      );
    },
    support() {
      storage.set('clickSts', true, 300);
      if (!this.$store.state.user.userInfo.id) {
        if (this.isMSF) {
          bridge.login({
            success(res) {
              //..
              console.log(res);
              const { data } = res;
              store.commit('SET_USERINFO', data);
            },
            fail(err) {
              console.log('app 登录失败！', err);
              // mini.forward('/index');
              this.showToast('登录失败，请重试！');
            },
          });
        } else {
          console.log('1', '222222222222222222');
          //this.$forward('login');
          if (!device.wechat) {
            this.$showToast('请在微信中为好友支援！');
          }
        }
        console.log('1', '222222222222222222');
      } else {
        console.log('2', '222222222');
        this.getSupport();
      }
    },
    getSupport() {
      api.supportCamp(
        { share_code: this.shareCode },
        res => {
          const { data } = res;
          let type = data.type,
            material_num = data.material_num;
          console.log(type, 'type');
          switch (type) {
            case 1:
              this.setInfo = {
                settingStatus: true,
                imgUrl: refuseImg,
                settingText: `支援成功！`,
                noticeText: `你为好友收集了${material_num}份原材料`,
                btnText: ['进入战场继续支援'],
              };
              break;
            case 2:
              this.setInfo = {
                settingStatus: true,
                imgUrl: failImg,
                settingText: `支援失败！`,
                noticeText: `你的战友在积极奋战<br>你却想着支援敌方阵营`,
                btnText: ['去支援战友'],
              };
              break;
            case 3:
              this.setInfo = {
                settingStatus: true,
                imgUrl: failImg,
                settingText: `支援失败！`,
                noticeText: `您已经支援过该好友<br>不能重复支援哦！`,
                btnText: ['进入战场'],
              };
              break;
            default:
              this.setInfo.settingStatus = false;
          }
          storage.remove('clickSts');
        },
        err => {}
      );
    },
    reject() {
      this.setInfo = {
        imgUrl: refuseImg,
        settingStatus: true,
        settingText: `快去支援你支持的阵营吧！`,
        noticeText: ``,
        btnText: ['进入战场'],
      };
    },
    btnForward() {
      this.$forward('/festival/chocie', { type: 4 }, { replace: true });
    },
    btnClose() {
      this.setInfo.settingStatus = false;
    },
  },
};
</script>
<style lang="stylus" scoped>
.share {
  width:100%;
  height:100%;
  background-size:100% auto;
  background-repeat:no-repeat;
  background-color :#e0f3ee;
  .share-bg {
    width:100%;
    height:auto;
    position:absolute;
    top:0;
  }
}
.banner img {
  height:auto;
  width:70%;
  margin:36% auto;
  position :absolute;
  left:0;
  right:0;
}
.tips {
  position:relative;
  height:42px;
  width:90%;
  margin:78% auto 0;
  .type {
    display:inline-block;
    line-height:52px;
    margin-left:5px;
  }
  .left-tips,.right-tips {
    width:56px;
    height:56px;
    border-radius: 50%;
    position :absolute;
    z-index:99;
    top:-24px;
    background: #fff;
  }
  .left-tips {
    left:0;
    border:3px solid #fb3c42;
  }
  .right-tips {
    right:0;
    border:3px solid #4cabe4;
  }
  .img-type {
    width:42px;
    height:33px;
    margin-top:7px;
    margin-left:4px;
  }
  .pop {
    width:44px;
    height:32px;
    position:absolute;
    top:-52px;
    background-size:100% 100%;
    background-repeat:no-repeat;
    line-height:32px;
    text-align:center;
    color:#fff;
  }
}
.share-btn-list {
  width:90%;
  display:flex;
  flex-direction :row;
  justify-content :space-between;
  margin:32% auto;
  .btn {
    width:157px;
    height:40px;
    background-size:100% 100%;
    background-repeat:no-repeat;
    z-index:999;
  }
  .btn-left {
    background-image :url('~assets/dumplings/share-btn-left.png');
  }
  .btn-right {
    background-image :url('~assets/dumplings/share-btn-right.png');
  }
  .btn-left-1 {
    background-image :url('~assets/dumplings/share-btn-left-1.png');
  }
  .btn-right-1 {
    background-image :url('~assets/dumplings/share-btn-right-1.png');
  }
}
>>>.box-text {
  font-size:16px;
}
>>>.tab-btn {
  justify-content :center;
}
>>>.box-btn {
  width:80%;
}
>>>.share-shade {
  display: none !important;
}
</style>
