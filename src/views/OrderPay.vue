<template>
  <div class="page-order-pay">
    <div class="product-box">
      <p class="product-title max-line-2">{{ order.item_name }}</p>
      <div class="product-info">
        <p class="product-price">¥{{ order.amount | price }}</p>
        <p class="product-address ellipsis">{{ order.branch_name }}</p>
      </div>
    </div>
    <div class="payway-box">
      <p class="payway-item">
        蜂蜜抵扣{{ honeyValue | price }}元
        <img src="~/assets/honey/honey_pot@2x.png" class="icon-honey" />
        <span class="icon-check" @click="honeyClick"
          ><mt-switch
            v-model="honeyStatus"
            @change="handleHoney"
            :disabled="honeyClicked"
          ></mt-switch
        ></span>
      </p>
      <p
        class="payway-item"
        v-for="(channel, index) in order.pay_channels"
        :key="index"
        @click="selectPayway(channel.id)"
      >
        {{ channel.name }} <img class="icon-pay" :src="channel.icon" />
        <span
          :class="{
            'icon-select': true,
            'icon-selected': payway == channel.id,
          }"
        ></span>
      </p>
    </div>
    <div class="notice-box">
      <p class="notice-txt" @click="showNotice">
        购买须知<i class="arrow-right"></i>
      </p>
    </div>
    <div class="tips-box">
      <div
        v-for="(item, index) in order.special_tips"
        :key="index"
        class="tips-item ellipsis"
      >
        {{ item.text }} <img class="icon-tip" :src="item.icon" />
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="btn-bottom">
      <p class="buy-tip" v-if="order.warning_text">{{ order.warning_text }}</p>
      <div class="btn-submit" @click="onSubmit">
        确认支付 ¥{{ finalAmount | price }}
      </div>
    </div>
    <!-- 购买须知 -->
    <div v-if="dialogNotice" class="dialog-notice" @click="showNotice">
      <div class="d-main" @click.stop>
        <p class="d-title">
          购买须知<i class="icon-close" @click="showNotice"></i>
        </p>
        <div class="d-container">
          <div class="d-content" v-html="order.tips"></div>
        </div>
      </div>
    </div>
    <div class="alipay-form" v-html="alipayForm"></div>
    <!-- 2.1版本新增 弹层 -->
    <InvitePop
      :settingStatus="setInfo.settingStatus"
      :setType="setInfo.setType"
      :settingText="setInfo.settingText"
      :btnText="setInfo.btnText"
      @btnEvent="btnEvent"
      v-if="setInfo.popStatus"
    ></InvitePop>
  </div>
</template>
<script>
import api from '@/api';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import { Switch } from 'mint-ui';
import InvitePop from '@/components/InvitePop';
export default {
  name: 'order-pay',
  components: {
    [Switch.name]: Switch,
    InvitePop,
  },
  data() {
    return {
      order: {},
      orderId: '',
      payway: 2,
      dialogNotice: false,
      alipayForm: '',
      honeyStatus: true,
      honeyValue: 0,
      honeyClicked: false, //是否可点击
      finalAmount: 0, //支付金额
      honeyLimit: false, // 2.1新增 是否限制了蜂蜜抵扣
      honeyMessage: '', // 2.1新增 限制了蜂蜜抵扣时候展示的提示信息
      setInfo: {
        popStatus: false, // 控制弹层显示
        settingStatus: true, // 膜层
        btnText: ['以后在说', '去完成笔记'], // 按钮文案
        setType: 4, // 类型 title
        settingText: '', // 弹层文案
      },
    };
  },
  created() {
    let activityId = this.$route.query.id;
    if (!activityId) {
      this.$showToast('缺少参数！');
      return;
    }
    this.initOrder(activityId);
  },
  methods: {
    // 2.1 新增 当有未完成的笔记 的点击事件
    honeyClick() {
      if (this.honeyLimit) {
        console.log('this.honeyLimit 是 true 给弹层');
        this.setInfo.popStatus = true;
      }
    },
    //是否抵扣蜂蜜
    handleHoney() {
      this.finalAmount = this.honeyStatus
        ? this.order.final_amount
        : this.order.amount;
      console.log(this.honeyStatus);
    },
    initOrder(activityId) {
      api.orderPayment(
        {
          activity_id: activityId,
        },
        res => {
          console.log(res);
          const { data } = res,
            that = this;
          that.order = data;
          that.orderId = data.order_id;
          if (data.honey_deduction) {
            that.honeyValue = data.honey_deduction.honey_spend;
            that.honeyStatus = data.honey_deduction.selected;
            that.honeyLimit = data.honey_deduction.honey_limit; // 2.1版本新增
            that.setInfo.settingText = data.honey_deduction.message; // 2.1版本新增
            console.log(that.setInfo.settingText, 'that.setInfo.settingText');
          }
          that.finalAmount = data.final_amount;
          if (that.honeyValue == 0) {
            that.honeyClicked = true;
            that.honeyStatus = false;
          }
        },
        err => {
          //特殊错误码处理
          if (err.errno == 91220003) {
            this.$showToast('蜂蜜余额不足, 请取消当前订单重新下单支付!');
          }
        }
      );
    },
    selectPayway(way) {
      if (this.payway == way) {
        this.payway = '';
      } else {
        this.payway = way;
      }
    },
    showNotice() {
      this.dialogNotice = !this.dialogNotice;
    },
    onSubmit() {
      // 1：微信支付，2：支付宝支付
      let payway = this.payway;
      if (payway == '') {
        this.$showToast('请选择支付方式');
      } else if (payway == 1) {
        if (device.wechat) {
          this.creatOrderPay();
        } else {
          this.$showToast('请在微信中打开支付');
        }
      } else if (payway == 2) {
        if (device.wechat) {
          this.$showToast('请点击右上角选择从浏览器中打开，并完成支付');
        } else {
          this.creatOrderPay();
        }
      }
    },
    // 创建订单并支付
    creatOrderPay() {
      let return_url = window.location.origin + '/order-result';
      this.alipayForm = '';
      const params = {
        activity_id: this.order.activity_id,
        pay_channel_id: this.payway,
      };
      if (this.orderId) {
        params.order_id = this.orderId;
      }
      if (this.payway == 2) {
        params.return_url = return_url;
      }
      if (this.honeyStatus) {
        params.honey_spend = this.honeyValue;
      }
      api.paymentApply(
        params,
        res => {
          console.log(res);
          this.honeyClicked = true;
          this.orderId = res.data.order_id;
          const that = this;
          if (params.pay_channel_id == 1) {
            let signData = decodeURIComponent(res.data.pay_sign_data);
            signData = JSON.parse(signData);
            // console.log('signData', signData);
            const query = {
              id: res.data.order_id,
              dwd_trade_no: res.data.trade_no,
              replace: true,
            };
            const payData = {
              appid: signData.appId,
              timestamp: signData.timeStamp,
              nonceStr: signData.nonceStr,
              package: signData.package,
              signType: signData.signType,
              paySign: signData.paySign,
              success: function(res) {
                that.$forward('order-result', query);
              },
              fail: function(res) {
                that.$showToast('支付失败，请重试~');
              },
              cancel: function(res) {},
              complete: function(res) {},
            };
            that.$hideLoading();
            bridge.ready(function(wx) {
              wx.chooseWXPay(payData);
            });
          } else if (params.pay_channel_id == 2) {
            // console.log(res.data.pay_sign_data);
            const str = res.data.pay_sign_data;
            const reg = /(.*?)<script[^>]*?>(.*?)<\/script>/i;
            const form = str.match(reg);
            this.alipayForm = form[1];
            this.$nextTick(() => {
              eval(form[2]);
            });
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    // 2.1 弹层点击事件监听
    btnEvent(item) {
      if (item.index == 0) {
        this.setInfo.popStatus = false;
      } else {
        this.setInfo.popStatus = false;
        this.$forward('order', { type: 4, index: 2 });
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.page-order-pay {
  position: relative;

  .product-box, .payway-box, .notice-box {
    padding: 0 15px;
    background: #fff;
    margin-bottom: 10px;
  }

  .product-box {
    padding: 15px;
  }

  .product-title {
    color: #231815;
    font-size: 17px;
    font-weight: bold;
    line-height: 24px;
  }

  .product-info {
    display: flex;
    line-height: 24px;
    margin-top: 8px;
  }

  .product-price {
    display: inline-block;
    padding-right: 10px;
    color: #FF5B00;
    font-size: 17px;
  }

  .product-address {
    flex: 1;
    color: #9B9B9B;
    font-size: 14px;
    text-align: right;
  }

  .payway-box {
    padding: 0 0 0 15px;
  }

  .payway-item {
    position: relative;
    height: 50px;
    line-height: 50px;
    padding-left: 33px;
    border-bottom: 1px solid #F5F5F5;
  }

  .payway-item:last-of-type {
    border-bottom: none;
  }

  .icon-pay {
    position: absolute;
    left: 0;
    top: 12px;
    width: 25px;
    height: auto;
  }
  .icon-honey {
    position: absolute;
    left: 0;
    top: 10px;
    width: 28px;
    height: auto;
  }
  .icon-select {
    position: absolute;
    right: 15px;
    top: 25px;
    width: 18px;
    height: 18px;
    border: 1px solid #B3B3B3;
    border-radius: 50%;
    margin-top: -9px;
  }

  .icon-selected {
    background: url('~@/assets/order/choose_pre.png') no-repeat center center;
    background-size: 100% 100%;
    border: none;
  }
  .icon-check {
    position:absolute;
    right:15px;
    top:8px;
  }
  .notice-txt {
    position: relative;
    height: 50px;
    line-height: 50px;
  }

  .arrow-right {
    display: inline-block;
    position: absolute;
    right: 3px;
    top: 25px;
    width: 10px;
    height: 10px;
    margin-top: -5px;

    &:before {
      position: absolute;
      content: '';
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-top: 1px solid #B3B3B3;
      transform: rotate(45deg);
    }

    &:after {
      position: absolute;
      content: '';
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      border-bottom: 1px solid #B3B3B3;
      transform: rotate(-45deg);
    }
  }

  .tips-box {
    padding: 10px 15px 100px;
  }

  .tips-box:after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
    zoom: 1;
  }

  .tips-item {
    position: relative;
    float: left;
    width: 33.33%;
    color: #9B9B9B;
    font-size: 13px;
    line-height: 18px;
    padding-left: 20px;
    margin-bottom: 12px;
    box-sizing: border-box;
  }

  .icon-tip {
    position: absolute;
    left: 0;
    top: 2px;
    width: 14px;
  }

  .btn-bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 500;
  }

  .buy-tip {
    color: #DF8900;
    line-height: 18px;
    text-align: center;
    font-size: 13px;
    padding: 8px;
    background: #FFFAE5;
  }

  .btn-submit {
    color: #fff;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    background: #FF5B00;
  }

  .dialog-notice {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .d-main {
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 8.8%;
    top: 25%;
    width: 82.4%;
    height: 50%;
    background: #fff;
    border-radius: 8px;
    padding: 10px 10px 25px 15px;
    box-sizing: border-box;
  }

  .d-title {
    position: relative;
    text-align: center;
    font-size: 17px;
    font-weight: bold;
    line-height: 24px;
    margin-bottom: 15px;
  }

  .icon-close {
    position: absolute;
    right: -5px;
    top: 0;
    width: 28px;
    height: 100%;
    background: url('~@/assets/order/close.png') no-repeat center center;
    background-size: 18px auto;
  }

  .d-container {
    flex: 1;
    font-size: 13px;
    line-height: 24px;
    text-align: justify;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .d-container::-webkit-scrollbar {
    width: 3px;
    background-color: unset;
  }

  /* 定义滚动条轨道 内阴影+圆角 */
  .d-container::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    display: unset;
  }

  /* 定义滑块 内阴影+圆角 */
  .d-container::-webkit-scrollbar-thumb {
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
    background-color: rgba(193, 193, 193, 0.3);
    display: unset;
  }

  .d-content {
    padding-right: 5px;

    >>> ul, >>> ol {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  }

  .alipay-form {
    position: absolute;
    left: -1000px;
    bottom: -1000px;
    visibility: hidden;
  }
}
.icon-check >>> .mint-switch-core {
  width:43.3px;
  height:26px;
  border:none;
}
.icon-check >>> .mint-switch-core::after {
  height:24px;
  width:26px;
  background-color:#999;
  border-color:#999;
}
.icon-check >>> .mint-switch-core::before {
  height:24px;
  width:26px;
  background-color:#999;
  border-color:#999;
}
.icon-check >>> .mint-switch-input:checked + .mint-switch-core {
  background-color:#FFF3B5;
  border-color:#FFF3B5;
}
.icon-check >>> .mint-switch-input:checked + .mint-switch-core::after{
  background-color:#FDCC02;
  border-color:#FDCC02;
}
.icon-check >>> .mint-switch-input:checked + .mint-switch-core::before{
  background-color:#FDCC02;
  border-color:#FDCC02;
}
</style>
