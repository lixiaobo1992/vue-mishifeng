<template>
  <div class="order-item" data-type="detail" @click="gotoNext">
    <div class="product-info">
      <div class="jzimg img-box"><img :src="item.src" alt="image" /></div>
      <div class="product-text">
        <p class="product-title ellipsis">{{ item.title }}</p>
        <div class="brand-name ellipsis">{{ item.brandName }}</div>
        <div class="price-or-status">
          <span class="price">￥{{ item.curPrice | price }}</span>
          <!--退款状态-->
          <small
            v-if="item.orderStatusCode === 5 || item.orderStatusCode === 6"
            class="refund"
            >{{ item.statusText }}</small
          >
          <span class="note-status">{{ item.noteStatus }}</span>
        </div>
      </div>
      <!--订单状态图章 订单过期-->
      <div v-if="item.orderStatusCode === 4" class="order-tag">
        <img src="~assets/order/order_expired.png" alt="" />
      </div>
    </div>
    <!--不等于退款订单-->
    <div
      v-if="item.orderStatusCode !== 5 && item.orderStatusCode !== 6"
      class="order-status"
    >
      <p class="order-time" v-if="item.status == 2">
        {{ item.statusText }} {{ item.timeText | formatDate('Y-M-D') }}
      </p>
      <p class="order-time" v-if="item.status == 3">
        {{ item.statusText }} {{ item.timeText | formatDate('Y-M-D H:F:S') }}
      </p>
      <!-- 去使用|去发布 按钮 -->
      <span
        v-if="item.orderStatusCode === 1"
        class="order-btn"
        data-type="detail"
        @click.stop="gotoNext"
        >去使用</span
      >
      <span
        v-else-if="item.orderStatusCode === 2"
        class="order-btn"
        data-type="publish"
        @click.stop="gotoNext"
        >发布笔记</span
      >
      <small
        v-else-if="item.orderStatusCode === 3"
        data-type="article"
        @click.stop="gotoNext"
        >查看笔记</small
      >
    </div>
  </div>
</template>

<script>
import { storage } from '@dwdjs/utils';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
export default {
  name: 'order-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isMSF: device.msf,
    };
  },
  methods: {
    gotoNext(e) {
      const { type } = e.currentTarget.dataset;
      switch (type) {
        case 'detail':
          this.$forward('order-detail', {
            id: this.item.oid,
          });
          break;
        case 'article':
          if (this.item.video_id) {
            if (this.isMSF) {
              const userInfo = storage.get('userInfo') || {};
              const that = this;
              bridge.getNativePath({
                success(res) {
                  let { pathList } = res.data;
                  if (pathList.indexOf('video-list') >= 0) {
                    that.$forward('video-list', {
                      id: that.item.article_id,
                      type: 1,
                      member: userInfo.id,
                    });
                  } else {
                    that.$forward('article', { id: that.item.article_id });
                  }
                },
              });
            } else {
              this.$forward('article', { id: this.item.article_id });
            }
          } else {
            this.$forward('article', { id: this.item.article_id });
          }
          break;
        case 'publish':
          this.$forward('publish', {
            order_id: this.item.oid,
            activity_id: this.item.activity_id,
          });
          break;
        default:
        // do nothing...
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.order-item{
  background: #FFFFFF;
  box-shadow: 0 2px 11px 0 rgba(0,0,0,0.12);
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 0 10px;
  .product-info{
    padding: 10px 0;
    display: flex;
    position: relative;
    .img-box{
      height: 70px;
      width: 70px;
      border-radius: 5px;
      overflow: hidden;
      background-color: #e1e1e1;
      margin-right: 10px;
    }
    .product-text{
      flex: 1;
      position: relative;
      overflow: hidden;
      .product-title{
        font-size: 15px;
        color: #212121;
        line-height: 24px;
      }
      .brand-name{
        font-size: 12px;
        color: #9B9B9B;
      }
      .price-or-status{
        display: flex;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        .price{
          flex: 1;
          font-size: 14px;
          color: #FF5B00;
        }
        .refund{
          font-size: 12px;
          color: #FF5B00;
        }
        .note-status{
          font-size: 12px;
          color: #999;
        }
      }
    }
    .order-tag{
      height: 63px;
      width: 63px;
      position: absolute;
      right: 0;
      bottom: 10px;
      z-index: 1;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .order-status{
    width: 100%;
    height: 42px;
    display: flex;
    align-items: center;
    border-top: 1PX dashed #F5F5F5;
    .order-time{
      flex: 1;
      font-size: 12px;
      color: #9B9B9B;
    }
    .order-btn{
      height: 26px;
      width: 60px;
      line-height: 26px;
      background: #FDCC02;
      border-radius: 4px;
      font-size: 11px;
      color: #231815;
      text-align: center;
      font-weight: bold;
      vertical-align: bottom;
    }
    small{
      font-size: 12px;
      color: #9B9B9B;
      text-decoration: underline;
    }
  }
}
</style>
