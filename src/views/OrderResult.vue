<template>
  <div class="page-order-result">
    <div class="img-box">
      <img class="image" src="~@/assets/order/result_success.png" />
    </div>
    <p class="txt1">订单支付成功！</p>
    <p class="txt2" v-if="!honey_limit">
      本次下单为您节省<span class="price">{{ order.saved_amount | price }}</span
      >元~
    </p>
    <p class="txt2" v-if="honey_limit">
      完成所有探店笔记就可以解锁蜂蜜抵扣功能
    </p>
    <div class="btn-box">
      <span
        class="btn"
        @click="$forward('order-detail', { id: order.order_id })"
        >查看订单</span
      >
      <span
        class="btn btn-right"
        @click="$forward('order', { replace: true, type: 4, index: 2 })"
        >去完成笔记</span
      >
    </div>
  </div>
</template>
<script>
import api from '@/api';

export default {
  name: 'order-result',
  data() {
    return {
      order: {
        order_id: 0,
        amount: 0,
        market_price: 0,
        saved_amount: 0,
        honey_limit: false,
      },
    };
  },
  created() {
    const orderId = this.$route.query.id;
    const tradeNo = this.$route.query.dwd_trade_no;
    if (!orderId || !tradeNo) {
      this.$showToast('缺少参数！');
      return;
    }
    this.getOrderResult(orderId, tradeNo);
  },
  methods: {
    getOrderResult(orderId, tradeNo) {
      api.paymentResult(
        {
          order_id: orderId,
          trade_no: tradeNo,
        },
        res => {
          console.log(res);
          this.order = res.data;
        },
        err => {
          console.log(err);
        }
      );
    },
  },
};
</script>
<style lang="stylus" scoped>
.page-order-result {
  position: relative;
  .img-box{
    padding: 37px 0 17px;
    text-align: center;
  }
  .image{
    width: 80px;
  }
  .txt1{
    text-align: center;
    font-size: 20px;
    color: #231815;
    font-weight: bold;
    line-height: 25px;
  }
  .txt2{
    text-align: center;
    font-size: 15px;
    color: #9B9B9B;
    line-height: 20px;
    padding-top: 5px;
  }
  .price{
    color: #FF5B00;
  }
  .btn-box{
    padding-top: 40px;
    text-align: center;
    font-size: 15px;
    color: #231815;
  }
  .btn{
    display: inline-block;
    padding: 8px 40px;
    border: 1px solid #FDCC03;
    border-radius: 4px;
  }
  .btn-right{
    background: #FDCC03;
    margin-left: 15px;
  }
}
</style>
