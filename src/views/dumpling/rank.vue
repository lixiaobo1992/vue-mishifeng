<template>
  <div class="rank">
    <div class="item-list">
      <div
        class="item-tab item-tab-1"
        :class="{ active: type == 1 }"
        @click="item(1)"
      >
        甜方大将
      </div>
      <div
        class="item-tab item-tab-2"
        :class="{ active: type == 2 }"
        @click="item(2)"
      >
        咸方大将
      </div>
    </div>
    <div class="user-item" v-if="type == userInfo.camp_type">
      <div class="user-avator">
        <img :src="userInfo.avatar" class="user-img" />
        <span class="user-name"
          >{{ userInfo.nickname }} <br /><sub v-if="userInfo.user_rank < 100"
            >第{{ userInfo.user_rank }}名</sub
          ></span
        >
      </div>
      <div class="user-right">
        <span class="user-name"
          >已贡献
          <p class="num">{{ userInfo.zongzi_num }}</p></span
        >
        <img src="~assets/dumplings/rank-zongzi.png" class="user-left" />
      </div>
    </div>
    <!-- <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck"
    > -->
    <RankingList :rankingData="sweetList" v-show="type == 1"></RankingList>
    <RankingList :rankingData="saltyList" v-show="type == 2"></RankingList>
    <!-- </vue-scroll> -->
    <DownloadNav :downLoadText="'让你一元吃大餐'" v-if="!isMSF"></DownloadNav>
  </div>
</template>
<script>
import api from '@/api';
import RankingList from '@/components/dumpling/RankingList';
import DownloadNav from '@/components/DownloadNav';
// import { Scroll } from '@/ui';
import device from '@/utils/device';
export default {
  name: 'ranking-item',
  components: {
    RankingList,
    DownloadNav,
    // Scroll,
  },
  data() {
    return {
      sweetList: [],
      saltyList: [],
      progressInfo: {
        totalNum: 200,
        value: 80,
      },
      userInfo: {
        user_rank: 0,
        zongzi_num: 0,
        user_name: '我的昵称',
        user_avator: '',
        user_id: 0,
      },
      type: 1,
      isMSF: device.msf,
    };
  },
  created() {
    this.type = this.$route.query.type || 1;
    this.getRankData();
  },
  methods: {
    item(type) {
      console.log(type, 'type');
      this.type = type;
    },
    getRankData() {
      api.rankData(
        {},
        res => {
          const { data } = res;
          this.userInfo = data.userinfo;
          this.sweetList = data.rank_list.sweet.slice(0, 10);
          this.saltyList = data.rank_list.salty.slice(0, 10);
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
.rank {
  background-image :url('~assets/dumplings/rank-bg.png');
  width:100%;
  height:100%;
  background-size:100% 100%;
  background-repeat:no-repeat;
  background-color :#fff;
}
.item-list {
  display:flex;
  flex-direction :row;
  border-bottom :5px solid #df8135;
  margin-top:60%;
  .item-tab {
    width:88px;
    height:29px;
    line-height:29px;
    background-size:75px 22px;
    background-repeat:no-repeat;
    margin-right:5px;
    text-align:center;
    color:#df8135;
    font-size:16px;
    background-color :#fff;
    border-top-right-radius: 3px;
    &.active {
      background-color :#df8135;
      color:#fff;
    }
    // &.item-tab-1 {
    //   background-image :url('~assets/dumplings/tab-left-active.png');
    // }
  }
}
.user-item {
  display:flex;
  flex-direction :row;
  justify-content :space-between;
  background-color :#fff;
  align-items :center;
  padding:10px 16px 8px;
  min-height:24px;
  border-bottom:6px solid #f5f5f5;
  margin:0 auto;
  .user-name {
    display :inline-block;
    vertical-align :middle;
    margin-left:10px;
    line-height:20px;
    font-size:14px;
  }
  .user-img {
    width:36px;
    height:36px;
    border-radius :50%;
  }
  .num {
    color:#df5e51;
    display :inline;
  }
  .user-left {
    width:20px;
    height:25px;
  }
  .block {
    display:block;
  }
  sub{
    font-size:14px;
  }
}
.ranking:last-child{
    padding-bottom:40px;
  }
</style>
