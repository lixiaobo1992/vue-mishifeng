<template>
  <div class="page-login">
    <div class="login-tip" v-show="hidden">{{ oauthTip }}</div>
    <div v-show="!hidden">
      <div class="banner">
        <img
          class="bg"
          src="~assets/login/bg_high.png"
          alt="background-image"
        />
        <Avatar
          :src="avatar"
          :size="120"
          maskColor="transparent"
          mode="scaleToFill"
          shape="hexagon"
          @click.native="goNext"
          class="avatar"
        >
        </Avatar>
      </div>

      <div class="close" @click="$back()">
        <Icon type="close-circle-o"></Icon>
      </div>
      <div class="login-form">
        <div class="tip">{{ loginTip }}</div>
        <div class="form-box">
          <div class="form-item form-input">
            <input
              type="tel"
              v-model.trim="loginForm.mobile"
              ref="mobile"
              maxlength="11"
              class="input-text"
              :class="{ error: this.errorMobile }"
              placeholder="手机号码"
            />
          </div>
          <div class="form-item form-input">
            <div
              class="input-text slider-block"
              id="slider"
              v-show="sliderStatus"
            ></div>
            <input
              type="tel"
              v-model.trim="loginForm.code"
              ref="code"
              maxlength="6"
              class="input-text"
              :class="{ error: this.errorCode }"
              placeholder="验证码"
              v-show="!sliderStatus"
            />
            <span
              class="get-code"
              login-form
              @click="goNext('code')"
              v-show="!sliderStatus"
              >{{ countdownTip }}</span
            >
          </div>
          <div
            class="form-item form-btn flex-center disabled"
            v-if="!mobileRight"
          >
            {{ btnText }}
          </div>
          <div class="form-item form-btn flex-center" @click="goSubmit" v-else>
            {{ btnText }}
          </div>
          <p class="hint-text">
            遇到问题?
            <span class="serve-text" @click="goNext('service')">联系客服</span>
          </p>
        </div>
      </div>
      <div class="line-box">
        <span class="line-item"></span>
        <p class="line-text">使用第三方账号</p>
        <span class="line-item"></span>
      </div>
      <SocialLogin
        v-show="!isBind"
        :types="socials"
        @goOauth="goOauth"
      ></SocialLogin>
      <div class="hint-box f10">
        <!-- <i v-bind:class="{ active: loginForm.remember == 1 }"></i> -->
        登录注册即表示同意<a class="agreement" @click="goNext('privacy')"
          >服务条款</a
        >和<a class="agreement" @click="goNext('agreement')">隐私政策</a>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/ui/Icon';
import Avatar from '@/components/Avatar';
import SocialLogin from '@/components/SocialLogin';
import defaultAvatar from '@/assets/login/default-avatar.png';
import { regMobile, regMobileCode } from '@/utils/validate';
import { sleep } from '@/utils';
import { mapActions } from 'vuex';
import api from '@/api';
import device from '@/utils/device';
import oauth from '@/utils/oauth';
import { loadJs, parse } from '@dwdjs/utils';
const btnText = '立即加入';
const loginTip = '现在就加入觅食蜂的大家庭吧!';

const wechatAutoLogin = true;
const countdownTimes = 60;
let nc;
// https://github.com/egoist/vue-final-form
// https://github.com/PeakTai/vue-verify
export default {
  name: 'login',
  components: {
    Icon,
    Avatar,
    SocialLogin,
  },
  data() {
    return {
      oauthTip: '',
      hidden: true,
      loginForm: {
        mobile: '',
        code: '',
      },
      countdown: countdownTimes,
      countdownTip: '获取验证码',
      socials: [
        { type: 'wechat' },
        // { type: 'alipay' },
      ],
      avatar: defaultAvatar,
      loginTip,
      errorMobile: false,
      errorCode: false,
      // 昵称
      btnText,
      isBind: false,
      // 绑定手机号，完成注册
      sliderStatus: false, //是否显示滑块
      sliderObj: {}, //滑块验证参数
      oauth_open_id: '',
    };
  },
  computed: {
    mobileRight() {
      const { mobile, code } = this.loginForm;
      // this.checkRight();
      // return regMobile.test(mobile) && regMobileCode.test(code);
      return regMobile.test(mobile) && code;
    },
  },
  created() {
    this.hidden = true;
    if (device.wechat && wechatAutoLogin) {
      // 自动登录
      // 微信内自动跳转授权登录, 流程如下
      // needAuth(c_redirect) -> Login -> wechat -> Login(完成授权&绑定)go(-2) -> 返回(c_redirect)
      // needAuth(c_redirect) -> Login -> wechat -> Login(完成登录)go(-2) -> 返回(c_redirect)
      // this.$forward('oauth', {
      //   type: 'wechat',
      //   c_redirect: this.$route.query.c_redirect || '',
      // });
      this.getOauth();
      return;
    } else {
      // 非微信，手机登录
      // this.oauthTip = '请在微信中完成登录';
      this.hidden = false;
    }
  },
  mounted() {
    loadJs('//g.alicdn.com/sd/nch5/index.js?t=2015052012', {
      onload: () => {
        this.initSlider();
      },
    });
  },
  methods: {
    ...mapActions(['setShareMask']),
    initSlider() {
      const nc_token = [
        'FFFF000000000167FF9D',
        new Date().getTime(),
        Math.random(),
      ].join(':');
      // if (!cDetect.isHandheldDevice) {
      //   appkey = 'FFFF000000000167FF9D';
      //   scene = 'login';
      // }
      nc = window.NoCaptcha.init({
        renderTo: '#slider',
        appkey: 'FFFF000000000167FF9D',
        scene: 'register_h5',
        token: nc_token,
        initHidden: true,
        callback: data => {
          nc.reset();
          this.sliderStatus = false;
          this.sliderObj = Object.assign({
            afs_session_id: data.csessionid,
            afs_sig: data.sig,
            afs_token: nc_token,
            afs_scene: 'register_h5',
          });
          this.countdown = 60;
          this.getMobileCode();
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
    goOauth(type) {
      // if (!this.loginForm.remember) {
      //   this.$showToast('请同意服务条款和隐私政策！');
      // } else {
      let scope;
      if (device.wechat) {
        type = 'wechat';
        scope = 'snsapi_userinfo';
      }
      this.oauthTip = '跳转授权';
      const url = oauth.getOauthUrl({
        type,
        scope,
        c_redirect: this.$route.query.c_redirect || '',
        pop_code: this.$route.query.pop_code || '',
      });
      url && location.replace(url);
      //}
    },
    getOauth() {
      this.oauthTip = '获取授权';
      const codeObj = parse(location.href);
      if (!codeObj.code) {
        const { code } = this.$route.query;
        if (!code) {
          this.goOauth();
          return;
        } else {
          codeObj.code = code;
        }
      }
      this.oauthTip = '正在获取授权信息';
      let param = {
        login_type: 2,
        auth_scope: 'auth_user',
        auth_code: codeObj.code,
      };
      api.login(
        param,
        res => {
          console.log(res);
          const {
            avatar,
            nickname,
            is_register = false,
            need_bind_mobile = true,
            oauth_info = {},
          } = res.data;

          console.log(is_register);
          if (!need_bind_mobile) {
            // 完成登录，直接返回来源页面
            this.oauthTip = '完成授权登录';
            console.log(res.data);
            // delete res.data.oauth_info;
            this.$store.commit('SET_USERINFO', res.data);
            const redirect = this.$route.query.c_redirect || '';
            redirect ? this.$forward(redirect) : this.$back();
          } else {
            // 走绑定逻辑
            this.avatar = avatar || defaultAvatar;
            this.loginTip = nickname || loginTip;
            this.oauthId = oauth_info.id;
            this.oauth_open_id = oauth_info.open_id;
            this.btnText = '绑定手机号，完成注册';
            this.hidden = false;
            // this.$store.commit('SET_OAUTHID', {
            //   id: oauth_info.id,
            //   avatar,
            //   nickname,
            // });
          }
        },
        async err => {
          console.log(err);
          if (err.errno === 9610040) {
            // 授权信息有误/重复使用，重新去授权
            this.$showToast('授权信息有误，请重新授权');
            sleep(1000);
            this.goOauth();
            return true;
          }
        }
      );
    },
    checkRight() {
      const { mobile, code } = this.loginForm;
      this.errorMobile = mobile && !regMobile.test(mobile);
      this.errorCode = code && !regMobileCode.test(code);
      return this.errorMobile && this.errorCode;
    },
    checkForm(checks = ['mobile', 'code']) {
      const { mobile, code } = this.loginForm;
      this.errorMobile = false;
      if (checks.includes('mobile')) {
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
      if (checks.includes('code')) {
        if (!code) {
          this.$showToast('请输入手机校验码');
          this.errorCode = true;
          return;
        }
        if (!regMobileCode.test(code)) {
          this.$showToast('验证码格式不正确');
          this.errorCode = true;
          return;
        }
      }

      // if (!this.errorTip) e.preventDefault();

      return !this.errorMobile && !this.errorCode;
    },
    //20181123
    // checkedClick() {
    //   this.loginForm.remember = !this.loginForm.remember;
    //   console.log(this.loginForm.remember);
    // },
    goSubmit() {
      const that = this;
      // e.preventDefault();
      // 这里需要加 v2.4.0
      if (!this.checkForm()) return;
      const { mobile, code } = this.loginForm;
      const codeObj = parse(location.href);
      const loginForm = {
        login_type: 1,
        mobile,
        auth_code: code,
        oauth_open_id: this.oauth_open_id,
        remember: 1, // v2.4.0 服务端没有改接口，这个字段服务端那边有兼容，给默认1服务端会通过验证。
      };
      if (this.oauthId) {
        loginForm.oauth_id = this.oauthId;
      }
      if (codeObj.pop_code) {
        loginForm.pop_code = codeObj.pop_code;
      }
      this.$store
        .dispatch('Login', loginForm)
        .then(async res => {
          console.log(res.data);
          this.$showToast(this.oauthId ? '绑定成功' : '登录成功');
          await sleep(1500);
          // redirect
          // console.log(that);
          const { query = {} } = that.$route;
          const isRegister = (res.data && res.data.is_register) || false;
          query.c_redirect ? that.$forward(query.c_redirect) : that.$back();
          if (!device.msf && isRegister) {
            that.setShareMask({ isShow: true, type: 3 });
            console.log(device.msf && isRegister, 'status');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMobileCode() {
      const mobileObj = Object.assign(this.sliderObj, {
        mobile: this.loginForm.mobile,
        type: 1,
        platform: 'h5',
      });
      console.log(this.sliderObj, 'this.sliderObj');
      if (this.sliderObj) {
        api.mobileCode(
          mobileObj,
          res => {
            const { data } = res;
            console.log(data);
            this.$showToast('获取验证码成功');
            // commit('SET_USERINFO', data);
            // .set("userInfo", { ...state });
            // resolve(res);
          },
          err => {
            // reject(err);
          }
        );
      }
    },
    goNext(type) {
      const that = this;
      switch (type) {
        //服务条款
        case 'agreement':
          this.$forward('static', { id: 2 });
          break;
        case 'privacy':
          //隐私政策
          this.$forward('static', { id: 4 });
          break;
        case 'service':
          this.$forward('service');
          break;
        case 'code': {
          // 43秒后可重新获取
          if (this.clearId) return;
          if (!this.checkForm(['mobile'])) return;
          this.sliderStatus = true;
          that.countdownTip = `${that.countdown}s`;
          that.clearId = setInterval(() => {
            that.countdown--;
            if (that.countdown > 0) {
              that.countdownTip = `${that.countdown}s`;
            } else {
              clearInterval(that.clearId);
              that.clearId = null;
              that.countdownTip = '获取验证码';
              that.countdown = countdownTimes;
            }
          }, 1000);
          break;
        }
        default:
        // do nothing...
      }
      // this.avatar = defaultAvatar;
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~@/style/var';

$textColor = #ccc;
$yellowColor = #FDCC02;
$errorColor = #D0021B;

// (1- Math.sqrt(3)/2)/2
// $hgap = 6.69872981077807;

.page-login {
  background: #fff;

  .close {
    position: absolute;
    padding: 10px;
    top: 10px;
    right: 10px;
    font-size: 20px;
  }
}
.login-tip {
  padding: 40px 10px 10px;
  display: flex;
  justify-content: center;
}
.banner {
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 60px;

  .bg {
    height: 100%;
    margin-top: -30px;
  }
}

.avatar {
  position: absolute;
  left: 50%;
  bottom: -90px;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  // filter: drop-shadow(0 4px 4px rgba(0,0,0,.1));
}

.login-form {
  margin: 0 auto 27px;
  width: 240px;
  text-align: center;

  .tip {
    font-size: 17px;
    font-weight: bold;
    color: #231815;
  }
  .form-input {
    position: relative;
    margin: 10px 0;
    // overflow: hidden;
  }
  .input-text {
    height: 36px;
    width: 100%;
    padding: 0px 16px;
    font-size: 14px;
    // border: none;
    // color: $textColor;
    border-radius: 10px;
    border: 1px solid $textColor;
    // 解决IOS端微信浏览器input，textarea有内上边框阴影
    // box-shadow: none;
    -webkit-appearance: none;

    &::-webkit-input-placeholder {
      color: $textColor;
    }

    &:focus {
      border-color: $yellowColor;

      // + .get-code {
      //   color: inherit;
      // }
    }
    &.error {
      border-color: $errorColor;
    }
  }
  .slider-block{
    border:none;
    width:100%;
    padding:0;
    z-index:999;
    display:block;
    >>>._nc .stage1 {
      .slider, .label, .track div, .button {
        border-radius: 26px;
        height: 34px;
        line-height: 34px;
      }
      .slider {
        box-shadow: 0 0 3px #FDCC02;
        background-color: #FFF;
        width:100%;
        left:-5px;
        position:absolute;
        z-index:999;
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
  .get-code {
    position: absolute;
    right: 10px;
    top: 13px;
    font-size: 12px;
    color: $textColor;

    &.disabled {
      color: $textColor;
    }
  }

  .form-text {
    margin: 0 -30px;
    font-size: 12px;
    color: $textColor;
    i {
      width:20px;
      height:20px;
      display:inline-block;
      background-image :url('~assets/login/login_check@2x.png');
      background-size :20px 20px;
      background-repeat :no-repeat;
      vertical-align :text-bottom;
      &.active {
        background-image :url('~assets/login/login_checked@2x.png');
      }
    }
    .agreement {
      text-decoration: underline;
    }
  }

  .form-btn {
    position: relative;
    margin: 10px auto;
    height: 36px;
    background-color: $yellowColor;
    border-radius: 10px;
    color: #000;
    width: 100%;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    border: 1px solid transparent;
    font-size: 14px;

    &.disabled {
      border-color: #EAEAEA;
      background: #fff;
      color: $textColor;
      box-shadow: none;
    }

    &:active {
      top: 1px;
    }
  }
}
// 2.4.0新增
.line-box{
  width: 240px;
  height: 20px;
  line-height: 20px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .line-item{
    width: 62px;
    height: 1px;
    background: #E2E2E2;
  }
  .line-text{
    padding: 0 6px;
    font-size: 12px;
    color: #999;
  }
}


.hint-text{
  color: #333;
  font-size: 12px;
}
.serve-text{
  color: #4897CC;
  text-decoration: underline;
}
.hint-box{
  position: fixed;
  bottom: 36px;
  width: 100%;
  text-align: center;
  color: #9B9B9B;
  .agreement{
    color: #4897CC;
    text-decoration: underline;
  }
}
</style>
