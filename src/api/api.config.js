import { copy } from 'kit-qs';

/**
 * API 命名规则
 * - 使用 camelCase 命名格式（小驼峰命名）
 * - 命名尽量对应 RESTful 风格，`${动作}${资源}`
 * - 假数据增加 fake 前缀
 * - 便捷易用大于规则，程序是给人看的
 */
let params = {};
let reqHeaders = {};

// api 列表
// https://dapi.cloudai.net/swagger-ui.html
export const modelApis = {
  // 初始化配置
  // test: 'https://easy-mock.com/mock/5aa79bf26701e17a67bde1d7/',
  // errReport: 'POST https://tongji.doweidu.com/log.php',
  getWxSign: '/open/common/getwxsign',
  getConfig: '/open/common/appconfig',
  // 获取七牛 token
  getQiniuToken: '/open/common/qiniutoken',
  getOpenIm: '/open/common/openim',
  // 通用
  // hotTags: '/open/common/hottags',
  zoneList: '/open/common/zonelist',
  getLocate: '/open/common/locate',
  getCbList: '/open/common/cblist',
  appUpdate: '/open/common/appupdate',
  getNotice: '/open/common/noticelists', // v2.4.0 新增公共 获取公告列表接口
  // 首页
  getIndex: '/open/home/index',
  getCategory: '/open/home/category', // 2.4.0新增接口，返回tabs分类、话题分类
  // 文章搜索
  getTagList: '/open/search/taglist',
  getHotTags: '/open/search/hottags',
  // 登录
  login: 'POST /open/user/login',
  logout: 'POST /open/user/logout',
  mobileCode: 'POST /common/common/authcode',
  // xx
  productDetail: '/product/productdetail',
  activityProduct: '/open/activity/article', // 活动商品内文章列表 v2.2.0 中不在活动详情页面不在调用此接口
  // 活动产品相关
  activityList: '/open/activity/list', // 活动商品列表 v2.2.0改版
  bargain: 'POST /open/activity/bargain', // 砍价
  activitydetail: '/open/activity/detail', // 活动商品详情
  helpbargain: '/open/activity/sharedetail', // 帮砍页
  // 订单相关
  orderlist: '/open/order/list', // 订单列表
  initrefund: '/open/order/refund', // 申请退款页面接口
  refundapply: 'POST /open/order/refundapply', // 退款申请提交接口
  redeem: 'POST /open/order/redeem', // 核销/兑换接口
  check: '/open/order/check', // 抢购前检查活动/订单等状态接口
  orderPayment: '/open/order/payment', // 支付页面接口
  orderdetail: '/open/order/detail', // 订单详情
  paymentApply: 'POST /open/order/paymentapply', // 生成支付订单
  cancelOrder: 'POST /open/order/cancel', // 取消订单
  paymentResult: 'POST /open/order/paymentresult', // 支付结果
  orderNoticeack: 'POST /open/order/noticeack', // 订单列表弹窗提示确认接口
  orderNoticepop: '/open/order/noticepop', // 订单列表弹窗提示发笔记接口
  // 个人中心
  followList: '/open/user/followlist',
  favoriteList: '/open/user/favoritelist',
  myArticleList: '/open/user/articlelist',
  articleDelete: 'POST /open/user/articledelete',
  toggleFollow: 'POST /open/user/togglefollow',
  getProfile: '/open/user/profile',
  dailyBonus: 'POST /open/user/dailybonus',
  getSetting: '/open/user/setting',
  updateInfo: 'POST /open/user/updateinfo',
  updatemobile: 'POST /open/user/updatemobile', // 修改手机号接口
  gethoney: '/open/user/gethoney', //获取用户蜂蜜信息
  getHoneylog: '/open/user/gethoneylog', //获取蜂蜜日志
  getInviteCode: '/open/invite/getcode', //获取蜂蜜日志
  getLevelList: '/open/user/levellist', //我的权益信息
  // 消息
  messageList: '/open/message/getlist',
  getMessage: '/open/message/type', //消息首页
  // 门店/附近餐厅
  branchListFull: '/open/search/branchlistfull',
  search: '/open/branch/search',
  near: '/open/branch/near',
  nearcbd: '/open/branch/nearcbd',
  branchDetail: '/open/branch/detail',
  branchList: '/open/search/branch',
  // 文章相关
  articleUpdate: 'POST /open/article/update',
  articleCreate: 'POST /open/article/create',
  toggleFavorite: '/open/article/togglefavorite',
  toggleLike: '/open/article/togglelikes',
  commentCreate: 'POST /open/article/createcomment',
  articleList: '/open/article/articlelist',
  articleComment: '/open/article/commentuserlist',
  commentList: '/open/article/commentlist',
  articleDetail: '/open/article/detail',
  articleInterestList: '/open/article/interestlist',
  searchTags: '/open/article/searchtags',
  articleLikesList: '/open/article/likeslist',
  articleFavoriteList: '/open/article/favoritelist',
  articleReport: '/open/article/report',
  //  获取视频播放凭证
  articlePlayAuth: '/open/video/getplayauth',
  // 用户协议
  staticContent: '/open/common/staticcontent',
  // 邀请新人页面相关
  inviteInitData: '/open/invite/initdata',
  receiveBoon: 'POST /open/invite/receiveboon',
  //端午活动接口
  dumplingDetail: '/open/zongzi/detail', // 主页数据
  getToadyMaterial: 'POST /open/zongzi/receivematerial', //获取今日材料
  makezongzi: 'POST /open/zongzi/makezongzi', //包粽子
  choiceCamp: 'POST /open/zongzi/choosecamp', //选择阵营
  rankData: '/open/zongzi/ranklist', //端午节排行榜
  shareInfo: '/open/zongzi/sharepage', //分享页接口
  supportCamp: 'POST /open/zongzi/support', //支援好友接口
  getUserCamp: '/open/zongzi/usercamp', // 获取用户阵营数据
  // 本地测试接口
  messageList1: '/message/message/lists',
  // v2.1.0 新增
  setPraise: 'POST /open/article/commenttogglelikes', // 点赞
  // 2.2.0 新增
  activityBranch: '/open/activity/branch', // 活动首页门店列表
  activityCategory: '/open/activity/category', //活动分类列表
  branchCollect: 'POST /open/branch/togglefavorite', // 店铺收藏接口
  favoriteBranchList: '/open/user/favoritebranch', // 用户想去的门店  ---  收藏列表接口
  articleParagraphlist: '/open/article/paragraphlist', // 文章优选段落展示列表（特殊） 活动详情页面调用
  // 2.3.0 新增
  userUpgrade: 'POST /open/user/fastupgrade', // 用户快速升级接口
  // v2.4.0 新增
  getUserWeal: 'POST /open/user/receivebenefit', // 领取用户福利
  // v2.4.0 相关配置依赖接口包含 首单返蜂蜜参数
  getNewUserMeal: '/open/common/depend', // 获取用户当前 首单返蜂蜜参数
  // v2.4.0 话题列表接口
  getTopicLists: '/open/interact/topiclists',
  // v2.4.0  话题详情接口
  getTopicDetail: '/open/interact/topic',
  // 2.4.0  讨论列表接口
  getDiscussLists: '/open/interact/discusslists',
};

export const commonParams = {
  init(data) {
    params = copy(data);
  },
  set(obj) {
    Object.assign(params, obj);
  },
  get(key) {
    return key ? copy(params[key]) : copy(params);
  },
};

export const headers = {
  init(data) {
    reqHeaders = copy(data);
  },
  set(obj) {
    Object.assign(reqHeaders, obj);
  },
  get(key) {
    return key ? copy(reqHeaders[key]) : copy(reqHeaders);
  },
};

const apiConfig = {
  modelApis,
  commonParams,
  headers,
};

export default apiConfig;
