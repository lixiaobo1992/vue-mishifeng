# newbee

## Project setup

```bash
yarn install
```

### Compiles and hot-reloads for development

```bash
yarn run serve
```

### Compiles and minifies for production

```bash
yarn run build
```

### Lints and fixes files

```bash
yarn run lint
```

### Run your unit tests

```bash
yarn run test:unit
```

### Run your end-to-end tests

```bash
yarn run test:e2e
```

## 技能

```bash
# 查询端口占用
lsof -i tcp:port
```

## 注意事项

目前使用的全局的 `eslint@5.7.0` 和 `prettier@1.14.3`，如果升级，会导致格式要求也要升级

重新安装是，"@vue/cli-plugin-e2e-cypress": "^3.0.3",依赖的 cypress 安装非常慢，导致失败，暂时先删除

## forward

- 如果是站内链接（配置为非http链接的链接认为是站内链接）如 `profile`
  - 在 App 内（提供方法获取 tabs & native 的所有页面列表）
    - 目标页面在 native 页面列表内时
      - 同时也是 tab 页面时，使用 `switchTo` 方法打开页面
      - 否则使用 `navigateTo` 方式打开
FIXED 除 tab 页面，全使用 `navigateTo` 方式打开页面（以下处理规则太过繁杂，全部新开）
|     - `profile` 因为复用的关系需特别处理，非登录者自己的页面，也使用 `navigateTo` 方式打开
|     - 文章详情页，也需要特殊处理，因为 header 透明渐变，也使用 `navigateTo` 方式打开
|   - 目标页面不在 native 页面列表内时
|     - 当前页面是 tab 页面，使用 `navigateTo` 方法新开页面
|     - 否则使用站内跳转 `router.push`
| - 不在 App 内
|   - 使用站内跳转 `router.push`
|- 如果是站外链接
  - 如果是http链接
    - 如果是本站域名，则走站内链接逻辑
    - 如果非本站域名，直接location.href=url
  - 如果是schema链接，暂不支持（进入链接不允许schema，跳出链接可以为schema）
- 补充：如果强制要求使用对应端的url链接，配置query参数 `target_type=native/h5/miniapp` 等

## 统一路由及参数

- 路由命名尽量**要有语义**
- 路由**暂定单级路由**，路由路径**全部小写字母**
  - 如有两个单词的，全用 `-` 链接
    - 如 `order-detail`
- 相关业务页面，可适当使用前缀分类
  - 如 `order` `order-detail` `order-refund`
- 如果做类似功能，可使用相同的命名格式
  - 不要像这样 `search-article` `shop-search`，统一一种格式即可，如 `search-xxx`
- 参数
  - 如果只需要唯一 `key` 来确定数据，就使用 `id` 来标识，如果存在多个，就区分标
    识
    - 如 `article?id=xxx` `order-detail?id=xxx` `publish?id=xxx`
  - 如果参数存在多个单词的，使用 `_` 链接，如 `order_id=xxx` `branch_id=xxx`
- 搜索参数 `?keyword=xxx`
- 常用参数示例参考
  - `id` 作为页面接口等内容唯一标识，常用于 api 请求
  - `type` 作为页面类型划分，如订单分类，如未支付、已支付，或不同规则页面区分等
  - `target_type=[native|h5|miniapp]` 作为页面 url 强制打开类型标记
  - `c_xxx` 作为项目功能参数，用于跳转等标识
    - `c_redirect` 用于跳转，标记回跳
  - `d_xxx` 作为调试代码，用于打开 debug 等功能
- 如果存在老板本，可以想办法做到兼容，迭代几个周期后替换掉
- 店码二维码格式规则 `https://render.mishifeng.com/mqr/xxxxx`

  - 无需校验域名，只需校验 pathname 中的 `mqr` 标识

- index 首页
- login 登录
- profile?id=xxx 个人中心
- 设置相关
  - setting 设置页
  - setup 设置昵称、个人描述
- city 城市选择
- 文章相关
  - x 文章列表
  - article?id=xxx 文章详情页
  - search-article?keyword=网红 搜索文章（v1.0）
- 发布相关
  - publish 发布
    - 参数 order_id=xxx&activity_id=xxx&branch_id=xxx
- 探店
  - shop 探店-店铺列表（v1.0）
  - shop-detail?id=xxx 店铺详情（v1.0）
  - search-shop 店铺搜索（v1.0）
  - product 探店-砍价列表（v2.0）
  - product-detail?id=xxx 砍价产品详情
  - bargain?id=xxx&publisher=xxx 帮砍页
- 其他
  - comments?id=xxx 评论页面
  - follow
    - ?type=1 我的关注
    - ?type=2 我的粉丝
  - map?xx=xxx 地图页面
  - rule?type=xxx 规则页面
  - message 消息列表
  - x 我的收藏
- 订单相关
  - order-pay?id=xxx 支付页面
  - order-result?id=xxx 订单支付结果页
  - order?type=xxx 订单列表 type 订单类型
  - order-detail?id=xxx 订单详情
  - order-refund?id=xxx 申请退款
- download 下载引导页
  - 支持 `ios-url` `android-url` 以及默认 url
- error 错误页

## 项目配置调整以及增强

- [x] vue-cli 3.0 搭建最新 vue 版本
- [x] 环境变量 √ 支持自定义环境变量
- [x] 七牛配置 √ 支持上传 cdn 以及替换路径
- [x] svg 加载处理 √ svg-sprite-loader app.js 一次性加载全部 ICON
- [ ] manifest 提取(不一定再需要)
- [x] pwa
- [x] 预加载
- [x] report 分析 √ 暂时使用 vue ui 提供的
- [ ] skeleton 骨架屏
- [x] 代码规范 prettier 规则(没有太多的配置项可供选择)
- [ ] stylelint 规则
- [x] 缓存处理 storage, session `@/utils/storage`
- [ ] 转场动画约定
  - 同级页面不要动画
  - 第一次进入不要动画效果
  - 刷新不要动画效果
  - 记录滚动位置
  - 怎么进就怎么出
- [ ] 分享先到首页再到目标页面
- [x] 约定规则-关于层级
  - popup >1000
  - mask >1000
  - navigation 500~600
  - content 10~100
  - body,#app 1-9(用于转场、人为干扰复合层的排序)
- [x] Debug 调试页面 `/#/debug`
- [x] bridge `@/utils/bridge`
- [ ] 统计数据 `@/utils/tongji`
- [x] 功能参数
  - 调试参数，全部 `d_` 开头，如更改 host `d_host`
  - 功能参数，全部 `c_` 开头，如重定向 `c_redirect`
  - 常规业务参数，无前缀，如 `id` `tao_id`
- [x] 获取分支相关信息
  - git symbolic-ref --short -q HEAD
  - git rev-parse --short HEAD
  - xargs gh-pages -d dist --message
- [] https://github.com/yarkovaleksei/vue2-storage

## 现有问题

- forward 优化
- 好食期小程序的 cookie
- 觅食蜂相关代码逻辑优化

## 当前工作

- 觅食蜂相关优化 60%
  - forward 方案 国风
  - tongji 方案
  - 登录回跳等 晓寒
- 小程序 npm 模块相关问题 志飞 10%
- 专题系统 国风 10%
- Admin 管理系统 (国风 志飞) 20%
- 多端方案 10%

当前问题

- 循环引用(使用方式修正)
- App.vue 引用要在 router 前
- mint-ui 按需加载问题 √
- loadJs 加载第三方代码 geo 优化
- app.js vendor 比较大（mint-ui 组件迁移）
- Setting 组件书写格式
- Icon 处理，全用 svg icons

- message `for in list` 的 list 数据
- setting `components` 组件引用
- publish `<img src="../assets/` 图片引用 以及对齐格式
  - ~assets
- 路由命名和 app 必须一致
- api 支付方式列表
- RecommentStar style 书写、三元表达式计算星星
- js 中引入图片，变量引入图片

- 代码优化
  - 样式格式控制

## 功能封装

- [ ] error 错误页面
- [ ] api 请求的封装
- [ ] 列表 demo 组件
- [ ] 路由-权限
- 公共组件：
  - [ ] swiper 组件
  - [ ] tabs 切换组件
  - [ ] 上传图片组件
  - [ ] 预览组件
  - [ ] 搜索组件
  - [ ] 瀑布流布局组件
  - [ ] header 组件
  - [ ] tabbar 组件

## 部分依赖处理

- `eslint-plugin-import` 用于本地 IDE 代码检查
- `lint-staged` 用于 gitHooks `pre-commit` `eslint --fix` 改为
  `vue-cli-service lint`;
- `babel-plugin-webpack-async-module-name`
- [自动化导入](https://cli.vuejs.org/zh/guide/css.html#自动化导入)
  - `vue-cli-plugin-style-resources-loader`

## 自动化测试

### 为什么需要自动化测试?

一个项目最终会经过快速迭代走向以维护为主的状态，在合理的时机以合理的方式引入自动
化测试能有效减少人工维护成本。自动化测试的收益可以简单总结为：

> 自动化的收益 = 迭代次数 _ 全手动执行成本 - 首次自动化成本 - 维护次数 _ 维护成
> 本

对于自动化测试来说，相对于发现未知的问题，更倾向于避免可能的问题。

- 单元测试 Unit Testing
  - 关注应用中每个零部件的正常运转，防止后续修改影响之前的组件。
  - jest 内置测试覆盖率工具 [istanbul](https://github.com/gotwarlost/istanbul)
    开启使用参数 `jest --coverage`
  - 只关注代码覆盖率很可笑。关注在 10%的风险最高的代码比关注 99%可忽略风险的代码
    ，收益要多得多。我认为风险覆盖比起测试覆盖要重要得多。
- 端到端测试又叫功能测试 E2E testing

## 环境变量

除了环境变量 `VUE_APP_*` 之外，在你的应用代码中始终可用的还有两个特殊的变量：

- 模式变量 `NODE_ENV` - 会是 `"development"`、`"production"` 或 `"test"` 中的一
  个。具体的值取决于应用运行的模式。
- 基础路径 `BASE_URL` - 会和 `vue.config.js` 中的 `baseUrl` 选项相符，即你的应用
  会部署到的基础路径。

```bash
# production
vue-cli-service build

# 可以自己添加 .env.staging，启动如下
vue-cli-service build --mode staging
```

## 其他

```js
// 自定义解析URL
// import { urlMap, getUrlType, getParams } from '@/utils/urlMap';

// 这里要处理url 与 query 的参数合并（需要提取path、合并query）
// 本质真正要处理的，只是一种：站内链接，其余都是站外链接（其他H5或schema链接）
// 所以封装两个 站内链接 + 站外链接 两个方法即可；
// 最终定位封装一个urlParse方法，解析为一个对象以及各种url参数数据，同时包含是否站内链接等，可以传入target目标链接
// URL解析url，自定义schema与http链接解析结果pathname不一致，例如
// mishifeng://native/home?id=xxx
// https://m.mishifeng.com/home?id=xxx

export function urlfix(url, paramsUrl = '') {
  let fixUrl = url;
  if (paramsUrl) {
    fixUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + paramsUrl;
  }
  return fixUrl;
}

export function urlParse(url) {
  try {
    return new URL(url);
  } catch (err) {
    console.error('URL is not a constructor');
  }
  return {};
}

// const httpReg = /^https?/i;
// regex-weburl.js
// https://gist.github.com/dperini/729294
// http://nodejs.cn/api/url.html

// function getChannel(url = '', targetUrl = url) {
//   // 透传参数
//   // 如果targetUrl已存在参数，则不透传
//   const query = getParams(url) || {};
//   const targetQuery = getParams(targetUrl, '') || {};
//   const paramsObj = {};
//   const params = ['d_host', 'channel_id', 'spm', 'share'];
//   for (let i = 0; i < params.length; i++) {
//     const key = params[i];
//     if (query[key] && query[key] !== targetQuery[key]) {
//       paramsObj[key] = query[key];
//     }
//   }
//   return paramsObj;
// }
```

适用于 iPad 和 iPhone 的启动图像和触摸图标的最终解决方案（landscape ||
portrait）和（retina || not）：

- https://stackoverflow.com/questions/4687698/multiple-apple-touch-startup-image-resolutions-for-ios-web-app-esp-for-ipad
- https://zhuanlan.zhihu.com/p/36085065

```html
<!-- iPhone ICON -->
<link href="apple-touch-icon-57x57.png" sizes="57x57" rel="apple-touch-icon" />
<!-- iPad ICON -->
<link href="apple-touch-icon-72x72.png" sizes="72x72" rel="apple-touch-icon" />
<!-- iPhone (Retina) ICON -->
<link
  href="apple-touch-icon-114x114.png"
  sizes="114x114"
  rel="apple-touch-icon"
/>
<!-- iPad (Retina) ICON -->
<link
  href="apple-touch-icon-144x144.png"
  sizes="144x144"
  rel="apple-touch-icon"
/>

<!-- iPhone/iPod Touch 竖屏 320x480 (标准分辨率) -->
<link
  href="apple-touch-startup-image-320x460.png"
  media="(device-width: 320px)"
  rel="apple-touch-startup-image"
/>
<!-- iPhone (Retina) SPLASHSCREEN -->
<link
  href="apple-touch-startup-image-640x920.png"
  media="(device-width: 320px) and (-webkit-device-pixel-ratio: 2)"
  rel="apple-touch-startup-image"
/>
<!-- iPad (portrait) SPLASHSCREEN -->
<link
  href="apple-touch-startup-image-768x1004.png"
  media="(device-width: 768px) and (orientation: portrait)"
  rel="apple-touch-startup-image"
/>
<!-- iPad (landscape 竖屏 标准分辨率) SPLASHSCREEN -->
<link
  href="apple-touch-startup-image-748x1024.png"
  media="(device-width: 768px) and (orientation: landscape)"
  rel="apple-touch-startup-image"
/>
<!-- iPad (Retina, portrait) SPLASHSCREEN -->
<link
  href="apple-touch-startup-image-1536x2008.png"
  media="(device-width: 1536px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)"
  rel="apple-touch-startup-image"
/>
<!-- iPad (Retina, landscape 竖屏) SPLASHSCREEN -->
<link
  href="apple-touch-startup-image-2048x1496.png"
  media="(device-width: 1536px)  and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)"
  rel="apple-touch-startup-image"
/>
<!-- iPhone 6/7/8 -->
<link
  href="/images/favicon/750x1334.png"
  media="(device-width: 375px) and (-webkit-device-pixel-ratio: 2)"
  rel="apple-touch-startup-image"
/>
<!-- iPhone 6 Plus/7 Plus/8 Plus -->
<link
  href="/images/favicon/1242x2208.png"
  media="(device-width: 414px) and (-webkit-device-pixel-ratio: 3)"
  rel="apple-touch-startup-image"
/>
```

- http://doweidu.udesk.cn/im_client/?web_plugin_id=58143&channel=msf

<script>
(function(a,h,c,b,f,g){a["UdeskApiObject"]=f;a[f]=a[f]||function(){(a[f].d=a[f].d||[]).push(arguments)};g=h.createElement(c);g.async=1;g.charset="utf-8";g.src=b;c=h.getElementsByTagName(c)[0];c.parentNode.insertBefore(g,c)})(window,document,"script","https://assets-cli.udesk.cn/im_client/js/udeskApi.js","ud");
ud({
    "code": "241b92kf",
    "link": "https://doweidu.udesk.cn/im_client/?web_plugin_id=58143"
});
</script>

<script>
(function(a,h,c,b,f,g){a["UdeskApiObject"]=f;a[f]=a[f]||function(){(a[f].d=a[f].d||[]).push(arguments)};g=h.createElement(c);g.async=1;g.charset="utf-8";g.src=b;c=h.getElementsByTagName(c)[0];c.parentNode.insertBefore(g,c)})(window,document,"script","https://assets-cli.udesk.cn/im_client/js/udeskApi.js","ud");
ud({
    "code": "241b92kf",
    "link": "https://doweidu.udesk.cn/im_client/?web_plugin_id=58143"
});
</script>

将此代码嵌入到你网站页面</body>标签之上即可启用 Udesk 在线客服 网站接入接口说明

- http://www.udesk.cn/doc/thirdparty/webim/

添加客户信息需按照文档在 web im 链接中添加客户信息和加密参数，具体开发方式请查看
开发文档 。

- http://udesk.udesk.cn/hc/articles/12153 KEY： c5bb6e5f2c5249acce341fda8c6134c2
  复制

报 Conflicting order between [mini-css-extract-plugin] 错误

- https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
- https://spectrum.chat/next-js/general/conflicting-order-between~25834bb9-fe91-44dd-ba47-b016b6518d67
