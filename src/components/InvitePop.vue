<template>
  <div class="bg" v-show="settingStatus">
    <div class="setting-box">
      <!-- 2.1版本新增 关闭按钮 -->
      <span class="header-clear-icon" v-show="setType === 5" @click="clearBtn"
        >X</span
      >
      <span class="header-title" v-show="setType === 1">新手任务</span>
      <span class="header-title" v-show="setType === 3">完善个人资料</span>
      <span class="header-title" v-show="setType === 4"
        >蜂蜜抵扣功能待解锁</span
      >
      <span class="header-title" v-show="setType === 5 || setType === 6"
        >核销成功</span
      >
      <span
        class="box-title"
        v-show="setType === 2 || setType === 1"
        v-html="headerText"
      ></span>
      <span
        class="box-text"
        v-html="settingText"
        :class="{ textActive: setType === 2 }"
      ></span>
      <i class="box-notice" v-show="setType === 1 && noticeText">{{
        noticeText
      }}</i>
      <div class="tab-btn">
        <div
          class="box-btn"
          v-for="(item, index) in btnText"
          :key="'box' + index"
          @click.stop="handleBox(index, setType)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'invite-pop',
  props: {
    setType: {
      // 1=>刚进入  2=>未填写完整  3.7天内未填写
      type: Number,
      default: 1,
    },
    settingStatus: {
      type: Boolean,
      default: false,
    },
    headerText: {
      type: String,
      default: '再完成以下信息就可以领取新手礼包啦',
    },
    settingText: {
      type: String,
      default: `换掉默认头像和昵称,<br>完善性别、生日、个人描述,<br/>你就是整个觅食蜂最靓的探店达人！`,
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
    closeMask() {
      this.settingStatus = false;
    },
    // 2.1版本新增 关闭按钮
    clearBtn() {
      let index = 5;
      let type = 'clear';
      this.$emit('btnEvent', Object.assign({}, { index }, { type }));
    },
  },
};
</script>
<style lang="stylus" scoped>
.bg {
  background: rgba(0,0,0,0.5);
  height:100%;
  width:100%;
  position :absolute;
  top:0;
  right:0;
  z-index:999;
}
.setting-box {
  padding:20px 10px 0;
  background :#fcfcfc;
  width:280px;;
  position:fixed;
  top:40%;
  margin:0 auto;
  right:0;
  left:0;
  z-index:999;
  border-radius :12px;
  .header-clear-icon{
    position: absolute;
    background: #e2e2e2;
    color: #333;
    font-size: 14px;
    top: 9.5px;
    right: 9.5px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    line-height: 20px;
    text-align: center;
  }
}
.header-title {
  width:100%;
  text-align:center;
  display :block;
  color:#030303;
  font-size:17px;
  padding-top:15px;
  padding-bottom:15px;
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
.box-text {
  color:#333;
  font-size:14px;
  display:block;
  line-height:20px;
  padding-bottom:10px;
  padding-left:10px;
}
.textActive {
  color:#ffff00;
}
.box-notice {
  display: block;
  color:#666;
  font-size:12px;
}
.tab-btn {
  display:flex;
  flex-direction :row;
  margin-top: 0.25rem;
  border-top: 0.01rem solid #c4c4c4;
}
.box-btn {
  text-align:center;
  font-size:17px;
  min-width:120px;
  color:#007AFF;
  border-right:1px solid #c4c4c4;
  height:44px;
  line-height:40px;
  margin: 0 auto;
  &:last-child {
    border-right:none;
  }
}
</style>
