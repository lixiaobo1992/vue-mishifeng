(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["x-34"],{"9fe5":function(t,e,s){},af5c:function(t,e,s){"use strict";var a=s("9fe5"),c=s.n(a);c.a},c8ac:function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAcCAYAAABlL09dAAAAAXNSR0IArs4c6QAAA3RJREFUSA2VVU1sTFEUPue+aad/SMv8dFKt6iOkdEEQ0q5EGjSk0a1IJK2wsOlCiNDY2dhJRILEyk9oxN+KjZBuJIJGa2YI0Zm+V0TbGVPVece5U3d63/zouMnMPec73/nuffedcx9CkbGxsbF2Jp3aTw52McUkoCYk9ADSFyCIAOItbx0NDg9PJApJYC5omqYXktP9QM4JAliaG9d9Tp4mAaciY/ZFRGT6wnAJr29qqv/9KzXIu9u2QCnBQniGZByIjI9PKHZWeG0otMJx5oZYtEUF/2dGwOGKStj59qNtyTwh/wYGBkSa5uROC4k+FAIOGwI65E/avJsHMk8fnNuamoE7UkvimR2b9f6DRHRdJ3LIRoF9kZh1z43Pe2YosI8cugxAAT3OZ90fidsXUL4sSk6NAlGTIvBqsYpK3KQeS+G5c1tLwJ9MOq8Yr1cxFp6A6qUrhfg53a2LSgIa4shiopL3OmrZwhB90laDn9wHyake4QB1KDAzIw6Gx6y8M3RxNCfD5RwNAkLYJbjYd+ggF/5Nl1+Cg0Lc0Glc0VsEb71ZBz2C3ul+KbYHc3KIGgQf9pyeTI5nVvdLsckx3DmIFYL7MKknOzSXrQ4d/5fNPbDKHSdLINGQDnKh79b9Uuz8HBwRhOKJOxl7Wxp8phsr7s1zsdfNwMeiqsx7m8HJbICoCtJ4TbVmFi9g8ItHSMNV7oMqFeZ3NiuMslvzLR3yD3B7nlVBOXPgPndfb7FG2dDsD8yk4DIfwz49j8v1UjRuH80Ib169etlkKhHhHazQSbz6V67zM3xr3VULtK7yBX/NYDevfC6XL+8XQ3ha38diXzPCUmxtMLgnDWnZcVnMtQhf6hzi2qcaHddtrt0D4bh9V2KGCnxLJMLLa5ZU8m3VrrCc2ct+eQ6WdRHhSiQ+cV4BmbtTOQ3r1p/m/T5Sfskzf0G8df5jOj/vsdvaAtU/bXrKj7xVJxaz+csR5e/Fdv2zJLl5whI0g0EfgPOCxRer57hRLtrff7Y+yDx9uI5CBeTqohw7eV1LYXkzwo8yj+gsJCq5BYVlIJOAxl5+1IT0XQMx5UHsGvlivXHhmlNUWHKi8fhLPqwePq/sDShtg0TPaMx+runkmdlyy4v8Bb4nktHamppP7Hbzj7hpDoXHrUytFsv5L9ys951cEwocLzXpDzK+PnFLj32AAAAAAElFTkSuQmCC"},d705:function(t,e,s){"use strict";s.r(e);var a,c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"page-search-shop"},[a("search",{ref:"SearchShop",attrs:{fixed:"",placeholder:"商圈,街道,地区"},on:{"on-submit":t.onSubmit,"on-change":t.placeSearchEvent,"on-cancel":t.onCancel,"on-clear":t.onClear},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}}),a("div",{staticClass:"centent-box"},[a("div",{staticClass:"address-box clearfix"},[a("div",{staticClass:"current-address",on:{click:t.currentLocation}},[a("p",[a("img",{attrs:{src:s("c8ac")}}),a("span",[t._v(t._s(t.currentAddress.address))])]),""!==t.currentAddress.tipText?a("small",[t._v(t._s(t.currentAddress.tipText))]):t._e()]),t.nearbyAddress.length?a("div",{staticClass:"city-box"},[a("p",{staticClass:"city-list-title"},[t._v("附近商圈")]),a("ul",{staticClass:"city-list"},t._l(t.nearbyAddress,function(e,s){return a("li",{key:"item_"+s+e.id,on:{click:function(s){return t.selectCurrentAddress(e)}}},[a("span",[t._v(t._s(e.name))])])}),0)]):t._e(),t.hotAddress.length?a("div",{staticClass:"city-box"},[a("p",{staticClass:"city-list-title"},[t._v("热门商圈")]),a("ul",{staticClass:"city-list"},t._l(t.hotAddress,function(e,s){return a("li",{key:"item_"+s+e.id,on:{click:function(s){return t.selectCurrentAddress(e)}}},[a("span",[t._v(t._s(e.name))])])}),0)]):t._e()]),t.searchResultList.length?a("div",{staticClass:"search-result",class:{show:t.searchResultList.length}},[a("div",{staticClass:"mask"}),a("div",{staticClass:"result-list"},t._l(t.searchResultList,function(e,s){return a("div",{key:"_"+s+e.id,staticClass:"line1px bottom result-item",on:{click:function(s){return t.selectSearchAddress(e)}}},[a("span",[t._v(t._s(e.name))]),a("p",[t._v(t._s(e.address))])])}),0)]):t._e()])],1)},n=[],i=(s("386d"),s("7f7f"),s("cebc")),r=s("2f62"),o=s("365c"),l=s("79bb"),d=s("a4eb"),u={name:"search-shop",components:{Search:l["d"]},data:function(){return{value:"",hotAddress:[],nearbyAddress:[],isShowResult:1,searchResultList:[]}},created:function(){var t=this;this.$showLoading(),this.getGeo({name:"shop-search",success:function(e){t.getData(),t.initConfig()},fail:function(e){t.getData(),t.initConfig()}})},mounted:function(){var t=this;this.$nextTick(function(){t.$refs.SearchShop.setFocus()})},computed:Object(i["a"])({},Object(r["d"])({location:function(t){return t.location}}),Object(r["c"])(["currAddress","defaultInfo"]),{currentAddress:function(){var t=this.location,e=t.locationState,s=t.geoInfo,a=e.code,c=e.text,n=c,i="";return 2===a?(n=s.address,i="(当前定位)"):3===a&&(n=this.defaultInfo.address,i="(定位失败)"),{address:n,tipText:i}}}),methods:Object(i["a"])({},Object(r["b"])(["getGeo","setSelectCity","setSelectAddress"]),{currentLocation:function(){var t=this.location,e=t.locationState.code,s=t.geoInfo;1===e||(2===e?this.setSelectCity(s):3===e&&this.setSelectCity(this.defaultInfo)),this.selectCurrentAddress({})},selectCurrentAddress:function(t){this.setSelectAddress(t),this.$back()},selectSearchAddress:function(t){var e=t.location,s=t.address,a=t.name,c={address:s,lat:e.lat,lng:e.lng,name:a};this.selectCurrentAddress(c)},onSubmit:function(t){},onCancel:function(){this.searchResultList=[]},onClear:function(){this.searchResultList=[]},getData:function(){var t=this;o["a"].nearcbd({},function(e){var s=e.data,a=s.hot,c=void 0===a?[]:a,n=s.near,i=void 0===n?[]:n;t.hotAddress=c,t.nearbyAddress=i},function(t){})},initConfig:function(){var t=this,e=window,s=e.AMap;s?this.initPlaceSearch():d["a"].geoInitGd().then(function(e){t.initPlaceSearch()})},initPlaceSearch:function(){var t=window,e=t.AMap,s=this.currAddress.citycode,c=s<100?"0"+s:s;e.plugin("AMap.PlaceSearch",function(){var t={pageSize:50,pageIndex:1,city:c,citylimit:!0};a=new e.PlaceSearch(t)})},placeSearchEvent:function(t){""!==t?a.search(t,this.placeSearchCallBack):this.searchResultList=[]},placeSearchCallBack:function(t,e){if("complete"===t&&"OK"===e.info){var s=e.poiList;this.searchResultList=s.pois||[]}}})},h=u,f=(s("af5c"),s("2877")),A=Object(f["a"])(h,c,n,!1,null,"d3795128",null);e["default"]=A.exports}}]);