<template>
  <div class="page-bargain">
    <Header :leftOptions="{ showBack: false }" :fixed="true">
      觅食蜂
      <div slot="left">
        <i class="left-arrow" @click="onClickBack"></i>
        <a class="cm-header-back" @click="onClickBack">返回</a>
      </div>
    </Header>
    <Scroll
      v-model="pullLoading"
      :isLoading="isLoading"
      :finished="finished"
      :listLen="listData.length"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
    >
      <div class="product-info" @click="goProductDetail">
        <div class="info">
          <div class="info-image"><img :src="productInfo.image" /></div>
          <div class="info-content">
            <p class="product-title max-line-2">{{ productInfo.name }}</p>
            <span class="bargain-num"
              >{{ productInfo.bargainCount }}人已砍价</span
            >
            <div class="product-price">
              <span class="cur-price"
                >¥{{ productInfo.currentPrice | price }}</span
              >
              <del class="del-price">{{ productInfo.marketPrice | price }}</del>
            </div>
          </div>
        </div>
      </div>
      <div class="branch">
        <branch-info :branchInfo="branchInfo"></branch-info>
        <branch-address :addressInfo="addressInfo"></branch-address>
      </div>
      <div class="bargain">
        <div
          class="bargain-btn"
          :class="{ 'bargain-disabled': !bargainBtnInfo.canClick }"
          @click="clickBargainBtn(bargainBtnInfo.btnType)"
        >
          {{ bargainBtnInfo.btnText }}
        </div>
        <div class="bargain-describe" v-if="showBargainDesc">
          <p class="bargain-suc" v-if="isBargained">
            恭喜您，成功帮好友砍了{{ bargainReduce }}元！
          </p>
          <p
            v-if="!isBargained && !isFloorPrice"
            class="to-buy"
            @click="goProductDetail"
          >
            去抢购<Icon
              class="arrow-right"
              mode="custom"
              type="arrow-right"
            ></Icon>
          </p>
        </div>
      </div>
      <div class="bargain-avatar">
        <div class="avatar-tag">
          <Tags :tags="avatarTags" :center="true"></Tags>
        </div>
        <div class="avatar-list">
          <template v-for="(item, index) in avatarList">
            <Avatar
              :key="index"
              :src="item.avatar"
              :size="40"
              class="avatar-item"
            ></Avatar>
          </template>
        </div>
      </div>
      <div class="product-list">
        <div class="product-tag">
          <Tags :tags="productTags" :center="true"></Tags>
        </div>
        <div class="list-box">
          <product-list :listData="listData"></product-list>
        </div>
      </div>
    </Scroll>
    <DownloadNav></DownloadNav>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import api from '@/api';
import { Tags, Scroll, Header } from '@/ui';
import Icon from '@/ui/Icon';
import Avatar from '@/components/Avatar';
import ProductList from '@/components/ProductList';
import BranchInfo from '@/components/BranchInfo';
import BranchAddress from '@/components/BranchAddress';
import pullList from '@/mixins/pull-list';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import { dealPrice } from '@/utils';
import DownloadNav from '@/components/DownloadNav';
import tongji from '@/utils/tongji';
export default {
  name: 'bargain',
  mixins: [pullList],
  components: {
    Icon,
    Avatar,
    Tags,
    ProductList,
    BranchInfo,
    BranchAddress,
    Scroll,
    Header,
    DownloadNav,
  },
  data() {
    return {
      productTags: [{ name: '更多美食' }], // 活动列表tags
      productInfo: {}, // 商品信息
      // 门店信息
      branchInfo: {
        starObj: {},
      },
      bargainBtnInfo: {}, // 砍价按钮信息
      addressInfo: {}, // 地址信息
      avatarList: [], // 砍价头像数据
      isOnline: true, // 是否在线
      isBargained: false, // 是否已砍价
      isSold: false, // 是否售完
      bargainReduce: '', // 砍价金额
      isFloorPrice: false, // 是否到底价
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
    }),
    // 头像列表tags
    avatarTags() {
      return [{ name: `${this.productInfo.bargainCount}人正在抢购` }];
    },
    // 显示按钮下方内容
    showBargainDesc() {
      return (
        this.isOnline &&
        !this.isSold &&
        (this.isBargained || (!this.isBargained && !this.isFloorPrice))
      );
    },
  },
  created() {
    this.$showLoading();
    this.getGeo({
      success: res => {
        this.getData();
      },
      fail: err => {
        this.getData();
      },
    });
  },
  mounted() {},
  methods: {
    ...mapActions(['getGeo']),
    getData() {
      this.getBargainDetail();
      this.getActivityList();
    },
    // 请求帮砍价页面数据
    getBargainDetail() {
      const id = this.$route.query.id || '681054';
      api.helpbargain(
        { activity_id: id },
        res => {
          const { data } = res;
          this.bargainReduce = data.reduce;
          this.isOnline = data.online_status == 1;
          this.isBargained = data.is_bargained;
          this.isSold = data.is_sold;
          this.isFloorPrice = data.current_price <= data.floor_price;
          this.bargainBtnInfo = this.dealButtonInfo();
          this.productInfo = {
            activityId: data.activity_id || '',
            name: data.item_name,
            image: data.item_pic,
            marketPrice: data.market_price,
            currentPrice: data.current_price,
            bargainCount: data.bargain_count || 0,
          };
          const branch = data.branch || {};
          this.branchInfo = {
            id: branch.id,
            branchLogo: branch.branch_head_pic,
            branchName: branch.branch_name,
            articleNum: branch.article_count,
            starVal: branch.star,
          };
          this.addressInfo = {
            lng: branch.lng,
            lat: branch.lat,
            title: branch.branch_name,
            address: branch.address,
            phoneNumber: branch.phone,
          };
          this.avatarList = data.bargain_users || [];

          if (device.wechat) {
            bridge.setShare({
              title: data.item_name,
              weixin_timeline: {
                title: `最低1折起，快来砍价！${branch.branch_name}:${data.item_name}`,
              },
              desc: `原价¥${dealPrice(
                data.market_price,
                100
              )}， 现在只要¥${dealPrice(
                data.current_price,
                100
              )}!快来帮我砍价，最低只要1折起！`,
              link: `${location.origin}/bargain?id=${
                this.$route.query.id
              }&publisher=${this.userInfo.id || 0}`,
              imgUrl: data.item_pic,
            });
          }
        },
        err => {}
      );
    },
    // 处理砍价按钮
    dealButtonInfo() {
      let btnText = '继续砍价';
      let btnType = 'bargain';
      let canClick = true;
      if (!this.isOnline) {
        btnText = '已下架';
        btnType = 'downLine';
        canClick = false;
      } else if (this.isSold) {
        btnText = '已抢光';
        btnType = 'isSold';
        canClick = false;
      } else if (this.isBargained) {
        btnText = '立即抢购';
        btnType = 'goProductDetail';
        canClick = true;
      } else if (this.isFloorPrice && !this.isBargained) {
        btnText = '马上抢';
        btnType = 'goProductDetail';
        canClick = true;
      }
      return {
        btnText,
        btnType,
        canClick,
      };
    },
    pullModel(...rest) {
      api.activityList.apply(this, rest);
    },
    // 请求活动列表数据
    getActivityList() {
      this.initPullList();
      this.onScrollToLower();
    },
    // 点击砍价按钮
    clickBargainBtn(btnType) {
      switch (btnType) {
        case 'bargain':
          this.doBargain();
          break;
        case 'goProductDetail':
          //tongji.event('c_bargain_friend', `value:{bargained:0}`);
          this.goProductDetail();
          break;
        case 'downLine':
        case 'isSold':
        default:
          break;
      }
    },
    // 进入商品详情页
    goProductDetail() {
      tongji.event('c_bargain_buy');
      this.$forward('product-detail', {
        id: this.productInfo.activityId,
      });
    },
    // 砍价
    doBargain() {
      api.bargain(
        {
          activity_id: this.productInfo.activityId,
          citywide: 1,
        },
        res => {
          const { data } = res;
          this.$showToast(data.result);
          this.bargainReduce = data.reduce;
          this.isBargained = data.is_bargained;
          this.productInfo = Object.assign(this.productInfo, {
            currentPrice: data.current_price,
            bargainCount: data.bargain_count,
          });
          this.bargainBtnInfo = this.dealButtonInfo();
          this.dealBargainAvatar();
          tongji.event('c_bargain_friend', `value:{bargained:1}`);
        },
        err => {
          if (err.errno == 91220003) {
            // 活动已经下架
            this.isOnline = false;
          } else if (err.errno == 91220013) {
            // 底价
            this.isFloorPrice = true;
          } else if (err.errno == 91220014) {
            // 已经砍过价
            this.isBargained = true;
          } else if (err.errno == 91220004) {
            // 售完
            this.isSold = true;
          }
          tongji.event('c_bargain_friend', `value:{bargained:0}`);
          if (
            err.errno == 91220003 ||
            err.errno == 91220013 ||
            err.errno == 91220014 ||
            err.errno == 91220004
          ) {
            this.bargainBtnInfo = this.dealButtonInfo();
            this.$showToast(err.errmsg);
            return true;
          }
        }
      );
    },
    // 处理砍价用户头像
    dealBargainAvatar() {
      const bargainAvatar = {
        id: this.userInfo.id,
        username: this.userInfo.nickname,
        avatar: this.userInfo.avatar,
      };
      if (this.avatarList.length < 16) {
        this.avatarList = [bargainAvatar, ...this.avatarList];
      } else {
        const newList = this.avatarList.slice(0, 15);
        this.avatarList = [bargainAvatar, ...newList];
      }
    },
    onClickBack() {
      const length = window.history.length;
      if (length && length < 2) {
        this.$forward('index');
        return;
      }
      this.$back();
    },
  },
};
</script>
<style lang="stylus" scoped>
.page-bargain {
  position: relation;
  background: rgb(245, 245, 245);
  padding-top: 46px;
}
.product-info, .branch, .bargain, .bargain-avatar, .product-list {
  position: relative;
  background: #FFF;
  margin-top: 10px;
}
.product-info {
  padding: 15px 15px 22px 15px;
  border-bottom: 1px solid #F5F5F5;
  margin-top: 0;
  .info {
    display: flex;
    .info-image {
      width: 112px;
      min-width: 112px;
      height: 112px;
      border-radius: 3px;
      overflow: hidden;
      margin-right: 12px;
      background-color: #eee;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .info-content {
      position: relative;
      .product-title {
        font-weight: 600;
        font-size: 15px;
        color: #231815;
        text-align: justify;
        margin-bottom: 5px;
      }
      .bargain-num {
        font-size: 12px;
        color: #9B9B9B;
      }
      .product-price {
        position: absolute;
        display: flex;
        left: 0;
        bottom: 0;
        text-align: justify;
        align-items: center;
        line-height: 1;
      }
      .cur-price {
        font-size: 17px;
        font-weight: bold;
        color: #FF5B00;
        margin-right: 3px;
      }
      .del-price {
        font-size: 12px;
        color: #9B9B9B;
        align-self: center;
      }
    }
  }
}
.branch {
  margin-top: 0;
}
.bargain {
  padding: 24px 15px 20px 15px;
  .bargain-btn {
    width: 100%;
    height: 42px;
    background: #FF5B00;
    border-radius: 3px;
    text-align: center;
    line-height: 42px;
    font-size: 17px;
    color: #FFF;
  }
  .bargain-disabled {
    background: #DDD;
  }
  .bargain-describe {
    margin-top: 9px;
    font-size: 14px;
    text-align: center;
    .bargain-suc {
      color: #9B9B9B;
    }
    .to-buy {
      color: #FF5B00;
      line-height: 1;
    }
  }
}
.bargain-avatar {
  padding: 0 15px;
  .avatar-tag {
    padding-top: 8px;
    border-bottom: 1px solid #F5F5F5;
  }
  .avatar-list {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0 11px 0;
    .avatar-item {
      min-width: 40px;
      margin-right: 3px;
      margin-bottom: 10px;
    }
  }
}
.product-list {
  .product-tag {
    padding-top: 8px;
    margin: 0 15px;
    border-bottom: 1px solid #F5F5F5;
  }
}
</style>
