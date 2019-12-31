<template>
  <div class="page-refund">
    <div class="refund-title">
      <span class="amount">¥{{ amount | price }}</span
      >将退款到您的{{ paymentMethod }}账户内
    </div>
    <div class="select-title">请选择退款原因</div>
    <div>
      <!-- 给表单注册提交事件 .prevent 就实现了阻止表单的默认提交 -->
      <!-- v-model是同一个名称就会互斥 需要value属性 -->
      <div class="reason-box">
        <template v-for="(item, index) in refundReasons">
          <label
            :key="'label_' + index"
            class="reason"
            :class="{ selected: selectIndex === index }"
            :for="index"
            @click="chooseReason(index)"
            >{{ item.reason }} <i v-if="!(selectIndex === index)"></i>
            <Icon
              v-else
              class="choose-reason"
              type="choose-reason"
              color="#FF5B00"
            ></Icon>
          </label>
          <input
            :key="'input' + index"
            type="radio"
            style="display: none"
            v-model="formObj.reasonInfo"
            :value="item"
            :id="index"
          />
        </template>
      </div>
      <div class="refund-desc-title">退款说明</div>
      <div class="refund-desc-box">
        <textarea
          class="refund-desc"
          name="refundDesc"
          v-model="formObj.desc"
          maxlength="20"
          placeholder="请输入你要吐槽的(选填)"
        ></textarea>
      </div>
      <div
        class="submit-btn"
        :class="{ disabled: submitDisabled }"
        @click="submitData"
      >
        确认提交
      </div>
    </div>
  </div>
</template>
<script>
import Icon from '@/ui/Icon';
import api from '@/api';
// isEmptyObject方法，当对象为空时，返回为false
import { isEmptyObject } from '@/utils/base';

const payChannel = {
  1: '微信',
  2: '支付宝',
};
export default {
  name: 'refund',
  components: {
    Icon,
  },
  data() {
    return {
      amount: '',
      paymentMethod: '',
      formObj: {
        desc: '',
        reasonInfo: {},
      },
      refundReasons: [],
      payChannel,
      selectIndex: '',
      orderId: '',
    };
  },
  computed: {
    // 提交按钮是否置灰
    submitDisabled() {
      return !isEmptyObject(this.formObj.reasonInfo);
    },
  },
  created() {
    // 外部打开请传参订单ID oid
    const oid = this.$route.query.id || '';
    this.orderId = oid;
    this.initRefund(oid);
  },
  mounted() {},
  methods: {
    initRefund(id) {
      api.initrefund(
        { order_id: id },
        res => {
          const { data } = res;
          this.amount = data.amount;
          this.paymentMethod = this.payChannel[data.pay_channel_id];
          this.refundReasons = data.refund_reasons;
        },
        err => {}
      );
    },
    submitData() {
      const selectReason = this.formObj.reasonInfo;
      if (!isEmptyObject(selectReason)) return;
      api.refundapply(
        {
          order_id: this.orderId,
          refund_reason_id: selectReason.id,
          orther_reason: this.formObj.desc,
        },
        res => {
          // console.log(res);
          this.$showToast('退款申请成功');
          setTimeout(() => {
            this.$back();
          }, 1000);
        },
        err => {}
      );
    },
    chooseReason(index) {
      if (this.selectIndex === index) return;
      this.selectIndex = index;
    },
  },
};
</script>
<style lang="stylus" scoped>
.page-refund {
  background: #FFFFFF;
}
.refund-title {
  width: 100%;
  font-size: 17px;
  color: #110C00;
  padding: 14px 0 12px 15px;
  border-bottom: 1px solid rgba(0,0,0,0.12);
}
.amount {
  color: #FF5B00;
  margin-right: 5px;
}
.select-title {
  font-size: 15px;
  color: #4A4A4A;
  padding: 15px 0 10px 15px;
}
.reason-box, .refund-desc-box {
  margin: 0 10px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.12);
  border-radius: 8px;
  overflow: hidden;
}
.reason-box {
  padding: 20px 0 0 10px;
}
.reason {
  position: relative;
  display: block;
  font-size: 15px;
  color: #231815;
  margin-bottom: 20px;
  i {
    border: 1px solid #B3B3B3;
    border-radius: 1000px;
  }
  i, .choose-reason {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 50%;
    margin-top: -8px;
    right: 14px;
  }
}
.refund-desc-title {
  font-size: 15px;
  color: #4A4A4A;
  padding: 20px 0 10px 15px;
}
.refund-desc-box {
  padding: 10px;
}
.refund-desc {
  width: 100%;
  height: 50px;
  font-size: 14px;
  border: none;
  resize: none;
  outline: none;
}
.submit-btn {
  position: absolute;
  display: block;
  width: 100%;
  height: 49px;
  line-height: 49px;
  background: #FDCC02;
  left: 0;
  bottom: 0;
  border: none;
  font-size: 17px;
  color: #231815;
  text-align: center;
}
.disabled {
  background: #dddddd;
  color: #FFFFFF;
}
</style>
