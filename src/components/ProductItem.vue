<template>
  <div
    class="product-item"
    :class="{ 'small-item': item.classType === 2 }"
    @click="gotoProductDetail"
  >
    <div class="product-item-box">
      <div class="img-box jzimg">
        <img class="product-img" :src="item.src" alt="image" />
        <!--<img src="" class="icon-img" alt="tag" />-->
      </div>
      <div class="product-info clearfix">
        <p class="max-line-2 product-name">
          <i class="new" v-show="item.is_new">新品</i>{{ item.title }}
        </p>
        <div class="product-address">
          <p class="ellipsis">{{ item.brandName }}</p>
          <span>{{ item.distance | distance }}</span>
        </div>
        <!-- <div class="product-tags">
          <span :class="{'gray': item.btnStatus.btnState == 1}">{{ item.bargainCount }}人已砍价</span>
        </div> -->
        <div class="price-box">
          <p>
            <span
              class="price"
              :class="{
                lessPrice: isLessPrice,
                gray: item.btnStatus.btnState == 1,
              }"
            >
              <template v-if="isLessPrice"
                >已砍{{ item.bargained }}</template
              >
              <template v-else
                >¥{{ item.curPrice | price }}</template
              >
            </span>
            <del>¥{{ item.delPrice | price }}</del>
          </p>
          <!--// 1 已抢光, 2 砍价, 3 再砍, 4 马上抢-->
          <span
            class="bargain-btn"
            :class="{
              cheng: item.btnStatus.btnState == 2,
              lv: item.btnStatus.btnState == 3,
              lan: item.btnStatus.btnState == 4,
            }"
            @click.stop="handleBtnClick"
          >
            {{ item.btnStatus.btnText }}
            <mt-spinner
              v-if="item.isload"
              :type="3"
              color="#ffffff"
              :size="20"
              class="spinnerStyle"
            ></mt-spinner>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Spinner } from 'mint-ui';
export default {
  name: 'product-item',
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: Number,
  },
  components: {
    [Spinner.name]: Spinner,
  },
  data() {
    return {
      isLessPrice: false,
    };
  },
  watch: {
    item(newVal, oldVal) {
      const { isload, is_bargained: newIsBargained } = newVal;
      const { is_bargained: oldIsBargained } = oldVal;
      if (!isload) {
        if (!oldIsBargained && newIsBargained) {
          this.isLessPrice = true;
          setTimeout(() => {
            this.isLessPrice = false;
          }, 1500);
        }
      }
    },
  },
  methods: {
    handleBtnClick() {
      console.log('1111');
      this.$emit(
        'btnEvent',
        Object.assign({}, this.item, { index: this.index })
      );
    },
    gotoProductDetail() {
      this.$forward('product-detail', { id: this.item.pid });
    },
  },
};
</script>

<style lang="stylus" scoped>
@keyframes lessPrice{
  0% {
    transform scale(1)
  }
  50% {
    transform scale(1.4)
  }
  100% {
    transform scale(1)
  }
}
.product-item{
  background: #FFFFFF;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.12);
  border-radius: 8px;
  padding: 12px 10px;
  margin-bottom: 10px;
  // 小样式
  &.small-item{
    .product-item-box{
      height: 88px;
      padding-left: 102px;
      .img-box{
        width: 88px;
        height: 88px;
      }
      .product-info{
        .product-address{
          display: none;
        }
      }
    }
  }

  /*display: flex;*/
  .product-item-box{
    padding-left: 124px;
    height: 112px;
    position: relative;
    .img-box{
      width: 112px;
      height: 112px;
      border-radius: 5px;
      overflow: hidden;
      background-color: #ccc;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      .product-img{

      }
      .icon-img{
        position: absolute;
        left: 0;
        top: 0;
        width: 35px;
        height: 35px;
        border: 1px solid #fff;
      }
    }

    .product-info{
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
      .product-name{
        font-size: 15px;
        color: #231815;
        line-height: 21px;
        margin-bottom: 5px;
        vertical-align :middle;
        .new{
          background-color:#FF5D02;
          font-size:12px;
          transform:scale(0.84);
          color:#fff;
          border-radius :5px;
          display:inline-block;
          line-height :18px;
          vertical-align :2px;
          width:30px;
          text-align:center;
        }
      }
      .product-address{
        font-size: 12px;
        color: #4A4A4A;
        display: flex;
        margin-bottom: 5px;
        p{
          flex: 1;
        }
      }

      .product-tags{
        span{
          display: inline-block;
          background: #FFF4F1;
          border-radius: 2px;
          padding: 0 3px;
          font-size: 10px;
          color: #FF660F;
          height: 15px;
          line-height: 15px;

          &.gray{
            color: #9B9B9B;
            background-color: #eee;
          }
        }
      }

      .price-box{
        display: flex;
        align-items: center;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        p{
          flex: 1;
          del{
            display: inline-block;
            margin-left: 10px;
            font-size: 12px;
            color: #999999;
          }
          .price{
            font-size: 15px;
            display: inline-block;
            color: #FF5B00;
            font-weight: bold;
            &.lessPrice{
              animation: lessPrice 1s 0s;
            }
            &.gray{
              color: #9B9B9B;
            }
          }
        }
      }

      .bargain-btn{
        border-radius: 14px;
        height: 28px;
        width: 56px;
        text-align: center;
        line-height: 28px;
        background-color: #B3B3B3;
        color: #fff;
        border: none;
        position: relative;
        font-size: 12px;
        &:active{
          transform: translateY(1px);
        }
        &.cheng{
          background-image: linear-gradient(-265deg, #FF7A2F 0%, #FF5D02 100%);
        }
        &.lv{
          background-image: linear-gradient(-265deg, #8DCE40 0%, #429321 100%);
        }
        &.lan{
          background-image: linear-gradient(-90deg, #ED192A 18%, #FF2E02 64%);
        }
        .spinnerStyle{
          position: absolute;
          top: 50%;
          left: 50%;
          transform translate(-50%, -50%)
        }
      }
    }
  }
}
</style>
