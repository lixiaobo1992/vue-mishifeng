import axios from 'axios';
import { stringify, compat } from 'kit-qs';
import { clone } from '@/utils';
import mini from '@/utils/mini';
import device from '@/utils/device';
import bridge from '@/utils/bridge';
import store from '@/store';
import jsReport from '@/config/js-report';
// import LRU from 'lru-cache';
// import env from '@/config/env';
// 创建axios实例
function noop() {
  console.warn('异常流程，不应该进入这里');
}
//配置缓存信息
// const microCache = new LRU({
//   max: 100, //最大的缓存数目
//   maxAge: 1000, //设置数据多久过期 默认1s
// });

function checkStatus(res = {}) {
  console.log('check');
  const { status } = res;
  if (status >= 200 && status < 300) {
    return res;
  }
}

const defaultOptions = {
  url: '',
  method: 'get',
  baseURL: '',
  headers: {
    // 'Content-Type': 'application/json; charset=utf-8',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  params: {},
  data: {},
  responseType: 'json',
  withCredentials: true,
};

export default function request({
  url,
  method,
  options = {},
  success = noop,
  fail = noop,
  header,
}) {
  const opts = clone(defaultOptions);
  opts.url = url;
  opts.headers = {
    ...opts.headers,
    ...header,
  };
  // let api;
  // if (env.apiBaseUrl) {
  //   api = env.apiBaseUrl = {
  //     api: env.apiBaseUrl,
  //     cached: LRU({
  //       max: 1000,
  //       maxAge : 1000
  //   }),
  // }
  // }
  let hasLoading = false;
  if (options.showLoading) {
    hasLoading = true;
    mini.showLoading();
  }
  delete options.showLoading; // 删除loading
  if (method === 'GET') {
    opts.method = 'get';
    opts.params = compat({ ...options });
    // console.log(opts.params, 'opts.params');
  } else {
    opts.method = 'post';
    // let query = new URLSearchParams();
    // for (let key in options) {
    //   query.append(key, options[key]);
    // }
    // opts.data = query;
    opts.data = stringify(options);
  }

  const successCallBack = data => {
    hasLoading && mini.hideLoading();
    if (typeof success === 'function') {
      success(data);
    }
  };
  const errorCallBack = (err = {}) => {
    hasLoading && mini.hideLoading();
    if (typeof fail === 'function' && fail(err)) {
      return;
    }
    const { errmsg = '网络异常，请稍后重试', errno = 'err' } = err;
    console.warn(JSON.stringify(err));
    // 9610010 未登录
    if (errno === 9610010) {
      store.dispatch('FedLogout');
      if (device.msf) {
        bridge.login({
          success(res) {
            //..
            console.log(res);
            const { data } = res;
            store.commit('SET_USERINFO', data);
          },
          fail(err) {
            console.log('app 登录失败！', err);
            // mini.forward('/index');
            mini.showToast('登录失败，请重试！');
          },
        });
      } else if (device.wxapp) {
        console.error('wxapp');
        store.commit('SET_USER_LOGIN_LAYER', true);
        // 提示弹层
      } else {
        // 要带来源页面，便于返回
        // debugger;
        mini.forward('/login', {
          c_redirect: location.href,
        });
      }
    } else {
      // const message = `${errno}: ${errmsg}`;
      // const message = `${errmsg}`;
      // console.log('errmsg:', message);
      mini.showToast(errmsg);
    }
  };

  function log(res) {
    // console.log('44444444');
    console.log(`api: ${method} ${res.status} ${url}`, 'logres');
    //获取缓存数据
    return res;
  }
  // const key = url + JSON.stringify(opts.params);
  axios(opts)
    .then(log)
    .then(checkStatus)
    .then((res = {}) => {
      // console.log(JSON.stringify(res));
      const { data = {} } = res;
      //如果存在，添加配置的缓存信息
      // if (opts.params.cache && microCache.get(key)) {
      //   console.log('返回缓存数据');
      //   return Promise.resolve(microCache.get(key));
      // }
      if (data.errno === 0) {
        // if (opts.params.cache && microCache) {
        //   microCache.set(key, data);
        //   console.log(microCache, 'microCache');
        //   console.log('使用缓存数据！');
        //   //return;
        //   Promise.resolve(data);
        // }
        // console.log('返回新数据！');
        successCallBack(data);
      } else {
        errorCallBack({
          errno: data.errno,
          errmsg: data.errmsg,
        });
      }
    })
    .catch(err => {
      const message = {
        api: url,
        errno: err.statusCode,
        errmsg: err.message,
        value: `${err.statusCode || -1} ${err.message}`,
        params: options,
      };
      console.error(message);
      jsReport(message);
      errorCallBack(message);
    });
}

//以formData形式上传七牛
export function ajaxFormData(formData) {
  return new Promise(function(resolve, reject) {
    axios
      .post('https://up.qbox.me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
