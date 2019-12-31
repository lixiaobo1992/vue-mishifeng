<template>
  <div class="ranking-button" :style="styles" @click.stop="btnClick">
    <span :style="fontStyle">{{ btnText }}</span>
  </div>
</template>
<script>
export default {
  name: 'dumpling-button',
  props: {
    imgItem: Object,
    fontItem: Object,
    btnText: {
      type: String,
      default: '确定',
    },
  },
  computed: {
    styles() {
      const { width, height, bgcolor } = this.$props.imgItem;
      return {
        // backgroundImage: src ? `url('${src}')` : null,
        width: `${width / 100}rem`,
        height: `${height / 100}rem`,
        lineHeight: `${height / 100}rem`,
        backgroundColor: bgcolor ? `${bgcolor}` : ``,
      };
    },
    fontStyle() {
      const { size, color, width } = this.$props.fontItem;
      return {
        fontSize: size ? `${size / 100}rem` : '12px',
        color: color ? color : '#fff',
        width: `${width / 100}rem`,
      };
    },
  },
  methods: {
    btnClick() {
      console.log('传递');
      this.$emit('btnEvent');
    },
  },
};
</script>
<style lang="stylus" scoped>
.ranking-button{
  width:100%;
  text-align:center;
  font-size:12px;
  border-radius:10px;

}
</style>
