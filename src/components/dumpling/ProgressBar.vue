<template>
  <div class="progress">
    <div
      class="progress-bar bar-left"
      :class="{ 'progress-striped actice': animate }"
      :style="{ width: (precent < 100 ? precent : 100) + '%' }"
    ></div>
    <!-- <span class="progress-text">{{ valueText }}</span> -->
    <span
      class="progress-text left-text"
      :style="{ width: (precent < 100 ? precent : 100) + '%' }"
      >{{ leftValue }}</span
    >
    <span
      class="progress-text right-text"
      :style="{ width: (100 - precent < 100 ? 100 - precent : 100) + '%' }"
      >{{ rightValue }}</span
    >
    <div
      class="progress-bar bar-right"
      :class="{ 'progress-striped actice': animate }"
      :style="{ width: (100 - precent < 100 ? 100 - precent : 100) + '%' }"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'progressBar',
  props: {
    animate: {
      type: Boolean,
      default: true,
    },
    totalNum: {
      type: Number,
      default: 100,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  computed: {
    precent() {
      return parseInt((this.value * 100) / this.totalNum, 10);
    },
    leftValue() {
      return this.value;
    },
    rightValue() {
      return this.totalNum - this.value;
    },
  },
  //data() {},
  methods: {},
};
</script>
<style lang="stylus" scoped>
.progress{
  height:24px;
  width:76%;
  border-radius:5px;
  margin: 0 auto;
  position:relative;
}
.progress-bar {
  position:absolute;
  top:3px;
  width:0;
  height:18px;;
  font-size:12px;
  color:#fff;
  text-align:center;
  border-radius:5px;
  transition:width .6s ease;
  animation :progress-bar-stripes 2s linear infinite;
  background-image :linear-gradient(45deg, rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,
                      rgba(255,255,255,.15) 75%, transparent 75%,transparent);
  background-size: 40px 40px;
}
.bar-left {
  left:0;
  left:3px;
  background-color :#fc545a;
}
.bar-right {
  right:0;
  right:3px;
  background-color :#64b6e7;
}
@keyframes progress-bar-stripes {
  0% {
    background-position:40px 0;
  }
  100% {
    background-position:0 0;
  }
}
  // .progress-striped {
  //   background-image :linear-gradient(45deg, rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,
  //                     rgba(255,255,255,.15) 75%, transparent 75%,transparent);
  // background-size: 40px 40px;
  // }
.progress-text {
  font-size:12px;
  color:#fff;
  z-index:999;
  position:absolute;
  height:18px;
  line-height:18px;
  top:3px;
  text-align:center;
}
.left-text{
  left:0px;
}
.right-text {
  right:0;
}
</style>
