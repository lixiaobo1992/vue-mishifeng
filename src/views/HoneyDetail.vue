<template>
  <div class="honey-page">
    <div class="header">
      <img src="~/assets/honey/honey@2x.png" />
      <span class="header-txt">我的蜂蜜又变多啦^_^</span>
    </div>
    <vue-scroll
      v-model="pullLoading"
      :finished="finished"
      :listLen="dataList.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck"
    >
      <ul class="items">
        <li>
          <span class="title">{{ date | dateFilter }}</span
          ><span class="right-txt">仅显示最近三个月的记录</span>
        </li>
        <li
          v-for="(item, index) in dataList"
          :key="'honey_' + index + item.id"
          :class="{ active: item.dateStatus, border: item.border }"
        >
          <span :class="{ title: item.dateStatus }" v-if="item.dateStatus">{{
            item.created_at | dateFilter
          }}</span>
          <span v-show="!item.dateStatus">{{ item.title }} </span>
          <span v-show="item.honey > 0">+{{ item.honey }} g</span>
          <span v-show="item.honey < 0">{{ item.honey }} g</span>
        </li>
      </ul>
    </vue-scroll>
  </div>
</template>
<script>
import api from '@/api';
import { formatDate } from '@/utils/base/date';
import { off } from '@/utils/event';
import { Scroll } from '@/ui';
import PullListMixin from '@/mixins/pull-list';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
// import { InfiniteScroll } from 'mint-ui';
export default {
  mixins: [PullListMixin],
  components: {
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      isMSF: device.msf,
      dataList: [],
      date: '',
      page: {
        page_num: 1, // 当前页
        page_limit: 20, //条目数量
        need_pagination: 1,
      },
      totalPage: 1,
    };
  },
  created() {},
  mounted() {
    this.getHoneylog();
    this.isMSF && this.initBridge();
  },
  filters: {
    dateFilter(val) {
      let timestamp = Math.floor(Date.parse(new Date()) / 1000),
        day = timestamp - val,
        numDay = 24 * 3600,
        days = Math.floor(day / numDay),
        dayStatus = formatDate(timestamp, 'M-D') == formatDate(val, 'M-D');
      if (days == 0 && dayStatus) {
        val = '今天';
        return val;
      } else if (days == 0 && !dayStatus) {
        val = '昨天';
        return val;
      } else {
        return formatDate(val, 'M-D');
      }
    },
  },
  methods: {
    getHoneylog() {
      this.$showLoading();
      let prams = this.page;
      api.getHoneylog(
        prams,
        res => {
          let dataArr = res.data.list;
          this.totalPage = res.data.total_page;
          for (let i = 0; i < dataArr.length; i++) {
            const dateObj = {
              dateStatus: true,
              created_at: '',
            };
            if (
              i !== dataArr.length - 1 &&
              formatDate(dataArr[i].created_at, 'M-D') !==
                formatDate(dataArr[i + 1].created_at, 'M-D')
            ) {
              dateObj.created_at = dataArr[i + 1].created_at;
              dataArr.splice(i + 1, 0, dateObj);
            }
          }
          if (this.page.page_num > 1) {
            this.dataList = this.dataList.concat(dataArr);
          } else {
            this.dataList = res.data.list || [];
          }
          this.date = this.dataList[0].created_at;
        },
        err => {}
      );
      //this.onScrollToLower();
    },
    onScrollToLower() {
      if (this.page.page_num < this.totalPage) {
        this.page.page_num++;
        this.$showLoading();
        setTimeout(() => {
          this.getHoneylog();
        }, 2000);
        this.loading = false;
      } else {
        this.finishedTip = '没有更多数据了!';
        this.finished = true;
      }
    },
    initBridge() {
      if (this.isMSF) {
        bridge.setNavigationBar({
          title: '蜂蜜明细',
          color: '#171900',
          success(res) {
            console.log(res);
          },
        });
      }
    },
  },
  beforeDestroy() {
    off(this.$el, 'scroll', () => {});
  },
};
</script>
<style lang="stylus" scoped>
.honey-page {
  width:100%;
  overflow-y :scroll;
  padding-top:44px;
}
.header {
  display:flex;
  flex-direction :column;
  justify-content :center;
  align-items :center;
  padding:0 0 15px;
  img {
    width:77px;
    height:105px;
  }
}
span {
  font-size: 12px;
  color: #333;
  &.title {
    font-size: 14px;
    font-weight :bold;
  }
  &.right-txt{
    color:#ccc;
  }
  &.header-txt {
    margin-top:15px;
  }
}
.items {
  padding:0;
  li {
    display:flex;
    flex-direction :row;
    justify-content :space-between;
    padding:15px 0;
    margin:0 15px;
    border-bottom :1px solid #f1f1f5;
    &:first-child {
      background:#f1f1f5;
      border:none;
      margin :0;
      padding:15px;
    }
    &:last-child {
      border:none;
      padding-bottom :0;
    }
    &.active {
      background:#f1f1f5;
      border:none;
      margin :0;
      padding:15px;
    }
    &.border {
      border:none;
    }
  }
}
@media screen and (max-width: 321px) {
  .header {
    padding-top:45px;
  }
}
</style>
