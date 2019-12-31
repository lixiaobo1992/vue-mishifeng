<template>
  <div class="default-page">
    <div class="top-img" :style="styles"></div>
    <span
      class="desc"
      :style="fontStyle"
      v-html="fontItem.desc"
      v-show="fontItem.desc"
    ></span>
  </div>
</template>
<script>
export default {
  name: 'DefaultPage',
  props: {
    imgItem: Object,
    fontItem: Object,
  },
  computed: {
    styles() {
      const { src, width, height } = this.$props.imgItem;
      return {
        backgroundImage: src ? `url('${src}')` : null,
        width: `${width / 100}rem`,
        height: `${height / 100}rem`,
      };
    },
    fontStyle() {
      const { size, color, width } = this.$props.fontItem;
      return {
        fontSize: size ? `${size / 100}rem` : '12px',
        color: color ? color : '#ccc',
        width: `${width / 100}rem`,
      };
    },
  },
  methods: {},
};
</script>
<style lang="stylus" scoped>
.default-page{
  display:flex;
  flex-direction :column;
  justify-content :center;
  align-items:center;
  height:100%;
  width:100%;
  margin-top:40%;
  .desc {
    flex:1;
  }
  .top-img {
    display:block;
    background-repeat :no-repeat;
    background-size:100% auto;
    background-position :center;
  }
  .desc {
    display :block;
    text-align:center;
    word-break:break-all;
    margin-top:18px;
  }
}
</style>
