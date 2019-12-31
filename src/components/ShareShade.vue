/** *.<ShareShade></ShareShade> *.showShareShade ＝ true 显示遮罩 */
<template>
  <div
    class="share-shade"
    v-show="showShareMask"
    @click="$store.dispatch('setShareMask', false)"
  >
    <div class="shade" v-if="shareMaskType == 1 || shareMaskType == 2">
      <!--默认分享-->
      <div v-if="shareMaskType === 1" class="share-block">
        <div class="shade-logo">
          <img src="~assets/profile/share_logo.png" />
        </div>
        <div class="shade-content">
          <p class="shade-title">点击右上角分享好友</p>
          <!-- <span>邀请小伙伴加入觅食蜂的大家庭吧！</span> -->
        </div>
      </div>
      <!--砍价分享-->
      <div v-if="shareMaskType === 2" class="share-block bargain-share">
        <div class="shade-content">
          <p class="shade-title">点击右上角分享好友</p>
          <span>快叫好友一起来砍价，抢一元探店套餐！</span>
        </div>
      </div>
      <img src="~assets/profile/share_arrow.png" class="shard-arrow" />
    </div>
    <!--新人登陆弹窗-->
    <div class="shade-comment new-register-box" v-if="shareMaskType == 3">
      <div
        class="register-close-box"
        @click="
          $store.dispatch('setShareMask', { isCloseBtn: true, isShow: false })
        "
      >
        <Icon class="register-close-icon" type="close-circle-o"></Icon>
      </div>
      <div class="shade-comment-top new-honry">
        <img class="top-image" src="~assets/honey/new_register.png" />
      </div>
      <div class="new-register-bottom">
        <div class="publish-notice">
          完善个人信息获取价值<span class="notice-info"
            >{{ newUserHoney / 100 }}元</span
          >新人礼包
        </div>
        <div class="publish-comment" @click="goSetting">去完善信息</div>
      </div>
    </div>
    <!-- 完善信息后的弹窗 -->
    <div class="shade-comment new-register-box" v-if="shareMaskType == 5">
      <div
        class="register-close-box"
        @click="
          $store.dispatch('setShareMask', { isCloseBtn: true, isShow: false })
        "
      >
        <Icon class="register-close-icon" type="close-circle-o"></Icon>
      </div>
      <div class="shade-comment-top new-honry">
        <img class="top-image" src="~assets/honey/new_register.png" />
      </div>
      <div class="new-register-bottom">
        <div class="publish-notice">
          恭喜您成功获取到了{{ newUserHoney }}g蜂蜜
        </div>
        <div class="publish-comment" @click="goMsfDetail">一键了解觅食蜂</div>
      </div>
    </div>
    <!--待评论订单弹窗-->
    <div class="shade-comment" v-if="shareMaskType === 4">
      <div class="shade-comment-top">
        <img
          class="top-image"
          src="https://img.mishifeng.com/FkaUIw6b3ns8m26tAUmM4ThUZLCN"
        />
        <div
          class="close-box"
          @click="
            $store.dispatch('setShareMask', { isCloseBtn: true, isShow: false })
          "
        >
          <Icon class="comment-close-icon" type="close-circle-o"></Icon>
        </div>
      </div>
      <div class="shade-comment-bottom">
        <span class="bottom-title">分享美食探店体验</span>
        <p>获取最多3000+g蜂蜜哦！</p>
        <!-- <div class="shop-info">
          <Icon class="shop-icon" type="shop"></Icon>
          <span class="ellipsis max-line-1">
            {{ orderCommentShade.item_name }}
          </span>
        </div> -->
        <div class="publish-comment" @click="goPublish">去发布觅食笔记</div>
      </div>
    </div>
    <div class="shade-hint-box" v-if="shareMaskType === 6">
      <img
        class="hint-image"
        src="https://img.mishifeng.com/FkaUIw6b3ns8m26tAUmM4ThUZLCN"
      />
      <div class="hint-cont">
        <p class="hint-title">提醒</p>
        <p class="hint-text">
          <span class="text-count">1.</span>
          <span class="text-box">你最多可用蜂蜜抵扣支付金额的比例可查看</span>
          <span class="text-btn" data-type="honey-level" @click="goNext"
            >我的等级</span
          >
        </p>
        <p class="hint-text">
          <span class="text-count">2.</span>
          <span class="text-box">你拥有的蜂蜜库存以及蜂蜜的获取方法可查看</span>
          <span class="text-btn" data-type="honey-note" @click="goNext"
            >我的蜂蜜</span
          >
        </p>
        <p class="notice-text">新用户在注册后30天内的蜂蜜抵扣比例为30%</p>
        <div
          class="hint-btn"
          @click="
            $store.dispatch('setShareMask', { isCloseBtn: true, isShow: false })
          "
        >
          我知道了
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Icon from '@/ui/Icon';
export default {
  name: 'ShareShade',
  props: {
    showShareShade: {
      type: Boolean,
      default: true,
    },
    // shareMaskType: {
    //   type: Number,
    //   default: 1,
    // },
    orderCommentShade: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Icon,
  },
  data() {
    return {
      code: '',
      newUserHoney: 0,
    };
  },
  created() {},
  mounted() {
    this.code = this.$route.query.code;
    //alert(this.code);
    // console.log(this.appConfig.honey.new_user_gift, 'this.code');
    // this.newUserHoney = this.appConfig.honey.new_user_gift;
  },
  computed: {
    ...mapState({
      showShareMask: state => state.app.showShareMask,
      shareMaskType: state => state.app.shareMaskType,
      appConfig: state => state.app.appConfig,
    }),
  },
  methods: {
    ...mapActions(['setShareMask', 'setOrderShadeData', 'setAppConfig']),
    // onClickShade() {
    //   this.$emit('onclickshade');
    // },
    goPublish() {
      // const { order_id = '', activity_id = '' } = this.orderCommentShade;
      // this.setShareMask({ isCloseBtn: true });
      // this.$forward('publish', {
      //   order_id,
      //   activity_id,
      // });
      this.setOrderShadeData({});
      this.setShareMask({ isCloseBtn: true });
      this.$forward('order', { replace: true, type: 4, index: 2 });
    },
    goSetting() {
      //console.log('setting1');
      this.$forward('setting', { type: 3 });
      this.setShareMask({ isCloseBtn: true });
    },
    goMsfDetail() {
      //跳转到觅食蜂新手引导页
      location.href =
        'https://topic.doweidu.com/?id=59d3f8342692f408e0d84c2aa3fecd76&origin=msf';
      this.setShareMask({ isCloseBtn: true });
    },
    // v2.4.0 跳转事件
    goNext(e) {
      const { type } = e.target.dataset;
      if (!type) return;
      this.setShareMask({ isCloseBtn: true, isShow: false });
      this.$forward(type);
    },
  },
};
</script>
<style lang="stylus" scoped>
.share-shade {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.5);
  color: #FDCC02;
  font-size: 12px;
  display:block;
}
.show {
  display:block;
}
.shade {
  position: relative;
  padding-top: 102px;
  .share-block{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .shade-logo {
      height: 90px;
      padding: 0 5px;
      margin-right: 11px;
      img {
        display: block;
        height: 100%;
      }
    }

    .shade-content {
      .shade-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
    }

    &.bargain-share{
      .shade-content{
        width: 250px;
        margin-right: 38px;
        .shade-title {
          text-align: center;
        }
      }
    }
  }

  .shard-arrow {
    position: absolute;
    top: 30px;
    right: 12px;
    height: 65px;
    display: block;
  }
}
.shade-comment {
  position: relative;
  padding: 150px 63px 0 62px;
  .shade-comment-top {
    position: relative;
    width: 100%;
    height: 170px;
    .top-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .close-box {
      position: absolute;
      top: 0;
      right: -18px;
      padding: 5px;
      .comment-close-icon {
        font-size: 26px;
        color: #FFF;
      }
    }
  }
  .shade-comment-bottom {
    padding: 20px 33px;
    background: #FFF;
    border-radius: 0 0 5px 5px;
    text-align: center;
    .bottom-title {
      font-size: 16px;
      color: #171900;
    }
    p {
      font-size: 14px;
      color: #151515;
      line-height: 22px;
      margin: 20px 0 30px 0;
    }
    .shop-info {
      margin: 26px 0 32px 0;
      width: 100%;
      display: flex;
      align-items: center;
      .shop-icon {
        font-size: 14px;
        min-width: 14px;
        margin-right: 2px;
      }
      span {
        font-size: 12px;
        color: #333;
      }
    }
  }
}
.new-register-box {
  position: relative;
  padding-top: 200px;
  background-color: rgba(0,0,0,0.5);
  .new-honry {
    height: 230px;
    background: #FFF;
  }
  .new-register-bottom {
    padding: 10px 0;
    background: #FFF;
  }
  .register-close-box {
    position: absolute;
    top: 136px;
    right: 45px;
    padding: 5px;
    .register-close-icon {
      font-size: 26px;
      color: #FFF;
    }
  }
  .publish-notice {
    color:#000;
    font-size:14px;
    width:100%;
    display :block;
    text-align:center;
    padding-bottom:10px;
    .notice-info {
      color:#fdcc02;
    }
  }
}
.publish-comment {
  margin: 0 auto;
  width:132px;
  height: 36px;
  font-size: 14px;
  color: #171900;
  text-align: center;
  line-height: 36px;
  background: #FDE044;
  box-shadow: 0 1px 4px 0 rgba(253,224,68,0.53);
  border-radius: 21px;
}
// 2.4.0 套餐详情 问号弹层
.shade-hint-box{
  width: 250px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  .hint-image{
    width: 100%;
    height: 150px;
  }
  .hint-cont{
    width: 100%;
    background: #fff;
    border-radius: 0 0 6px 6px;
    padding-bottom: 20px;
    .hint-title{
      font-size: 16px;
      color: #000000;
      text-align: center;
    }
    .hint-text{
      padding: 0 15px;
      font-size: 12px;
      color: #333;
      padding-top: 15px;
      .text-count{
        font-weight: bold;
        font-size: 14px;
      }
      .text-btn{
        font-size: 12px;
        margin-left: 3px;
        color: #fdcc02;
        text-decoration: underline;
      }
    }
    .notice-text{
      padding-top: 30px;
      text-align: center;
      font-size: 10px;
      color: #999;
    }
    .hint-btn{
      width: 96px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 16px;
      background: #FDE044;
      box-shadow: 0 1px 4px 0 rgba(253,224,68,0.53);
      color: #171900;
      font-size: 14px;
      margin: 0 auto;
      margin-top: 30px;
    }
  }
}
</style>
