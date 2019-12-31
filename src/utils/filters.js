import Vue from 'vue';
import { formatCountDown, formatDate } from '@/utils/base';
import { dealPrice } from './index';
// 距离
Vue.filter('distance', distance => {
  let str = '';
  const tempSistance = distance || 0;
  if (tempSistance < 1000) {
    str = tempSistance + 'm';
  } else if (tempSistance >= 1000) {
    if (tempSistance >= 1000 * 100) {
      str = '>100km';
    } else {
      str = (tempSistance / 1000).toFixed(1) + 'km';
    }
  }
  return str;
});

Vue.filter('price', price => dealPrice(price, 100));

Vue.filter('formatCountDown', formatCountDown);
Vue.filter('formatDate', formatDate);

Vue.filter('url', url => {
  //
  var h5 = /^(https|http):\/\//i;
  if (!h5.test(url)) return url;
  //
  const protocol = location.protocol;
  let tempUrl = url.split('://');
  return `${protocol}//${tempUrl[1]}`;
});
