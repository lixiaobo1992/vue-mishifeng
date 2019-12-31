<template>
  <div class="page-order-detail">
    <div class="line-box"></div>
    <div class="product-box" @click="goNext('goProduct')">
      <span class="product-name ellipsis">{{ productName }}</span>
      <Icon mode="custom" type="arrow-right"></Icon>
    </div>
    <div
      class="goods-box"
      :class="{ 'published-article': orderStatus == 3 && artaicleStatus == 2 }"
    >
      <div class="top-goods">
        <div class="img-box">
          <img class="product-img" :src="orderimg" alt="商品" />
        </div>
        <div class="right-desc">
          <span class="order-number">订单号：{{ order_no }}</span>
          <span class="order-address ellipsis">{{ branchName }}</span>
          <span class="order-price">
            <!-- <i class="price-text">￥{{ orderPrice | price }} </i> -->
            <i style="padding-right:10px;" v-if="orderStatus == 5">退款成功</i>
            <i style="padding-left:10px;" v-if="orderStatus == 7">退款中</i>
            <i class="note-text" v-if="orderStatus == 3">{{ noteText }}</i>
          </span>
          <div class="expired" v-if="orderStatus == 4">
            <img class="expired-img" src="~/assets/order/order_expired.png" />
          </div>
        </div>
      </div>
      <div
        class="date-status"
        :class="{ 'check-article': orderStatus == 3 && artaicleStatus == 2 }"
        v-if="dateStatus.showDateStatus"
      >
        <span>{{ dateStatus.dateStatusText }}</span>
        <a v-if="dateStatus.showBtn" @click="goNext(dateStatus.type)">{{
          dateStatus.btnText
        }}</a>
      </div>
      <div v-if="orderStatus == 2 || (orderStatus == 3 && artaicleStatus == 1)">
        <button
          class="scan"
          type="button"
          @click="goNext(operationData.btnType)"
        >
          <i v-if="operationData.isScanCode" class="scanIcon"></i
          >{{ operationData.operationBtn }}
        </button>
        <span class="remind-note">
          <i class="remind"></i>
          <p>
            {{ operationData.operationDesc }}
            <span class="store-btn" v-if="operationData.isScanCode"
              ><a class="store" @click="storeStatus">使用店码核销</a></span
            >
          </p>
        </span>
      </div>
    </div>
    <div class="line-box"></div>
    <div class="buy-notes" v-if="refundStatus == -1">
      <span class="note-title">购买须知</span>
      <NoticeText :html="tips"></NoticeText>
    </div>
    <div class="refund-detail-box" v-else>
      <div class="refund-detail-title">退款进程</div>
      <div class="refund-detail-list">
        <div
          v-for="(item, index) in refundDetailData"
          :key="index"
          class="refund-detail"
        >
          <div class="detail-title">
            <Icon
              v-if="!item.isAction"
              class="wait"
              type="wait"
              color="#DDDDDD"
            ></Icon>
            <Icon
              v-else
              class="choose-reason"
              type="choose-reason"
              color="#FF5B00"
            ></Icon>
            <p>{{ item.title }}</p>
          </div>
          <div class="detail-content">{{ item.content }}</div>
        </div>
      </div>
      <div class="custom-service">
        有疑问？<span @click="goCustomService">联系客服</span>
      </div>
    </div>
    <div class="security-code-wrap" v-if="storeShow">
      <div class="code-content">
        <i class="closeIcon" @click="closeModel()"></i>
        <span class="code-title">请输入店码使用当前订单</span>
        <label for="code" @click="inputCode()">
          <ul class="security-code-container">
            <li class="field-wrap" v-for="(item, index) in number" :key="index">
              <i class="char-field">{{ storeValue[index] || placeholder }}</i>
            </li>
          </ul>
          <p class="desc">使用前请确认已到店，且店铺可以兑换当前订单！</p>
        </label>
      </div>
      <input
        ref="input"
        class="input-code"
        @keyup="handleInput($event)"
        v-model="storeValue"
        id="code"
        name="code"
        type="tel"
        :maxlength="number"
        autocorrect="off"
        autocomplete="off"
        autocapitalize="off"
      />
    </div>
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
import Icon from '@/ui/Icon';
import NoticeText from '@/components/NoticeText';
import { formatDate } from '@/utils/base/date';
import { hashUrl } from '@/utils/urlMap';
import { mapActions } from 'vuex';
import InvitePop from '@/components/InvitePop';

export default {
  name: 'order-detail',
  components: {
    Icon,
    NoticeText,
    InvitePop,
  },
  props: {
    number: {
      type: Number,
      default: 4,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      order_no: '',
      orderId: '',
      refundDetailData: [],
      orderStatus: 3, // 1=未支付，2=待使用，3=已使用，4=已过期，5=已退款，6=已取消，7=退款中
      branchName: '', //门店名称
      orderimg: '', //商品图像
      productName: '', //商品名称
      orderPrice: '', //商品价格
      refundType: 1, //是否支持退款  1 ==>支持退款 2==>不支持退款
      refundStatus: 1, // 1=未退款，2=已经申请退款，3=申请退款审核通过，4=退款成功
      storeShow: false,
      storeValue: '', //核销码
      dateStatus: {}, // 订单时间状态
      activityId: '',
      articleId: '',
      branchId: '',
      operationData: {},
      tips: '',
      artaicleStatus: '',
      noteText: '',
      // 2.1新增核销弹层
      setInfo: {
        settingStatus: true,
        setType: 6,
        settingText: '',
        btnText: [],
        popStatus: false,
      },
      honeyRuleUrl: '', // 2.1 抵扣规则跳转链接
      honeyLimit: false, // 2.1 是否限制蜂蜜抵扣
    };
  },
  computed: {},
  created() {
    this.orderId = this.$route.query.id;
    this.getDetailData();
  },
  mounted() {
    console.log(this.orderId);
    console.log('店码==>' + this.storeValue);
  },
  methods: {
    ...mapActions(['setShareMask', 'setOrderShadeData']),
    getDetailData() {
      let oid = this.$route.query.id;
      console.log(oid);
      api.orderdetail(
        {
          order_id: oid,
        },
        res => {
          const { data } = res;
          this.orderId = data.id;
          this.order_no = data.order_no;
          this.activityId = data.activity_id;
          this.artaicleStatus = data.article_status;
          this.articleId = data.article_id;
          this.branchId = data.branch_id;
          this.orderStatus = data.status;
          this.refundStatus = data.refund_status;
          this.branchName = data.branch_name;
          this.orderimg = data.item_pic;
          this.orderno = data.item_id;
          this.productName = data.item_name;
          this.orderPrice = data.amount;
          this.dateStatus = this.dealDateStatus(data);
          this.refundDetailData = this.dealRefundDetailData(
            data.refund_process
          );
          this.operationData = this.dealOperationData(data);
          this.tips = data.tips;
          this.noteText = this.noteStatusText(data.article_status);
        },
        err => {
          this.$showToast(err.errmsg);
        }
      );
    },
    dealRefundDetailData(list = []) {
      return list.map(item => {
        return {
          isAction: !(item.process_time == 0),
          title: item.title,
          content: item.detail,
        };
      });
    },
    dealDateStatus(data) {
      const status = data.status;
      let dateStatusText = '',
        showBtn = false,
        btnText = '',
        showDateStatus = true,
        type = '';
      switch (status) {
        case 2: // 待使用
          dateStatusText = `有效期至 ${formatDate(data.expire_time, 'Y-M-D')}`;
          if (data.refund_type == 1) {
            showBtn = true;
            btnText = '申请退款';
            type = 'refund';
          }
          break;
        case 3: // 已使用
          dateStatusText = `已使用 ${formatDate(
            data.redeem_time,
            'Y-M-D H:F:S'
          )}`;
          if (data.article_status == 2) {
            showBtn = true;
            btnText = '查看笔记';
            type = 'lookArticle';
          }
          break;
        case 4: // 已过期
          dateStatusText = `已过期 ${formatDate(
            data.expire_time,
            'Y-M-D H:F:S'
          )}`;
          break;
        case 5: // 已退款
        case 7: // 退款中
        case 1: // 未支付
        case 6: // 已取消
          showDateStatus = false;
          break;
      }
      return {
        dateStatusText,
        showBtn,
        btnText,
        showDateStatus,
        type,
      };
    },
    dealOperationData(data) {
      const status = data.status;
      const articleStatus = data.article_status;
      if (!(status == 2 || (status == 3 && articleStatus == 1))) return {};
      let operationBtn = '扫码使用',
        operationDesc =
          '请认真查看购买须知，到店后扫描店内二维码使用，若扫码遇到问题，请在工作人员的帮助下',
        isScanCode = true,
        btnType = 'scanCode';
      if (status == 3) {
        operationBtn = '发布笔记轻松赢蜂蜜';
        operationDesc = '累积更多蜂蜜将为你带来更多优惠，敬请期待哦~';
        isScanCode = false;
        btnType = 'goPublish';
      }
      return {
        operationBtn,
        operationDesc,
        isScanCode,
        btnType,
      };
    },
    goNext(type) {
      switch (type) {
        case 'refund':
          this.$forward('order-refund', { id: this.orderId });
          break;
        case 'lookArticle':
          this.$forward('article', { id: this.articleId });
          break;
        case 'goProduct':
          this.$forward('product-detail', { id: this.activityId });
          break;
        case 'goPublish':
          this.$forward('publish', {
            order_id: this.orderId,
            activity_id: this.activityId,
          });
          break;
        case 'scanCode':
          if (device.wxapp) {
            this.$showToast('请前往觅食蜂app使用该功能');
            return;
          }
          this.scanCode();
          break;
        default:
          break;
      }
    },
    goCustomService() {
      this.$forward('service', {});
    },
    //二维码核销
    scanCode() {
      if (device.msf || device.wechat) {
        bridge.scanQRCode().then(
          res => {
            const { code } = res;
            const { pathname } = hashUrl(code);
            const pathArray = pathname.split('/');
            if (pathArray.length && pathArray[0] === 'mqr') {
              if (pathArray[1]) {
                this.getRedeem(2, pathArray[1]);
              }
            } else {
              this.$showToast('请您扫描正确的核销二维码');
            }
          },
          err => {
            console.log(err);
          }
        );
      } else {
        this.$showToast({
          message: '您的客户端不支持扫码核销，使用店码核销吧～',
          duration: 3000,
        });
      }
    },
    storeStatus() {
      console.log('店码核销');
      this.storeShow = true;
      this.$el.style.overflowY = 'hidden';
    },
    // 核销
    getRedeem(redeemType, redeemCode) {
      // alert(redeemType + redeemCode);
      api.redeem(
        {
          order_id: this.orderId,
          redeem_type: parseInt(redeemType),
          code: redeemCode,
        },
        res => {
          // this.$showToast('核销成功！');
          console.log(res, 'res');
          // 2.1 toast改为弹层
          const { data } = res;
          this.setInfo.settingText = data.message;
          if (data.honey_limit) {
            this.honeyRuleUrl = data.honey_rule_url; // 2.1 抵扣规则跳转链接
            this.setInfo.btnText = ['了解蜂蜜抵扣规则'];
            this.setInfo.setType = 5;
          } else {
            this.setInfo.btnText = ['知道了'];
            this.setInfo.setType = 6;
          }
          this.honeyLimit = data.honey_limit;
          this.setInfo.popStatus = true;
          this.getOrderNoticepop();
          this.getDetailData();
        },
        err => {
          this.$showToast(err.errmsg);
          return true;
        }
      );
      if (redeemType == 1) {
        this.closeModel();
      }
    },
    inputCode() {
      this.$refs.input.focus();
    },
    closeModel() {
      this.$el.style.overflowY = 'scroll';
      this.storeShow = false;
      this.storeValue = '';
    },
    hideKeyboard() {
      // 输入完成隐藏键盘
      document.activeElement.blur(); // ios隐藏键盘
      this.$refs.input.blur(); // android隐藏键盘
      console.log('输入完成');
      this.$showLoading('正在核销...');
      setTimeout(() => {
        this.getRedeem(1, this.storeValue);
      }, 1000);
    },
    handleSubmit() {
      this.$emit('input', this.storeValue);
    },
    handleInput(e) {
      this.$refs.input.value = this.storeValue;
      if (this.storeValue.length >= this.number) {
        this.hideKeyboard();
      }
      this.handleSubmit();
    },
    getOrderNoticepop() {
      api.orderNoticepop(
        {},
        res => {
          const { data } = res;
          if (data.is_pop) {
            // 显示分享遮罩
            this.setShareMask({ isShow: true, type: 4 });
            this.setOrderShadeData(data.pop_data);
            this.getOrderNoticeack();
          }
        },
        err => {}
      );
    },
    getOrderNoticeack() {
      api.orderNoticeack({}, res => {}, err => {});
    },
    // 2.1 处理订单是否发布笔记文案
    noteStatusText(note_status) {
      let noteText = '';
      switch (note_status) {
        case 1:
          noteText = '笔记待发布';
          break;
        case 2:
          noteText = '笔记审核中';
          break;
        case 4:
          noteText = '笔记未通过审核';
          break;
        default:
          noteText = '';
          break;
      }
      return noteText;
    },
    // 2.1 弹层按钮事件监听
    btnEvent(item) {
      console.log(item, 'item');
      if (this.honeyLimit) {
        if (item.type == 'clear') {
          this.setInfo.popStatus = false;
        } else {
          this.setInfo.popStatus = false;
          location.replace(this.honeyRuleUrl);
        }
      } else {
        this.setInfo.popStatus = false;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-order-detail {
  background: #fff;
}

.refund-detail-box {
  padding: 0 0 0 15px;
  background: #FFF;
  font-size: 15px;

  .refund-detail-title {
    padding: 16px 0 7px 0;
    color: #4A4A4A;
    border-bottom: 1px solid #F5F5F5;
  }

  .custom-service {
    width: 100%;
    text-align: center;
    margin-top: 123px;
    color: #999;
    font-size: 13px;
    padding-bottom: 30px;

    span {
      color: #FF5B00;
      text-decoration-line: underline;
    }
  }
}

.refund-detail {
  padding: 0 7px 0 24px;

  .detail-title {
    position: relative;
    color: #231815;
    letter-spacing: 0.3px;

    .choose-reason, .wait {
      position: absolute;
      width: 14px;
      height: 14px;
      top: 50%;
      margin-top: -7px;
      left: -24px;
    }
  }

  .detail-content {
    position: relative;
    font-size: 13px;
    color: #9B9B9B;
    letter-spacing: 0.26px;
    padding: 4px 0 19px 0;
  }

  .detail-content::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    top: 0;
    left: -17px;
    background: #DDD;
  }

  &:first-child {
    .detail-title {
      margin-top: 12px;
    }
  }

  &:last-child {
    .detail-content {
      padding-bottom: 0;

      &::before {
        width: 0;
      }
    }
  }
}

.line-box {
  background-color: #f5f5f9;
  height: 10px;
  width: 100%;
}

.product-box {
  display: flex;
  align-items: center;
  padding: 15px;
  font-size: 17px;
  border-bottom: 1px solid #F5F5F5;

  .product-name {
    flex: 1;
    font-weight: 600;
  }
}

.goods-box {
  padding: 15px;

  .top-goods {
    display: flex;
    flex-direction: row;
    background-color: #F5F5F5;
    border-radius: 4px;
    position: relative;

    .expired {
      position: absolute;
      width: 63px;
      height: 63px;
      right: 10px;
      bottom: -30px;
      .expired-img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .img-box {
      height: 70px;
      width: 70px;
      border-radius: 4px;
      overflow: hidden;
      .product-img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .right-desc {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 10px 13px 0 13px;
      width: 50%;

      span {
        text-align: left;
        font-size: 13px;
        height: 19px;
        line-height: 19px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;

        &.order-number {
          color: #4A4A4A;
        }

        &.order-address {
          font-size: 12px;
          color: #9B9B9B;
        }

        &.order-price {
          font-size: 15px;
          color: #FFBF00;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          i {
            display: inline-block;
            font-size: 13px;
          }
          .price-text{
            font-weight: bold;
            font-size: 15px;
          }
          .note-text{
            font-size: 12px;
          }
        }
      }
    }
  }
  .date-status {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #979797;
    font-size: 13px;
    padding: 14px 0 13px 0;
    border-bottom: 1px solid #F5F5F5;

    a {
      text-decoration: underline;
    }
  }
  .check-article {
    border-bottom: none;
  }
}
.published-article {
  padding-bottom: 0;
}
.buy-notes {
  margin: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #F5F5F5;

  .note-title {
    font-size: 15px;
    color: #4A4A4A;
    width: 100%;
  }
}

.scan {
  width: 100%;
  height: 44px;
  line-height: 44px;
  border-radius: 4px;
  border: none;
  background: #FDCC02;
  font-size: 17px;
  color: #231815;
  text-align: center;
  margin-top: 15px;

  .scanIcon {
    width: 18px;
    height: 16px;
    display: inline-block;
    background-image: url('~assets/order/scanning@2x.png');
    background-size: 18px 16px;
    background-repeat: no-repeat;
    margin-right: 5px;
    vertical-align: -2px;
  }
}

.remind-note {
  margin-top: 15px;
  font-size: 13px;
  color: #4A4A4A;
  letter-spacing: 0.3px;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;

  i.remind {
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('~assets/order/remind_icon@2x.png');
    background-size: 14px 14px;
    background-repeat: no-repeat;
    vertical-align: -5px;
    margin-top: 2px;
  }

  p {
    margin-left: 3px;
    max-width: 95%;
    .store-btn {
      display: inline-block;
    }
    .store {
      color: #F3CA02;
      text-decoration: underline;
    }
  }
}

.security-code-wrap {
  overflow: hidden;
  background-image: linear-gradient(-180deg, rgba(85,84,84, 0.96) 0%, rgba(32,30,30,0.96) 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  padding-top: 45px;
  .code-content{
    position: relative;
    width :100%;
    padding-top: 100px;
    .closeIcon {
      position: absolute;
      display: block;
      background-image: url('~assets/order/wrong.png');
      background-size: 24px 24px;
      background-repeat: no-repeat;
      width: 24px;
      height: 24px;
      right: 14px;
      top: 21px;
    }
    .code-title {
      font-size: 24px;
      color: #FEDB4C;
      letter-spacing: 0.2px;
      text-align: center;
      display:block;
      width:100%;
      margin-bottom :24px;
    }
    .desc {
      display :block;
      width:100%;
      font-size: 13px;
      color: #FFF;
      opacity: 0.61;
      text-align: center;
      margin-top:10px;
    }
  }
}
.security-code-container {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items :center;
  text-align :center;

  .field-wrap {
    list-style: none;
    display: block;
    width: 46px;
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    background-color: #fff;
    margin-right: 15px;
    color: #000;
    border-radius :4px;
    .char-field {
      font-style: normal;
    }
  }
}

.input-code {
  position: absolute;
  left: -9999px;
  top: -99999px;
  width: 100%;
  height: 10px;
  opacity: 0;
  overflow: visible;
  z-index: -1;
}
</style>
