<template>
  <div class="collect-item-box">
    <div
      class="collect-item"
      data-type="shop-detail"
      :data-id="item.id"
      @click="goNext"
    >
      <img class="product-img" :src="item.branch_head_pic" alt="" />
      <div class="product-text-box">
        <p class="product-title">{{ item.name }}</p>
        <div class="product-star">
          <star class="score" :scoreMax="50" :value="item.star"></star>
          <div class="star-title">{{ item.article_count }}篇觅食笔记</div>
        </div>
      </div>
      <i class="right-arrow"></i>
    </div>
    <div class="article-goods-box" v-if="item.activity.length > 0">
      <ul class="goods-cont-box">
        <li
          class="goods-li-box"
          v-for="(activityItem, activityIndex) in item.activity"
          :key="activityIndex"
          :data-id="activityItem.id"
          data-type="product-detail"
          @click="goNext"
        >
          <dl class="goods-info-box">
            <dt class="goods-img-box">
              <img class="goods-img" :src="activityItem.pic" alt="" />
            </dt>
            <dd class="goods-text-box">
              <p class="text-title">{{ activityItem.name }}</p>
              <p class="text-price">
                <span class="current-price"
                  >￥{{ activityItem.current_price }}</span
                >
                <span class="original-price"
                  >￥{{ activityItem.market_price }}</span
                >
              </p>
            </dd>
            <img
              class="right-arrows"
              src="https://img.mishifeng.com/FgqP_woduNe3vbTRExhImQ-_tPAA"
            />
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Star from '@/components/Star';
export default {
  name: 'collect-item',
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    Star,
  },
  data() {
    return {
      starVal: 10,
    };
  },
  mounted() {
    console.log(this.item, 'item--collect');
  },
  methods: {
    // 跳转事件
    goNext(e) {
      const { type, id } = e.currentTarget.dataset;
      this.$forward(type, {
        id,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.collect-item-box{
  width: 100%;
  overflow: hidden;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
  border-radius: 5px;
  margin-top: 10px;
  .collect-item{
    display: flex;
    width: 100%;
    height: 60px;
    padding: 10px 14px 10px 14px;
    position: relative;
    background: #fff;
    .product-img{
      width: 40px;
      height: 40px;
      border-radius: 2px;
      border: 1px solid #999;
    }
    .product-text-box{
      margin-left: 16px;
      width: 241px;
      .product-title{
        height: 20px;
        line-height: 20px;
        color: #4a4a4a;
        font-size: 14px;
      }
      .product-star{
        font-size: 14px;
        color: #666;
        line-height: 22px;
        display: flex;
        height: 22px;
        align-items: center;
        .star-title{
          margin-right: 77px;
          color:#9b9b9b;
          font-size:12px;
        }
        .score{
          flex: 1;
          position: relative;
          margin-top:-3px;
        }
      }
    }
    .right-arrow{
      position: absolute;
      width: 0.3rem;
      height: 0.3rem;
      right: 0;
      top: 12px;
      &::before{
        content: "";
        position: absolute;
        width: 0.12rem;
        height: 0.12rem;
        border: 0.01rem solid #B3B3B3;
        border-width: 0.02rem 0 0 0.02rem;
        transform: rotate(135deg);
        top: 0.08rem;
        left: 0.07rem;
      }
    }
  }
  .article-goods-box{
    padding: 14px 14px 10px 14px;
    width: 100%;
    height: 80px;
    background: #fff;
    border-top: 1px solid #F5F5F5;
    .goods-cont-box{
      height: 57px;
      overflow-x: scroll;
      white-space: nowrap;
      margin-block-start: 0;
      margin-block-end: 0;
      padding-inline-start: 0;
      .goods-li-box{
        display: inline-block;
        width: 232px;
        height: 52px;
        margin-right: 10px;
        border-radius: 3px;
        background: #f8f8f8;
        .goods-info-box{
          width: 100%;
          height: 52px;
          display: flex;
          margin-block-start: 0;
          margin-block-end: 0;
          position: relative;
          .goods-img-box{
            width: 52px;
            height: 52px;
            .goods-img{
              width: 100%;
              height: 100%;
            }
          }
          .goods-text-box{
            width: 180px;
            height: 52px;
            margin-left: 5px;
            .text-title{
              margin-top: 4px;
              width: 100%;
              font-size: 14px;
              height: 20px;
              line-height: 20px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .text-price{
              width: 180px;
              height: 20px;
              line-height: 20px;
              .current-price{
                font-size: 14px;
                color: #FFBF00;
                font-weight: bold;
              }
              .original-price{
                margin-left: 4px;
                font-size: 12px;
                color: #999;
                text-decoration: line-through;
              }
            }
          }
          .right-arrows{
            position: absolute;
            width: 12px;
            height: 14px;
            right: 5px;
            top: 19px;
          }
        }
      }
    }
  }
}
>>> .star-box .star-item{
  width: 12px;
  height: 10px;
}
</style>
