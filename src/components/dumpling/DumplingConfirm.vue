<template>
  <div class="bg" v-show="settingStatus" @click="closeBox">
    <div class="setting-box">
      <!-- 弹窗标题 -->
      <span
        class="header-title"
        v-show="headerTitle"
        v-html="headerTitle"
      ></span>
      <!-- 标题提示 -->
      <span
        class="box-title"
        v-show="headerNotice"
        v-html="headerNotice"
      ></span>
      <!-- <img src="~assets/dumplings/confirm-example.png" class="img-con" /> -->
      <img :src="imgUrl" class="img-con" v-show="imgUrl" />
      <!-- 标题正文内容 -->
      <span
        class="box-text"
        v-html="settingText"
        :class="{ typeTitle: setType == 3 }"
      ></span>
      <!-- 标题提示 -->
      <i class="box-notice" v-show="noticeText" v-html="noticeText"></i>
      <div class="tab-btn">
        <div
          class="box-btn"
          v-for="(item, index) in btnText"
          :key="'box' + index"
          :class="'box_btn_' + index"
          @click.stop="handleBox(index, setType)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <img
      src="~assets/dumplings/close-circle.png"
      class="close-box"
      @click.stop="closeBox"
    />
  </div>
</template>
<script>
export default {
  name: 'invite-pop',
  props: {
    setType: {
      type: Number,
      default: 1,
    },
    settingStatus: {
      type: Boolean,
      default: false,
    },
    headerTitle: {
      type: String,
      default: '',
    },
    headerNotice: {
      type: String,
      default: '',
    },
    imgUrl: {
      type: String,
      default: '',
    },
    settingText: {
      type: String,
      default: ``,
    },
    noticeText: {
      type: String,
      default: `需完成本页上全部信息才能领取到新手礼包哦～`,
    },
    btnText: {
      type: Array,
      default: () => {
        return ['暂时放弃', '继续填写'];
      },
    },
  },
  methods: {
    handleBox(index, type) {
      this.$emit('btnEvent', Object.assign({}, { index }, { type }));
    },
    closeBox() {
      this.$emit('closeBox');
    },
  },
};
</script>
<style lang="stylus" scoped>
.bg {
  background: rgba(0,0,0,0.5);
  //background-color #f00;
  height:100%;
  width:100%;
  display  :table;
  z-index:999;
  position:absolute;
  top:0;
}
.setting-box {
  padding:20px 10px 0;
  background :#fcfcfc;
  width:280px;;
  position:fixed;
  margin:auto;
  left:50%;
  top:50%;
  z-index:999;
  border-radius :12px;
  transform: translate(-50%, -50%);
}
.header-title {
  width:100%;
  text-align:center;
  display :block;
  color:#030303;
  font-size:17px;
  padding-top:15px;
  padding-bottom:6.5px;
  font-weight :500;
}
.box-title {
  color:#fdcc02;
  font-size:14px;
  display:block;
  line-height:18px;
  padding-bottom:10px;
  padding-left:10px;
  text-align:center;
}
.img-con {
  width:115px;
  height:115px;
  margin: 10px auto;
  display:block;
}
.box-text {
  color:#333;
  font-size:14px;
  display:block;
  line-height:20px;
  padding-bottom:10px;
  padding-left:10px;
  font-weight: 500;
  text-align:center;
}
.textActive {
  color:#ffff00;
}
.box-notice {
  display: block;
  color:#666;
  font-size:12px;
  text-align:center;
}
.tab-btn {
  display:flex;
  flex-direction :row;
}
.box-btn {
  text-align:center;
  font-size:17px;
  min-width:120px;
  color:#fff;
  margin: 20px auto 30px;
  background: #89C225;
  border-radius:20px;
  padding:10px;
  &:last-child {
    border-right:none;
  }
}
.box_btn_0 {
  background:#F9A121;
}
.close-box {
  width:32px;
  height:32px;
  position:fixed;
  margin:0 auto;
  top:78%;
  right:0;
  left:0;
}
</style>
