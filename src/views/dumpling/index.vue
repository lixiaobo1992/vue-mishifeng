<template>
  <div class="index" :class="{ h5index: !isMSF }">
    <div class="header"></div>
    <div class="header-text">
      <span>粽子材料:{{ zongzhiInfo.material_num }} </span
      ><span class="header-txt-right"
        >已包粽子:{{ zongzhiInfo.zongzi_num }}</span
      >
    </div>
    <div class="btn-list">
      <DumplingButton
        :btnText="btnText"
        :imgItem="{ width: 108.5, height: 25, bgcolor: '' }"
        :fontItem="{ size: 14 }"
        class="left-stuff"
        :class="{ more: moreStatus }"
        @btnEvent="getToadyMaterial(btnType)"
      ></DumplingButton>
      <div class="right-btn">
        <DumplingButton
          :btnText="''"
          :imgItem="{
            width: 67.5,
            height: 27,
            bgcolor: '',
          }"
          :fontItem="{ size: 14 }"
          class="btn-item btn-rule"
          @btnEvent="goRule"
        ></DumplingButton>
        <DumplingButton
          :btnText="''"
          :imgItem="{ width: 67.5, height: 27, bgcolor: '' }"
          :fontItem="{ size: 14 }"
          class="btn-item rank-btn"
          @btnEvent="goRank"
        ></DumplingButton>
      </div>
    </div>
    <div class="tips">
      <div class="left-tips">
        <img src="~assets/dumplings/left-dumpling.png" class="img-type" />
        <span class="type text-type">咸粽</span>
      </div>
      <div
        class="pop left-pop"
        v-show="zongzhiInfo.camp_type == 2"
        v-if="popStatus"
      >
        +1
      </div>
      <div class="right-tips">
        <img src="~assets/dumplings/right-dumpling.png" class="img-type" />
        <span class="type text-type">甜粽</span>
      </div>
      <div
        class="pop right-pop"
        v-show="zongzhiInfo.camp_type == 1"
        v-if="popStatus"
      >
        +1
      </div>
      <div class="vs-bg"></div>
      <ProgressBar
        :value="progressInfo.value"
        :totalNum="progressInfo.totalNum"
        v-show="progressInfo.totalNum > 1"
      ></ProgressBar>
    </div>
    <!-- <RankingList :rankingData="rankingList"></RankingList> -->
    <div :class="['make-tips', activeClass]">
      <!-- <img src="~assets/dumplings/tips.png" class="tips-img" /> -->
    </div>
    <div class="btn-make" @click="makeDumpling">
      <img src="~assets/dumplings/img-hand.png" class="hand" />
    </div>
    <div class="btn-box"></div>
    <DumplingConfirm
      :setType="setInfo.setType"
      :settingStatus="setInfo.settingStatus"
      :headerTitle="setInfo.headerTitle"
      :settingText="setInfo.settingText"
      :headerText="setInfo.headerText"
      :imgUrl="setInfo.imgUrl"
      :noticeText="setInfo.noticeText"
      :btnText="setInfo.btnText"
      @btnEvent="btnForward"
      @closeBox="btnClose"
    >
    </DumplingConfirm>
    <DownloadNav :downLoadText="'让你一元吃大餐'" v-if="!isMSF"></DownloadNav>
    <!-- <ShareShade
      v-show="showStatus"
      :shareMaskType="1"
      @click="closeMask"
    ></ShareShade> -->
  </div>
</template>
<script>
import api from '@/api';
import ProgressBar from '@/components/dumpling/ProgressBar';
import RankingList from '@/components/dumpling/RankingList';
import DumplingButton from '@/components/dumpling/DumplingButton';
//import defaultBtn from '@/assets/img/bg-header.png';
import DumplingConfirm from '@/components/dumpling/DumplingConfirm';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import { mapActions, mapState } from 'vuex';
import DownloadNav from '@/components/DownloadNav';
import ShareShade from '@/components/ShareShade';

import goAppImg from '@/assets/dumplings/selected-camp.png';
import materialImg from '@/assets/dumplings/getMaterial.png';
import shareImg from '@/assets/dumplings/shareImg.png';
//import rule from '@/assets/dumplings/rule.png';
// import { storage } from '@dwdjs/utils';
export default {
  name: 'ranking-list',
  components: {
    RankingList,
    ProgressBar,
    DumplingButton,
    DumplingConfirm,
    DownloadNav,
    ShareShade,
  },
  data() {
    return {
      rankingList: [
        {
          avatar: '~assets/img/honey_icon.png',
          id: 1,
          nickname: '用户名1',
          content: '已贡献300个甜粽子',
        },
        {
          avatar: '~assets/img/honey_icon.png',
          id: 2,
          nickname: '用户名21111',
          content: '已贡献300个甜粽子',
        },
      ],
      btnText: '',
      moreStatus: false,
      btnType: 1,
      progressInfo: {
        totalNum: 200,
        value: 80,
      },
      zongzhiInfo: {
        wait_num: 0,
        material_num: 0,
        zongzi_num: 0,
        camp_type: 1,
      },
      shareInfo: {
        share_code: '',
        share_pic: '',
      },
      setInfo: {
        setType: 1,
        settingStatus: false,
        headerTitle: '',
        headerText: '',
        settingText: ``,
        noticeText: `发布笔记所得的粽子原材料会在24小时内到账。`,
        btnText: ['进入战场'],
      },
      downurl: '',
      isMSF: device.msf,
      popStatus: false,
      activeClass: '',
      initIndex: 0,
      showStatus: true,
      isNewVersion: false,
      iphone: device.iphone,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      logged: state => state.user.logged,
    }),
  },
  created() {
    console.log(window.screen.height, 'window.screen.height');
    if (!this.isMSF) {
      console.log('1111112');
      if (this.$store.state.user.userInfo.id) {
        this.getInitData();
        this.generateUrl();
      } else {
        console.log('1111113');
        this.$forward('/festival/chocie', { type: 4 }, { replace: true });
      }
    } else {
      const that = this;
      bridge.getUserInfo({
        success(res) {
          if (!res.data.id && !res.data.token) {
            console.log(1, '1111112');
            // bridge.redirectTo({
            //   url: `${window.location.origin}/festival/chocie?type=4`,
            // });
            //this.$forward('/festival/chocie', { type: 4 }, { replace: true });
            location.replace('/festival/chocie?type=4');
          } else {
            // console.log(index, 'index');
            that.getInitData();
          }
        },
      });
    }
    if (
      (this.iphone && this.$version.gt('1.6.4')) ||
      this.$version.gt('1.6.2')
    ) {
      this.isNewVersion = true;
    }
  },
  mounted() {
    //this.getInitData();
    // this.btnText =
    //   this.zongzhiInfo.wait_num == 0 ? '获取更多材料' : '获取今日材料';
    //let that = this;
    setInterval(() => {
      //that.getInitData();
    }, 5);
  },
  methods: {
    ...mapActions(['setShareMask']),
    getInitData() {
      //alert(JSON.stringify(device));
      //if (device.wechat && !this.isMSF) {
      // let title = `消灭咸粽恶势力！甜粽战友速来支援，咸粽党不服来战！`;
      // let desc = '甜咸粽子大战已经打响，快来！！！';
      // // let shareUrl = `${window.location.origin}/festival/share?code=${
      // //   this.shareInfo.shareCode
      // // }`;
      // let shareUrl = ``;
      // bridge.setShare({
      //   title,
      //   weixin_timeline: {
      //     title,
      //     desc,
      //   },
      //   imgUrl: '',
      //   desc,
      //   url: shareUrl,
      //   link: shareUrl,
      // });
      //}
      api.dumplingDetail(
        {},
        res => {
          const { data } = res;
          if (data.type == 1) {
            console.log(data.sweet_num, 'data');
            this.zongzhiInfo = {
              wait_num: data.wait_num || 0,
              material_num: data.material_num || 0,
              zongzi_num: data.zongzi_num || 0,
              camp_type: data.camp_type,
            };
            this.progressInfo = {
              totalNum: Number(data.sweet_num) + Number(data.salty_num) || 100,
              value: data.salty_num || 0,
            };
            this.shareInfo = {
              share_code: data.share_code || '',
              share_pic: data.share_pic || '',
            };
            if (this.zongzhiInfo.wait_num === 0) {
              this.moreStatus = true;
              this.btnType = 2;
            }
          } else {
            console.log(data, 'data');
            if (!this.isMSF) {
              this.$forward('/festival/chocie', { type: 4 }, { replace: true });
            } else {
              // bridge.redirectTo({
              //   url: `${window.location.origin}/festival/chocie?type=4`,
              // });
              location.replace('/festival/chocie?type=4');
            }
          }
          if (device.wechat && !this.isMSF) {
            let title = `消灭咸粽恶势力！甜粽战友速来支援，咸粽党不服来战！`;
            let desc = '甜咸粽子大战已经打响，快来！！！';
            let shareUrl = `${window.location.origin}/festival/share?code=${this.shareInfo.shareCode}`;
            // let shareUrl = ``;
            bridge.setShare({
              title,
              weixin_timeline: {
                title,
                desc,
              },
              imgUrl: shareImg,
              desc,
              url: shareUrl,
              link: shareUrl,
            });
          }
        },
        err => {
          if (err.errno == 9330004) {
            if (!this.isMSF) {
              console.log('1111112');
              this.$forward('/festival/chocie', { type: 4 }, { replace: true });
            } else {
              // bridge.redirectTo({
              //   url: `${window.location.origin}/festival/chocie?type=4`,
              // });
              location.replace('/festival/chocie?type=4');
              //this.$forward('/festival/chocie', { type: 4 }, { replace: true });
            }
          }
        }
      );
    },
    getToadyMaterial(type) {
      console.log(type, 'type');
      switch (type) {
        case 1:
          console.log('调获取今日材料接口！');
          api.getToadyMaterial(
            {},
            res => {
              console.log(res.data);
              this.zongzhiInfo.material_num = this.zongzhiInfo.material_num + 5;
              this.moreStatus = true;
              this.btnType = 2;
              this.setInfo = {
                setType: 3,
                settingStatus: true,
                imgUrl: materialImg,
                settingText: `已成功领取今日份粽子原材料`,
                noticeText: ``,
                btnText: ['去包粽子'],
              };
            },
            err => {
              console.log(err);
            }
          );
          break;
        case 2:
          console.log('获取更多粽子材料弹窗！');
          if (this.isMSF || device.wechat) {
            this.setInfo = {
              headerTitle: '获取更多粽子材料',
              settingStatus: true,
              settingText: `可以通过以下方法获得材料：<br/><p>1. 发布带有 #甜咸粽子大战# 标签的有效笔记可以获得10份粽子原材料，笔记被精选还可以获得额外40份粽子原材料哦～<br/>2. 分享给好友，让他们来支援你</p>`,
              noticeText: `发布笔记所得的粽子原材料会在24小时内到账。`,
              btnText: ['请求好友支援', '去写美食笔记'],
            };
          } else {
            this.setInfo = {
              setType: 2,
              headerTitle: '获取更多粽子材料',
              settingStatus: true,
              settingText: `可以通过以下方法获得材料：<br/><p>1. 发布带有 #甜咸粽子大战# 标签的有效笔记可以获得10份粽子原材料，笔记被精选还可以获得额外40份粽子原材料哦～<br/>2. 分享给好友，让他们来支援你</p>`,
              noticeText: `发布笔记所得的粽子原材料会在24小时内到账。`,
              btnText: ['前往觅食蜂app获取'],
            };
          }
          break;
      }
      // api.getToadyMaterial(
      //   {},
      //   res => {
      //     this.$showToast(res.data);
      //   },
      //   err => {}
      // );
    },
    makeDumpling() {
      api.makezongzi(
        {},
        res => {
          this.activeClass = '';
          setTimeout(() => {
            this.activeClass =
              this.zongzhiInfo.camp_type == 1 ? 'active-tian' : 'active-xian';
          }, 10);
          this.popStatus = true;
          this.zongzhiInfo = {
            material_num: this.zongzhiInfo.material_num - 1,
            zongzi_num: this.zongzhiInfo.zongzi_num + 1,
          };
          this.progressInfo.totalNum = this.progressInfo.totalNum + 1;
          if (this.zongzhiInfo.camp_type == 2) {
            this.progressInfo.value = this.progressInfo.value + 1;
          }
          this.getInitData();
          setTimeout(() => {
            this.popStatus = false;
          }, 2000);
        },
        err => {
          //特殊错误码处理
          if (err.errno == 91330005) {
            if (this.isMSF || device.wechat) {
              this.setInfo = {
                headerTitle: '啊哦…材料不够了',
                settingStatus: true,
                settingText: `可以通过以下方法获得材料：<br/><p>1. 发布带有 #甜咸粽子大战# 标签的有效笔记可以获得10份粽子原材料，笔记被精选还可以获得额外40份粽子原材料哦～<br/>2. 分享给好友，让他们来支援你</p>`,
                noticeText: `发布笔记所得的粽子原材料会在24小时内到账。`,
                btnText: ['请求好友支援', '去写美食笔记'],
              };
            } else {
              this.setInfo = {
                setType: 2,
                headerTitle: '啊哦…材料不够了',
                settingStatus: true,
                settingText: `可以通过以下方法获得材料：<br/><p>1. 发布带有 #甜咸粽子大战# 标签的有效笔记可以获得10份粽子原材料，笔记被精选还可以获得额外40份粽子原材料哦～<br/>2. 分享给好友，让他们来支援你</p>`,
                noticeText: `发布笔记所得的粽子原材料会在24小时内到账。`,
                btnText: ['前往觅食蜂app获取'],
              };
            }
          }
        }
      );
    },
    goRank() {
      this.$forward('/festival/rank', { type: this.zongzhiInfo.camp_type });
    },
    goRule() {
      console.log('rule');
      this.$forward('/festival/chocie', { type: 3 });
    },
    //跳转url配置
    // generateUrl() {
    //   const { query = {} } = this.$route;
    //   const defaultDownurl =
    //     'https://sj.qq.com/myapp/detail.htm?apkName=com.doweidu.mishifeng';
    //   let downurl = '';
    //   if (device.system == 'iphone' && query.ios_url) {
    //     downurl = query.ios_url || '';
    //   } else if (device.system == 'android') {
    //     downurl = query.android_url || '';
    //   }
    //   if (!downurl) {
    //     if (device.wechat) {
    //       downurl = defaultDownurl;
    //     } else {
    //       downurl =
    //         device.system == 'iphone'
    //           ? 'https://itunes.apple.com/cn/app/id1435026988?mt=8'
    //           : defaultDownurl;
    //     }
    //   }
    //   this.downurl = downurl;
    // },
    btnForward(item) {
      console.log(item, 'item');
      if (item.index === 0 && item.type === 1) {
        this.setInfo.settingStatus = false;
        // if (!this.isMSF) {
        //   this.showStatus = true;
        // }
        !this.isMSF && this.setShareMask({ isShow: true, type: 1 });
        // alert('111', this.setShareMask({ isShow: true, type: 1 }));
        this.shareAppBottom();
      }
      if (item.index === 1 && item.type === 1) {
        if (this.isMSF) {
          this.$forward('/index');
        } else {
          console.log('index');
          this.setInfo = {
            setType: 2,
            settingStatus: true,
            imgUrl: goAppImg,
            settingText: `发笔记收集材料的方式,只开放给app端用户哦！`,
            noticeText: ``,
            btnText: ['前往觅食蜂app'],
          };
        }
        // location.replace(this.downurl);
        // this.setInfo.settingStatus = false;
      }
      if (item.index === 0 && item.type === 2) {
        this.$forward('/download');
        this.setInfo.settingStatus = false;
      }
      if (item.index === 0 && item.type === 3) {
        // api.getToadyMaterial(
        //   {},
        //   res => {
        //     console.log(res.data);
        //     this.zongzhiInfo.material_num = this.zongzhiInfo.material_num + 5;
        //     this.moreStatus = true;
        //     this.btnType = 2;
        //   },
        //   err => {
        //     console.log(err);
        //   }
        // );
        this.setInfo.settingStatus = false;
      }
    },
    btnClose() {
      this.setInfo.settingStatus = false;
    },
    closeMask() {
      console.log('close');
      this.showStatus = false;
    },
    shareAppBottom() {
      let shareUrl = `${window.location.origin}/festival/share?code=${this.shareInfo.share_code}`;
      if (!device.wechat && this.isNewVersion) {
        this.$showToast('需要更新到最新版本才能使用分享图功能！');
      }
      console.log(this.shareInfo.share_code, 'this.shareInfo.shareCode');
      const campText = this.zongzhiInfo.camp_type == 1 ? '甜粽' : '咸粽';
      const objText = this.zongzhiInfo.camp_type == 1 ? '咸粽' : '甜粽';
      const title = ` 我是坚定的${campText}党，快来支援我消灭${objText}恶势力！`;
      const desc = `甜咸粽子大战已打响，够胆你就来！`;
      if (device.msf) {
        const defaultChannel = ['weixin', 'weixin_timeline', 'image'];
        // if (this.isNewVersion) {
        //   defaultChannel.splice(2, 0, 'weibo');
        //   defaultChannel.push('image');
        // }
        // const wbDesc = `快来觅食蜂围观@${
        //   this.authorItem.name
        // } 觅食笔记，抢一元探店套餐! ${
        //   location.href
        // } （觅食蜂，美食达人聚集地 https://m.mishifeng.com/download )`;
        bridge.showShare({
          type: 0,
          title,
          weixin_timeline: {
            title: `咸粽VS甜粽！你会pick谁？获胜阵营0元吃霸王餐！`,
          },
          // weibo: {
          //   title: wbDesc,
          // },
          desc,
          link: shareUrl,
          imgUrl: this.shareInfo.share_pic,
          url: shareUrl,
          onlySelectChannel: defaultChannel,
          success(res2) {
            console.log(res2);
          },
        });
      } else {
        // let shareUrl = `${window.location.origin}/festival/share?code=${
        //   this.shareInfo.shareCode
        // }`;
        // let shareUrl = ``;
        bridge.setShare({
          title,
          weixin_timeline: {
            title,
            desc,
          },
          imgUrl: shareImg,
          desc,
          url: shareUrl,
          link: shareUrl,
        });
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.index {
  background-image :url('~assets/dumplings/index_bg.jpg');
  width:100%;
  height:100%;
  background-size:100% 100%;
  background-repeat:no-repeat;
  background-color :#e0f3ee;
}
.header{
  font-size:14px;
}
.header-text {
  font-size:16px;
  color:#293f02;
  font-weight:500;
  width:90%;
  margin:15px auto;
}
.header-txt-right {
  margin-left:15px;
}
.btn-list {
  display:flex;
  flex-direction :row;
  justify-content :space-between;
  margin-bottom:20px;
  .left-stuff {
    margin-left:15px;
    background-image :url('~assets/dumplings/today-meterial.png');
    background-size:100% 100%;
  }
  .more {
    background-image :url('~assets/dumplings/more-meterial.png');
  }
}
.left-btn {
  margin-left:20px;
  float:left;
  font-weight:500;
}
.right-btn {
  display:flex;
  flex-direction :column;
  margin-top:-42px;
  .btn-rule {
    margin-bottom:12px;
    background-image :url('~assets/dumplings/rule.png');
  }
  .rank-btn {
    background-image :url('~assets/dumplings/rank-btn.png');
  }
  .btn-item {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-size:100% auto;
    z-index:999;
  }
}
.tips {
  position:relative;
  height:42px;
  width:100%;
  margin-top:70px;
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
    left:18px;
    border:3px solid #fb3c42;
  }
  .right-tips {
    right:18px;
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
    top:-50px;
    background-size:100% 100%;
    background-repeat:no-repeat;
    line-height:32px;
    text-align:center;
    color:#fff;
    animation: timeshow 2s infinite;
  }
  .left-pop {
    left:45px;
    background-image: url('~assets/dumplings/left-pop.png');
  }
  .right-pop {
    right:45px;
    background-image: url('~assets/dumplings/right-pop.png');
  }
  @keyframes timeshow {
    0% {
      top:-42px;
      opacity :0;
    }
    50% {
      top:-50px;
      opacity :1;
    }
    100% {
      top:-58px;
      opacity :0;
    }
  }
}

.make-tips {
  width: 280px;
  height: 282px;
  margin:0 auto;
  background-position: 0 0;
  background-size: 1770px 1752px;
  background-image: url('~assets/dumplings/sprite.png');
}

.active-tian{
  animation: tian 2.5s step-end 1 forwards;
}

.active-xian{
  animation: xian 2.5s step-end 1 forwards;
}

@keyframes tian {
  0% {
  background-position: 0px 0px;
  }
  4.1% {
  background-position: -295px 0px;;
  }
  8.2% {
  background-position: 0px -292px;
  }
  12.3% {
  background-position: -295px -292px;
  }
  16.4% {
  background-position: -590px 0px;
  }
  20.5% {
  background-position: -590px -292px;
  }
  24.6% {
  background-position: 0px -584px;
  }
  30.5% {
  background-position: -295px -584px;
  }
  34.6% {
  background-position: -590px -584px;
  }
  38.2% {
  background-position: -885px 0px;
  }
  42.3% {
  background-position: -885px -292px;
  }
  46.4% {
  background-position: -885px -584px;
  }
  50.5% {
  background-position: 0px -876px;
  }
  54.6% {
  background-position: -295px -876px;
  }
  58.7% {
  background-position: -590px -876px;
  }
  62.8% {
  background-position: -885px -876px;
  }
  66.9% {
  background-position: -1180px 0px;
  }
  74% {
  background-position: -1180px -292px;
  }
  78.1% {
  background-position: -1180px -584px;
  }
  82.2% {
  background-position: -1180px -876px;
  }
  86.3% {
  background-position: 0px -1168px;
  }
  90.4% {
  background-position: -295px -1168px;
  }
  94.5% {
  background-position: -590px -1168px;
  }
  98.6% {
  background-position: -885px -1168px;
  }
  100% {
  background-position: -885px -1168px;
  }
}

@keyframes xian {
  0% {
  background-position: 0px 0px;
  }
  4.1% {
  background-position: -295px 0px;;
  }
  8.2% {
  background-position: 0px -292px;
  }
  12.3% {
  background-position: -1180px -1168px;
  }
  16.4% {
  background-position: -1475px 0px;
  }
  20.5% {
  background-position: -1475px -292px;
  }
  24.6% {
  background-position: -1475px -584px;
  }
  30.5% {
  background-position: -295px -584px;
  }
  34.6% {
  background-position: -1475px -876px;
  }
  38.2% {
  background-position: -1475px -1168px;
  }
  42.3% {
  background-position: 0px -1460px;
  }
  46.4% {
  background-position: -295px -1460px;
  }
  50.5% {
  background-position: 0px -876px;
  }
  54.6% {
  background-position: -295px -876px;
  }
  58.7% {
  background-position: -590px -876px;
  }
  62.8% {
  background-position: -885px -876px;
  }
  66.9% {
  background-position: -1180px 0px;
  }
  74% {
  background-position: -1180px -292px;
  }
  78.1% {
  background-position: -1180px -584px;
  }
  82.2% {
  background-position: -1180px -876px;
  }
  86.3% {
  background-position: 0px -1168px;
  }
  90.4% {
  background-position: -295px -1168px;
  }
  94.5% {
  background-position: -590px -1168px;
  }
  98.6% {
  background-position: -885px -1168px;
  }
  100%{
    background-position: -885px -1168px;
  }
}
// .tips-img {
//   width: 295px;
//   height: 292px;
//   margin: 0 auto;
// }
.btn-make {
  background-image :url('~assets/dumplings/make-btn.png');
  width:209.5px;
  height:67.5px;
  background-size:100% 100%;
  background-repeat:no-repeat;
  margin: -10px auto;
  position :relative;
  margin-left:24%;
  .hand {
    position:absolute;
    top:16px;
    right:-12%;
    width:76px;
    height:66px;
    animation: wave 0.5s infinite;
  }
  @keyframes wave{
    0%{
      top:16px;
    }
    50%{
      top:22px;
      width:63px
      height:55px
    }
    100%{
      top:16px;
    }
  }
}
>>>.box-text {
  font-size:14px;
  color: #222;
  line-height: 20px;
  text-align :left;
  margin-top:20px;
  p{
    color:#151515;
    font-weight:400;
    margin-top:5px;
  }
}
>>>.box-btn {
  font-size:14px;
}
>>>.progress {
  width:66%;
}
>>>.typeTitle {
  text-align:center;
  margin-top:10px;
  padding-bottom:0;
  font-size:17px;
}
>>>.vs-bg {
  background-image:url('~assets/dumplings/fight-vs.png');
  background-size:100% 100%;
  background-repeat:no-repeat;
  width:50px;
  height:37px;
  position:absolute;
  top:-120%;
  left:0;
  right:0;
  margin:0 auto;
}
>>>.img-con{
  background:#f6ffe6;
  border-radius:50%;
}
.btn-box{
  height:80px;
  width:100%;
  }
// >>>.share-shade{
//   display:block !important;
// }
</style>
