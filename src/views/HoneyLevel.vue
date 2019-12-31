<template>
  <div class="level">
    <div class="fix-header" v-if="!isMSF" :style="headerStyle">
      <img class="icon-left" src="~assets/honey/left.png" @click="goback" />
      <span class="txt-center">我的等级</span>
    </div>
    <div class="header">
      <div
        class="notice-box"
        v-if="noticeStatus"
        @click="noticeJump"
        :class="isMSF ? 'notice-top' : ' '"
      >
        <img src="~assets/profile/notice_icon.png" class="notice-icon" alt="" />
        {{ noticeText }}
        <img
          src="~assets/profile/close__icon.png"
          @click.stop="onticeClear"
          class="close-icon"
        />
      </div>
      <div
        class="update-level-box"
        :class="{ 'level-top-number': noticeStatus }"
      >
        <div
          class="update-level-btn"
          :class="{ 'level-btn-bear': upgradeData.status == 1 }"
          v-if="upgradeData.status == 1 || upgradeData.status == 2"
          @click="upgradeBtn"
        >
          <span class="level-text">{{ upgradeData.text }}</span>
          <Icon class="arrows-dot" type="arrows-dot"></Icon>
        </div>
        <div
          class="update-level-btn level-btn-over"
          v-if="upgradeData.status == 3"
        >
          <span class="level-text">{{ upgradeData.text }}</span>
          <img
            class="level-over"
            src="https://img.mishifeng.com/Fr8LxlxIRzU6RRFh-AgkhI6Rs9O5"
          />
        </div>
      </div>
      <div class="successNav" :class="{ 'swiper-top-number': noticeStatus }">
        <swiper :options="swipersuccess" ref="mySwiper" v-if="levelList.length">
          <swiper-slide v-for="(item, index) in levelList" :key="index">
            <!-- 一键升级 点击后升级 -->
            <img
              :src="item.image.background"
              alt=""
              :style="styles"
              class="imgSwiper"
              :class="{ isphoneSwiper: iphone && isMSF }"
            />
            <span class="top-tag" v-show="item.id > curLevel">待升级</span>
            <span class="top-tag" v-show="item.id < curLevel">升级完成</span>
            <span class="top-tag" v-show="item.id == curLevel">当前等级</span>
            <div class="icon-name">
              <img :src="item.image.icon" class="swiper-item-icon" />
              <span class="level-circle">LV{{ item.id }}</span>
              <span class="level-name" :class="'level_' + index">{{
                item.name
              }}</span>
            </div>
            <span class="level-title">享有以下权益</span>
            <div class="level-rights" :class="'level_list_' + index">
              <div
                class="level-list"
                v-for="(levelItem, levelIndex) in item.benefit"
                :key="levelIndex"
              >
                <img :src="levelItem.icon" class="list-icon" />
                <span class="list-icon-text" v-if="levelItem.desc">{{
                  levelItem.desc
                }}</span>
                <span class="icon-text" v-if="levelItem.name">{{
                  levelItem.name
                }}</span>
              </div>
            </div>
            <span class="level-tasks">升级任务</span>
            <div class="level-text">
              <i class="icon-tasks"></i>
              <span class="task-detail">{{ item.upgrade_condition }}</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="footer">
      <span class="note">
        注意事项：
        1.本规则尚在试运营阶段，可能出现调整，调整不会影响您已经获得的等级和蜂蜜。2.
        完成升级任务后第二天系统会自动帮你升级哦！
      </span>
    </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.min.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { mapState } from 'vuex';
import api from '@/api';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import { on, off } from '@/utils/event';
import scroll from '@/utils/scroll';
import Icon from '@/ui/Icon';
export default {
  components: {
    swiper,
    swiperSlide,
    Icon,
  },
  data() {
    return {
      swipersuccess: {
        centeredSlides: true,
        slidesPerView: 1.22,
        spaceBetween: 0,
        loop: true,
        speed: 500,
        duration: 1000,
        initialSlide: 0,
      },
      levelList: [],
      styles: {
        width: window.innerWidth * 0.78,
      },
      curLevel: 1,
      isMSF: device.msf,
      iphone: device.iphone,
      headerStyle: {
        backgroundColor: 'rgba(255,255,255,0)',
      },
      noticeStatus: false,
      // v2.3.0
      upgradeData: {},
      noticeText: '',
      // v2.3.2
      goProfile: false, // 用作判断是否有上一级页面
    };
  },
  computed: {
    ...mapState({
      logged: state => state.user.logged,
    }),
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
  filters: {},
  created() {
    if (!this.logged) {
      this.$forward('login');
      return;
    }
    this.getLevelList();
    console.log(this.curLevel, 'this.curLevel');
  },
  mounted() {
    this.isMSF && this.initBridge();
    this.$nextTick(() => {
      // 悬浮导航
      if (!this.isMSF) {
        on(this.$el, 'scroll', e => {
          const scrollTop = scroll.getScrollTop(this.$el);
          const opacity = scrollTop / 100;
          if (opacity <= 1.5) {
            let style = {
              backgroundColor: `rgba(254,220,0,${opacity})`,
            };
            if (opacity >= 1.4) {
              style.boxShadow = `0px 2PX 4PX rgba(0, 0, 0, ${opacity / 10})`;
            }
            this.headerStyle = style;
          }
        });
      }
    });
  },
  methods: {
    updateBox() {
      this.$nextTick(() => {
        const levelW = this.$el.querySelector('.level-rights');
        console.log(levelW, 'levelW');
      });
    },
    getLevelList() {
      api.getLevelList(
        { cache: true },
        res => {
          console.log(res, 'res');
          const { data } = res;
          // v2.3.0 升级信息
          this.upgradeData = data.upgrade;
          this.curLevel = data.userinfo.level_id;
          this.levelList = data.list;
          this.swipersuccess.initialSlide =
            data.userinfo.level_id > 0 ? data.userinfo.level_id - 1 : 0;
        },
        err => {}
      );
    },
    goback() {
      // 判断历史记录的长度，v2.3.2配合运营
      if (this.goProfile) {
        this.$forward('profile');
      } else {
        this.$back();
      }
    },
    initBridge() {
      bridge.setNavigationBar({
        title: '我的等级',
        color: '#171900',
        background: 'nav_yellow_grid_bg',
        success(res) {
          console.log(res);
        },
      });
    },
    onticeClear() {
      this.noticeStatus = false;
    },
    // v2.3.0 用户一键升级,  这个事件只会在状态等于 1或者2的时候才会有
    upgradeBtn() {
      if (this.upgradeData.status == 1) {
        this.noticeStatus = true;
        this.noticeText = '需要完成所有个人资料才能快速升级哦';
      } else {
        // 调用一键升级接口
        api.userUpgrade(
          {},
          res => {
            console.log(res, 'res');
            this.getLevelList();
          },
          err => {}
        );
      }
    },
    // v2.3.1 新增公告点击跳转
    noticeJump() {
      this.$forward('setting');
    },
  },
  beforeDestroy() {
    off(this.$el, 'scroll', () => {});
  },
  // 导航进入该组件的对应路由时调用
  beforeRouteEnter(to, from, next) {
    // 不！能！获取组件实例 `this` 因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建。
    // 可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数。
    next(vm => {
      if (from.path == '/' || from.path != 'profile') {
        vm.goProfile = true;
      }
    });
  },
};
</script>
<style lang="stylus" scoped>


.swiper-top-number{
  top: 130px !important;
}

.level-top-number{
  top: 85px !important;
}

.update-level-box{
  width: 100%;
  height: 32px;
  line-height: 32px;
  text-align: center;
  position: absolute;
  top: 40px;
}
.update-level-btn{
  width: 148px;
  height: 32px;
  line-height: 32px;
  border-radius: 18px;
  font-size: 14px;
  background-image: linear-gradient(0deg, #FC851D 0%, #FB480D 82%);
  box-shadow: 0 2px 3px 1px rgba(198,150,5,0.59);
  color: #fff;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.level-btn-bear{
  background-image: linear-gradient(0deg, #8B8B8B 0%, #A7A7A7 80%) !important;
}
.level-btn-over{
  background: #FFFFFF;
  color: #FFBF00;
}
.level-over{
  color: #FFBF00;
  font-size: 18px;
  margin-top: 7px;
  margin-left: 2px;
  width: 17px;
  height: 17px;
}
.arrows-dot{
  margin-top: 6px;
  transform: rotate(180deg);
  font-size: 18px;
}
.successNav {
  width:100%;
  justify-content :center;
  align-items :center;
  margin :auto;
  position:absolute;
  top:80px;
}
>>>.swiper-slide img.imgSwiper{
  height:152px;
}
>>>.swiper-slide-prev{
  transform :scale(0.85);
  margin-top:-20px;
}
>>>.swiper-slide-prev img.imgSwiper{
  margin-left:21px;
  height:152px;
}
>>>.swiper-slide-prev img.isphoneSwiper{
  margin-left:23px;
  height:152px;
}
>>>.swiper-slide-next{
  left:10px;
  transform :scale(0.85);
  margin-top:-20px;
}
>>>.swiper-slide-next img.imgSwiper {
  margin-left:-20px;
  height:152px;
}
>>>.swiper-slide-active img.imgSwiper {
  height:auto;
}
.top-tag {
  position:absolute;
  left:4px;
  top:0;
  font-size:12px;
  height:24px;
  line-height:20px;
  width:60px;
  text-align:center;
  color:#fff;
  transform :scale(.85);
}
.icon-name{
  height: 1rem;
  overflow: hidden;
  width: 1rem;
  position: absolute;
  top: 5%;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.successNav .swiper-slide.swiper-slide-active img.imgSwiper {
  border-radius: 5px;
  width:100%;
}
.swiper-slide {
  position:relative;
}
img.swiper-item-icon {
  width:76px;
  height:76px;
  z-index:99;
  left:0;
  right:0;
  margin: 0 auto;
  display:block;
}
.level-name {
  left:0;
  right:0;
  margin: 0 auto;
  color:#fff;
  text-align:center;
  font-size:14px;
  display:block;
  margin-top:5px;
  font-weight:500;
}
.level-circle {
  width:30px;
  height:30px;
  background-image:url('~assets/profile/honey_circle@3x.png');
  background-size:30px auto;
  background-repeat:no-repeat;
  position : absolute;
  top:0;
  right:7%;
  z-index:99;
  padding-left:3px;
  font-size:12px;
  transform: scale(0.85);
  line-height:24px;
  color:#fff;
}
.level-tasks{
  font-size: 0.16rem;
  display: block;
  text-align: center;
  margin:auto;
  margin-bottom: 0.1rem;
  color: #333;
  font-weight: 500;
  width:124px;
  height:36px;
  background-image :url('~assets/profile/bg_task@3x.png');
  background-size:100%;
  background-repeat:no-repeat;
  margin-top:10px;
}
.level-text {
    position:relative;
  }
  .icon-tasks {
    display:block;
    width:8px;
    height:8px;
    position:absolute;
    left:0;
    top:5px;
    background: url("~assets/profile/pentagon.png") no-repeat center center;
    background-size:100% 100%;
  }
  .task-detail {
    font-size:14px;
    color:#333;
    line-height:24px;
    padding-left:15px;
    padding-right:20px;
    display :block;
  }
.level {
  position: relative;
}
.fix-header {
  position: fixed;
  top: 0;
  height: 40px;
  line-height: 40px;
  z-index: 999;
  width: 100%;
  text-align: center;
  overflow: hidden;
  .icon-left {
    color: #fff;
    position: absolute;
    left: 15px;
    top: 10px;
    height: 20px;
    width: 20px;
    line-height: 50px;
  }
  .txt-center {
    font-size: 17px;
    color:#171900;
  }
}
.header {
  width:100%;
  height:160px;;
  background: url("~assets/honey/level-center-bg@3x.png") no-repeat center center;
  background-size:100% 100%;
  .notice-box{
    width: 100%;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 10;
    height: 35px;
    line-height: 35px;
    top: 40px;
    background: rgba(0,0,0,.8);
    color: #fff;
    font-size: 14px;
    padding: 0 5px;
    .notice-icon{
      margin-top: 8px;
      margin-right: 3px;
      width: 20px;
      height: 20px;
      line-height: 35px;
      float: left;
    }
    .close-icon{
      margin-top: 8px;
      width: 20px;
      height: 20px;
      line-height: 35px;
      float: right;
    }
  }
  .notice-top{
    top: 0px !important;

  }
  .swiper-box {
    height:140px;
    width:70%;
    border:1px solid #ccc;
    position:absolute;
    top:80px;
    left:10%;
    margin-left:5%;
  }
}
.level-title {
    font-size:16px;
    display : block;
    text-align :center;
    margin:20px auto;
    color:#333;
    font-weight:500;
  }
.level-content {
  margin:60px auto;
}
.level-rights{
  display :flex;
  flex-wrap: wrap;
  margin-bottom:15px;
  margin:auto;
  .level-list {
    min-width :20%;
    text-align:center;
    margin-bottom:20px;
    position:relative;
    min-height:72px;
  }
  .level_list_0, .level_list_1, .level_list_2{
    width:64%;
  }
  .list-icon {
    width:50px;
    height:50px;
    display :block;
    margin:auto;
  }
  .list-icon-text {
    position:absolute;
    width:50px;
    line-height:14px;
    font-size:12px;
    transform :scale(0.85);
    background-image :linear-gradient(0deg, #FEDC00  0%, #FED100 100%);
    color:#fff;
    border-radius:7px;
    margin: -0.14rem auto 0.05rem;
    position:absolute;
    left:0;
    right:0;
    margin:0 auto;
    bottom:20px;
  }
  .icon-text {
    font-size:12px;
  }
}
  .note{
    color:#bbb;
    padding:12px 15px;
    display :block;
    line-height:18px;
    font-size:12px;
    margin-top:115%;
    background: #f6f7f9;
  }
.level_0,.level_4{
  color:#FEA66F;
}
.level_1,.level_5{
  color:#74A5CC;
}
.level_2,.level_6{
  color:#6C9058;
}
.level_3,.level_7{
  color:#B560D4;
}
.level_list_1 .level-list,.level_list_0 .level-list,.level_list_2 .level-list,.level_list_3 .level-list{
  width:50%;
  .list-icon {
    width:64px;
    height:64px;
  }
}
.level_list_5 .level-list,.level_list_6 .level-list,.level_list_4 .level-list{
  width:33%;
  .list-icon-text {
    padding-top:1px;
  }
}
.level_list_7 .level-list {
  width:33%;
}
</style>
