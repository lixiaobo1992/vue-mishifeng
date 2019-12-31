<template>
  <div class="magnify-img-box">
    <div class="magnify-top-box">
      <img
        class="magnify-back-icon"
        src="https://img.mishifeng.com/FsFBlDGxmdqRtX_DEaJeC9P5xZHT"
        @click="onClickBack"
      />
      <span class="img-number">{{ createNumber }}/{{ imgNumber }}</span>
    </div>
    <div class="magnify-swiper-box">
      <Swiper :auto="SwiperAuto" @change="change" :defaultIndex="createIndex">
        <SwiperItem
          v-for="(item, index) in imagesArr"
          :key="index"
          :data-link="item.link"
          :data-index="index"
          @click.native="$onUrlPage($event)"
        >
          <img class="image" :src="item.pic" />
        </SwiperItem>
      </Swiper>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from '@/ui';
import { mapState, mapActions } from 'vuex';
export default {
  name: 'magnify-img',
  components: {
    Swiper,
    SwiperItem,
  },
  computed: {
    ...mapState({
      imagesBigStatus: state => state.app.imagesBigStatus,
    }),
  },
  data() {
    return {
      SwiperAuto: 0,
      imgNumber: 0,
      createNumber: 1,
      createIndex: 0,
      imagesArr: [],
    };
  },
  mounted() {
    const { imgArray, index } = this.imagesBigStatus;
    this.imgNumber = imgArray.length;
    this.createNumber = Number(index) + 1;
    this.createIndex = Number(index);
    this.imagesArr = imgArray;
  },
  methods: {
    ...mapActions(['setImagesBigStatus']),
    // 关闭图片放大
    onClickBack() {
      this.setImagesBigStatus({ imageStatus: false });
    },
    change(index) {
      this.createNumber = Number(index) + 1;
    },
  },
};
</script>

<style lang="stylus" scoped>
.magnify-img-box{
  width: 100%;
  height: 100vh;
  background: #000;
  position: fixed;
  z-index: 8;
  .magnify-top-box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px;
    line-height: 64px;
    text-align: center;
    z-index: 9;
    background: rgba(0,0,0,0.80);
    .magnify-back-icon{
      position: absolute;
      left: 20px;
      top: 18px;
      width: 34px;
      height: 30px;
    }
    .img-number{
      color: #fff;
    }
  }
  .magnify-swiper-box{
    width: 100%;
    height: 100vh;
    .image{
      width: 100%;
      height: 100%;
    }
    >>> .mint-swipe-items-wrap{
      display: flex;
      align-items: center;
    }
    >>> .mint-swipe-indicators{
      display: none;
    }
  }
}
</style>
