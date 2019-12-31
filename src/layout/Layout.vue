<!-- 基础模板 -->
<template>
  <section
    class="layout-base"
    :class="{ 'is-header': isShowHeader, 'is-tabbar': isShowTabBar }"
  >
    <cm-header
      v-if="isShowHeader"
      class="layout-header"
      :class="{ show: isShowHeader }"
      slot="header"
      absolute
      :title="title"
    ></cm-header>
    <transition :name="transition">
      <keep-alive :include="$store.getters.keepAliveList">
        <div class="router-container">
          <router-view
            class="router-view page-container"
            id="rootContainer"
          ></router-view>
        </div>
      </keep-alive>
    </transition>
    <tabbar
      v-if="isShowTabBar"
      class="layout-tabbar"
      :class="{ show: isShowTabBar }"
      slot="bottom"
      :value="tabbarVal"
    ></tabbar>
    <ShareShade :orderCommentShade="orderCommentShade"></ShareShade>
    <!-- v2.2.0 放大图片功能 -->
    <magnify-img v-if="imagesBigStatus.imageStatus"></magnify-img>
    <!-- v2.2.0 探店首页引导层 -->
    <product-guide-layer v-if="productGuideLayerStatus"></product-guide-layer>
    <!-- v2.4.0 新人福利 -->
    <new-user-weal
      v-if="newUserMealStatus && route.name == 'product'"
    ></new-user-weal>
    <!-- v2.3.5 登录弹窗 兼容微信小程序审核 -->
    <login-layer v-if="userLoginLayerStatus"></login-layer>
  </section>
</template>

<script>
import {
  // mapActions,
  mapState,
  // mapGetters,
} from 'vuex';
import device from '@/utils/device';
import { Header, ViewBox } from '@/ui';
import TabBar from '@/components/tabbar.vue';
import ShareShade from '@/components/ShareShade';
import MagnifyImg from '@/components/MagnifyImg'; // v2.2.0 放大图片功能
import ProductGuideLayer from '@/components/ProductGuideLayer'; // v2.2.0 探店首页引导层
import NewUserWeal from '@/components/popup/NewUserWeal'; // v2.4.0 新人福利
import LoginLayer from '@/components/LoginLayer'; // v2.3.5 登录弹层
// console.log(device);
const hideHeader = [
  'index',
  'profile',
  'search-article',
  'shop',
  'product',
  'shop-detail',
  'setup',
  'search-shop',
  'login',
  'publish',
  'product-detail',
  'bargain',
  'honey-note',
  'invite-register',
  'message-index',
  'comment-list',
  'message',
  'honey-level',
  'setting',
  'festival-dumplings',
  'share-dumplings',
  'chocie-dumplings',
  'rank-dumplings',
];
const showTabBar = [
  'index',
  'shop',
  'product',
  'message-index',
  'message',
  'profile',
];
export default {
  name: 'Layout',
  props: {
    keepAlList: Array,
  },
  components: {
    [Header.name]: Header,
    [ViewBox.name]: ViewBox,
    [TabBar.name]: TabBar,
    [ShareShade.name]: ShareShade,
    [MagnifyImg.name]: MagnifyImg,
    [ProductGuideLayer.name]: ProductGuideLayer,
    [NewUserWeal.name]: NewUserWeal,
    [LoginLayer.name]: LoginLayer,
  },
  data() {
    return {
      transition: '',
      // tabbarVal: 'index',
      // isMsf
      ismsf: device.msf, // 是否是蜜
      // orderCommentShade: {},
    };
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      name: state => state.route.name,
      ani: state => state.app.ani,
      userInfo: state => state.user.userInfo,
      orderCommentShade: state => state.app.orderCommentShade,
      imagesBigStatus: state => state.app.imagesBigStatus,
      productGuideLayerStatus: state => state.app.productGuideLayerStatus,
      newUserMealStatus: state => state.app.newUserMealStatus,
      userLoginLayerStatus: state => state.app.userLoginLayerStatus,
    }),
    // 是否显示header
    isShowHeader() {
      if (device.msf) {
        return false;
      }
      if (hideHeader.indexOf(this.name) > -1) {
        return false;
      }
      return true;
    },
    // 是否显示tabbar
    isShowTabBar() {
      if (device.msf) {
        return false;
      }
      const otherUserId = this.$route.query.id || '';
      const isSelf =
        (otherUserId && this.userInfo.id == otherUserId) || !otherUserId;
      if (showTabBar.indexOf(this.name) > -1) {
        if (this.name == 'profile' && !isSelf) return false;
        return true;
      }
      return false;
    },
    tabbarVal() {
      if (showTabBar.indexOf(this.name) > -1) {
        return this.name;
      }
      return 'index';
    },
    // header
    title() {
      return (this.route.meta && this.route.meta.title) || '';
    },
  },
  // watch $route 决定使用哪种过渡
  watch: {
    $route(to, from) {
      // 暂时不启用转场动画
      // 参见 README.md 转场动画约定
      // const toDepth = to.path.split('/').length;
      // const fromDepth = from.path.split('/').length;
      // const isForward = toDepth < fromDepth;
      // const toIndex = to.meta.index;
      // const fromIndex = from.meta.index || 0;
      // const isBack = toIndex < fromIndex;
      // if (!isUnDef(toIndex)) {
      //   this.transition = '';
      // } else {
      //   this.transition = isBack ? 'slide-right' : 'slide-left';
      // }
    },
  },
};
</script>

<style lang="stylus" scoped>
.layout-base{
  &.is-header .router-container {
    padding-top: 46px;
  }
  &.is-tabbar .router-container {
    padding-bottom: 49px;
  }
}
.layout-header,.layout-tabbar{
  display: none;
  &.show{
    display: block;
  }
}

.transition-box {
  position: absolute;
  z-index: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  transition: transform 0.4s cubic-bezier(.55,0,.1,1);

  // height: 100%;
  height: 100vh;
}

.slide-left-enter-active,
.slide-right-enter-active,
.slide-right-leave-active {
  background-color: #fff;
}

.slide-right-leave-to {
  z-index: 10;
}
.slide-right-enter {
  z-index: -1;
}

.slide-right-leave-to,
.slide-left-enter {
  transform: translate3D(100%, 0, 0);
}
.slide-right-enter,
.slide-left-leave-to
{
  transform: translate3D(-20%, 0, 0);
}
.slide-right-enter-active,
.slide-left-leave-active {
  &:after {
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.1);
    width: 100%;
    bottom: 0;
    content: '';
    z-index: 10000;
    transition: opacity 0.4s cubic-bezier(.55,0,.1,1);
  }
}
.slide-right-enter:after {
  opacity: 1;
}
.slide-right-enter-to:after {
  opacity: 0;
}
.slide-left-leave:after {
  opacity: 0;
}
.slide-left-leave-to:after {
  opacity: 1;
}
// .slide-left-leave-active,
// .slide-right-enter{
//   opacity: 0;
//   transform: translate3D(-20%, 0, 0);
// }
</style>
