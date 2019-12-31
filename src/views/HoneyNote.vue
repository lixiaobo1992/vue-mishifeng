<template>
  <div class="honey-page" :class="{ honey: !isMSF, isphone: iphone && isMSF }">
    <div class="fix-header" :style="headerStyle" v-if="!isMSF">
      <img class="icon-left" src="~assets/honey/left.png" @click="goback" />
      <span class="txt-center">我的蜂蜜</span>
    </div>
    <div class="header">
      <div class="text">
        <span class="curtxt">当前蜂蜜</span>
        <span class="round" @click="goDetail">蜂蜜明细</span>
      </div>
      <div class="honeyweight">
        <img src="~assets/honey/flower@2x.png" />
        <span class="weight" v-show="honeyData >= 0">
          {{ honeyData }}g <i>=</i> {{ honeyMoney }}元
        </span>
        <span class="weight" v-show="honeyData < 0">{{ honeyData }}g </span>
      </div>
      <span class="honeyreason"> 如何获取蜂蜜</span>
    </div>
    <span class="note">发布笔记</span>
    <ul class="items">
      <li>
        <span>1.发布第一篇觅食笔记</span><span class="right-active">+300g</span>
      </li>
      <li>
        <span>2.发布更多觅食笔记(每日前5篇) </span
        ><span class="right-active">+200g/篇</span>
      </li>
      <li>
        <span>3.店铺首篇觅食笔记额外奖励</span
        ><span class="right-active">+100g/篇</span>
      </li>
      <li>
        <span @click="goKonw"
          >4.优质文章额外奖励<img
            src="~assets/honey/extra-notice.png"
            class="notice-icon"
          /> </span
        ><span class="right-active">+1000～3000g/篇</span>
      </li>
    </ul>
    <!-- <div class="btn-know" @click="goKonw">一键了解优质文章奖励体系</div> -->
    <div class="icontxt">
      <span><img src="~assets/honey/heart.png" />点赞</span>
      <span><img src="~assets/honey/message.png" />评论</span>
      <span><img src="~assets/honey/star.png" />收藏</span>
    </div>
    <span class="limitday">每天最多获得100g</span>
    <span class="note"><img src="~assets/honey/accomplish.png" />连续签到</span>
    <span class="limitday">连续签到天数即为获得蜂蜜数，最多每天获得7g</span>
    <div class="line"></div>
    <div class="notetxt">
      <span class="title">什么是蜂蜜？</span>
      <p>
        1.
        蜂蜜是觅食蜂APP达人激励体系中的一种社区福利，可在下单时用于减免支付金额，蜂蜜不兑余额、不找零；
      </p>
      <p>
        2.
        蜂蜜使用的有效期限：自成功获得蜂蜜之日起一年（按照365个自然日计算），已成功获得的蜂蜜如未在一年有效期内使用的，则将清零；（注：为保障您已拥有的蜂蜜权益，您在2019年4月18日之前已成功获得的蜂蜜可继续使用）；
      </p>
      <p>
        3.
        当您下单使用蜂蜜进行支付金额减免时，将自动按照您获得蜂蜜的时间先后顺序，优先使用获得时间在先的蜂蜜进行支付金额的减免；
      </p>
      <p>
        4.
        如用户获取或使用蜂蜜的行为违反《觅食蜂用户注册协议》、《觅食蜂社区规范》或存在其他违规操作的，相应的蜂蜜将被收回并清空；
      </p>
      <p>
        5.
        如用户存在刷蜂蜜行为（包括但不限于异常邀请好友、虚假交易、恶意退款、套现等），我们有权取消您获得蜂蜜的资格，对于严重违规刷蜂蜜的账户，将采取包括但不限于暂时或永久封号等措施；
      </p>
      <p>
        6. 蜂蜜的具体获取方法和使用规则详见相关具体页面的解释和说明；
      </p>
      <p>
        7. 觅食蜂对蜂蜜的获取方法和使用规则拥有最终的解释权。
      </p>
    </div>
  </div>
</template>
<script>
import api from '@/api';
import { on, off } from '@/utils/event';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import scroll from '@/utils/scroll';
export default {
  data() {
    return {
      honeyData: 0,
      honeyMoney: 0,
      headerStyle: {
        backgroundColor: 'rgba(255,255,255,0)',
      },
      isMSF: device.msf,
      iphone: device.iphone,
    };
  },
  created() {
    //this.isMSF && this.initBridge();
  },
  mounted() {
    this.getHoneyData();
    this.isMSF && this.initBridge();
    this.$nextTick(() => {
      // 悬浮导航
      if (!this.isMSF) {
        on(this.$el, 'scroll', e => {
          const scrollTop = scroll.getScrollTop(this.$el);
          const opacity = scrollTop / 150;
          if (opacity <= 1.5) {
            let style = {
              backgroundColor: `rgba(254,220,0,${opacity})`,
            };
            if (opacity >= 1.4) {
              style.boxShadow = `0px 2PX 4PX rgba(0, 0, 0, ${opacity / 10})`;
            }
            this.headerStyle = style;
          }
        });
      }
    });
  },
  beforeDestroy() {
    //...
    off(this.$el, 'scroll', () => {});
  },
  methods: {
    getHoneyData() {
      api.gethoney(
        {},
        res => {
          let data = res.data;
          this.honeyData = data.honey;
          this.honeyMoney = (data.money / 100).toFixed(2);
        },
        err => {}
      );
    },
    goback() {
      this.$back();
    },
    goDetail() {
      this.$forward('honey-detail');
    },
    goKonw() {
      console.log('跳转了解奖励体系！');
      this.$forward(
        'https://topic.doweidu.com/?id=bf4c471df9a32f714c18d02f36d886a6&origin=msf',
        { replace: true }
      );
    },
    initBridge() {
      bridge.setNavigationBar({
        title: '我的蜂蜜',
        color: '#171900',
        backgroundColor: ['#FEDC00', '#FED100'],
        success(res) {
          console.log(res);
        },
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.honey {
  top:-5px;
  padding-top:44px;
}
.honey-page {
  width:100%;
  overflow-y:scoll;
  position :relative;
}
.line {
  height:5px;
  background :#f1f1f5;
  margin-top:20px;
}
.header {
  width:100%;
  height:200px;;
  background: url("~assets/honey/bg@2x.png") no-repeat center center;
  background-size:100% 100%;
  .text {
    display :flex;
    flex-direction :row;
    justify-content :space-between;
    padding-top:10px
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
  background: linear-gradient(90deg,#fedc00 30%,#fed100);
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
  }
}
span {
  font-size:12px;
  color:#333;
  height:30px;
  line-height:30px;
  text-align :center;
  &.right-active {
    color:#FFBF00;
  }
  &.curtxt {
    margin-left:30px;
    color:#fff;
  }
  &.round {
    width:80px;
    background :#fff;
    color:#FFBF00;
    font-size:14px;
    border-top-left-radius :15px;
    border-bottom-left-radius :15px;
    padding-left:5px;
  }
  &.weight {
    font-size: 28px;
    color: #231815;
    margin-left:7px;
    font-weight :bold;
    i {
      color:#fff;
      font-weight:bold;
    }
  }
  &.honeyreason {
    color:#fff;
    font-size:14px;
    width:100%;
    display :block;
    margin-top:10px;
  }
  &.note {
    color:#231815;
    font-size:16px;
    width:100%;
    display :block;
    margin-top:15px;
    font-weight :bold;
    img {
      height:24px;
      width:24px;
      vertical-align :text-bottom;
    }
  }
  &.limitday {
    font-size:14px;
    width:100%;
    display :block;
    margin-top:5px;
  }
}
.honeyweight {
  text-align:center;
  vertical-align :middle;
  margin-top:10px;
  img{
    width:40px;
    height:40px;
  }
}
.items {
  padding:0;
  li {
    display:flex;
    flex-direction :row;
    justify-content :space-between;
    padding:5px 0;
    margin:0 15px;
    border-bottom :1px solid #e3e3e3;
  }
}
.btn-know {
  min-width:60%;
  font-size:14px;
  padding:8px 14px;
  margin:0 auto;
  text-align:center;
  background:#f00;
  width:40%;
  border-radius:5px;
  color:#fff;
}
.icontxt {
  display:flex;
  flex-direction :row;
  justify-content :center;
  margin-top:20px;
  span {
    width:20%;
    text-align :center;
    font-size :14px;
    img {
      height:20px;
      line-height :20px;
      vertical-align :text-bottom;
    }
  }
}
.notetxt {
  padding:15px;
  .title {
    font-size: 14px;
    color: #171900;
    font-weight:bold;
  }
  p {
    font-size:12px;
    line-height:20px;
    display :block;
    color:#333;
  }
}
img.notice-icon {
  width:27px;
  height:24px;
  margin-top:-4px;
}
@media screen and (max-width: 321px) {
  .header {
    top:5px;
  }
}
@media screen and (min-width: 361px) and (max-width: 380px) {
  .isphone {
    padding-top:-44px;
  }
}
</style>
