import { parse } from 'kit-qs';
import router from '@/router';
import store from '@/store';
import { Toast, Indicator, MessageBox } from 'mint-ui';
// import env from '@/config/env';
import bridge from '@/utils/bridge';
import device from '@/utils/device';
import env from '@/config/env';

import { Version } from '@dwdjs/utils';
import { compact } from '@/utils';
import { stringify } from '@/utils/base';
import { getUrlType, hashUrl } from './urlMap';
import eventSub from '@/utils/eventSub';

// 透传参数白名单
const passRoutes = ['d_debug', 'd_host', 'd_console', 'spm', 'channel_id'];
const mini = {
  device,
  version: new Version(env.version),
  // log: tongji.event,
  showToast(msg, callback) {
    if (device.msf) {
      bridge.showToast({
        content: msg,
        success(res) {
          console.log(res, 'res');
          if (typeof res == 'string') {
            callback && callback(JSON.parse(res));
          } else {
            callback && callback(res);
          }
        },
      });
    } else {
      Toast(msg);
      setTimeout(() => {
        callback && callback();
      }, 3000);
    }
  },
  // showAlert: MessageBox.alert,
  showAlert(title, msg, callback) {
    if (device.msf) {
      bridge.showAlert({
        title: title,
        content: msg,
        btns: [
          {
            id: 2,
            type: 'sure',
            text: '确定',
          },
        ],
        success(res) {
          // console.log(res);
          if (res.data && res.data.id == 2) {
            callback && callback('confirm');
          } else {
            callback && callback('error');
          }
        },
      });
    } else {
      MessageBox.alert(msg, title)
        .then(res => {
          callback && callback('confirm');
        })
        .catch(err => {
          callback && callback('error');
        });
    }
  },
  showConfirm(opts) {
    if (!opts.title && !opts.message) return;
    if (device.msf) {
      bridge.showAlert({
        title: opts.title || '',
        content: opts.message || '',
        btns: [
          {
            id: 1,
            type: 'cancel',
            text: opts.cancelButtonText || '取消',
          },
          {
            id: 2,
            type: 'sure',
            text: opts.confirmButtonText || '确定',
          },
        ],
        success(res) {
          // console.log(res);
          if (res.data && res.data.id == 2) {
            opts.callback && opts.callback('confirm');
          } else if (res.data && res.data.id == 1) {
            opts.callback && opts.callback('cancel');
          } else {
            opts.callback && opts.callback('error');
          }
        },
      });
    } else {
      MessageBox({
        title: opts.title || '',
        message: opts.message || '',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: opts.confirmButtonText || '确定',
        cancelButtonText: opts.cancelButtonText || '取消',
      })
        .then(res => {
          opts.callback && opts.callback(res);
        })
        .catch(err => {
          opts.callback && opts.callback('error');
        });
    }
  },
  showLoading(opts = {}) {
    let op = {
      content: '',
      type: 'fading-circle',
    };
    if (typeof opts === 'string') {
      op.content = opts;
    }
    if (typeof opts === 'object') {
      Object.assign(op, opts);
    }
    if (device.msf) {
      bridge.showLoading({
        content: op.content,
      });
    } else {
      // type = fading-circle snake triple-bounce double-bounce
      Indicator.open(
        compact({
          text: op.content,
          spinnerType: op.type || 'fading-circle',
        })
      );
    }
  },
  hideLoading(times = 0) {
    setTimeout(() => {
      if (device.msf) {
        bridge.hideLoading();
      } else {
        Indicator.close();
      }
    }, times);
  },
  // forward仅用于站内跳转
  forward(url, query = {}) {
    if (!url) return;
    // url 可以传path，也可以传name，建议path
    const urlType = getUrlType(url);
    const info = getUrlInfo(url, query, urlType);
    // APP环境内
    if (device.msf) {
      const openOnlyByNativeList = [
        'article',
        'comment-list',
        'profile',
        'honey-level',
        '/festival/chocie',
        '/festival/index',
      ];
      // 是msf链接
      if (urlType === 'h5Msf' || urlType === 'other') {
        // 目前bridge取不到属性，只能从原window对象上取
        const bridgePages = bridge._pages;
        // console.log('bridgePages________________', bridge);
        if (!bridgePages) {
          console.warn('bridgePages初始化未完成');
          return;
        }
        let curtPathName = router.currentRoute.name;
        // 需求：当前是tab页跳其它页需要新开
        let curtIsTab =
          bridgePages[curtPathName] && bridgePages[curtPathName]['isTab'];
        if (curtPathName == 'article') {
          // 把文章页加入（当前是tab），理由：文章页没有header
          curtIsTab = true;
        }
        // 特殊页：是tab页但却需要用navigateTo，例如跳别人的profile页
        let isExpPage = false;
        if (
          info.pathname == 'profile' &&
          info.query.id &&
          info.query.id != store.state.user.userInfo.id
        ) {
          isExpPage = true;
        }
        // APP开放的page
        if (bridgePages[info.pathname]) {
          // 是tab页面
          if (bridgePages[info.pathname]['isTab'] && !isExpPage) {
            bridge.switchTab({
              url: info.link,
            });
          } else {
            // 不是tab页面
            bridge.navigateTo({
              url: info.link,
            });
          }
        } else {
          // 站内跳转，target_type=native/h5/miniapp
          if ((curtIsTab && !isExpPage) || openOnlyByNativeList.includes(url)) {
            // 当前页是tab页，且不是特殊页（特殊页已有返回键）
            bridge.navigateTo({
              url: info.link,
            });
          } else {
            mini.goRouter(info.path, info.query);
          }
        }
      } else {
        // 其它链接都走这
        bridge.navigateTo({
          url: info.link,
        });
      }
      return;
    }
    if (urlType === 'h5Msf' || urlType === 'other') {
      mini.goRouter(info.path, info.query);
    } else {
      location.href = info.link;
    }
  },
  goRouter(path, query) {
    const { replace, back } = query;
    delete query.replace;
    delete query.back;
    if (back) return mini.back();
    const type = !replace ? 'push' : 'replace';
    router[type](
      {
        path: path,
        query: query,
      },
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  },
  back(n = -1) {
    let deep = window.history.length;
    if (deep > 1) {
      router.go(n);
    } else {
      if (device.msf) {
        bridge.navigateBack();
      } else {
        router.push({
          path: '/',
        });
      }
    }
  },
  // onUrlPage用于各种链接跳转
  onUrlPage(e) {
    e.preventDefault();
    if (!e) {
      console.log('此方法限用于 data-link 链接跳转');
    } else {
      const dom = e.currentTarget;
      let link = dom.getAttribute('data-link');
      // index用于统计
      // let index = dom.getAttribute('data-index');
      const urlType = getUrlType(link);
      // const urlInfo = hashUrl(link);
      // urlInfo.urlType = urlType;
      // urlInfo.link = link;
      if (urlType.indexOf('h5') >= 0) {
        mini.forward(link);
      } else {
        console.warn('目前只支持h5链接', link);
      }

      // const domain = window.document.domain;
      // if (device.msf && urlType.indexOf('h5') >= 0) {
      //   const schema = 'mishifeng://native/';
      //   const params = getTargetUrl(link, 'schemaMsf');
      //   if (params.page && urlType === 'h5Msf') {
      //     link = schema + params.page + '?' + stringify(params.query);
      //   } else if (link.indexOf(domain) === -1) {
      //     link = 'mishifeng://native/webview?url=' + encodeURIComponent(link);
      //   }
      // }
      // console.log(link);
      // window.location.href = link;
    }
  },
  eventSub, // 事件订阅，后期优化
};

// 处理url和query
function getUrlInfo(url, query, urlType) {
  const info = {};
  const params = {
    ...router.currentRoute.query,
  };
  // 需要透传的参数
  const passParams = {};
  for (let key in params) {
    if (passRoutes.includes(key)) {
      passParams[key] = params[key];
    }
  }
  if (urlType.indexOf('h5') >= 0) {
    const urlInfo = hashUrl(url);
    info.pathname = urlInfo.pathname;
    info.path = '/' + info.pathname;
    info.query = Object.assign({}, passParams, urlInfo.query, query);
    if (urlType !== 'h5Msf') {
      // 站外链接指定打开方式为h5
      info.query.target_type = 'h5';
    }
    const queryString = stringify(info.query);
    info.link = queryString
      ? url.split('?')[0] + '?' + queryString
      : url.split('?')[0];
  } else if (urlType === 'other') {
    const reg = /^\//;
    if (!reg.test(url)) {
      url = '/' + url;
    }
    if (url === '/') {
      url = '/index';
    }
    let urlQuery = {};
    // 兼容 /detail?id=3 格式
    if (url.indexOf('?') >= 0) {
      urlQuery = parse(url.split('?')[1]);
      url = url.split('?')[0];
    }
    info.path = url;
    info.pathname = info.path.substr(1);
    info.query = Object.assign({}, passParams, urlQuery, query);
    const queryString = stringify(info.query);
    info.link = queryString
      ? window.location.origin + url + '?' + queryString
      : window.location.origin + url;
  }
  return info;
}

/**
 * 解决循环导入
 * https://www.cnblogs.com/mengfangui/p/9640993.html
 */
export default mini;
