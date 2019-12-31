<template>
  <div class="product-article-cont">
    <!-- 插入活动展示 -->
    <div class="article-activity-title">
      <span class="title-text">大家都在看</span>
      <img
        class="title-icon"
        src="https://img.mishifeng.com/FtUAMXnJhleZGjMUf2iCqxOLaBBI"
      />
    </div>
    <div class="article-activity-box">
      <ul class="activity-cont-box">
        <li
          class="cont-info-box"
          v-for="(item, index) in listArray"
          :key="index"
          data-type="product-detail"
          :data-id="item.activity_id"
          @click="goNext"
        >
          <dl class="info-box">
            <dt class="info-img-box">
              <span class="activity-tag-seckill" v-if="!item.is_new"
                >底价秒杀<img
                  class="tag-img"
                  src="https://img.mishifeng.com/FkP1c78LkB-egzQtEhVTz5ulF1FQ"
              /></span>
              <span class="activity-tag" v-if="item.is_new"
                >新品来袭<img
                  class="tag-img"
                  src="https://img.mishifeng.com/Fm-Rrg2th--NhyUBMtrCdLIsseja"
              /></span>
              <img class="activity-img" :src="item.item_pic" />
            </dt>
            <dd class="info-text-box">
              <p class="activity-title">
                {{ item.item_name }}
              </p>
              <p class="activity-price">
                <span class="current-price">￥{{ item.current_price }}</span>
                <span class="original-price">￥{{ item.market_price }}</span>
              </p>
              <span class="activity-btn" v-if="!item.is_sold">马上抢</span>
              <span class="activity-btn-grey" v-if="item.is_sold">已抢光</span>
            </dd>
          </dl>
        </li>
        <li
          class="more-box"
          data-id="1"
          data-type="product-tab-list"
          @click="goNext"
        >
          <img
            class="more-img"
            src="https://img1.haoshiqi.net/miniapp/msf/more-icon_c1bee9af88.png"
          />
          <span class="more-text">查看全部</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'article-activity-item',
  props: {
    listArray: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    // 跳转
    goNext(e) {
      const { type, id } = e.currentTarget.dataset;
      switch (type) {
        case 'product-detail':
          this.$forward(type, {
            id,
          });
          break;
        case 'product-tab-list':
          this.$forward(type, {
            type: id,
          });
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.product-article-cont{
  padding: 5px 10px 5px 10px;
  margin-bottom: 15px;
  .article-activity-title{
    display: flex;
    .title-text{
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
    .title-icon{
      width: 26px;
      height: 17px;
      margin-left: 5px;
    }
  }
  .article-activity-box{
    margin-top: 13px;
    width: 100%;
    height: 85px;
    .activity-cont-box{
      height: 85px;
      display: flex;
      overflow-x: scroll;
      white-space: nowrap;
      margin-block-start: 0;
      margin-block-end: 0;
      padding-inline-start: 0;
      .cont-info-box{
        display: inline-block;
        width: 305px;
        height: 80px;
        margin-right: 5px;
        border-radius: 3px;
        box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
        .info-box{
          width: 100%;
          padding-right: 5px;
          background: #fff;
          height: 80px;
          display: flex;
          margin-block-start: 0;
          margin-block-end: 0;
          .info-img-box{
            width: 80px;
            height: 80px;
            position: relative;
            .activity-img{
              width: 100%;
              height: 100%;
            }
            .activity-tag-seckill{
              position: absolute;
              top: 3px;
              left: 0px;
              width: 68px;
              height: 18px;
              font-size: 10px;
              color: #fff;
              padding-left: 2px;
              line-height: 18px;
              background-image: linear-gradient(-243deg, #FB8D63 16%, #F14646 75%);
              box-shadow: 0 0 4px 0 rgba(0,0,0,0.08);
              border-radius: 0px 9px 9px 0px;
            }
            .tag-img{
              width: 12px;
              height: 12px;
              position: absolute;
              right: 4px;
              top: 3px;
            }
            .activity-tag{
              position: absolute;
              top: 3px;
              left: 0px;
              width: 68px;
              height: 18px;
              font-size: 10px;
              color: #fff;
              line-height: 18px;
              padding-left: 2px;
              background-image: linear-gradient(-243deg, #71A1D1 16%, #949DF2 75%);
              box-shadow: 0 0 4px 0 rgba(0,0,0,0.08);
              border-radius: 0px 9px 9px 0px;
            }
            .tag-img{
              width: 14px;
              height: 14px;
              position: absolute;
              right: 3px;
              top: 2px;
            }
          }
          .info-text-box{
            margin-left: 10px;
            width: 210px;
            overflow: hidden;
            position: relative;
          }
          .activity-title{
            font-size: 14px;
            line-height: 20px;
            height: 40px;
            white-space: normal;
            overflow:hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
          }
          .activity-price{
            margin-top: 10px;
            height: 20px;
            line-height: 20px;
          }
          .current-price{
            font-size: 15px;
            color: #ffbf00;
            font-weight: bold;
          }
          .original-price{
            font-size: 12px;
            color: #999;
            margin-left: 4px;
            text-decoration: line-through;
          }
          .activity-btn{
            position: absolute;
            right: 10px;
            bottom: 7px;
            background-image: linear-gradient(-90deg, #FF2E02 18%, #ED192A 64%);
            border-radius: 14px;
            color: #fff;
            font-size: 12px;
            height: 22px;
            width: 52px;
            text-align: center;
            line-height: 22px;
          }
          .activity-btn-grey{
            position: absolute;
            right: 10px;
            bottom: 7px;
            background-color: #d1d1d1;
            border-radius: 14px;
            color: #fff;
            font-size: 12px;
            height: 22px;
            width: 52px;
            text-align: center;
            line-height: 22px;
          }
        }
      }
      .more-box{
        display: inline-block;
        margin-left: 10px;
        width: 80px;
        height: 70px;
      }
      .more-img{
        width: 26px;
        height: 26px;
        display: block;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 5px;
      }
      .more-text{
        text-align: center;
        color: #666;
        font-size: 10px;
      }
    }
  }
}
</style>
