<template>
  <div :class="{ 'tag-box': true, 'tag-center': center }">
    <div class="tag-container">
      <ul class="tag-ul">
        <li
          class="tag-li"
          v-for="(item, index) in tags"
          :key="index"
          @click="onTagClick(item, index)"
        >
          <span
            :class="{ 'tag-item': true, 'tag-active': curtTagIdx == index }"
            >{{ item.name }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js';
let loop = null;

export default {
  name: 'CircleTags',
  props: {
    tags: {
      type: Array,
      default: function() {
        return [];
      },
    },
    curtIndex: {
      type: Number,
      default: 0,
    },
    center: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tagLineStyle: {
        paddingBottom: '0%',
      },
      // tag滚动dom
      tagScroller: null,
      // tag外盒子宽度
      tagContainerW: 0,
      // tag总宽度
      tagUlW: 0,
      // tag每个标签宽度
      tagLis: [],
      curtTagIdx: 0,
    };
  },
  watch: {
    curtIndex(val) {
      if (val !== this.curtTagIdx) {
        this.tagAnimate(val);
      }
    },
    tags(val, oldVal) {
      let [len, oldLen] = [0, 0];
      if (val) {
        len = val.length;
      }
      if (oldVal) {
        oldLen = oldVal.length;
      }
      if (len != oldLen) {
        this.updateTag();
      }
    },
  },
  created() {
    this.curtTagIdx = this.curtIndex;
    function animate(time) {
      loop = requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    animate();
  },
  mounted() {
    this.updateTag();
  },
  methods: {
    updateTag() {
      // console.log('updateTag');
      this.$nextTick(() => {
        const tagC = this.$el.querySelector('.tag-container');
        const tagU = this.$el.querySelector('.tag-ul');
        const tagL = this.$el.querySelectorAll('.tag-li');
        const tagI = this.$el.querySelectorAll('.tag-item');
        const rectC = tagC.getBoundingClientRect();
        const rectU = tagU.getBoundingClientRect();
        tagC.removeEventListener('touchmove', this.onTouchMove, false);
        tagC.addEventListener('touchmove', this.onTouchMove, false);
        this.tagScroller = tagC;
        this.tagContainerW = rectC.width;
        this.tagUlW = rectU.width;
        if (tagL && tagL.length) {
          this.tagLis = [];
          for (let i = 0; i < tagL.length; i++) {
            let rectLi = tagL[i].getBoundingClientRect();
            let rectItem = tagI[i].getBoundingClientRect();
            this.tagLis.push({ liW: rectLi.width, itemW: rectItem.width });
          }
        }
        this.tagAnimate(this.curtTagIdx);
      });
    },
    tagAnimate(index) {
      const that = this;
      this.curtTagIdx = index;
      if (this.tagLis.length) {
        const width = this.tagLis[index]['itemW'];
        let sum = 0;
        if (index > 0) {
          for (let i = 0; i < index; i++) {
            sum += this.tagLis[i]['liW'];
          }
        }
        sum += (this.tagLis[index]['liW'] - width) / 2;
        let curtLeft = this.tagScroller.scrollLeft;
        let targetLeft = sum + width / 2 - this.tagContainerW / 2;
        let diffLeft = this.tagUlW - this.tagContainerW;
        if (targetLeft <= 0) {
          targetLeft = 0;
        } else if (targetLeft >= diffLeft) {
          targetLeft = this.tagUlW - this.tagContainerW / 2;
        }
        // 居中动画
        const myTween = new TWEEN.Tween({
          left: curtLeft,
        })
          .to({ left: targetLeft }, 300)
          .onUpdate(function(data) {
            // console.log(data);
            that.tagScroller.scrollLeft = data.left;
          })
          .onComplete(function() {
            TWEEN.removeAll();
          });
        myTween.start();
        // 滑块动画
        this.tagLineStyle = {
          width: `${width}px`,
          transform: `translate3d(${sum}px,0,0)`,
          '-webkit-transform': `-webkit-translate3d(${sum}px,0,0)`,
        };
      }
      //console.log('1');
    },
    onTagClick(item, index) {
      // console.log(index);
      if (index == this.curtTagIdx) {
        return;
      }
      this.tagAnimate(index);
      /*****以上是动画部分，下面是数据处理*****/
      this.$emit('onTagClick', item, index);
    },
    onTouchMove(e) {
      e.stopPropagation();
    },
  },
  beforeDestroy() {
    // 销毁loop
    loop && cancelAnimationFrame(loop);
  },
};
</script>

<style lang="stylus" scoped>
.tag-box{
  height: 36px;
  overflow: hidden;
}
.tag-container{
  position: relative;
  width: 100%;
  height: 36px;
  padding-left: 14px;
}
.tag-ul{
  width: 100%;
  line-height: 23px;
  display: flex;
  font-size: 14px;
  padding: 8px 0px;
  white-space: nowrap;
  overflow-x: scroll;
}
.tag-li{
  display: inline-block;
  height: 23px;
  line-height: 23px;
  margin-right: 8px;
  border-radius: 12px;
  position: relative;
  span{
    padding: 0px 15px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0,0,0,0.10);
    color:#999;
    &.tag-active{
      color:#171900;
      background: #fde044;
      font-weight: bold;
      box-shadow: 0;
    }
  }
}
.tag-line{
  position: absolute;
  left: 14px;
  bottom: 5px;
  width: 32px;
  height: 3px;
  background-color: #FDE044;
  transform: translate3d(10px, 0, 0);
  transition: all .3s;
  border-radius: 3px;
}
.tag-active{
  font-weight: bold;
  box-shadow: 0;
  background: #FDE044;
}
.tag-active::after{
  content: '';
  display: block;
  position: absolute;
  bottom: -2px;
  left: 24px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #FDE044;
  transform:rotate(180deg);
}
.tag-center{
  text-align: center;
  .tag-container{
    display: inline-block;
  }
}
</style>
