<template>
  <div class="product-box">
    <div class="product-list">
      <!-- item -->
      <product-item
        v-for="(item, index) in productListData"
        :key="'product_' + index + item.pid"
        :item="item"
        :index="index"
        @btnEvent="btnEvent"
      ></product-item>
    </div>
  </div>
</template>

<script>
import { Popup } from 'mint-ui';
import ProductItem from '@/components/ProductItem';
import bridge from '@/utils/bridge';
import mini from '@/utils/mini';
import device from '@/utils/device';
import { dealPrice } from '@/utils/index';
import { mapState, mapActions } from 'vuex';
import store from '@/store';
import api from '@/api';
import tongji from '@/utils/tongji';
export default {
  name: 'product-list',
  props: {
    listData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    [Popup.name]: Popup,
    [ProductItem.name]: ProductItem,
  },
  data() {
    return {
      // shareTip: false,
      productListData: [],
      isMSF: device.msf,
      tongdunFingerprintStatus: false, //同盾设备指纹状态
      blackBox: '', //同盾设备指纹
      sessionId: '', //同盾验证成功的sessionId
    };
  },
  watch: {
    listData(newVal, oldVal) {
      setTimeout(() => {
        this.productListData = this.dealList(newVal);
      }, 0);
    },
  },
  computed: {
    ...mapState({
      logged: state => state.user.logged,
      userInfo: state => state.user.userInfo,
    }),
  },
  created() {
    //console.log(dealPrice(39000,100);
    this.productListData = this.dealList(this.listData);
    const that = this;
    if (this.isMSF) {
      bridge.getAppConfig({
        success(res) {
          const { data } = res;
          console.log(res, 'res');
          that.tongdunFingerprintStatus = data.tongdunFingerprint;
          if (that.tongdunFingerprintStatus) {
            bridge.getSystemInfo({
              success(res) {
                const { data } = res;
                that.blackBox = data.blackBox;
                console.log(res, 'res2', that.blackBox);
              },
            });
          }
        },
      });
    }
  },
  methods: {
    ...mapActions(['setShareMask']),
    dealList(list = []) {
      return list.map(item => this.filterItemData(item));
    },
    filterItemData(item) {
      const btnStatus = this.getBtnState(item);
      return {
        pid: item.activity_id,
        src: item.item_pic,
        title: item.item_name,
        is_new: item.is_new,
        curPrice: item.current_price,
        delPrice: item.market_price,
        // address: '这里是地址这里是地址这里是地址这里是地址',
        brandName: item.branch_name,
        distance: item.distance || 0, // 距离
        bargainCount: item.bargain_count || 0, // 已砍价数
        is_bargained: item.is_bargained,
        classType: this.$route.name === 'shop-detail' ? 2 : 1, // 存在两种样式 大/小
        btnStatus,
      };
    },
    // 获取按钮状态
    getBtnState(item) {
      let btnText = '已抢光';
      let btnState = 1; // 1 已抢光, 2 砍价, 3 再砍, 4 马上抢
      // current_price 当前价  floor_price 最低价

      // 库存 商品是否已经卖完
      // is_sold false 代表已卖完
      if (item.is_sold) {
        btnState = 1;
        btnText = '已抢光';
      } else if (Number(item.current_price) <= Number(item.floor_price)) {
        btnText = '马上抢';
        btnState = 4;
      } else if (item.is_bargained) {
        //当前用户是否已经砍过价
        // 是否已经砍过价
        btnText = '再砍';
        btnState = 3;
      } else {
        btnText = '砍价';
        btnState = 2;
      }

      return {
        btnText,
        btnState,
      };
    },

    // 显示在砍价弹窗，设置分享信息，
    btnEvent(item) {
      const { btnStatus, pid } = item;
      const value = `index:${item.index},value:{goodId:${pid},goodBargainStatus:${btnStatus}}`;
      tongji.event('c_good_cheap', value);
      console.log('1111112');
      // 用户是否登录
      if (!this.logged) {
        // ios手机内调用navigateTo方法导致崩溃，紧急修复，在app内使用bridge.login方法
        if (device.msf) {
          bridge.login({
            success(res) {
              //..
              console.log(res);
              const { data } = res;
              store.commit('SET_USERINFO', data);
            },
            fail(err) {
              console.log('app 登录失败！', err);
              // mini.forward('/index');
              mini.showToast('登录失败，请重试！');
            },
          });
        } else {
          this.$forward('login');
        }
        return;
      }

      // 1 已抢光, 2 砍价, 3 再砍, 4 马上抢 5 已下架
      switch (btnStatus.btnState) {
        case 2:
          this.bargain(item);
          break;
        case 3:
          // 待处理
          this.againBargain(item);
          break;
        case 1:
        case 4:
        case 5:
          //
          this.goBooking(item);
          break;
        default:
        //
      }
    },

    // 砍价
    bargain(currentItem) {
      const that = this;
      this.$showLoading('正在砍价中...');
      currentItem.isload = true;
      this.productListData.splice(
        currentItem.index,
        1,
        Object.assign({}, currentItem)
      );
      console.log(currentItem);
      api.bargain(
        {
          activity_id: currentItem.pid,
          showLoading: false,
          black_box: this.sessionId ? '' : this.blackBox,
          afs_session_id: this.sessionId,
        },
        res => {
          console.log(res);
          this.$hideLoading();
          const { reduce = 0 } = res.data;

          let newItem = this.filterItemData(res.data);
          newItem.isload = false;
          newItem.is_bargained = true; // 是否砍价
          newItem.bargained = reduce; // 砍价的金额
          newItem.index = currentItem.index;
          that.productListData.splice(
            currentItem.index,
            1,
            Object.assign({}, newItem)
          );
          this.sessionId = '';
        },
        err => {
          console.log(err);
          this.$hideLoading();
          currentItem.isload = false;
          // 特殊错误码处理
          // 91220003  活动已经下架
          // 91220013  已经是最低价，不能再砍了
          // 91220014  您今天已经砍过价啦, 请不要重复操
          // 91220004  活动已售完，不可以再砍价啦
          if (
            err.errno == 91220003 ||
            err.errno == 91220013 ||
            err.errno == 91220004 ||
            err.errno == 91220014
          ) {
            let btnText = '已抢光';
            let btnState = 1; // 1 已抢光, 2 砍价, 3 再砍, 4 马上抢 5 已下架
            if (err.errno == 91220003) {
              btnState = 5;
              btnText = '已下架';
            } else if (err.errno == 91220013 || err.errno == 91220014) {
              btnState = 4;
              btnText = '马上抢';
            }
            currentItem.btnStatus = {
              btnText,
              btnState,
            };
          } else if (
            (err.errno == 9125103 && this.isMSF) ||
            (err.errno == 9125102 && this.isMSF)
          ) {
            bridge.securityGuard({
              success(res) {
                const { data } = res;
                if (data && data.sessionID) {
                  that.sessionId = data.sessionID;
                  that.bargain(currentItem);
                  that.sessionId = '';
                }
              },
            });
          }

          this.productListData.splice(
            currentItem.index,
            1,
            Object.assign({}, currentItem)
          );
        }
      );
    },
    // 在砍
    againBargain(item) {
      tongji.event('c_product_share');
      if (device.wechat || device.msf) {
        const { delPrice, curPrice, title, src, brandName, pid } = item;
        const shareData = {
          title: title,
          weixin_timeline: {
            title: `最低1折起，快来砍价！${brandName}:${title}`,
          },
          desc: `原价¥${dealPrice(delPrice, 100)}， 现在只要¥${dealPrice(
            curPrice,
            100
          )}!快来帮我，最低只要1折起！`,
          link: `${location.origin}/bargain?id=${pid}&publisher=${this.userInfo
            .id || 0}`,
          imgUrl: src,
        };
        if (device.wechat) {
          this.setShareMask({ isShow: true, type: 2 });
          bridge.setShare(shareData);
          // alert(shareData);
        } else if (device.msf) {
          console.log(item);
          // sss
          bridge.showShare({
            ...shareData,
            url: location.href,
            success(res2) {
              console.log(res2);
            },
            onlySelectChannel: [
              'weixin',
              'weixin_timeline',
              // 'qq',
              // 'qzone',
              // 'weibo',
              'copy_link',
              // 'image',
            ],
          });
        }
      } else {
        this.$showToast({
          message: '您的客户端不支持分享，手动分享此页面吧～',
          duration: 3000,
        });
      }
    },
    //
    goBooking(item) {
      // 去详情
      const value = `index:${item.index},value:{goodId:${item.pid}}`;
      tongji.event('c_good', value);
      this.$forward('product-detail', { id: item.pid });
    },
  },
};
</script>

<style lang="stylus" scoped>
.product-list{
  padding: 10px 10px 0 10px;
}
</style>
