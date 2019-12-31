<template>
  <div class="pages-setting" :hidden="hiddenPage">
    <div class="fix-header" v-if="!isMSF" @click="goBack">
      <img class="icon-left" src="~assets/profile/right.png" />
      <span class="txt-center">我的等级</span>
    </div>
    <div class="personal-info">
      <div
        v-for="(item, index) in personalInfoList"
        :key="index"
        class="info-cell line1px bottom"
        :class="{ 'avatar-cell': item.cellType == 'avatar' }"
        @click="goNext(item, index)"
      >
        <span
          class="cell-title"
          :class="{ 'desc-title': item.cellType == 'personalDesc' }"
          >{{ item.title }}</span
        >
        <div
          class="cell-content"
          @click="updateAvatar"
          :class="{
            'desc-content': item.cellType == 'personalDesc',
            'content-def':
              item.cellType == 'noBirthday' ||
              item.cellType == 'noSex' ||
              item.cellType == 'noPersonalDesc',
          }"
        >
          <Avatar
            v-if="item.cellType == 'avatar'"
            :src="item.content || avatar"
            :size="100"
            class="info-avatar"
          ></Avatar>
          {{ item.cellType != 'avatar' ? item.content : '' }}
        </div>
        <div class="cell-right" v-if="index != 0 && index != 4">
          <Icon
            class="cell-right-arrow"
            mode="custom"
            type="arrow-right"
            :size="1"
          ></Icon>
        </div>
      </div>
    </div>
    <div class="serve-info">
      <div
        v-for="(item, index) in serveInfo"
        :key="index"
        class="info-cell  line1px bottom"
        @click="goNext(item, index)"
      >
        <span class="serve-cell-title">{{ item.title }}</span>
        <div class="cell-content"></div>
        <div class="cell-right">
          <Icon
            class="cell-right-arrow"
            mode="custom"
            type="arrow-right"
            :size="1"
          ></Icon>
        </div>
      </div>
    </div>
    <div class="logout" @click="logOut">
      <div class="logout-cell">退出登录</div>
    </div>
    <InvitePop
      :settingStatus="setInfo.settingStatus"
      :setType="setInfo.setType"
      :settingText="setInfo.settingText"
      :headerText="setInfo.headerText"
      :noticeText="setInfo.noticeText"
      :btnText="setInfo.btnText"
      @btnEvent="btnEvent"
      v-if="loginType == 3 || loginType == 1"
    >
    </InvitePop>
    <mt-datetime-picker
      ref="datePicker"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="pickerVisible"
      :startDate="startDate"
      :endDate="endDate"
      @confirm="handleConfirm"
    >
    </mt-datetime-picker>
    <mt-popup v-model="popupVisible" position="bottom" class="my-popup">
      <mt-picker :slots="slots" showToolbar ref="picker">
        <mt-button class="picker-btn" @click="clickButton('cancel')"
          >取消</mt-button
        >
        <mt-button class="picker-btn" @click="clickButton('confirm')"
          >确认</mt-button
        >
      </mt-picker>
    </mt-popup>
  </div>
</template>
<script>
import api from '@/api';
import { formatDate } from '@/utils/base/date';
import Avatar from '@/components/Avatar';
import InvitePop from '@/components/InvitePop';
import Icon from '@/ui/Icon';
import defaultAvatar from '@/assets/login/default-avatar.png';
import { DatetimePicker, Picker, Popup, Button } from 'mint-ui';
import { mapState, mapActions } from 'vuex';
import device from '@/utils/device';

// 初始化个人信息
const personalInfoList = [
  { title: '头像', content: '', cellType: 'avatar' },
  { title: '昵称', content: '', cellType: 'userName' },
  { title: '性别', content: '你是小哥哥还是小姐姐？', cellType: 'noSex' },
  { title: '生日', content: '悄悄地告诉我吧！', cellType: 'noBirthday' },
  { title: '手机号码', content: '18612345678', cellType: 'mobile' },
  {
    title: '个人描述',
    content: '签名写得好，小伙伴不会少',
    cellType: 'noPersonalDesc',
  },
];
// 初始化服务信息
const serveInfo = [
  // { title: '服务条款', link: '', cellType: 'serve' },
  // { title: '隐私政策', link: '', cellType: 'privacy' },
  { title: '关于觅食蜂', link: '', cellType: 'aboutUs' },
];
// 初始化性别选项
const slots = [{ flex: 1, values: ['小哥哥', '小姐姐'], defaultIndex: 0 }];
export default {
  name: 'setting',
  components: {
    Icon,
    Avatar,
    InvitePop,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    [Picker.name]: Picker,
    [Button.name]: Button,
  },
  data() {
    return {
      isMSF: device.msf,
      avatar: defaultAvatar,
      personalInfoList,
      serveInfo,
      hiddenPage: true,
      pickerVisible: '1990-01-01', // 默认选中
      startDate: new Date('1950-01-01'), // 日期选择开始日期
      endDate: new Date(), // 日期选择结束日期
      slots,
      popupVisible: false, // 控制pop显示／隐藏
      showToolbar: true, // 设置是否在picker组件顶部显示一个 toolbar，内容自定义
      sexDefaultIndex: 0, // 性别选项初始选中的index
      introduction: '', // 个人描述
      setInfo: {
        settingStatus: true,
        setType: 3,
        headerText: '',
        settingText: `换掉默认头像和昵称，完善性别、生日、个人描述，只要完成这些信息，将能领取新人大礼包哦！！`,
        noticeText: '',
        btnText: ['马上行动起来'],
      },
      downurl: '',
      loginType: 1,
    };
  },
  computed: {
    ...mapState({
      showShareMask: state => state.app.showShareMask,
    }),
  },
  created() {
    this.getSetting();
    this.generateUrl();
    this.loginType = this.$route.query.type || 1;
    console.log(this.loginType, 'loginType');
  },
  methods: {
    ...mapActions(['Logout']),
    //请求设置接口
    getSetting() {
      api.getSetting(
        {},
        res => {
          const { data } = res;
          this.personalInfoList.forEach((item, index) => {
            const opts = { item, index, data };
            item = this.dealCellContent(opts);
          });
          this.serveInfo.forEach((item, index) => {
            if (index == 0) {
              item.link = data.service_terms;
            } else {
              item.link = data.aboutus;
            }
          });
          this.introduction = data.introduction;

          this.slots[0].defaultIndex =
            data.gender - 1 == 2 ? 0 : data.gender - 1;
          this.hiddenPage = false;
        },
        err => {}
      );
    },
    //跳转url配置
    generateUrl() {
      const { query = {} } = this.$route;
      const defaultDownurl =
        'https://sj.qq.com/myapp/detail.htm?apkName=com.doweidu.mishifeng';
      let downurl = '';
      if (device.system == 'iphone' && query.ios_url) {
        downurl = query.ios_url || '';
      } else if (device.system == 'android') {
        downurl = query.android_url || '';
      }
      if (!downurl) {
        if (device.wechat) {
          downurl = defaultDownurl;
        } else {
          downurl =
            device.system == 'iphone'
              ? 'https://itunes.apple.com/cn/app/id1435026988?mt=8'
              : defaultDownurl;
        }
      }
      this.downurl = downurl;
    },
    // 处理页面个人信息部分内容 0.头像 1.昵称 2.性别 3.生日 4.手机号码 5. 个人描述
    dealCellContent(opts) {
      const { item, index, data } = opts;
      switch (index) {
        case 0: // 头像
          if (data.avatar) {
            item.content = data.avatar;
          }
          return item;
        case 1: // 昵称
          if (data.nickname) {
            item.content = data.nickname;
          }
          return item;
        case 2: // 性别
          if (data.gender && data.gender != 3) {
            item.cellType = 'sex';
            item.content = data.gender == 1 ? '小哥哥' : '小姐姐';
          }
          return item;
        case 3: // 生日
          if (data.birthday) {
            item.cellType = 'birthday';
            item.content = data.birthday;
            this.pickerVisible = data.birthday;
          }
          return item;
        case 4: // 手机号码
          item.content = data.mobile;
          return item;
        case 5: // 个人描述
          if (data.introduction) {
            item.cellType = 'personalDesc';
            item.content = data.introduction;
          } else {
            item.cellType = 'noPersonalDesc';
            item.content = '签名写得好，小伙伴不会少';
          }
          return item;
      }
    },
    // 退出登录
    logOut() {
      const that = this;
      this.Logout().then(function() {
        that.$forward('index');
      });
    },
    // 点击事件
    goNext(obj, index) {
      const { cellType = '' } = obj;
      if (cellType == 'aboutUs') {
        // 0.服务条款 1.关于我们  2.隐私政策
        //const type = [2, 4, 3][index];
        //console.log(type, 'type');
        this.$forward('about_us');
      } else {
        // 0.头像 1.昵称 2.性别 3.生日 4.手机号码 5. 个人描述
        switch (index) {
          case 0: // 头像
            break;
          case 1: // 昵称
            this.$forward('setup', {
              editUserName: true,
              currText: this.personalInfoList[1].content,
            });
            break;
          case 2: // 性别
            this.popupVisible = true;
            break;
          case 3: // 生日
            this.openPicker();
            break;
          case 4: // 手机号码
            break;
          case 5: // 个人描述
            this.$forward('setup', {
              editUserName: false,
              currText: this.introduction,
            });
            break;
        }
      }
    },
    // 点击修改生日，打开datePicker
    openPicker() {
      this.$refs.datePicker.open();
    },
    // 选择生日
    handleConfirm(e) {
      const newBirth = formatDate(e, 'Y-M-D');
      this.updateInfo('birthday', newBirth);
    },
    // 点击选择性别picker中的button
    clickButton(clickType) {
      if (clickType == 'confirm') {
        const value = this.$refs.picker.getValues() || [];
        this.updateInfo('gender', value[0]);
      }
      this.popupVisible = false;
    },
    // 请求更新信息接口
    updateInfo(par, value) {
      let params = {};
      if (par == 'birthday') {
        params = { birthday: value };
      } else {
        value == '小哥哥' ? (params = { gender: 1 }) : (params = { gender: 2 });
      }
      api.updateInfo(
        params,
        res => {
          const { data } = res;
          if (data.result == 'success') {
            if (par == 'birthday') {
              this.personalInfoList[3].content = value;
              this.personalInfoList[3].cellType = 'birthday';
              return;
            }
            this.personalInfoList[2].content = value;
            this.personalInfoList[2].cellType = 'sex';
          }
        },
        err => {}
      );
    },
    btnEvent(item) {
      console.log(item, 'item');
      if (item.type === 3) {
        this.setInfo.settingStatus = false;
        return;
      }
      if (item.type === 1 && item.index === 1) {
        location.replace(this.downurl);
      }
      switch (item.index) {
        case 0:
          this.setInfo.settingStatus = false;
          // this.$forward('/profile', { type: 3 });
          break;
        case 1:
          this.setInfo.settingStatus = false;
      }
    },
    goBack() {
      console.log(this.loginType, 'this.loginType');
      if (this.loginType == 3) {
        this.setInfo = {
          settingStatus: true,
          setType: 1,
          headerText: '目前只支持在app端修改头像!!',
          settingText:
            '请前往app端修改默认头像和其他个人信息之后才能领取新手礼包哦～',
          noticeText: '',
          btnText: ['我知道了', '前往app'],
        };
      } else {
        this.$back();
      }
    },
    updateAvatar() {
      console.log('不支持更换头像,请往app端跳转');
      this.setInfo = {
        settingStatus: true,
        setType: 1,
        headerText: '目前只支持在app端修改头像!!',
        settingText:
          '请前往app端修改默认头像和其他个人信息之后才能领取新手礼包哦～',
        noticeText: '',
        btnText: ['我知道了'],
      };
    },
  },
};
</script>
<style lang="stylus" scoped>
.fix-header {
  position :fixed;
  top:0;
  height:40px;
  line-height:40px;
  z-index:999;
  width:100%;
  text-align:center;
  overflow:hidden;
  background: #fff;
  .icon-left {
    color:#fff;
    position :absolute;
    left:15px;
    top:10px;
    height:20px;
    width:20px;
    line-height:50px;
  }
  .txt-center {
    font-size:17px;
  }
}
.pages-setting {
  position: relative;
  padding: 0;
  margin: 0;
  background: rgb(245, 245, 245);
  height: 100%;
}
.personal-info, .serve-info, .logout {
  position: relative;
  background: #FFFFFF;
  padding: 0 15px;
  font-size: 13px;
  color: #000000;
  margin-bottom: 10px;
}
.personal-info {
  margin-top:40px;
}
.info-cell {
  display: flex;
  padding: 12px 0;
  align-items: center;
}
.info-cell:last-child::after {
  display: none;
}
.avatar-cell {
  padding: 17px 0;
  line-height: 100px;
}
.cell-title {
  min-width: 75px;
  color: #9B9B9B;
}
.serve-cell-title {
  width: 75px;
}
.content-def {
  color: #9B9B9B;
}
.cell-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  word-wrap: break-word;
  word-break: normal;
}
.cell-right {
  width: 10px;
}
.desc-title {
  align-self: flex-start;
}
.desc-content {
  margin-right: 6px;
}
.logout-cell {
  padding: 12px 0;
  text-align: center;
}
.my-popup {
  width: 100%;
}
.picker-btn {
  width: 50%;
  color: rgb(34, 176, 250);
  font-size: 16px;
  background-color: #FFFFFF;
}
.confirm {
  color: red;
}
</style>
