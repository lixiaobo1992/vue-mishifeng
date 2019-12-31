<template>
  <div class="layer-box">
    <div class="layer-page-one" v-if="pageCount == 1">
      <img
        class="layer-img"
        src="https://img.mishifeng.com/FrD8rwvXUZ9E7OdMamBGRwjI8wQe"
      />
      <span class="layer-btn" @click="goNext"></span>
    </div>
    <div class="layer-page-two" v-if="pageCount == 2">
      <img
        class="layer-img"
        src="https://img.mishifeng.com/FhdYnp7jNpizAVUU7KvTqkLPzB47"
      />
      <span class="layer-btn" @click="goNext"></span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { storage } from '@dwdjs/utils';
export default {
  name: 'product-guide-layer',
  data() {
    return {
      pageCount: 1,
    };
  },
  computed: {
    ...mapState({
      productGuideLayerStatus: state => state.app.productGuideLayerStatus,
    }),
  },
  methods: {
    ...mapActions(['setProductGuideLayer']),
    goNext() {
      if (this.pageCount === 1) {
        this.pageCount = 2;
      } else {
        this.setProductGuideLayer(false);
        storage.set('guideLyaer', true, 0);
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.layer-box{
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0,0,0,.5);
  z-index: 3;
  .layer-page-one{
    width: 100%;
    height: 100vh;
    .layer-img{
      width: 100%;
      height: 100%;
    }
    .layer-btn{
      width: 150px;
      height: 60px;
      position: fixed;
      bottom: 25px;
      left: 100px;
    }
  }
  .layer-page-two{
    width: 100%;
    height: 100vh;
    .layer-img{
      width: 100%;
      height: 100%;
    }
    .layer-btn{
      width: 150px;
      height: 60px;
      position: fixed;
      bottom: 150px;
      left: 100px;
    }
  }
}
</style>
