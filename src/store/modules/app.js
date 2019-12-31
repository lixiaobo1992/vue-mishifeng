// 网站设置相关代码，如侧边栏开关、多语言切换等

// 存在 api 循环引用
import api from '@/api';
import * as Types from '../types';
import { storage } from '@dwdjs/utils';
import device from '@/utils/device';
const app = {
  // TDK?
  state: {
    site: {
      title: '觅食蜂',
    },
    ani: 'slideleft',
    keepAliveList: [],
    appConfig: {},
    showShareMask: false, // 分享遮罩
    shareMaskType: 1, // 1默认分享 2 砍价分享
    orderCommentShade: {}, // 订单遮罩弹层数据
    imagesBigStatus: {}, // v2.2.0 图片放大
    productGuideLayerStatus: false, // v2.2.0 探店引导层
    indexNoticeStatus: false, // v2.4.0 公告
    newUserMealStatus: false, // v2.4.0 新人福利
    newUserMealParam: {}, // v 2.4.0 新人福利参数
    userLoginLayerStatus: false, // v2.3.5 用户登录弹层
  },
  mutations: {
    setAnim(state, data) {
      state[data.key] = data.key;
    },
    ['SET_KEEPALIVELIST'](state, payload = []) {
      state.keepAliveList = payload;
    },
    // 初始化app配置
    [Types.INIT_APP_CONFIG](state, payload = {}) {
      const { configInfo } = payload;
      state.appConfig = configInfo;
      // 存储到本地
      storage.set('app-config', configInfo, 864000);
    },
    // 分享遮罩显示隐藏
    ['SET_SHARE_MASK'](state, flag) {
      state.showShareMask = flag;
    },
    // 修改分享遮罩类型
    ['SET_SHARE_TYPE'](state, type) {
      state.shareMaskType = type;
    },
    // 修改订单遮罩弹层数据
    ['SET_ORDER_SHADE_DATA'](state, payload = {}) {
      state.orderCommentShade = payload;
    },
    // v2.2.0 图片放大
    ['SET_IMAGES_BIG_STATUS'](state, payload = {}) {
      state.imagesBigStatus = payload;
    },
    // v2.2.0 探店引导层
    ['SET_PRODUCT_GUIDE_LAYER'](state, type) {
      state.productGuideLayerStatus = type;
    },
    // v2.4.0 首页公告展示隐藏
    ['SET_INDEX_NOTICE_STATUS'](state, type) {
      state.indexNoticeStatus = type;
    },
    // v2.4.0 新人福利
    ['SET_NEW_USER_MEAL_STATUS'](state, type) {
      state.newUserMealStatus = type;
    },
    // v2.4.0 设置新人福利参数
    ['SET_NEW_USER_MEAL_PARAM'](state, type) {
      state.newUserMealParam = type;
    },
    // v2.3.5 用户登录弹层
    ['SET_USER_LOGIN_LAYER'](state, type) {
      console.log(type);
      state.userLoginLayerStatus = type;
    },
  },
  actions: {
    // 初始化app配置
    initAppConfig({ commit, state }, payload = {}) {
      if (!device.msf) {
        api.getConfig(
          {
            // loc_type: 'amap', // 高德
            showLoading: false,
          },
          res => {
            commit({ type: Types.INIT_APP_CONFIG, configInfo: res.data });
          },
          err => {
            console.log(err);
          }
        );
      }
    },
    setAppConfig({ commit, state }, payload = {}) {
      commit({ type: Types.INIT_APP_CONFIG, configInfo: payload });
    },
    // 分享遮罩显示隐藏
    setShareMask({ commit, state }, payload = {}) {
      const { isShow = false, type = 1, isCloseBtn = false } = payload;
      if (state.shareMaskType === 1 || state.shareMaskType === 2) {
        commit('SET_SHARE_TYPE', type);
        commit('SET_SHARE_MASK', isShow);
      } else {
        if (isCloseBtn) {
          commit('SET_SHARE_TYPE', type);
          commit('SET_SHARE_MASK', isShow);
        }
      }
    },
    // 订单弹窗数据
    setOrderShadeData({ commit, state }, payload = {}) {
      commit('SET_ORDER_SHADE_DATA', payload);
    },
    // v2.2.0 图片放大
    setImagesBigStatus({ commit, state }, payload = {}) {
      commit('SET_IMAGES_BIG_STATUS', payload);
    },
    // v2.2.0 探店引导层
    setProductGuideLayer({ commit, state }, type) {
      commit('SET_PRODUCT_GUIDE_LAYER', type);
    },
    // v2.4.0 首页公告
    setIndexNoticeStatus({ commit, state }, type) {
      commit('SET_INDEX_NOTICE_STATUS', type);
    },
    // v2.4.0 新人福利
    setNewUserMealStatus({ commit, state }, type) {
      commit('SET_NEW_USER_MEAL_STATUS', type);
    },
    // v2.4.0 获取新人福利参数
    setNewUserMealParam({ commit, state }, type) {
      // 传入 type = true 就会调用这个接口
      if (type) {
        api.getNewUserMeal(
          {},
          res => {
            const { first_order_benefit } = res.data;
            commit('SET_NEW_USER_MEAL_PARAM', first_order_benefit);
            commit('SET_NEW_USER_MEAL_STATUS', first_order_benefit.is_show_pop);
          },
          err => {
            console.log(err, 'err');
          }
        );
      }
    },
    // v2.3.5 用户登录弹层
    setUserLoginLayer({ commit, state }, type) {
      commit('SET_USER_LOGIN_LAYER', type);
    },
  },
};

export default app;
