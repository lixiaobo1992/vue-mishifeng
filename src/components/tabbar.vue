<template>
  <cm-tabbar
    class="tabbar-box"
    :class="{ 'isphone-x': isX }"
    fixed
    :isx="isX"
    @tab-click="handleTabClick"
    :value="value"
  >
    <!-- <img src="~assets/tabbar/tab_home_normal.png" alt=""> -->
    <cm-tabbar-item
      v-for="(item, index) in tabBarData"
      :key="item.id"
      :class="item.type ? 'publish-btn' : ''"
      :data-index="index"
      :data-link="item.link"
      :id="item.id"
    >
      <img
        slot="tab-icon"
        :src="value == item.id ? item.selectedIconPath : item.iconPath"
        :alt="item.text"
      />
      {{ item.text }}
    </cm-tabbar-item>
  </cm-tabbar>
</template>
<script>
import { TabBar, TabBarItem } from '@/ui';
import { mapState } from 'vuex';
// import Icon from '@/ui/Icon';
// 首页 icon
import indexIconPath from '@/assets/tabbar/tab_index.png';
import indexSelectedIconPath from '@/assets/tabbar/tab_index_active.png';
// 探店 icon
import locationIconPath from '@/assets/tabbar/tab_discovery.png';
import locationSelectedIconPath from '@/assets/tabbar/tab_discovery_active.png';
// 消息 icon
import msgIconPath from '@/assets/tabbar/tab_news.png';
import msgSelectedIconPath from '@/assets/tabbar/tab_news_active.png';
import msgNewIconPath from '@/assets/tabbar/tab_news_active.png';
// 我的 icon
import profileIconPath from '@/assets/tabbar/tab_mine.png';
import profileSelectedIconPath from '@/assets/tabbar/tab_mine_active.png';
// 发布
import publishIconPath from '@/assets/tabbar/tab_publish.png';
import device from '@/utils/device';

const tabBarData = [
  {
    id: 'index', // page
    iconPath: indexIconPath,
    selectedIconPath: indexSelectedIconPath,
    text: '首页',
    // link: 'ali_portal',
  },
  {
    id: 'product', // page shop
    iconPath: locationIconPath,
    selectedIconPath: locationSelectedIconPath,
    text: '探店',
    // link: 'probe_shop',
  },
  {
    id: 'publish', // page
    type: 1,
    iconPath: publishIconPath,
    selectedIconPath: locationSelectedIconPath,
    text: '',
    // link: 'probe_shop',
  },
  {
    id: 'message', // 消息图标有多种状态需要特殊处理
    iconPath: msgIconPath,
    selectedIconPath: msgSelectedIconPath,
    text: '消息',
    // link: 'msg',
  },
  {
    id: 'profile', // page
    iconPath: profileIconPath,
    selectedIconPath: profileSelectedIconPath,
    text: '我的',
    // link: 'profile',
  },
];

export default {
  name: 'tabbar',
  components: {
    [TabBar.name]: TabBar,
    [TabBarItem.name]: TabBarItem,
    // Icon,
  },
  props: {
    value: String,
  },
  data() {
    return {
      tabBar: tabBarData,
    };
  },
  computed: {
    ...mapState({
      appConfig: state => state.app.appConfig,
    }),
    tabBarData() {
      if (this.appConfig.unread) {
        let tabBar = this.tabBar.concat();
        tabBar[3].iconPath = msgNewIconPath;
        return tabBar;
      }
      return this.tabBar;
    },
    isX() {
      return (
        /iphone/gi.test(navigator.userAgent) &&
        (screen.height == 812 && screen.width == 375)
      );
    },
  },
  methods: {
    // ...
    handleTabClick(...rest) {
      const [id, e] = rest;
      // console.log(id, e);
      if (id === this.value) return;
      const { link } = e.currentTarget.dataset;
      if (device.wxapp) {
        switch (id) {
          case 'publish':
            this.$showToast('请前往觅食蜂app使用该功能');
            break;
          default:
            this.$forward(link || id);
            break;
        }
      } else {
        switch (id) {
          case 'index':
          case 'product':
          case 'publish':
          case 'message':
          case 'profile':
            this.$forward(link || id);
            break;
        }
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.isphone-x{
  background-color: #fff !important;
}
.tabbar-box{
  max-height: 49px;
  background-color: rgba(250,250,250,0.9);
  z-index: 2;
  >>>.cm-tabbar-item{
    color: #8E8E93;
    padding: 5px 0;
    .tabbar-icon{
      width:24px;
    }
    &.is-selected {
      background: none;
      color: #333;
    }
    &.publish-btn{
      .tabbar-icon{
        width: 70px;
        height: 70px;
        margin-top: -22px;
      }
      .tabbar-label{
        display: none;
      }
    }
  }
}
</style>
