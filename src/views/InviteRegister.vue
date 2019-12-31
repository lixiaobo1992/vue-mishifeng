<template>
  <div class="page-invite-register" :style="{ backgroundColor: bgColor }">
    <div class="invite-top">
      <div class="top-bg"><img class="bg-img" :src="topBg" /></div>
    </div>
    <div class="invite-bottom">
      <div class="invite-content">
        <!-- 此处使用v-if会出bug，slider会出现在其它兄弟组件中，因此使用v-show -->
        <div class="register-box" v-show="pageType == 1">
          <div class="slider-box" id="slider" v-show="showSlider"></div>
          <div class="form-input" :class="{ error: this.errorMobile }">
            <Icon type="mobile" class="mobile-icon"></Icon>
            <i class="line"></i>
            <input
              type="tel"
              ref="mobile"
              v-model.trim="formMsg.mobile"
              maxlength="11"
              class="input-text"
              placeholder="请输入手机号"
            />
          </div>
          <div class="form-input code" :class="{ error: this.errorCode }">
            <Icon type="code" class="code-icon"></Icon>
            <i class="line"></i>
            <input
              type="tel"
              ref="code"
              v-model.trim="formMsg.authCode"
              maxlength="6"
              class="input-text"
              placeholder="请输入验证码"
            />
            <span
              :class="{ 'count-down': this.isGotCode }"
              @click="clickCodeBtn"
              >{{ countDownTip }}</span
            >
          </div>
          <div class="receive" @click="register">一键领取</div>
        </div>
        <div class="receive-box" v-if="pageType == 2">
          <div class="gift-image"><img :src="gift" /></div>
          <span class="success-desc">成功获得2000g蜂蜜奖励</span>
          <div class="receive downLoadApp" @click="downLoadApp">
            立即打开觅食蜂
          </div>
        </div>
        <div class="share-box" v-if="pageType == 3">
          <div class="share-img"><img class="share-bg" :src="shareBg" /></div>
          <span class="inviteNum"
            >今日已邀请好友(<i class="num">{{ inviteInfo.invited_count }}</i
            >/{{ inviteInfo.max_inv_count }})</span
          >
          <div class="share-content">
            <div
              class="item"
              v-for="(item, index) in shareList"
              :key="index"
              @click="goShare(index)"
              :class="{
                item2: shareList.length == 3 && index == 1,
                'normal-item': shareList.length == 2,
              }"
            >
              <div><Icon class="share-icon" :type="item.iconName"></Icon></div>
              <span class="item-desc">{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="invite-rules">
        <div
          class="rules-title"
          :style="{
            'background-image': 'url(' + rulesTitleBg + ')',
            'background-repeat': 'round',
          }"
        >
          规则说明
        </div>
        <ul>
          <li v-for="(item, index) in rules" :key="index">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api';
import { regMobile, regMobileCode } from '@/utils/validate';
import { loadJs } from '@dwdjs/utils';
import { mapActions } from 'vuex';
import Icon from '@/ui/Icon';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import wechat from '@/utils/bridge/wechat';

const countDownTimes = 60;
let nc;
export default {
  name: 'invite-register',
  components: {
    Icon,
  },
  data() {
    return {
      isMSF: device.msf,
      pageType: 1, // 1.注册页面 2.领取成功 3.分享页
      errorMobile: false,
      errorCode: false,
      formMsg: {
        mobile: '',
        authCode: '',
      },
      topBg: '',
      bgColor: '',
      shareBg: '',
      rulesTitleBg: '',
      rules: [],
      gift: '',
      countDownTip: '获取验证码',
      isGotCode: false, // 是否已获取过验证码
      countDown: countDownTimes,
      showSlider: false, // 显示滑块
      shareCode: '', // 分享码
      shareList: [
        {
          iconName: 'share-wechat',
          desc: '微信邀请',
        },
        {
          iconName: 'weibo',
          desc: '微博邀请',
        },
      ],
      userName: '',
      wechatShareImg: '',
      weiboShareImg: '',
      inviteInfo: {
        invited_count: 0,
        max_inv_count: 10,
      },
    };
  },
  created() {
    const that = this;
    if (this.isMSF && this.$version.lte('1.3.1')) {
      this.shareList.pop();
    }
    const pageQuery = this.$route.query || {};
    this.pageType = pageQuery.pageType || 1;
    this.shareCode = window.decodeURIComponent(pageQuery.shareCode || '');
    this.userName = window.decodeURIComponent(pageQuery.userName || '');
    if (this.pageType == 1) {
      loadJs('//g.alicdn.com/sd/nch5/index.js?t=2015052012', {
        onload: () => {
          that.initSlider();
        },
      });
    }
    this.inviteInitData();
  },
  methods: {
    ...mapActions(['setShareMask']),
    inviteInitData() {
      api.inviteInitData(
        {},
        res => {
          const { data } = res;
          this.topBg = data.pg_head;
          this.bgColor = data.bg_color;
          this.rules = data.rules;
          this.shareBg = data.share;
          this.rulesTitleBg = data.rectangle;
          this.gift = data.gift;
          this.inviteInfo = {
            invited_count: data.invited_count,
            max_inv_count: data.max_inv_count,
          };
          this.wechatShareImg = data.share_wx;
          this.weiboShareImg = data.share_wb;
          if (device.wechat && !this.isMSF) {
            let specialDesc = `你的好友@${this.userName} 求你帮Ta点一下，领20元探店福利一起吃大餐！`;
            let shareUrl = `${window.location.origin}/invite-register?pageType=1&shareCode=${this.shareCode}`;
            bridge.setShare({
              title: `就差你啦！${this.userName} 喊你帮Ta点一下，领20元一起探店吃大餐吧！`,
              weixin_timeline: {
                title: specialDesc,
                desc: specialDesc,
              },
              imgUrl: this.wechatShareImg,
              desc: '快来和我一起加入觅食蜂，领20元探店福利一起享美味！',
              url: shareUrl,
              link: shareUrl,
            });
          }
        },
        err => {}
      );
    },
    checkForm(check = ['mobile', 'authCode']) {
      const { mobile, authCode } = this.formMsg;
      this.errorMobile = false;
      if (check.includes('mobile')) {
        if (!mobile) {
          this.$showToast('请输入手机号');
          this.errorMobile = true;
          return;
        }
        if (!regMobile.test(mobile)) {
          this.$showToast('手机号格式不正确');
          this.errorMobile = true;
          return;
        }
      }
      this.errorCode = false;
      if (check.includes('authCode')) {
        if (!regMobileCode.test(authCode)) {
          this.$showToast('请输入正确的验证码');
          this.errorCode = true;
          return;
        }
      }
      return !this.errorMobile && !this.errorCode;
    },
    register() {
      if (!this.checkForm()) return;
      api.receiveBoon(
        {
          invite_code: this.shareCode,
          auth_code: this.formMsg.authCode,
          mobile: this.formMsg.mobile,
        },
        res => {
          this.showSlider = false;
          nc.hide();
          this.pageType = 2;
        },
        err => {}
      );
    },
    clickCodeBtn() {
      if (!this.checkForm(['mobile']) || this.intervalId) return;
      this.showSlider = true;
      nc.show();
    },
    getCode(obj) {
      const that = this;
      if (this.intervalId) return;
      this.isGotCode = true;
      this.countDownTip = `${this.countDown}s`;
      this.intervalId = setInterval(() => {
        that.countDown--;
        if (that.countDown > 0) {
          that.countDownTip = `${that.countDown}s`;
        } else {
          clearInterval(that.intervalId);
          that.intervalId = null;
          that.countDownTip = '重新发送验证码';
          that.countDown = countDownTimes;
        }
      }, 1000);
      api.mobileCode(
        {
          mobile: this.formMsg.mobile,
          type: 5,
          platform: 'h5',
          afs_session_id: obj.sessionId,
          afs_token: obj.nc_token,
          afs_sig: obj.sig,
          afs_scene: obj.scene,
        },
        res => {
          console.log(res);
        },
        err => {}
      );
    },
    initSlider() {
      // console.log('aaBBdfqfe');
      const nc_token = [
        'FFFF000000000167FF9D',
        new Date().getTime(),
        Math.random(),
      ].join(':');
      nc = window.NoCaptcha.init({
        renderTo: '#slider',
        appkey: 'FFFF000000000167FF9D',
        scene: 'register_h5',
        token: nc_token,
        initHidden: true,
        callback: data => {
          nc.reset();
          this.showSlider = false;
          this.getCode({
            nc_token,
            scene: 'register_h5',
            sessionId: data.csessionid,
            sig: data.sig,
          });
        },
        error: s => {},
      });
      window.NoCaptcha.setEnabled(true);
      nc.reset(); //请务必确保这里调用一次reset()方法
      window.NoCaptcha.upLang('cn', {
        LOADING: '加载中...', //加载
        SLIDER_LABEL: '请向右滑动验证', //等待滑动
        CHECK_Y: '验证通过', //通过
      });
    },
    getShareInfo() {
      return {
        url: `${window.location.origin}/invite-register?pageType=1&shareCode=${this.shareCode}`,
        link: `${window.location.origin}/invite-register?pageType=1&shareCode=${this.shareCode}`,
        title: `就差你啦！${this.userName} 喊你帮Ta点一下，领20元一起探店吃大餐吧！`,
        desc: '快来和我一起加入觅食蜂，领20元探店福利一起享美味！',
      };
    },
    goShare(index) {
      let wakeup = '';
      let specialDesc = '';
      let imgUrl = this.wechatShareImg;
      switch (index) {
        case 0:
          wakeup = 'weixin';
          if (device.wxapp) {
            let shareUrl = `${window.location.origin}/invite-register?pageType=1&shareCode=${this.shareCode}`;
            const shareData = {
              desc: 'test',
              title: '在吗？邀你领取20元美食红包，点开一起遨游美食世界！',
              imgUrl: imgUrl,
              link: shareUrl,
            };
            window.wx.miniProgram.postMessage({ data: shareData });
          }
          break;
        case 1:
          wakeup = 'weibo';
          specialDesc = `#觅食蜂探店#就差你啦！你的好友@${this.userName} 求你帮Ta点一下，领20元探店福利一起吃大餐吧！${window.location.origin}/invite-register?pageType=1&shareCode=${this.shareCode}（下载@觅食蜂 ，抢1折起探店套餐！https://m.mishifeng.com/download）`;
          imgUrl = this.weiboShareImg;
          break;
      }
      const options = Object.assign(this.getShareInfo(), {
        imgUrl,
        wakeup,
        weixin_timeline: {
          title: specialDesc,
          desc: specialDesc,
        },
        weibo: {
          title: specialDesc,
          desc: specialDesc,
        },
        weixin: {
          title: specialDesc,
          desc: specialDesc,
          isMini: true,
          pagePath:
            'pages/web-view/web-view?jumplink=' +
            encodeURIComponent(
              `${window.location.origin}/invite-register?pageType=1&shareCode=${this.shareCode}`
            ),
          userName: 'gh_f711793d5963',
        },
        onlySelectChannel: ['weixin', 'weixin_timeline'],
      });
      if (this.isMSF) {
        bridge.showShare(options);
      } else {
        // 显示分享提示
        this.setShareMask({ isShow: true });
        wechat.setShare(options);
      }
    },
    downLoadApp() {
      if (device.system == 'iphone') {
        location.href = 'https://itunes.apple.com/cn/app/id1435026988?mt=8';
      } else if (device.system == 'android') {
        location.href =
          'https://sj.qq.com/myapp/detail.htm?apkName=com.doweidu.mishifeng';
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.page-invite-register {
  position: relative;
  height: 100%;
}
.invite-top {
  position: relative;
  padding-top: 73.3%;
  .top-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .bg-img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
.invite-bottom {
  position: relative;
  padding: 0 20px;
}
.invite-content {
  margin-top: -35px;
  padding: 0 40px;
}
.invite-content, .invite-rules {
  position: relative;
  width: 100%;
  background: #FFF;
  border-radius: 60px 60px 10px 10px;
  box-shadow: 0 -3px 18px rgba(255,132,36,0.61);
}
.register-box {
  position: relative;
  width: 100%;
  padding: 32px 0 25px 0;
  .code {
    margin-top: 18px;
    span {
      display: inline-block;
      padding: 0 13px;
      font-size: 12px;
      align-self: center;
      text-decoration-line: underline;
      color: rgb(45,142,255);
    }
    .count-down {
      color: #ffd75f;
      text-decoration-line: none;
    }
  }
  .form-input {
    display: flex;
    align-items: center;
    height: 33px;
    border-radius: 33px;
    overflow: hidden;
    border: 1px solid #FDCC02;
    .mobile-icon, .code-icon {
      font-size: 24px;
      margin-left: 13px;
    }
    .line {
      width: 1px;
      height: 17px;
      background: #FDCC02;
      margin: 0 5px 0 10px;
    }
    input {
      flex: 1;
      width: 100%;
      height: 100%;
      border: none;
      font-size: 12px;
      &::-webkit-input-placeholder {
        color: #FDCC02;
      }
    }
  }
  .error {
    border-color: #D0021B;
  }
  .slider-box {
    position: absolute;
    height: 100px;
    top: 42%;
    left: -18px;
    right: -18px;
    z-index: 1000;
    >>>._nc .stage1 {
      .slider, .label, .track div, .button {
        border-radius: 26px;
        height: 34px;
        line-height: 34px;
      }
      .slider {
        box-shadow: 0 0 3px #FDCC02;
        background-color: #FFF;
        .label {
          font-size: 12px;
        }
      }
      .track div {
        color: #fff;
      }
      .bg-green {
        background-color: #78c430;
      }
      .bg-red {
        background-color: #ff5500;
      }
      .button, {
        width: 34px;
        background: rgb(255,197,16);
      }
      .icon {
        left: 8px;
        right: 8px;
        top: 8px;
        bottom: 8px;
        font-size: 18px;
        width: 0;
        height: 0;
        padding: 0;
        margin: 0;
        color: #FFF;
      }
    }
  }
}
.receive {
  margin: 23px 1px 0 1px;
  height: 33px;
  line-height: 36px;
  font-size: 16px;
  color: #FFF;
  text-align: center;
  background-image: linear-gradient(90deg, rgb(255,200,15) 0%, rgb(255,132,36) 100%);
  border-radius: 33px;
  box-shadow: 0 3px 6px rgba(255,122,33,0.61);
}
.receive-box {
  padding-bottom: 16px;
  .gift-image {
    padding: 16px 50px 13px 50px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .success-desc {
    display: block;
    text-align: center;
    font-size: 15px;
  }
  .downLoadApp {
    margin-top: 15px;
  }
}
.share-box {
  padding-bottom: 28px;
  .share-img {
    padding: 12px 0 0;
    margin: 0 32px 0 12px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .inviteNum {
    width:100%;
    font-size:16px;
    text-align:center;
    display:block;
    font-weight:bold;
    height:24px;
    line-height :24px;
    margin-bottom:10px;
    color:#666;
    .num {
      color:#FF9900;
      padding-left:5px;
    }
  }
  .share-content {
    display: flex;
    align-items: center;
    .item2 {
      flex: 1;
    }
    .normal-item {
      flex: 1;
    }
    .item {
      text-align: center;
      .share-icon {
        font-size: 50px;
        margin-bottom: 10px;
      }
      .item-desc {
        font-size: 12px;
        font-weight: 500;
        color: #333;
        letter-spacing: 0.32PX;
      }
    }
  }
}
.invite-rules {
  margin: 44px 0 25px 0;
  border-radius: 10px;
  padding: 36px 18px 2px 18px;
  .rules-title {
    position: absolute;
    top: -17px;
    height: 37px;
    width: 70%;
    left: 50%;
    margin-left: -35%;
    color: #FFF;
    font-size: 20px;
    text-align: center;
    line-height: 37px;
    letter-spacing: 1px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      margin-bottom: 13px;
      font-size: 12px;
      color: rgb(255,157,1);
      text-align: left;
      line-height: 16px;
    }
  }
}
</style>
