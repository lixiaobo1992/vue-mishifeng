(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["x-21~x-7"],{"0190":function(e,t,a){"use strict";var i=a("19b4"),s=a.n(i);s.a},"036f":function(e,t,a){},1493:function(e,t,a){},"19b4":function(e,t,a){},2446:function(e,t,a){"use strict";var i=a("cebc"),s=a("51e6"),r=a("4183"),n=0;t["a"]={data:function(){return{isLoading:!0,pullLoading:!1,finished:!1,imgIsLoading:!1,scrollCheck:!1,finishedTip:"没有更多数据了",loadingTip:"加载中...",listData:[],pullParamsDefault:{page_num:1,page_limit:20,need_pagination:1,page_serial:""},pullParams:{}}},methods:{initPullList:function(){this.pullParams.page_serial="",this.pullParams.page_num=1,this.finished=!1,this.pullLoading=!1},onRefresh:function(){this.initPullList(),window.scrollTo(0,10)},onScrollToLower:function(){var e=this;if(!this.pullLoading)if(this.finished)this.pullLoading=!1;else{this.pullLoading=!0;var t=n;n++,this.pullModel(Object(i["a"])({},this.pullParamsDefault,this.pullParams,{showLoading:!1}),function(a){e.$hideLoading(),e.isLoading=!1,e.pullLoading=!1,n-1>t||(s["a"].msf&&r["a"].stopRefresh(),"function"===typeof e.afterPull&&e.afterPull(a),e.dealData(a))},function(t){e.$hideLoading(),e.pullLoading=!1,s["a"].msf&&r["a"].stopRefresh()},this)}},pullModel:function(){},dealData:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=this.pullParams.page_num,a=void 0===t?1:t,i=e.data,s=void 0===i?{}:i;this.pullParams.page_serial=s.page_serial||"";var r=s.list||[],n=s.total_page>a;if(1!==a||r.length||(n=!1),1===a&&(this.listData=[]),n&&(this.pullParams.page_num+=1),this.finished=!n,"function"===typeof this.dealList&&r.length){var o=this.dealList(r)||[];if(!o)return void this.$showToast("处理数据返回格式有问题");r=o.filter(function(e){return e})}this.listData=this.listData.concat(r),"function"===typeof this.afterPullData&&this.afterPullData(e)}}}},"7f10":function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"default-page"},[a("div",{staticClass:"top-img",style:e.styles}),a("span",{directives:[{name:"show",rawName:"v-show",value:e.fontItem.desc,expression:"fontItem.desc"}],staticClass:"desc",style:e.fontStyle,domProps:{innerHTML:e._s(e.fontItem.desc)}})])},s=[],r={name:"DefaultPage",props:{imgItem:Object,fontItem:Object},computed:{styles:function(){var e=this.$props.imgItem,t=e.src,a=e.width,i=e.height;return{backgroundImage:t?"url('".concat(t,"')"):null,width:"".concat(a/100,"rem"),height:"".concat(i/100,"rem")}},fontStyle:function(){var e=this.$props.fontItem,t=e.size,a=e.color,i=e.width;return{fontSize:t?"".concat(t/100,"rem"):"12px",color:a||"#ccc",width:"".concat(i/100,"rem")}}},methods:{}},n=r,o=(a("c52c"),a("2877")),l=Object(o["a"])(n,i,s,!1,null,"6e735df8",null);t["a"]=l.exports},ba45:function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"item",class:{active:1==e.item.status,type:4==e.queryType}},[a("div",{staticClass:"item-desc",class:{"item-desc-type":4==e.queryType}},[4!==e.queryType?a("div",{staticClass:"left-icon",on:{click:function(t){return e.goProfile(e.item.sender_id)}}},[a("Avatar",{staticClass:"avatar",attrs:{src:e.item.sender_avatar,size:38,bg:"",navsrc:e.vipsrc,navSatus:e.item.quality_user}})],1):e._e(),a("div",{staticClass:"content",class:{conType:4==e.queryType},on:{click:function(t){return e.goDetail(e.item)}}},[a("div",{staticClass:"item-users ellipsis",class:{itemtype:!e.item.article_pic,userType:4==e.queryType}},[e.item.sender_nickname?a("b",{directives:[{name:"show",rawName:"v-show",value:7!=e.item.type&&8!=e.item.type&&9!=e.item.type,expression:"item.type != 7 && item.type != 8 && item.type != 9"}],staticClass:"title"},[e._v(e._s(e.item.sender_nickname))]):e._e(),a("i",{class:{bold:4===e.queryType}},[e._v("\n          "+e._s(e.item.title)+"\n        ")])]),e.showDom?a("div",{staticClass:"item-active ellipsis",class:{textType:4==e.queryType}},[e._v("\n        "+e._s(e.item.content)+"\n        ")]):a("div",{staticClass:"item-active ellipsis",class:{textType:4==e.queryType}},[e._v("\n        "+e._s(e.item.article_title)+"\n      ")]),a("div",{staticClass:"time",class:{timeType:4==e.queryType}},[e._v("\n        "+e._s(e._f("dateFilter")(e.item.publish_at))+"\n        "),a("p",{directives:[{name:"show",rawName:"v-show",value:4==e.item.type,expression:"item.type == 4"}]},[e._v("回复")])])]),a("div",{directives:[{name:"show",rawName:"v-show",value:1==e.item.type||4!==e.queryType,expression:"item.type == 1 || queryType !== 4"}],staticClass:"right-icon"},[1==e.item.type?a("div",{staticClass:"btn follow-btn",class:{"btn-full":!e.item.is_followed},on:{click:function(t){return e.toggleFollow(e.item.sender_id,e.item.index,e.item.is_followed,e.item.listType)}}},[e._v("\n        "+e._s(e.item.is_followed?"已关注":"回粉")+"\n      ")]):6==e.item.type||7==e.item.type||9==e.item.type?a("div",{directives:[{name:"show",rawName:"v-show",value:e.item.system_link,expression:"item.system_link"}],staticClass:"btn see-btn",on:{click:function(t){return e.goForward(e.item.system_link,e.item.type)}}},[e._v("\n        查看\n      ")]):a("div",{directives:[{name:"show",rawName:"v-show",value:e.item.article_pic,expression:"item.article_pic"}],staticClass:"right-image",on:{click:function(t){return e.goDetail(e.item)}}},[a("img",{attrs:{src:e.item.article_pic,alt:""}})])])])])},s=[],r=(a("6762"),a("2fdb"),a("c5f6"),a("df3a")),n=a("365c"),o=a("4f9d"),l=a("51e6"),c=a("4183"),d=a("e380"),u=a("0f26"),f=a.n(u),p={name:"MessageItem",components:{Avatar:r["a"]},props:{item:Object,queryType:{type:Number,default:1}},data:function(){return{vipsrc:f.a,isMSF:l["a"].msf}},computed:{showDom:function(){return[6,7,8,9,17,20,21,22,23].includes(this.item.type)}},beforeMount:function(){},filters:{dateFilter:function(e){var t=Math.floor(Date.parse(new Date)/1e3),a=t-e,i=86400,s=Math.floor(a/i);return 0==s&&Object(o["b"])(t,"M-D")==Object(o["b"])(e,"M-D")?(e="今天 "+Object(o["b"])(e,"H:F"),e):0==s&&Object(o["b"])(t,"M-D")!==Object(o["b"])(e,"M-D")?(e="昨天",e):Object(o["b"])(e,"M-D")}},methods:{toggleFollow:function(e,t,a,i){var s=this,r="value:{ followerId:".concat(e,"},followed:").concat(a);d["a"].event("c_notification_msg",r),n["a"].toggleFollow({follow_user_id:e},function(e){var a=e.data.result;a&&s.$emit("toggleFollow",a,t,i)},function(e){})},goDetail:function(e){var t=this.$props.queryType,a="https://topic.doweidu.com/?id=94e8d4f521202828b099e29f0a118cda&origin=msf&target_type=h5";switch(e.type){case 1:d["a"].event("c_notification_msg","value:{ followerId:".concat(e.article_id,"}")),this.$forward("profile",{id:e.receiver_id});break;case 4:this.$forward("comments",{id:e.article_id});break;case 5:if(d["a"].event("c_user_icon","value:{ followerId:".concat(e.article_id,"}")),1==e.media_type)this.$forward("article",{id:e.article_id});else if(this.isMSF){var i=this;c["a"].getNativePath({success:function(a){var s=a.data.pathList;s.indexOf("video-list")>=0?i.$forward("video-list",{id:e.article_id,type:4,member:5==t?e.sender_id:e.receiver_id}):i.$forward("article",{id:e.article_id})}})}else this.$forward("article",{id:e.article_id});break;case 6:this.goForward(e.system_link,e.type);break;case 7:this.$forward("/festival/index");break;case 9:this.$forward("honey-detail");break;case 10:this.$forward("comment-detail",{id:e.article_id,pid:e.reply_pid});break;case 11:this.$forward("profile",{id:e.invited_user_id});break;case 12:this.$forward("article",{id:e.related_id});break;case 13:this.$forward("/festival/index");break;case 14:this.$forward("/festival/index");break;case 15:this.$forward("/festival/index");break;case 16:this.$forward("/festival/index");break;case 17:this.$forward("publish",{id:e.related_id,edit:!0});break;case 22:this.goForward(a);break;case 23:this.$forward("product");break;default:if(1==e.media_type)this.$forward("article",{id:e.article_id});else if(this.isMSF){var s=this;c["a"].getNativePath({success:function(a){var i=a.data.pathList;i.indexOf("video-list")>=0?s.$forward("video-list",{id:e.article_id,type:4,member:5==t?e.sender_id:e.receiver_id}):s.$forward("article",{id:e.article_id})}})}else this.$forward("article",{id:e.article_id});break}},goProfile:function(e){e&&(d["a"].event("c_user_icon","value:{ relatedUserId:".concat(e,"}")),this.$forward("profile",{id:e}))},goForward:function(e,t){9!=t?e&&this.$forward(e):this.$forward("honey-note")}}},m=p,v=(a("f48d"),a("2877")),h=Object(v["a"])(m,i,s,!1,null,"74442821",null);t["a"]=h.exports},c52c:function(e,t,a){"use strict";var i=a("1493"),s=a.n(i);s.a},df3a:function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",{staticClass:"avatar-warapper"},[a("div",{staticClass:"avatar-border"},[a("div",{staticClass:"vue-avatar",class:e.classes,style:e.styles},[e._t("default")],2),a("Icon",{staticClass:"avatar-mask",attrs:{type:"avatar-mask",color:e.maskColor}}),a("i",{directives:[{name:"show",rawName:"v-show",value:e.navSatus,expression:"navSatus"}],staticClass:"bottom-nav",class:{navvip:e.navSatus},style:e.navStyles},[a("sub",{directives:[{name:"show",rawName:"v-show",value:e.navType>0,expression:"navType > 0"}]},[e._v(e._s(e.navText.navText))])])],1)])},s=[],r=a("bd86"),n=(a("ac6a"),a("456d"),a("6762"),a("2fdb"),a("c5f6"),a("38a5")),o=a("526c"),l=a.n(o),c=a("e9d2"),d=a.n(c),u=a("a4b8"),f=a.n(u),p={scaleToFill:"contain",aspectFill:"cover",widthFix:"100% auto",heightFix:"auto 100%"},m={name:"avatar",components:{Icon:n["a"]},props:{prefixCls:String,src:String,spin:Boolean,shadow:Boolean,size:[String,Number],bg:String,color:String,mode:{type:String,default:"aspectFill",validator:function(e){return Object.keys(p).includes(e)}},shape:{type:String,validator:function(e){return["circle","hexagon"].includes(e)}},navSatus:{type:[Boolean,Number],default:!1},navType:{type:Number,default:0},navsrc:{type:String,default:l.a},maskColor:{type:String,default:"#ffffff"}},computed:{classes:function(){var e,t=this.$props,a=t.spin,i=t.shadow,s=t.shape;return e={},Object(r["a"])(e,"is-spin",a),Object(r["a"])(e,"is-".concat(s),!!s),Object(r["a"])(e,"is-shadow",!!i),e},styles:function(){var e=this.$props,t=e.src,a=e.size,i=void 0===a?0:a,s=e.color,r=e.bg,n=e.mode;return{backgroundImage:t?"url('".concat(t,"')"):null,width:"".concat(i/100,"rem"),height:"".concat(i/100,"rem"),color:!!s,backgroundColor:r||null,backgroundSize:p[n]}},navStyles:function(){var e=this.$props.navType,t="";switch(e){case 0:t=null;break;case 1:t=l.a;break;case 2:t=f.a;break;case 3:t=d.a;break;default:break}return{backgroundImage:"url('".concat(t,"')")}},navText:function(){var e=this.$props.navType,t="";switch(e){case 0:t="";break;case 1:t="认证达人";break;case 2:t="探店达人";break;case 3:t="官方账号";break;default:break}return{navText:t}}}},v=m,h=(a("0190"),a("2877")),y=Object(h["a"])(v,i,s,!1,null,"45f7c22a",null);t["a"]=y.exports},f48d:function(e,t,a){"use strict";var i=a("036f"),s=a.n(i);s.a}}]);