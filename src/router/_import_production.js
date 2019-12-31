module.exports = file => () =>
  import(/* webpackChunkName: "msf-[index]" */ '@/views/' + file + '.vue');
