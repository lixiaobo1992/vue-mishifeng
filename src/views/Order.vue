<template>
  <div class="order-page">
    <!-- 订单分类 -->
    <ul
      class="order-nav line1px"
      :class="{ bottom: isNavClass, 'is-header': isHeader }"
    >
      <li
        v-for="(item, index) in navData"
        :key="item.name + index"
        :class="{ action: index == currentNavIndex }"
        @click="navClickEvent(item.type, index)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>

    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck"
    >
      <!-- shop-list -->
      <div class="order-list">
        <order-item
          v-for="(item, index) in listData"
          :key="'order_' + index + item.oid"
          :item="item"
        ></order-item>
      </div>
      <div class="not-order" slot="not-data">
        <DefaultPage :imgItem="imgItem" :fontItem="fontItem"></DefaultPage>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
// import { mapGetters, mapActions, mapState } from 'vuex';
import PullListMixin from '@/mixins/pull-list';
import api from '@/api';
import { Scroll } from '@/ui';
import OrderItem from '@/components/OrderItem';
import { on, off } from '@/utils/event';
import scroll from '@/utils/scroll';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import { mapActions } from 'vuex';
import DefaultPage from '@/components/DefaultPage';
//图片导入
import defaultOrder from '@/assets/img/no-order.png';

export default {
  name: 'order',
  mixins: [PullListMixin],
  components: {
    [Scroll.name]: Scroll,
    [OrderItem.name]: OrderItem,
    DefaultPage,
  },
  data() {
    return {
      isNavClass: false,
      currentNavIndex: this.$route.query.index || 0,
      currentType: this.$route.query.type || 0,
      navData: [
        {
          name: '全部订单',
          type: 0,
        },
        {
          name: '待使用',
          type: 1,
        },
        {
          name: '待分享笔记',
          type: 4,
        },
        {
          name: '退款单',
          type: 3,
        },
      ],
      imgItem: {
        width: 166.6,
        height: 133.3,
        src: defaultOrder,
      },
      fontItem: {
        desc: '吃点好的很有必要，赶紧去下单吧～',
      },
    };
  },
  created() {
    // this.currentNavIndex =
    //
    this.getData();
    this.getOrderNoticepop();
  },
  computed: {
    isHeader() {
      if (device.msf) {
        return true;
      }
      return false;
    },
  },
  watch: {
    $route(to, oldVal) {
      // console.log(to, oldVal);
      const { index = 0, type = 0 } = to.query;
      this.currentNavIndex = index;
      this.currentType = type;
      scroll.setScrollTop(this.$el, 0);
      this.getData();
    },
  },
  mounted() {
    this.$nextTick(() => {
      const that = this;
      if (device.msf) {
        // 开启刷新和监听下拉刷新，要在页面document 进来以后添加
        bridge.enableRefresh(); // 开启刷新
        // 监听下拉刷新
        bridge.onPullRefresh({
          success(res) {
            scroll.setScrollTop(that.$el, 0);
            that.getData();
          },
        });
      }
      // 悬浮导航
      on(this.$el, 'scroll', e => {
        const scrollTop = scroll.getScrollTop(this.$el);
        // console.log(scrollTop);
        if (scrollTop == 0) {
          this.isNavClass = false;
        } else if (!this.isNavClass) {
          this.isNavClass = true;
        }
      });
    });
  },
  beforeDestroy() {
    //...
    off(this.$el, 'scroll', () => {});
    if (device.msf) {
      bridge.disableRefresh(); // 禁止 下拉刷新
      bridge.offPullRefresh(res => {
        console.log('app off PullRefresh', res);
      });
    }
  },
  methods: {
    ...mapActions(['setShareMask', 'setOrderShadeData']),
    // 切换分类
    navClickEvent(type, index) {
      //
      console.log(index);
      this.currentNavIndex = index;
      this.$forward('order', { replace: true, type: type, index: index });
      // scroll.setScrollTop(this.$el, 0);
      // this.getData();
    },
    getData() {
      this.$showLoading();
      this.initPullList();
      // this.pullParams.page_limit = 5;
      this.pullParams.filter_type = this.currentType;
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.orderlist.apply(this, rest);
    },
    dealList(list = []) {
      return list.map(item => {
        const orderStatus = this.getOrderStatus(item);

        return {
          oid: item.id,
          activity_id: item.activity_id,
          article_id: item.article_id,
          src: item.item_pic,
          title: item.item_name,
          curPrice: item.amount,
          noteStatus: this.noteStatusText(item.article_status, item.status),
          brandName: item.branch_name,
          distance: 1212, // 距离
          ...orderStatus,
        };
      });
    },
    getOrderStatus(item) {
      // 自定义code:
      // 1 待使用
      // 2 待评论（已使用，未发布笔记）
      // 3 已完成（已使用，已发布笔记）
      // 4 已过期（未使用，已过期）
      // 5 退款中
      // 6 退款完成

      // 服务端返回code
      // 1=未支付，2=待使用，3=已使用，4=已过期，5=已退款，6=已取消，7=退款中
      let code = 0;
      let statusText = '';
      let timer = item.expire_time;
      switch (item.status) {
        case 1:
          // 暂不处理
          break;
        case 2:
          code = 1;
          statusText = '有效期至';
          break;
        case 3:
          statusText = '已使用';
          timer = item.redeem_time;
          if (item.article_status == 1) {
            code = 2;
          } else if (item.article_status == 5) {
            code = 2;
          } else {
            code = 3;
          }
          break;
        case 4:
          code = 4;
          statusText = '已过期';
          break;
        case 5:
          code = 6;
          statusText = '退款成功';
          break;
        case 6:
          // 暂不处理
          break;
        case 7:
          code = 5;
          statusText = '退款中';
          break;
        default:
        // ...
      }

      return {
        status: item.status,
        orderStatusCode: code,
        statusText: statusText, // 有效期至 | 已使用 | 已过期 | 退款中 | 退款成功
        timeText: timer, // 有效期时间 | 已使用时间
      };
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
    // 2.1 笔记状态文字处理
    noteStatusText(note_status, order_status) {
      let noteText = '';
      let versionString = this.$version._version;
      let versionNum = Number(versionString.replace(/[.]/g, ''));
      if (versionNum >= 210) {
        if (order_status == 3) {
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
            case 5:
              noteText = '笔记待发布';
              break;
            default:
              noteText = '';
              break;
          }
        }
      } else {
        if (order_status == 3) {
          switch (note_status) {
            case 1:
              noteText = '笔记待发布';
              break;
            case 2:
              noteText = '';
              break;
            default:
              noteText = '';
              break;
          }
        }
      }

      return noteText;
    },
  },
};
</script>

<style lang="stylus" scoped>
.order-page{
  padding-top: 42px;
}
.order-nav{
  height: 42px;
  background-color: #fff;
  margin: 0;
  padding: 0;
  display: flex;
  position: fixed;
  width: 100%;
  left: 0;
  top : 46px;
  z-index: 1;
  &.is-header{
    top : 0;
  }
  li{
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1;
    text-align: center;
    position: relative;
    span{
      display: inline-block;
      height: 42px;
      line-height: 44px;
      border-bottom: 2PX solid #fff;
      font-size: 13px;
      color: #9B9B9B;
    }

    &.action span{
      border-color: #FDCC02;
      font-size: 13px;
      color: #231815;
      font-weight: bold;
    }

    &:after{
      content: '';
      position: absolute;
      top: 30%;
      right: 0;
      z-index: 2;
      display: block;
      height: 40%;
      border-right: 2px solid #f5f5f5;
    }

    &:last-child{
      &:after{
        display: none;
      }
    }
  }
}

.order-list{
  padding: 10px 10px 0 10px;
}
</style>
