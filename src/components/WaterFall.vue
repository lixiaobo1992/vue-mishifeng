/** *
<water-fall
  ref="waterfall"
  :init-data="initData"
  :has-cover="hasCover"
  @ontap="onTap"
  @ondelete="onDelete"
  @oncomplete="onComplete"
></water-fall>
* 注意：数据不是通过props传入的，而是通过调用setDate传入的！！！！！ *
props：initData为缓存数据，即onComplete返回的数据；hasCover是否有遮罩，个人中心传true
* onTap(id, index)、onDelete(id, index)、onComplete(initData,
index)在自己页面内定义， *
onTap点击触发，去跳转；onDelete点击删除触发，删除逻辑；onComplete瀑布流改变时触发，返回当前当前瀑布流数据和tag下标
* 调用方法： * this.$refs.waterfall.setDate(data, type, index); *
this.$refs.waterfall.deleteItem(index); **/
<template>
  <div class="wf-container">
    <div class="wf-main" :style="mainStyle">
      <div
        class="wf-list"
        v-for="(item, index) in lists"
        :key="index"
        :style="item.style"
      >
        <div
          class="content"
          v-press="onPress"
          :data-id="item.id"
          :data-index="index"
          @click="onClick(item.id, index, item.user_id, item.media_type)"
        >
          <div class="pic" :style="{ paddingBottom: item.ratio }">
            <img class="image" :src="item.pic" />
          </div>
          <p class="title max-line-2">{{ item.title }}</p>
          <div class="info flex">
            <div class="user ellipsis flex-1">
              <img class="icon" :src="item.user_avatar" />
              <img
                class="vip"
                src="~assets/img/vip.png"
                v-show="item.quality_user == 1"
              />
              <div class="user-level-box">
                <i class="user_name">{{ item.user_nickname }}</i>
                <div
                  class="level-img-box"
                  v-for="(levelItem, levelIndex) in levelList"
                  :key="levelIndex"
                >
                  <img
                    class="level-img"
                    v-if="levelItem.level == item.level_id"
                    :src="levelItem.image"
                  />
                </div>
              </div>
            </div>
            <div
              class="zan"
              ref="'like_' + index"
              @click.stop="
                itemLike(index, item.likes_num, item.id, item.media_type)
              "
              :class="{ active: item.likes_status }"
            ></div>
            <span>{{ item.likes_num }}</span>
          </div>
        </div>
        <!-- 删除遮罩 -->
        <div
          class="cover"
          v-if="item.showCover"
          ref="deleteCover"
          v-show="isClicked"
          :style="{ paddingBottom: item.ratio }"
        >
          <img
            class="icon-delete"
            src="~assets/profile/icon_delete.png"
            @touchstart="isClicked && onDelete(item.id, index)"
          />
        </div>
      </div>
    </div>
    <div class="wf-virt">
      <div
        class="wf-virt-list"
        v-for="(item, index) in virtLists"
        :key="index"
        :style="{ width: listW + 'px' }"
      >
        <div class="pic" :style="{ paddingBottom: item.ratio }"></div>
        <p class="title max-line-2">{{ item.title }}</p>
        <div class="info flex">
          <div class="user ellipsis flex-1">
            <img class="icon" :src="item.user_avatar" />
            <img class="vip" src="~assets/img/vip.png" />
            {{ item.user_nickname }}
          </div>
          <div
            class="zan"
            @click.stop="itemLike(index, item.likes_num, item.id)"
          ></div>
          <span>{{ item.likes_num }}</span>
        </div>
      </div>
      <div class="wf-gap"></div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { clone } from '@/utils';
import tongji from '@/utils/tongji';

export default {
  name: 'WaterFall',
  props: {
    initData: {
      type: Object,
      default: function() {
        return { lists: [], mainStyle: '' };
      },
    },
    hasCover: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lists: [],
      virtLists: [],
      mainStyle: '',
      gapW: 0,
      gapH: 0,
      listW: 0,
      startL: { x: 0, y: 0 },
      startR: { x: 0, y: 0 },
      curtIndex: 0,
      showCover: false,
      isClicked: true,
      likeClicked: false,
      levelList: [
        // v2.4.0等级列表
        {
          level: 1,
          image: 'https://img.mishifeng.com/FgY5XT2DOQPbe9DikpyOHsXltMcN',
        },
        {
          level: 2,
          image: 'https://img.mishifeng.com/FobnFz2hIEYX93jUsZ2vZ20Yrf_T',
        },
        {
          level: 3,
          image: 'https://img.mishifeng.com/FjMiAxVy_1QJBJ88i32P7MI-TJUb',
        },
        {
          level: 4,
          image: 'https://img.mishifeng.com/FoPcuQ2ZdOXo6f_neo3XROREd9dm',
        },
        {
          level: 5,
          image: 'https://img.mishifeng.com/Fv4AympZ5RM4f2S-GgedxnOD845C',
        },
        {
          level: 6,
          image: 'https://img.mishifeng.com/Fog7ZsXSvEaLUViwe-K3MHc7CP54',
        },
        {
          level: 7,
          image: 'https://img.mishifeng.com/FiUTqDr4AFMCFVi7tPHFVsDDVf1p',
        },
        {
          level: 8,
          image: 'https://img.mishifeng.com/FpWmuysyqR_cXUT5pSjO_kikdAMt',
        },
      ],
    };
  },
  watch: {
    initData(val) {
      this.lists = clone(val.lists);
      this.mainStyle = clone(val.mainStyle);
      this.startL = clone(val.startL);
      this.startR = clone(val.startR);
    },
  },
  mounted() {
    console.log(this.lists, 'lists');
    this.$nextTick(() => {
      this.getGapSize('init');
    });
  },
  methods: {
    getGapSize(data = [], type = 'push', index = 0) {
      const gap = this.$el.querySelector('.wf-gap');
      const rect = gap.getBoundingClientRect();
      this.gapW = rect.width;
      this.gapH = rect.height;
      this.listW = (this.gapW - this.gapH) / 2;
      this.startR.x = this.listW + this.gapH;
      if (data === 'init') {
        return;
      }
      this.setDate(data, type, index);
    },
    // type：1、push添加，2、reset重置
    setDate(data = [], type = 'push', index = 0) {
      // console.log(data);
      if (!this.gapH) {
        setTimeout(() => {
          this.getGapSize(data, type, index);
        }, 1);
        return;
      }
      const list = clone(data);
      if (!list || list.length === 0) {
        if (type == 'reset') {
          this.lists = [];
          this.mainStyle = '';
        }
        this.$emit(
          'oncomplete',
          {
            lists: clone(this.lists),
            mainStyle: clone(this.mainStyle),
            startL: { x: 0, y: 0 },
            startR: { x: this.startR.x, y: 0 },
          },
          index
        );
        return;
      }
      for (let item of list) {
        item.ratio = (item.height * 100) / item.width + '%';
      }
      this.virtLists = list;
      this.$nextTick(() => {
        const virtLists = this.$el.querySelectorAll('.wf-virt-list');
        for (let i = 0; i < virtLists.length; i++) {
          let rect = virtLists[i].getBoundingClientRect();
          list[i]['vw'] = rect.width;
          list[i]['vh'] = rect.height;
        }
        this.addToList(list, type, index);
        this.virtLists = [];
      });
    },
    addToList(data, type, index) {
      const startL = { ...this.startL };
      const startR = { ...this.startR };
      const gap = this.gapH;
      //const listW = this.listW;
      if (type == 'reset') {
        startL.y = 0;
        startR.y = 0;
      }
      for (let item of data) {
        let [left, top] = [0, 0];
        if (startL.y <= startR.y) {
          left = startL.x;
          top = startL.y;
          startL.y = startL.y + item.vh + gap;
        } else {
          left = startR.x;
          top = startR.y;
          startR.y = startR.y + item.vh + gap;
        }
        item.style = {
          left: `${left}px`,
          top: `${top}px`,
          // width: `${listW}px`,
        };
        item.showCover = false;
      }
      this.startL = startL;
      this.startR = startR;
      this.mainStyle = { height: Math.max(startL.y, startR.y) + 'px' };
      const listsLen = this.lists.length;
      if (type == 'reset') {
        this.lists.splice(0, listsLen, ...data);
      } else {
        this.lists.splice(listsLen, 0, ...data);
      }
      this.curtIndex = index;
      this.$emit(
        'oncomplete',
        {
          lists: clone(this.lists),
          mainStyle: clone(this.mainStyle),
          startL: clone(startL),
          startR: clone(startR),
        },
        index
      );
    },
    onDelete(id, index) {
      setTimeout(() => {
        this.$emit('ondelete', id, index);
      }, 300);
    },
    deleteItem(index) {
      const lists = clone(this.lists);
      lists.splice(index, 1);
      this.addToList(lists, 'reset', this.curtIndex);
    },
    onClick(id, index, user_id, media_type) {
      this.$emit('ontap', {
        id,
        index,
        user_id,
        media_type,
      });
    },
    onPress(el) {
      // console.log(el);
      if (!this.hasCover) {
        return;
      }
      const index = el.getAttribute('data-index');
      console.log(index, 'index');
      const article = { ...this.lists[index] };
      article.showCover = true;
      this.lists.splice(index, 1, article);
    },
    onCloseCover(index) {
      setTimeout(() => {
        const article = { ...this.lists[index] };
        article.showCover = false;
        this.lists.splice(index, 1, article);
      }, 301);
    },
    itemLike(index, num, id, media_type) {
      console.log(index, num, id);
      const value = `index:${index},value:{articleId:${id},liked:${this.lists[index].likes_status},articleType:${media_type}}`;
      tongji.event('c_article_like', value);
      this.isClicked = false;
      this.showCover = true;
      api.toggleLike(
        {
          id: id,
        },
        res => {
          this.ind = index;
          console.log(res.data.likes_num, 'num');
          this.lists[index].likes_num = res.data.likes_num;
          this.lists[index].likes_status = res.data.status == 1 ? true : false;
        },
        err => {
          console.log(err);
        }
      );
    },
  },
};
</script>

<style lang="stylus">
.wf-container{
  position: relative;
  padding-top: 10px;
  z-index:1;
}
.wf-main{
  position: relative;
  left: 0;
  top: 0;
}
.wf-list,.wf-virt-list{
  position: absolute;
  background-color: #fff;
  border-radius: 3px;
  //box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
  overflow: hidden;
  width:50%;
  .content,.pic{
    position: relative;
    left: 0;
    top: 0;
  }
  .image{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .title{
    font-size: 13px;
    margin: 7px;
    line-height: 20px;
    max-height: 40px;
    color:#2a2a2a;
    font-weight:500;
  }
  .info{
    font-size: 12px;
    padding: 0px 5px 10px;
    height: 30px;
    line-height: 20px;
  }
  .user{
    position: relative;
    padding-left: 24px;
    display: flex;
    align-items: center;
    font-size: 12px;
    transform: scale(.92);
    color: #333;
    span{
      color:#333;
    }
  }
  .icon{
    position: absolute;
    left: 1px;
    top: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .vip{
    position:absolute;
    width:10px;
    height:10px;
    left:12px;
    bottom:-1px;
  }
  .user-level-box{
    display: flex;
    align-items: center;
    .user_name {
      max-width:92px;
      display :inline-block;
      overflow :hidden;
      text-overflow :ellipsis;
    }
    .level-img-box{
      .level-img{
        margin-left: 2px;
        width: 35px;
        height: 12px;
      }
    }
  }

  .zan{
    padding-left: 20px;
    background: url(../assets/img/article/like.png) no-repeat;
    background-position:1% 2px;
    background-size: 19.2px 13.6px;
    height:13.6px;
    z-index: 99;
    &.active {
      background: url(../assets/img/article/like-active.png) no-repeat;
      background-position: 1% 0.01rem;
      background-size: 0.192rem 0.136rem;
      //animation: isActive 1s 0s;
    }
  }
  @keyframes isActive{
  0% {
    opacity:1;
    transform scale(1)
  }
  50% {
    opacity:0;
    transform scale(1.5)
  }
  100% {
    opacity:1;
    transform scale(1)
  }
}
  .cover{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: rgba(0, 0, 0, .3);
    border-radius: 5px;
  }
  .icon-delete{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50px;
    transform: translate3d(-50%, -50%, 0);
  }
}
.wf-virt{
  position: absolute;
  left: -1000px;
  top: -1000px;
  width: 100%;
  visibility: hidden;
}
.wf-gap{
  width: 100%;
  height: 10px;
}
</style>
