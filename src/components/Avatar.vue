<template>
  <span class="avatar-warapper">
    <div class="avatar-border">
      <div :style="styles" :class="classes" class="vue-avatar">
        <slot></slot>
      </div>
      <Icon class="avatar-mask" type="avatar-mask" :color="maskColor"></Icon>
      <i
        class="bottom-nav"
        :style="navStyles"
        :class="{ navvip: navSatus }"
        v-show="navSatus"
        ><sub v-show="navType > 0">{{ navText.navText }}</sub></i
      >
    </div>
  </span>
</template>

<script>
import Icon from '@/ui/Icon';
import defaultNavsrc from '@/assets/img/avator-status.png';
import officialNavsrc from '@/assets/img/official-icon.png';
import probeNavsrc from '@/assets/img/probe-icon.png';
// hexagon-gap-left (1 - Math.sqrt(3)/2)/2
// const hexagonStart = ((1 - Math.sqrt(3) / 2) / 2) * 100;
// const hexagonEnd = 100 - hexagonStart;

// https://docs.alipay.com/mini/component/image
const modes = {
  // aspectFit: 'auto', // 背景图像的真实大小
  scaleToFill: 'contain', // 将背景图像等比缩放到宽度或高度与容器的宽度或高度相等，背景图像始终被包含在容器内
  aspectFill: 'cover', // 将背景图像等比缩放到完全覆盖容器，背景图像有可能超出容器
  widthFix: '100% auto',
  heightFix: 'auto 100%',
};
export default {
  name: 'avatar',
  components: {
    Icon,
  },
  props: {
    prefixCls: String,
    src: String,
    spin: Boolean,
    shadow: Boolean,
    size: [String, Number],
    // prettier-ignore
    bg: String,
    color: String,
    mode: {
      type: String,
      default: 'aspectFill',
      validator(value) {
        return Object.keys(modes).includes(value);
      },
    },
    shape: {
      type: String,
      validator(value) {
        return ['circle', 'hexagon'].includes(value);
      },
    },
    //是否显示认证达人
    navSatus: {
      type: [Boolean, Number],
      default: false,
    },
    navType: {
      type: Number,
      default: 0,
    },
    navsrc: {
      type: String,
      default: defaultNavsrc,
    },
    // navsize: [String, Number],
    maskColor: {
      type: String,
      default: '#ffffff',
    },
  },
  computed: {
    classes() {
      const { spin, shadow, shape } = this.$props;
      return {
        // icon: true,
        [`is-spin`]: spin,
        [`is-${shape}`]: !!shape,
        [`is-shadow`]: !!shadow,
      };
    },
    styles() {
      const { src, size = 0, color, bg, mode } = this.$props;
      return {
        backgroundImage: src ? `url('${src}')` : null,
        width: `${size / 100}rem`,
        height: `${size / 100}rem`,
        color: !!color,
        backgroundColor: bg ? bg : null,
        backgroundSize: modes[mode],
      };
    },
    navStyles() {
      const { navType } = this.$props;
      let bgSrc = '';
      switch (navType) {
        case 0:
          bgSrc = null;
          break;
        case 1:
          bgSrc = defaultNavsrc;
          break;
        case 2:
          bgSrc = probeNavsrc;
          break;
        case 3:
          bgSrc = officialNavsrc;
          break;
        default:
          break;
      }
      return {
        backgroundImage: `url('${bgSrc}')`,
      };
    },
    navText() {
      const { navType } = this.$props;
      let navText = '';
      switch (navType) {
        case 0:
          navText = '';
          break;
        case 1:
          navText = '认证达人';
          break;
        case 2:
          navText = '探店达人';
          break;
        case 3:
          navText = '官方账号';
          break;
        default:
          break;
      }
      return {
        navText,
      };
    },
  },
};
</script>

<style lang="stylus" scoped>
// $hexagonStart = ((1 - Math.sqrt(3) / 2) / 2) * 100;
$hexagonGap = 6.698729810778071;
$hexagonStart = ($hexagonGap)%;
$hexagonEnd = (100 - $hexagonGap)%;

.avatar-warapper {
  overflow: hidden;
}
.avatar-border {
  position: relative;
  &.is-shadow {
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
  }
}
.avatar-mask {
  position: absolute 0 0 0 0;
  z-index: 1;
  size: 110%;
  color: transparent;
  // border: 10px solid;
  transform: translate(-5%, -5%);
  box-sizing: content-box;
}
.vue-avatar {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &.is-circle {
    // clip-path: circle(50% at 50% 50%);
  }
  &.is-hexagon {
    clip-path: polygon(50% 0%, $hexagonEnd 25%, $hexagonEnd 75%, 50% 100%, $hexagonStart 75%, $hexagonStart 25%);
  }
}
.bottom-nav{
  position:absolute;
  right:0;
  bottom:0;
  z-index:99;
  width:100%;
  background-image: url("~assets/img/avator-status.png");
  background-size:100% 100%;
  background-repeat:no-repeat;
  sub{
    font-size:12px;
    transform :scale(0.84);
    color:#fff;
    margin-left:27%;
    display:inline-block;
    bottom :0;
  }
}
.navvip{
  height: 16px;
  width: 16px;;
  bottom: -2px;
  right: 0px;;
}
</style>
