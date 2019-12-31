<template>
  <div class="star-box">
    <span
      class="star-item"
      v-for="(i, index) in starData"
      :key="index"
      :class="{ active: i }"
      @click.stop="clickEvent(index)"
    ></span>
  </div>
</template>

<script>
// import activeIcon from '@/assets/img/article/rate-active.png';
// import normalIcon from '@/assets/img/article/rate-disabled.png';

export default {
  name: 'star',
  props: {
    //
    value: Number,
    scoreMax: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      type: 1, //分治1: 5/ 2:100
      cardinal: this.scoreMax / 5, // 基数
    };
  },
  created() {
    ///
    console.log(this.value);
  },
  mounted() {
    //
  },
  computed: {
    //
    starData() {
      //
      let starVal = [];
      // const tempVal = this.cardinal % this.value ?;
      //
      //
      const starSum = Math.ceil((this.value * 5) / this.scoreMax);
      for (let i = 1; i <= 5; i++) {
        // 这里还存在问题
        if (i <= starSum) {
          starVal.push(1);
        } else {
          starVal.push(0);
        }
      }
      // console.log(starVal);
      return starVal;
    },
  },
  methods: {
    //
    clickEvent(index) {
      if (Object.keys(this._events).indexOf('input') > -1) {
        let currIndex = index + 1;
        if (this.value == this.cardinal && index == 0) {
          currIndex = 0;
        }
        this.$emit('input', this.cardinal * currIndex);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.star-box{
  position: relative;
  .star-item{
    display: inline-block;
    width: 20px;
    height: 17px;
    margin-right: 3px;
    vertical-align: middle;
    background: url("~assets/img/article/cellular@2x.png") no-repeat center center;
    background-size: auto 100%;
    &.active{
      background-image: url("~assets/img/article/cellular-visit@2x.png");
    }
  }
}
</style>
