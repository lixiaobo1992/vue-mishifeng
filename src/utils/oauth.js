// 授权逻辑

import { wxappId, aliappId } from '@/config';
import env from '@/config/env';
// import store from '@/store';

const { location } = window;
console.log(location.pathname);
const getRedirectUri = (redirect = '', pop_code = '') => {
  // `xxx/redirect?redirect=${window.location.origin}/authredirect`
  // `${location.origin}/oauth`
  let url = '';
  if (env.isEnv(['dev', 'local'])) {
    const jumpUrl = window.location.origin + `/login?pop_code=${pop_code}`;
    // const redirectUri = encodeURIComponent(
    //   location.protocol +
    //     '//m.beta.mishifeng.com/test-code?c_redirect=profile&jumpUrl=' +
    //     jumpUrl
    // );
    url = `https://m.beta.mishifeng.com/test-code?c_redirect=${redirect}&jumpUrl=${jumpUrl}`;
  } else {
    url = `${window.location.origin}/login?c_redirect=${redirect}&pop_code=${pop_code}`;
  }
  return encodeURIComponent(url);
};

export default {
  getOauthUrl({ type, scope, c_redirect = '', pop_code = '' }) {
    let url = '';
    switch (type) {
      case 'wechat': {
        // store.commit('SET_AUTH_TYPE', type);
        // const { scope = 'snsapi_base' } = this;
        const appId = wxappId;
        // 因为格式化，如有换行若不处理，会导致生成的链接错误
        // alert(getRedirectUri(c_redirect));
        url =
          `https://open.weixin.qq.com/connect/oauth2/authorize` +
          `?appid=${appId}` +
          `&redirect_uri=${getRedirectUri(c_redirect, pop_code)}` +
          `&response_type=code` +
          `&scope=${scope}` +
          `&state=${Date.now()}` +
          `#wechat_redirect`;
        break;
      }
      case 'alipay': {
        // store.commit('SET_AUTH_TYPE', type);
        const appId = aliappId;
        url =
          `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm` +
          `?app_id=${appId}` +
          `&redirect_uri=${getRedirectUri()}` +
          `&scope=${scope}` +
          `&state=${Date.now()}` +
          `#wechat_redirect`;
        break;
      }
      case 'qq': {
        // store.commit('SET_AUTH_TYPE', type);
        // const clientId = 'xxxxx';
        url =
          `https://graph.qq.com/oauth2.0/authorize` +
          `?response_type=code` +
          `&client_id=${scope}` +
          `&redirect_uri=${getRedirectUri()}`;
        break;
      }
      default:
      // do nothing...
    }
    return url;
  },
};
