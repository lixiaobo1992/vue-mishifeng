<template>
  <div class="product-article-cont">
    <div class="article-top-box">
      <div class="article-status" v-if="topStatus">
        <img
          :src="listItem.branch.branch_log"
          :data-id="listItem.branch.id"
          data-type="shop-detail"
          @click="goNext"
          class="user-avatar"
        />
        <div class="text-box">
          <p
            class="product-name"
            data-type="shop-detail"
            :data-id="listItem.branch.id"
            @click="goNext"
            v-if="listItem.branch.branch_name"
          >
            {{ listItem.branch.branch_name }}
            <img
              src="https://img.mishifeng.com/FmkNYKydZTZYdSuEsIK7aQP2W9rn"
              class="map-icon"
            />
          </p>
          <p class="user-name">
            笔记来自:<span
              class="user-text"
              :data-id="listItem.article.user_id"
              data-type="profile"
              @click="goNext"
              >{{ listItem.article.user_nickname }}</span
            >
          </p>
        </div>
      </div>
      <div class="article-status-false" v-if="!topStatus">
        <img
          :src="listItem.article.user_avatar"
          :data-id="listItem.article.user_id"
          data-type="profile"
          @click="goNext"
          class="user-avatar"
        />
        <span class="user-name">{{ listItem.article.user_nickname }}</span>
      </div>
    </div>
    <div class="article-cont-box">
      <p
        class="article-text"
        data-type="article"
        :data-id="listItem.article.id"
        @click="goNext"
      >
        {{ listItem.article.content }}
        <span class="text-blue">详情</span>
      </p>
      <div
        class="article-video-box"
        :data-id="listItem.article.id"
        data-type="article"
        v-if="listItem.article.media_type == 2"
        @click="goNext"
      >
        <img class="video-cont-img" :src="listItem.article.pic" />
        <img
          class="video-play-img"
          src="https://img.mishifeng.com/FnI67wFKjCPTlVqPFWc0KN1HIu_m"
        />
        <span class="video-time-text"
          >{{ listItem.article.video_duration }}s</span
        >
      </div>
      <div
        class="article-img-box"
        v-if="
          listItem.article.media_type == 1 &&
            listItem.article.pic_list.length > 0
        "
      >
        <ul class="img-cont-box">
          <li
            class="img-info-box"
            v-for="(picItem, picIndex) in listItem.article.pic_list"
            :data-index="picIndex"
            @click="bigImg"
            :key="picIndex"
          >
            <img class="img-box" :src="picItem.pic" />
          </li>
        </ul>
      </div>
      <div class="article-goods-box" v-if="listItem.activity.length > 0">
        <ul class="goods-cont-box">
          <li
            class="goods-li-box"
            v-for="(goodsItem, goodsIndex) in listItem.activity"
            :key="goodsIndex"
            data-type="product-detail"
            :data-id="goodsItem.id"
            @click="goNext"
          >
            <dl class="goods-info-box">
              <dt class="goods-img-box">
                <img class="goods-img" :src="goodsItem.item_pic" />
              </dt>
              <dd class="goods-text-box">
                <p class="text-title">{{ goodsItem.item_name }}</p>
                <p class="text-price">
                  <span class="current-price"
                    >￥{{ goodsItem.current_price }}</span
                  >
                  <span class="original-price"
                    >￥{{ goodsItem.market_price }}</span
                  >
                </p>
              </dd>
              <img
                class="right-arrows"
                src="https://img.mishifeng.com/FgqP_woduNe3vbTRExhImQ-_tPAA"
              />
            </dl>
            <img
              class="loot-img"
              v-if="!goodsItem.left_stock"
              src="https://img.mishifeng.com/FgDiaVAwR-cps_Ks6fUB6MGVmC0g"
            />
          </li>
        </ul>
      </div>
    </div>
    <div class="article-footer-box" v-if="footerStatus">
      <div class="distance-box">
        <img
          class="gps-img"
          src="https://img.mishifeng.com/FjRpKoqtA3GtEBfC0PKU33cT620d"
        />
        <span class="distance-number">{{ listItem.branch.distance }}km</span>
      </div>
      <div
        class="collect-box"
        :class="{ 'white-bg': listItem.branch.is_collected }"
        @click="collectBranch"
      >
        <span class="collect-btn">{{
          listItem.branch.is_collected ? '已收藏' : '我想去'
        }}</span>
        <img
          class="collect-img"
          src="https://img1.haoshiqi.net/miniapp/msf/seeding-icon_f572e1a6de.png"
        />
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { mapActions } from 'vuex';
export default {
  name: 'article-item',
  props: {
    footerStatus: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
    index: Number,
    topStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listItem: {},
    };
  },
  created() {
    if (this.item.article) {
      this.listItem = this.item;
    } else {
      this.listItem = {
        article: this.item,
        branch: {},
        activity: [],
        list: [],
      };
    }
  },
  methods: {
    ...mapActions(['setImagesBigStatus']),
    // 收藏
    collectBranch() {
      const { branch } = this.item;
      api.branchCollect(
        {
          branch_id: branch.id,
        },
        res => {
          this.item.branch.is_collected = !this.item.branch.is_collected;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 处理跳转事件
    goNext(e) {
      const { type, id } = e.currentTarget.dataset;
      this.$forward(type, {
        id,
      });
    },
    // 图片放大
    bigImg(e) {
      const { index } = e.currentTarget.dataset;
      this.setImagesBigStatus({
        imageStatus: true,
        imgArray: this.listItem.article.pic_list || [],
        index,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.white-bg{
  background: #fff !important;
  border: 1px solid #999;
}
.product-article-cont{
  width: 100%;
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
  background: #fff;
  margin-bottom: 10px;
  .article-top-box{
    height: 32px;
    width: 100%;
    .article-status-false{
      display: flex;
      line-height: 32px;
      height: 32px;
      width: 100%;
      .user-avatar{
        width: 30px;
        height: 30px;
        border-radius: 100%;
      }
      .user-name{
        margin-left: 8px;
        font-size: 12px;
        color: #333;
        font-weight: bold;
        max-width: .6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .article-status{
      display: flex;
      line-height: 32px;
      height: 32px;
      width: 100%;
      .user-avatar{
        width: 30px;
        height: 30px;
        border-radius: 5px;
      }
      .text-box{
        margin-left: 6px;
        width: 100%;
        .product-name{
          font-size: 10px;
          position: relative;
          max-width: 200px;
          font-weight: bold;
          height: 15px;
          overflow: hidden;
          line-height: 15px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .map-icon{
          display: inline-block;
          vertical-align: inherit;
          width: 9px;
          height: 11px;
        }
        .user-name{
          font-size: 12px;
          overflow: hidden;
          height: 15px;
          line-height: 15px;
          color: #999;
        }
        .user-text{
          color: #66AED0;
        }
      }
    }
  }
  .article-cont-box{
    width: 100%;
    overflow: hidden;
    margin-top: 4px;
    .article-text{
      line-height: 20px;
      font-size: 14px;
      color: #333;
      height: 40px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      position: relative;
      .text-blue{
        position: absolute;
        bottom: 0;
        right: 0;
        background: #fff;
        color: #66AED0;
        font-size: 14px;
      }
      .text-dot{
        position: absolute;
        bottom: 0;
        right: 28px;
        padding: 0 5px;
        background: #fff;
        color: #333;
        font-size: 14px;
      }
    }
    .article-video-box{
      width: 100%;
      height: 180px;
      margin-top: 5px;
      position: relative;
      border-radius: 5px;
      .video-cont-img{
        width: 100%;
        height: 180px;
        border-radius: 5px;
      }
      .video-play-img{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        transform: translate(-50%, -50%);
      }
      .video-time-text{
        height: 20px;
        line-height: 20px;
        color: #fff;
        font-size: 14px;
        position: absolute;
        bottom: 10px;
        right: 10px;
      }
    }
    .article-img-box{
      width: 100%;
      margin-top: 5px;
      height: 80px;
      .img-cont-box{
        height: 85px;
        overflow-x: scroll;
        white-space: nowrap;
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
      }
      .img-info-box{
        display: inline-block;
        width: 80px;
        height: 80px;
        margin-right: 4px;
        border-radius: 3px;
      }
      .img-box{
        width: 100%;
        height: 100%;
        border-radius: 3px;
      }
    }
    .article-goods-box{
      margin-top: 10px;
      width: 100%;
      height: 52px;
      .goods-cont-box{
        height: 57px;
        overflow-x: scroll;
        white-space: nowrap;
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
        overflow-y: hidden;
      }
      .goods-li-box{
        display: inline-block;
        width: 232px;
        height: 52px;
        margin-right: 4px;
        border-radius: 3px;
        background: #f8f8f8;
        position: relative;
      }
      .goods-info-box{
        width: 100%;
        height: 52px;
        display: flex;
        margin-block-start: 0;
        margin-block-end: 0;
        position: relative;
      }
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
      }
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
      }
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
      .right-arrows{
        position: absolute;
        width: 12px;
        height: 14px;
        right: 5px;
        top: 19px;
      }
      .loot-img{
        width: 40px;
        height: 40px;
        position: absolute;
        right: 9px;
        top: 23px;
        border-radius: 40px;
      }
    }
  }
  .article-footer-box{
    margin-top: 5px;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    .distance-box{
      line-height: 30px;
      .gps-img{
        width: 8px;
        height: 9px;
        margin-right: 2px;
      }
      .distance-number{
        font-size: 12px;
        color: #333;
      }
    }
    .collect-box{
      margin-top: 4px;
      width: 64px;
      height: 23px;
      line-height: 23px;
      background: #fde044;
      border-radius: 23px;
      font-size: 12px;
      color: #333;
      display: flex;
      .collect-btn{
        margin-left: 8px;
      }
      .collect-img{
        margin-top: 5px;
        margin-left: 3px;
        display: inline-block;
        width: 12px;
        height: 11px;
      }
    }
  }
}
</style>
