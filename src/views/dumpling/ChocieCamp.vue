<template>
  <div class="choice">
    <!-- <div class="fix-header" v-if="!isMSF">
      <img
        class="icon-left"
        src="~assets/honey/left.png"
        @click="goback(pageType)"
      />
      <span class="txt-center">甜咸粽子大战</span>
    </div> -->
    <div class="btn-bg" v-show="pageType == 1">
      <img src="~assets/dumplings/choice_bg.jpg" class="share-bg" />
      <div class="btn-list">
        <div
          class="btn-type btn-type-top"
          :class="{ btnactive: btnActive }"
          @click="btnEvent(2)"
        ></div>
        <div class="btn-type btn-type-bottom" @click="btnEvent(1)"></div>
      </div>
    </div>
    <div class="fight-tips" v-show="pageType == 2">
      <!-- <span class="fight-title">战斗指引</span> -->
      <div class="fight-con">
        <img src="~assets/dumplings/fight-1.png" class="first" />
        <img src="~assets/dumplings/fight-2.png" />
        <img src="~assets/dumplings/fight-3.jpg" @click="enterBtn" />
      </div>
      <div class="enter">
        <!-- <DumplingButton
          :imgItem="{ width: 220, height: 40, bgcolor: '#6fa217' }"
          :fontItem="{ size: 18 }"
          :btnText="'进入战斗'"
          @btnEvent="enterBtn"
          class="btn-enter"
        >
        </DumplingButton> -->
      </div>
    </div>
    <div class="rule" v-show="pageType == 3">
      <span class="fight-title">规则说明</span>
      <div class="rule-con">
        <p>
          1.
          每一个觅食蜂用户（同一觅食蜂账户ID、手机终端、手机号、身份证视为同一用户）点击参与甜咸粽子活动即可自动获取制作5个粽子的原材料。
        </p>

        <p>
          2.
          用户须进入战场主页面点击“包粽子”按钮并成功包好粽子后，该粽子才计入所在阵营的总粽子数中，用户所拥有的粽子原材料数量并不会直接计入阵营粽子数量中
        </p>

        <p>
          3.用户在选定阵营后不能做阵营的更改，在此次大战中不鼓励反叛行为哦！
        </p>

        <p>
          4.
          最后的胜负由双方阵营的战士所包的粽子总数决定，截止活动结束时，粽子总数多的一方将成为本次大战的最终胜者。
        </p>

        <p>
          5.
          胜利的一方贡献值排名前10和失利的一方贡献排名前3的用户都可以获得粽子大礼包。胜利的一方排名前3的用户可以额外获得觅食蜂平台任意霸王餐一份。贡献值由用户为阵营包的粽子定。我们将短信通知获奖的用户，并且在活动结束后，公示获奖的名单，请获奖用户及时联系小蜂（mishifeng666）领取奖品。本次活动有效领奖取期间为2019年6月11日至2019年6月17日，逾期将视为您放弃活动奖励。
        </p>

        <p>6. 用户获取粽子原材料的方式有三种。</p>

        <p>
          - 在活动期间发布带有 #甜咸粽子大战#
          标签的有效笔记可以获得10个粽子原材料，笔记被精选可以额外获得40个粽子原材料。
          发布笔记所得的粽子原材料会在24小时内到账。截止至2019/06/10
          17:00前发布的活动文章相关的粽子原材料会在当天18:00前全部到账。在2019/06/10
          17:00后发布的文章会有粽子无法准时到账的情况，所以不要等到最后一刻哦～
        </p>

        <p>
          -
          分享给好友，让好友们来为你收集粽子原材料！每个好友通过你分享的页面接受你的支援请求后，你会随机获得数量不等的粽子原材料。每个好友只能为你助力一次。
        </p>

        <p>- 在活动期间用户每天可以在战场页领取到5个粽子原材料</p>

        <p>
          7.
          本次活动不允许任何作弊行为，用户通过任何不正当手段所获得的粽子都会被收回并扣除该用户为所在阵营贡献的所有粽子
        </p>

        <p>
          8.
          本活动规则中所述“粽子”，为虚拟的网络活动道具，非实物商品，无法兑换现金或实物、亦无法转让、赠与、出售等；
          本活动规则第5条所述“粽子大礼包”与“霸王餐”，为实物礼品和线下商品套餐
        </p>

        <p>
          “粽子大礼包”为五芳斋粽子礼盒（内含大肉粽*2，栗子肉粽*2，蛋黄肉粽*2，豆沙粽*2，蜜枣粽*2）
        </p>
        <P>9.活动时间为：2019/06/06 00：00 - 2019/06/10 18:00</P>
        <p>10.本活动最终解释权归觅食蜂所有</p>
      </div>
    </div>
    <div class="enter_index" v-show="pageType == 4">
      <div class="btn_enter_index" @click="goNext()"></div>
    </div>
    <DumplingConfirm
      :setType="setInfo.setType"
      :settingStatus="setInfo.settingStatus"
      :imgUrl="setInfo.imgUrl"
      :headerTitle="setInfo.headerTitle"
      :settingText="setInfo.settingText"
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
import DumplingButton from '@/components/dumpling/DumplingButton';
import DumplingConfirm from '@/components/dumpling/DumplingConfirm';
import { mapState } from 'vuex';
import DownloadNav from '@/components/DownloadNav';
import defaultAvatar from '@/assets/dumplings/selected-camp.png';
import sweetImg from '@/assets/dumplings/sweet.png';
import saltyImg from '@/assets/dumplings/salty.png';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import store from '@/store';
export default {
  name: '',
  components: {
    DumplingButton,
    DumplingConfirm,
    DownloadNav,
  },
  data() {
    return {
      isMSF: device.msf,
      btnActive: false,
      pageType: 4,
      setInfo: {
        setType: 1,
        settingStatus: false,
        headerTitle: '',
        headerText: '',
        settingText: `您已经选择过阵营啦！<br/>本次大战不支持更改阵营哦!`,
        noticeText: '',
        btnText: ['前往战场'],
      },
      campType: 0,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      logged: state => state.user.logged,
    }),
  },
  created() {
    //this.initUser();
    this.pageType = this.$route.query.type || 4;
    console.log(
      this.userInfo,
      'this.userInfo',
      this.$store.state.user.userInfo
    );
    this.initBridge();
  },
  methods: {
    initUser() {
      api.getUserCamp(
        {},
        res => {
          this.campType = res.data.camp_type;
          if (this.campType == 0) {
            console.log('1111');
            this.pageType = 1;
          } else {
            console.log('112211');
            this.$forward('festival/index');
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    btnEvent(index) {
      if (this.campType == 0) {
        let imgUrl = index === 1 ? sweetImg : saltyImg,
          campText = index === 1 ? '甜粽' : '咸粽';
        this.campType = index;
        console.log(campText, 'campText');
        this.setInfo = {
          setType: 2,
          settingStatus: true,
          headerTitle: '你选择的阵营是',
          imgUrl: imgUrl,
          settingText: '',
          noticeText: '',
          btnText: ['再想想', '确认'],
        };
        console.log('item11');
      } else {
        // let imgUrl = index === 1 ? sweetImg : saltyImg,
        //   campText = index === 1 ? '甜粽' : '咸粽';
        // this.campType = index;
        // console.log(campText, 'campText');
        // this.setInfo = {
        //   setType: 2,
        //   settingStatus: true,
        //   headerTitle: '你选择的阵营是',
        //   imgUrl: imgUrl,
        //   settingText: '',
        //   noticeText: '',
        //   btnText: ['在想想', '确认'],
        // };
        console.log('item22');
        this.setInfo = {
          setType: 1,
          settingStatus: true,
          headerTitle: '',
          imgUrl: defaultAvatar,
          settingText: `您已经选择过阵营啦！<b/>本次大战不支持更改阵营哦！`,
          noticeText: '',
          btnText: ['前往战场'],
        };
      }
    },
    enterBtn() {
      console.log('进入战斗页item');
      this.$forward('/festival/index');
    },
    btnForward(item) {
      console.log(item, 'item');
      // if (this.campType) {
      //   console.log(item, 'item');
      //   this.$forward('/festival/index');
      // }
      if (item.index == 0 && item.type == 1) {
        console.log('item1');
        this.setInfo.settingStatus = false;
      }
      if (item.index == 0 && item.type == 2) {
        //console.log('因此隐藏因此隐藏因此隐藏因此隐藏item');
        //this.setInfo.settingStatus = false;
        console.log('item2');
        this.campType = 0;
        this.pageType = 1;
        console.log(this.pageType, this.campType, 'item pageType');
        this.setInfo.settingStatus = false;
      }
      if (item.index == 1 && item.type == 2) {
        console.log('item3');
        api.choiceCamp(
          {
            camp_type: this.campType,
          },
          res => {
            this.pageType = 2;
            this.setInfo.settingStatus = false;
            // this.$forward('/festival/index');
          },
          err => {
            console.log(err);
          }
        );
      }
    },
    goNext() {
      console.log('1', this.$store.state.user.userInfo.id);
      if (this.$store.state.user.userInfo.id) {
        console.log(1, '1');
        this.initUser();
      } else {
        console.log(2, '1');
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
          this.$forward('login');
        }
      }
    },
    goback(page) {
      if (page == 1) {
        this.$forward('/comment-list', { type: 4 });
      } else {
        this.$forward('/festival/index');
      }
    },
    btnClose() {
      this.setInfo.settingStatus = false;
      this.campType = 0;
    },
    initBridge() {
      if (this.isMSF) {
        // bridge.navigateBack({
        //   success(res) {
        //     console.log(res);
        //   },
        // });
        // bridge.onBack({
        //   success(res) {
        //     bridge.navigateBack({
        //       success(res) {
        //         console.log(res, 'res');
        //       },
        //     });
        //   },
        // });
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.choice {
  background-image :url('~assets/dumplings/index_bg.png');
  width:100%;
  height:100%;
  background-size:100% 100%;
  background-repeat:no-repeat;
  background-color :#e0f3ee;
  .share-bg {
    width:100%;
    height:auto;
    position:absolute;
    top:0;
  }
}
.fix-header {
  position :fixed;
  top:0;
  height:40px;
  line-height:40px;
  z-index:999;
  width:100%;
  text-align:center;
  overflow:hidden;
  // background: linear-gradient(90deg,#fedc00 30%,#fed100);
  // background : #fff;
  .icon-left {
    color:#fff;
    position :absolute;
    left:15px;
    top:10px;
    height:20px;
    width:20px;
    line-height:50px;
  }
  .txt-center {
    font-size:17px;
    font-weight:bold;
  }
}
.enter_index {
  background-image :url('~assets/dumplings/pageEnter_bg.jpg');
  width:100%;
  height:100%;
  background-size:100% 100%;
  background-repeat:no-repeat;
  background-color :#e0f3ee;
  .btn_enter_index {
    background-image :url('~assets/dumplings/enter_btn.png');
    width:218px;
    height:67.5px;
    background-size:100% 100%;
    background-repeat:no-repeat;
    position:absolute;
    margin:0 auto;
    right:0;
    left:0;
    top:44%;
  }
}
.btn-bg {
  // background-image :url('~assets/dumplings/choice_bg.jpg');
  width:100%;
  height:100%;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
.btn-type {
  width:208px;
  height:64px;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
.btn-list {
  position:absolute;
  bottom:6%;
  left:0;
  right:0;
  margin: 0 auto;
  width:210px;
}
.btn-type-top {
  background-image :url('~assets/dumplings/choice-btn-1.png');
  margin-bottom:20px;
  &.btnactive {
    background-image :url('~assets/dumplings/choice-btn-active.png');
  }
}
.btn-type-bottom {
  background-image :url('~assets/dumplings/choice-btn-2.png');
  &.btnactive {
    background-image :url('~assets/dumplings/choice-btn-2-active.png');
  }
}
.fight-title {
  width:100%;
  height:42px;
  line-height:42px;
  text-align:center;
  font-size:21px;
  font-weight:bold;
  display:block;
}
.btn-enter {
  width:220px;
  height:40px;
  margin: 0 auto;
  position:absolute;
  bottom:6%;
  left:0;
  right:0;
}
.fight-con, .rule-con {
  margin: 0 auto;
}
.fight-con {
  width:100%;
  height:100%;
  position:absolute;
  bottom:40px;
  img {
    width:100%;
  }
}
>>>.box-text {
  text-align:left
}
>>>.box-btn {
  width:90%;
}
.rule {
  width:90%;
  margin:40px auto;
}
.fight-tips {
  margin: 40px auto;
}
p {
  font-size:14px;
  line-height:18px;
  margin-bottom:15px;
  color:#000;
}
>>>.box_btn_0 , >>>.box_btn_1 {
  font-size:14px;
  height:32px;
  line-height:32px;
}
>>>.box_btn_1 {
  margin-left:5px;
}
.first {
  margin-top:40px;
}
</style>
