<template>
  <div class="theme-box">
    <div class="theme-top-box">
      <!-- 单个话题 -->
      <div class="theme-single" v-if="nowDiscussList.length == 1">
        <dl
          class="single-box"
          v-for="(nowItem, index) in nowDiscussList"
          :key="'new-' + index"
        >
          <dt class="single-img-box">
            <span class="label-cont">本期讨论</span>
            <img class="theme-img" :src="nowItem.pic" />
          </dt>
          <dd class="single-text-box">
            <p class="text-title">#{{ nowItem.title }}#</p>
            <p class="text-cont">
              {{ nowItem.description }}
            </p>
            <div class="text-time">
              <span></span>
              <p class="time-text">
                {{ nowItem.start_time }}-{{ nowItem.end_time }}
              </p>
            </div>
            <div class="theme-join-btn">参与有奖</div>
          </dd>
        </dl>
      </div>
      <!-- 多个话题 swiper 预留 -->
      <!-- @click.native="$onUrlPage($event)"
            @change="handleChange(index)"
            v-for="(swiperItem, index) in swiperList"
            :key="index"
            :data-link="swiperItem.link"
            :data-index="index" -->
      <div class="theme-swiper-box" v-if="nowDiscussList.length > 1">
        <Swiper :ratio="adsRatio" :showIndicators="false" :auto="100000">
          <SwiperItem
            v-for="(nowItem, nowIndex) in nowDiscussList"
            :key="nowIndex"
          >
            <dl class="single-box">
              <dt class="single-img-box">
                <span class="label-cont">本期讨论</span>
                <img class="theme-img" :src="nowItem.pic" />
              </dt>
              <dd class="single-text-box">
                <p class="text-title">#{{ nowItem.title }}#</p>
                <p class="text-cont">
                  {{ nowItem.description }}
                </p>
                <div class="text-time">
                  <span></span>
                  <p class="time-text">
                    {{ nowItem.start_time }}-{{ nowItem.end_time }}
                  </p>
                </div>
                <div class="theme-join-btn">参与有奖</div>
              </dd>
            </dl>
          </SwiperItem>
        </Swiper>
      </div>
      <!-- 无话题缺省 -->
      <div
        class="theme-null-box"
        v-if="!nowDiscussList.length || !nowDiscussList.length"
      >
        <img
          class="theme-null-img"
          src="https://img.mishifeng.com/FrVZzKFSIopyd9KAq66-D4_NRy0N"
        />
        <p class="theme-null-text">本期话题活动即将开始，敬请期待！</p>
      </div>
    </div>
    <div class="theme-cont-box">
      <div class="cont-list-box">
        <vue-scroll
          class="page-scroll"
          v-model="pullLoading"
          :finished="finished"
          :listLen="listData.length"
          :isLoading="isLoading"
          :imgIsLoading="imgIsLoading"
          @onScrollToLower="onScrollToLower"
          :finishedTip="finishedTip"
          :immediate-check="scrollCheck"
        >
          <before-small-list
            v-if="listType == 2"
            :list="nowDiscussList"
          ></before-small-list>
          <before-big-list
            v-if="listType == 1"
            :list="beforeDiscussList"
          ></before-big-list>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import PullListMixin from '@/mixins/pull-list';
import BeforeSmallList from '@/components/BeforeSmallList';
import BeforeBigList from '@/components/BeforeBigList';
import { Swiper, SwiperItem, Scroll } from '@/ui';
import device from '@/utils/device';
import { formatDate } from '@/utils/base/date';
export default {
  mixins: [PullListMixin],
  name: 'theme-list',
  components: {
    [BeforeSmallList.name]: BeforeSmallList,
    [Scroll.name]: Scroll,
    [BeforeBigList.name]: BeforeBigList,
    Swiper,
    SwiperItem,
  },
  data() {
    return {
      imgIsLoading: true,
      finishedTip: '',
      adsRatio: 170 / 355,
      listType: 2, // 1是讨论  2是话题
      nowDiscussList: [], // 本期讨论
      beforeDiscussList: [], // 往期讨论
    };
  },
  created() {
    this.listType = this.$route.query.type;
    this.refresh();
  },
  mounted() {
    // console.log(this.listData);
  },
  methods: {
    refresh() {
      this.initPullList();
      this.onScrollToLower();
    },
    pullModel(...rest) {
      if (this.listType == 1) {
        // 讨论
        api.getDiscussLists.apply(this, rest);
      } else {
        // 话题
        api.getTopicLists.apply(this, rest);
      }
    },
    // 整理数据，将时间戳改为具体年月日
    setDealList(list = []) {
      return list.map(item => {
        return {
          ...item,
          start_time: formatDate(item.start_time, 'Y-M-D'),
          end_time: formatDate(item.end_time, 'Y-M-D'),
        };
      });
    },
    afterPull(res) {
      const { data, share, timestamp } = res;
      const { list } = data;
      this.setShareData(share);
      this.splitList(list, timestamp);
    },
    // 拆分话题、讨论列表，拆分也本期、往期
    splitList(list = [], end_time) {
      for (let i = 0; i < list.length; i++) {
        if (Number(list[i].end_time) < Number(end_time)) {
          this.nowDiscussList.push(list[i]);
        } else {
          this.beforeDiscussList.push(list[i]);
        }
      }
      this.nowDiscussList = this.setDealList(this.nowDiscussList);
      this.beforeDiscussList = this.setDealList(this.beforeDiscussList);
    },
    // 设置分享
    setShareData(data) {
      if (device.wxapp) {
        const shareData = {
          desc: 'test',
          title: data.desc,
          imgUrl: data.pic,
          link: data.link,
        };
        window.wx.miniProgram.postMessage({ data: shareData });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.theme-box{
  width: 100%;
}
.theme-top-box{
  margin-top: 11px;
  width: 100%;
  padding: 16px;
  background: #fff;
  .theme-single{
    width: 343px;
    height: 143px;
    border-radius: 5px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.10);
  }
  .theme-swiper-box{
    width: 343px;
    height: 143px;
    background: #FFFFFF;
    border-radius: 5px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.10);
  }
  .theme-null-box{
    width: 343px;
    height: 143px;
    border-radius: 5px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.10);
    position: relative;
    .theme-null-img{
      position: absolute;
      top: 10px;
      left: 50%;
      margin-left: -110px;
      width: 220px;
      height: 100px;
    }
    .theme-null-text{
      position: absolute;
      bottom: 12px;
      width: 100%;
      font-size: 10px;
      line-height: 14px;
      text-align: center;
      color: #999;
    }
  }
  .single-box{
    width: 100%;
    height: 143px;
    border-radius: 5px;
    display: flex;
    margin: 0px;
  }
  .single-img-box{
    position: relative;
    width: 145px;
    height: 143px;
    border-radius: 5px 0 0 5px;
    .label-cont{
      position: absolute;
      top: 0px;
      left: 0px;
      width: 97px;
      height: 25px;
      line-height: 25px;
      color: #fff;
      font-size: 14px;
      padding-left: 10px;
      text-align: center;
      background-size: cover;
      background-image: url('https://img.mishifeng.com/FhokMkj0I0jsXwtkUcbQs1y95aQO');
      border-radius: 5px 0 10px 0;
    }
    .theme-img{
      width: 100%;
      height: 100%;
    }
  }
  .single-text-box{
    margin-left: 12px;
    width: 156px;
    .text-title{
      margin-top: 12px;
      font-size: 16px;
      color: #373737;
    }
    .text-cont{
      color: #666;
      font-size: 12px;
      line-height: 17px;
      margin-top: 3px;
      height: 34px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .text-time{
      display: flex;
      font-size: 12px;
      margin-top: 3px;
      color: #333;
      align-items: center;
      span{
        display: inline-block;
        width: 11px;
        height: 11px;
        background: #f60;
      }
      .time-text{
        margin-left: 2px;
      }
    }
    .theme-join-btn{
      width: 90px;
      height: 25px;
      line-height: 25px;
      background: #FDE044;
      box-shadow: 0 2px 4px 0 #FCEB8E;
      border-radius: 12.5px;
      text-align: center;
      font-size: 14px;
      color: #171900;
      margin-top: 11px;
    }
  }
}
.theme-cont-box{
  margin-top: 10px;
}
</style>
