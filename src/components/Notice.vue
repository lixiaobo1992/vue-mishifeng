<template>
  <div class="notice-box">
    <Icon class="notice-laba" type="laba"></Icon>
    <div class="hidden-box">
      <p class="notice-text" :class="{ animation: textLength }">
        {{ noticeText }}
      </p>
    </div>
    <span class="close-icon" @click="closeNotice">X</span>
  </div>
</template>

<script>
import Icon from '@/ui/Icon';
import { mapActions } from 'vuex';
export default {
  name: 'notice',
  components: {
    Icon,
  },
  props: {
    noticeText: {
      type: String,
      default: '会员等级和蜂蜜折扣比例将在10/10号开始正式挂钩！',
    },
  },
  data() {
    return {};
  },
  computed: {
    textLength() {
      console.log(this.noticeText.length);
      if (this.noticeText.length > 28) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions(['setIndexNoticeStatus']),
    closeNotice() {
      this.setIndexNoticeStatus(false);
    },
  },
};
</script>

<style lang="stylus" scoped>
.notice-box{
  width: 100%;
  height: 24px;
  background: rgba(0,0,0,.8);
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .notice-laba{
    color: #FFBF00;
  }
  .hidden-box{
    width: 90%;
    overflow: hidden;
  }
  .notice-text{
    color: rgba(255,255,255,0.80);
    font-size: 12px;
    display: inline-block;
    white-space: nowrap;

  }
  .close-icon{
    color: #fff;
    font-size: 12px;
  }
}
.animation{
  animation: 15s wordsLoop linear infinite normal;
}
@keyframes wordsLoop {
  0% {
    transform: translateX(300px);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
