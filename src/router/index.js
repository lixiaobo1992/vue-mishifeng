import Vue from 'vue';
import Router from 'vue-router';
import env from '@/config/env';
import Index from '@/views/Index.vue';
import device from '@/utils/device';
// import PageError from '@/views/Error.vue';

// const _import = require('./_import_' + process.env.NODE_ENV);
const lazyLoad = // env.isMode('prod')
  process.env.NODE_ENV === 'production'
    ? file => () =>
        import(/* webpackChunkName: "x-[index]" */ '@/views/' + file + '.vue')
    : file => require('@/views/' + file + '.vue').default;
// 使用下面的方法，编译速度很慢
// 使用env.isMode('prod') 以及开发环境使用import 都会导致慢了
// function _import(page) {
//   if (process.env.NODE_ENV === 'production') {
//     return () => import(/* webpackChunkName: "x-[index]" */ `@/views/${page}`);
//   }
//   return () => require(`@/views/${page}.vue`).default;
//   // return () =>
//   //   import(/* webpackChunkName: "[request]-[index]" */ `@/views/${page}`);
// }

// in development-env not use lazy-loading,
// because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

const routes = [
  {
    path: '*',
    name: 'Error_404',
    meta: {},
    component: lazyLoad('common/404'),
  },
];

if (!env.isEnv('prod')) {
  routes.unshift({
    path: '/bridge',
    name: 'bridge',
    meta: { title: 'JSBridge 调试' },
    component: lazyLoad('common/Bridge'),
  });
  routes.unshift({
    path: '/debug',
    name: 'debug',
    meta: { title: 'Debug 调试页面', needAuth: false },
    component: lazyLoad('common/Debug'),
  });
  routes.unshift({
    path: '/test-code',
    name: 'test-code',
    meta: { title: '授权中转页面', needAuth: false },
    component: lazyLoad('common/TestCode'),
  });
}

const demoRoutes = [
  {
    path: '/demo',
    name: 'demo',
    meta: { title: 'demo 标题', needAuth: false },
    component: lazyLoad('component-demo/Demo'),
    children: [
      {
        path: 'header',
        name: 'header',
        meta: { title: 'header 标题', needAuth: false },
        component: lazyLoad('component-demo/Header'),
      },
      {
        path: 'search',
        name: 'search',
        meta: { title: 'search 标题', needAuth: false },
        component: lazyLoad('component-demo/Search'),
      },
      {
        path: 'scroll',
        name: 'scroll',
        meta: { title: 'scroll 标题', needAuth: false },
        component: lazyLoad('component-demo/Scroll'),
      },
      {
        path: 'testheader',
        name: 'testheader',
        meta: {},
        component: lazyLoad('component-demo/testHeader'),
      },
    ],
  },
];

const router = new Router({
  // debug: __DEV__ ? env.debug : false,
  mode: env.routerMode,
  base: env.routerBase,
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { x: 0, y: 0 };
  //   }
  // },
  routes: [
    {
      path: '/',
      alias: '/index',
      name: 'index',
      meta: { needAuth: false, keepAlive: true, title: '觅食蜂' },
      component: Index,
    },
    {
      path: '/city',
      name: 'city',
      meta: { title: '城市选择' },
      component: lazyLoad('City'),
    },
    {
      path: '/product',
      name: 'product',
      meta: { title: '探店' },
      component: lazyLoad('Product'),
    },
    {
      path: '/product-tab-list',
      name: 'product-tab-list',
      meta: { title: '大家都在看' },
      component: lazyLoad('ProductTabList'),
    },
    {
      path: '/shop',
      name: 'shop',
      meta: { title: '探店' },
      component: lazyLoad('Shop'),
    },
    {
      path: '/shop-detail',
      name: 'shop-detail',
      meta: { title: '店铺详情' },
      component: lazyLoad('ShopDetail'),
    },
    {
      path: '/search-shop',
      name: 'search-shop',
      meta: { title: '商圈搜索' },
      component: lazyLoad('SearchShop'),
    },
    {
      path: '/map',
      name: 'map',
      meta: { title: '地图' },
      component: lazyLoad('Map'),
    },
    {
      path: '/search-article',
      name: 'search-article',
      meta: { needAuth: false, title: '文章搜索' },
      component: lazyLoad('SearchArticle'),
    },
    {
      path: '/home',
      name: 'home',
      meta: { needAuth: false },
      component: lazyLoad('Home'),
    },
    {
      path: '/publish',
      name: 'publish',
      redirect: 'download',
      meta: { title: '分享美食体验', needAuth: true },
      component: lazyLoad('Publish'),
    },
    {
      path: '/about',
      name: 'about',
      meta: { index: 1, title: '关于我们' },
      component: lazyLoad('About'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { index: 10, title: '登录' },
      component: lazyLoad('Login'),
    },
    {
      path: '/service',
      name: 'service',
      meta: { needAuth: false },
      component: lazyLoad('Service'),
    },
    {
      path: '/profile',
      name: 'profile',
      meta: { title: '个人中心', needAuth: !device.wxapp },
      component: lazyLoad('Profile'),
    },
    {
      path: '/message',
      name: 'message',
      meta: { title: '消息列表', needAuth: !device.wxapp },
      component: lazyLoad('Message'),
    },
    {
      path: '/message-index',
      name: 'message-index',
      meta: { title: '消息', needAuth: true },
      component: lazyLoad('MessageIndex'),
    },
    {
      path: '/order',
      name: 'order',
      meta: { title: '我的订单', needAuth: true },
      component: lazyLoad('Order'),
    },
    {
      path: '/follow',
      name: 'follow',
      meta: { title: '我的粉丝' },
      component: lazyLoad('Follow'),
    },
    {
      path: '/comments',
      name: 'comments',
      meta: { title: '全部评论' },
      component: lazyLoad('Comments'),
    },
    {
      path: '/comment-list',
      name: 'comment-list',
      meta: { title: '' },
      component: lazyLoad('CommentList'),
    },
    {
      path: '/comment-detail',
      name: 'comment-detail',
      meta: { title: '回复详情' },
      component: lazyLoad('CommentDetail'),
    },
    {
      path: '/setting',
      name: 'setting',
      meta: { title: '账号设置', needAuth: true },
      component: lazyLoad('Setting'),
    },
    {
      path: '/article',
      name: 'article',
      meta: { title: '' },
      component: lazyLoad('Article'),
    },
    {
      path: '/setup',
      name: 'setup',
      meta: { title: '修改昵称' },
      component: lazyLoad('SetUp'),
    },
    {
      path: '/rule',
      name: 'rule',
      meta: { title: '' },
      component: lazyLoad('Rule'),
    },
    {
      path: '/download',
      name: 'download',
      meta: { title: '' },
      component: lazyLoad('Download'),
    },
    {
      path: '/order-refund',
      name: 'order-refund',
      meta: { title: '申请退款' },
      component: lazyLoad('Refund'),
    },
    {
      path: '/order-pay',
      name: 'order-pay',
      meta: { title: '确认订单' },
      component: lazyLoad('OrderPay'),
    },
    {
      path: '/order-result',
      name: 'order-result',
      meta: { title: '支付成功' },
      component: lazyLoad('OrderResult'),
    },
    {
      path: '/order-detail',
      name: 'order-detail',
      meta: { title: '订单详情' },
      component: lazyLoad('OrderDetail'),
    },
    {
      path: '/product-detail',
      name: 'product-detail',
      meta: { title: '商品详情' },
      component: lazyLoad('ProductDetail'),
    },
    {
      path: '/bargain',
      name: 'bargain',
      meta: { title: '觅食蜂' },
      component: lazyLoad('Bargain'),
    },
    {
      path: '/static',
      name: 'static',
      meta: { title: '' },
      component: lazyLoad('Static'),
    },
    {
      path: '/honey-note',
      name: 'honey-note',
      meta: { title: '我的蜂蜜' },
      component: lazyLoad('HoneyNote'),
    },
    {
      path: '/honey-detail',
      name: 'honey-detail',
      meta: { title: '蜂蜜明细' },
      component: lazyLoad('HoneyDetail'),
    },
    {
      path: '/about_us',
      name: 'about_us',
      meta: { title: '关于觅食蜂' },
      component: lazyLoad('Aboutus'),
    },
    {
      path: '/invite-register',
      name: 'invite-register',
      meta: { title: '邀请有礼' },
      component: lazyLoad('InviteRegister'),
    },
    {
      path: '/honey-level',
      name: 'honey-level',
      meta: { title: '我的等级' },
      component: lazyLoad('HoneyLevel'),
    },
    {
      path: '/festival/index',
      name: 'festival-dumplings',
      meta: { title: '端午节' },
      component: lazyLoad('dumpling/index'),
    },
    {
      path: '/festival/chocie',
      name: 'chocie-dumplings',
      meta: { title: '甜咸粽子大战' },
      component: lazyLoad('dumpling/ChocieCamp'),
    },
    {
      path: '/festival/share',
      name: 'share-dumplings',
      meta: { title: '甜咸粽子大战' },
      component: lazyLoad('dumpling/share'),
    },
    {
      path: '/festival/rank',
      name: 'rank-dumplings',
      meta: { title: '排行榜' },
      component: lazyLoad('dumpling/rank'),
    },
    {
      path: '/collect-product',
      name: 'collect-product',
      meta: { title: '想去的店' },
      component: lazyLoad('CollectProduct'),
    },
    // v2.4.0 新增
    {
      path: '/theme-list',
      name: 'theme-list',
      meta: { title: '' },
      component: lazyLoad('ThemeList'),
    },
    {
      path: '/theme-detail',
      name: 'theme-detail',
      meta: { title: '' },
      component: lazyLoad('ThemeDetail'),
    },
    ...demoRoutes,
    ...routes,
  ],
});

export default router;
