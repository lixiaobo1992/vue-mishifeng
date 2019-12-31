import { stringify } from 'kit-qs';
import router from '@/router';
import store from '@/store';
import tongji from '@/utils/tongji';
import mini from '@/utils/mini';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import api from '@/api';
import jsReport from '@/config/js-report';

// no redirect whitelist
const whiteList = ['login', 'authredirect'];

const defaultPage = 'index';
let { spm, channel } = api.getCommonParams();

router.beforeEach((to, from, next) => {
  console.log(to);
  // console.log(from);
  const { meta = {} } = to;
  // 解决拦截 router-link 跳转问题
  if (meta.status === -1) {
    return next(false);
  }

  if (meta.title) {
    document.title = meta.title;
  }
  if (meta.desc) {
    // ...
  }

  // if (device.wxapp && to.path === '/login') {
  //   bridge.ready(() => {
  //     window.wx.miniProgram.navigateTo({
  //       url: '/pages/login/login',
  //     });
  //   });
  //   return;
  // }

  if (to.query.spm && to.query.spm != spm) {
    api.setCommonParams({ spm: to.query.spm });
    spm = to.query.spm;
  }
  if (to.query.channel_id && to.query.channel_id != channel) {
    api.setCommonParams({ channel: to.query.channel_id });
    channel = to.query.channel_id;
  }

  const { logged = false } = store.state.user;
  // console.log(store.state.user);
  if (logged) {
    if (to.name === 'login') {
      // 已登录，直接回到来源页面（是否应该使用back）
      const redirect = to['c_redirect'] || defaultPage;
      // redirect ? mini.forward(redirect) : mini.back();
      mini.forward(redirect);
      return;
    }
  } else if (meta.needAuth && !whiteList.includes(to.name)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    console.warn('app login');
    if (device.msf) {
      // 获取用户信息
      bridge.getUserInfo({
        success(res) {
          console.log('获取getUserInfo 修改store:', res);
          const { data } = res;
          // app端已将res.data中的userId改为id
          store.commit('SET_USERINFO', data);
          // 判断是否真的未登录
          if (data.id && data.token) {
            next();
          } else {
            jsReport({
              value: 'bridge.getUserInfo incomplete',
              userInfo: data,
            });
            // 未登录仍然跳转页面
            next();
          }
        },
        fail(err) {
          console.log('获取 getUserInfo 失败！', err);
          jsReport({
            value: 'bridge.getUserInfo fail',
            userInfo: err,
          });
          next();
        },
        complete(ret) {},
      });
      return;
    }
    mini.forward('/login', { c_redirect: to.fullPath });
    return;
  }
  // 判断是否需要缓存组件，如果是添加组件名到数组
  if (meta.keepAlive) {
    const { keepAliveList } = store.getters;
    if (!keepAliveList.includes(to.name)) {
      keepAliveList.push(to.name);
    }
    store.commit('SET_KEEPALIVELIST', keepAliveList);
  }

  let currentPath = to.path.replace(/^\//, '') || defaultPage;
  currentPath = currentPath + '?' + stringify(to.query);
  // const currentPath = location.href.replace(location.origin, '');

  tongji.pv(currentPath);

  // 跳转页面之前动态设置转场动画?
  // store.commit('SET_TRANSNA', to.meta.index < from.meta.index);

  // 确保一定要调用 next()
  next();
});
router.beforeResolve((to, from, next) => {
  // console.log(to, from);
  next();
});
router.afterEach((to, from) => {
  console.log(`进入${to.name}页面`);
  // 获取微信签名
  if (device.wechat) {
    Promise.resolve().then(() => {
      console.log('permission:2');
      console.warn('[当前url]', JSON.stringify(location.href));
      if (device.android) {
        bridge.jsBridgeReady();
      } else if (device.iphone) {
        bridge.setShare();
      }
    });
  }
});
