(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["x-52"],{"17f2":function(t,e){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAClklEQVRYR82XjVFUQRCEuyNQMsAIhAzOCNQIgAiECJAI0AjACIAIIAM1AzJQIxjru5p9tffu/ey7s0q2ijrgdrd7/npmrf+8vAQ/IlaS3ks6kvQ6P7nih6Tf+fnNNn83rVkCEQHQJ0nnCfqQQAUUoEIGYhCEzBdJX23z++iaJBARHyRdS2LfZ0n3cxcmYc6xPyRd2L4fYzBKICKwAMuvbHPZ4hURnLvEG7Yvhi4YJBARt5KwYrUknkMAEUFYniTd2T7r79kikJaf/gvwAlaRuLVNLnVrg0DG/E7S8b6W9y1NEt8lfaxzoiOQycMGyqiLeUQ8k1C2CUvzigi8eGO7xuDekzRwXR39L09tH9YolfvOW0kUcEln/TNpEKFYG1kTgNEgyBISU+AA5vfXtg86Aqlwj5IOxuq8hcQceBJAtH6VPFt7IDP/0DalN7qmSLSAV1WBMD1TEYUAdfrUIjhDJJaAp8HEH41ZFQLoOpk+KpljiZn/vxlKuDFXZrlf2j4uBNDsd7bxRNOqPPFqCXh6gK76SInuQ2Bd55L+jFXPhAe2CCwNQQFH2zmL55boxLpb2j7aJQk78CIyLSXay6GtJKT1tpThFnhVWqXrzXoiIrbKcB2TGSEaBV9CInvOphBlZk5J8Sx4K4nUDAYUFHGrGZ3YftOLVzN4C4mpZgQjMrrrVHOeaZBtZsiuu+aIttFxX85AUrmPimBoQBmb5/sGb5DkDDvjI1lFgumH+X5vEqkRgD/YJp82VstYjmJdNTWI3qZqLOeBsmF52dryMCEkNCvUCysmXzpZ53iP/dyPMC1/mFThoDpgzw+dj8vIjbGnGTpPg4I49b7706zv9owncSyP07e552f1OKWMm5N39nG6S+yXnPkL6zavMO7F86kAAAAASUVORK5CYII="},"1d9e":function(t,e,n){t.exports=n.p+"static/img/icon@2x.d2a1baf8.png"},"36f2":function(t,e,n){},3992:function(t,e,n){"use strict";var i=n("bfa3"),s=n.n(i);s.a},"3a93":function(t,e,n){t.exports=n.p+"static/img/sweet.f8ab5cc2.png"},"4e5e":function(t,e,n){t.exports=n.p+"static/img/selected-camp.f8de956e.png"},"52df":function(t,e,n){},"608a":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"bottom-nav"},[i("div",{staticClass:"nav-con"},[i("span",{staticClass:"footer-txt"},[i("img",{staticClass:"left-img",attrs:{src:n("1d9e")}}),t._v("\n      "+t._s(t.downLoadText)+"\n    ")]),i("span",{staticClass:"bottom-btn",on:{click:t.downloadEvent}},[t._v("立即打开")])])])},s=[],a=n("51e6"),o=n("e380"),c={name:"DownloadNav",props:{downLoadText:{type:String,default:"探店套餐1折抢"}},components:{},data:function(){return{}},methods:{downloadEvent:function(){o["a"].event("c_bargain_initiate");var t=this.$route.query,e=void 0===t?{}:t;"iphone"==a["a"].system?location.href=e.ios_url||"https://itunes.apple.com/cn/app/id1435026988?mt=8":"android"==a["a"].system&&(location.href=e.android_url||"https://sj.qq.com/myapp/detail.htm?apkName=com.doweidu.mishifeng")}}},r=c,p=(n("79e5b"),n("2877")),l=Object(p["a"])(r,i,s,!1,null,"f4c32c82",null);e["a"]=l.exports},7701:function(t,e,n){t.exports=n.p+"static/img/salty.f3070ca4.png"},"79e5b":function(t,e,n){"use strict";var i=n("36f2"),s=n.n(i);s.a},"960f":function(t,e,n){t.exports=n.p+"static/img/choice_bg.11b22764.jpg"},"9ad7":function(t,e,n){t.exports=n.p+"static/img/fight-1.de4db208.png"},"9cc1":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"ranking-button",style:t.styles,on:{click:function(e){return e.stopPropagation(),t.btnClick(e)}}},[n("span",{style:t.fontStyle},[t._v(t._s(t.btnText))])])},s=[],a={name:"dumpling-button",props:{imgItem:Object,fontItem:Object,btnText:{type:String,default:"确定"}},computed:{styles:function(){var t=this.$props.imgItem,e=t.width,n=t.height,i=t.bgcolor;return{width:"".concat(e/100,"rem"),height:"".concat(n/100,"rem"),lineHeight:"".concat(n/100,"rem"),backgroundColor:i?"".concat(i):""}},fontStyle:function(){var t=this.$props.fontItem,e=t.size,n=t.color,i=t.width;return{fontSize:e?"".concat(e/100,"rem"):"12px",color:n||"#fff",width:"".concat(i/100,"rem")}}},methods:{btnClick:function(){this.$emit("btnEvent")}}},o=a,c=(n("3992"),n("2877")),r=Object(c["a"])(o,i,s,!1,null,"97e24bd8",null);e["a"]=r.exports},b11e:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"choice"},[i("div",{directives:[{name:"show",rawName:"v-show",value:1==t.pageType,expression:"pageType == 1"}],staticClass:"btn-bg"},[i("img",{staticClass:"share-bg",attrs:{src:n("960f")}}),i("div",{staticClass:"btn-list"},[i("div",{staticClass:"btn-type btn-type-top",class:{btnactive:t.btnActive},on:{click:function(e){return t.btnEvent(2)}}}),i("div",{staticClass:"btn-type btn-type-bottom",on:{click:function(e){return t.btnEvent(1)}}})])]),i("div",{directives:[{name:"show",rawName:"v-show",value:2==t.pageType,expression:"pageType == 2"}],staticClass:"fight-tips"},[i("div",{staticClass:"fight-con"},[i("img",{staticClass:"first",attrs:{src:n("9ad7")}}),i("img",{attrs:{src:n("b8a6")}}),i("img",{attrs:{src:n("ca3c")},on:{click:t.enterBtn}})]),i("div",{staticClass:"enter"})]),i("div",{directives:[{name:"show",rawName:"v-show",value:3==t.pageType,expression:"pageType == 3"}],staticClass:"rule"},[i("span",{staticClass:"fight-title"},[t._v("规则说明")]),i("div",{staticClass:"rule-con"},[i("p",[t._v("\n        1.\n        每一个觅食蜂用户（同一觅食蜂账户ID、手机终端、手机号、身份证视为同一用户）点击参与甜咸粽子活动即可自动获取制作5个粽子的原材料。\n      ")]),i("p",[t._v("\n        2.\n        用户须进入战场主页面点击“包粽子”按钮并成功包好粽子后，该粽子才计入所在阵营的总粽子数中，用户所拥有的粽子原材料数量并不会直接计入阵营粽子数量中\n      ")]),i("p",[t._v("\n        3.用户在选定阵营后不能做阵营的更改，在此次大战中不鼓励反叛行为哦！\n      ")]),i("p",[t._v("\n        4.\n        最后的胜负由双方阵营的战士所包的粽子总数决定，截止活动结束时，粽子总数多的一方将成为本次大战的最终胜者。\n      ")]),i("p",[t._v("\n        5.\n        胜利的一方贡献值排名前10和失利的一方贡献排名前3的用户都可以获得粽子大礼包。胜利的一方排名前3的用户可以额外获得觅食蜂平台任意霸王餐一份。贡献值由用户为阵营包的粽子定。我们将短信通知获奖的用户，并且在活动结束后，公示获奖的名单，请获奖用户及时联系小蜂（mishifeng666）领取奖品。本次活动有效领奖取期间为2019年6月11日至2019年6月17日，逾期将视为您放弃活动奖励。\n      ")]),i("p",[t._v("6. 用户获取粽子原材料的方式有三种。")]),i("p",[t._v("\n        - 在活动期间发布带有 #甜咸粽子大战#\n        标签的有效笔记可以获得10个粽子原材料，笔记被精选可以额外获得40个粽子原材料。\n        发布笔记所得的粽子原材料会在24小时内到账。截止至2019/06/10\n        17:00前发布的活动文章相关的粽子原材料会在当天18:00前全部到账。在2019/06/10\n        17:00后发布的文章会有粽子无法准时到账的情况，所以不要等到最后一刻哦～\n      ")]),i("p",[t._v("\n        -\n        分享给好友，让好友们来为你收集粽子原材料！每个好友通过你分享的页面接受你的支援请求后，你会随机获得数量不等的粽子原材料。每个好友只能为你助力一次。\n      ")]),i("p",[t._v("- 在活动期间用户每天可以在战场页领取到5个粽子原材料")]),i("p",[t._v("\n        7.\n        本次活动不允许任何作弊行为，用户通过任何不正当手段所获得的粽子都会被收回并扣除该用户为所在阵营贡献的所有粽子\n      ")]),i("p",[t._v("\n        8.\n        本活动规则中所述“粽子”，为虚拟的网络活动道具，非实物商品，无法兑换现金或实物、亦无法转让、赠与、出售等；\n        本活动规则第5条所述“粽子大礼包”与“霸王餐”，为实物礼品和线下商品套餐\n      ")]),i("p",[t._v("\n        “粽子大礼包”为五芳斋粽子礼盒（内含大肉粽*2，栗子肉粽*2，蛋黄肉粽*2，豆沙粽*2，蜜枣粽*2）\n      ")]),i("P",[t._v("9.活动时间为：2019/06/06 00：00 - 2019/06/10 18:00")]),i("p",[t._v("10.本活动最终解释权归觅食蜂所有")])],1)]),i("div",{directives:[{name:"show",rawName:"v-show",value:4==t.pageType,expression:"pageType == 4"}],staticClass:"enter_index"},[i("div",{staticClass:"btn_enter_index",on:{click:function(e){return t.goNext()}}})]),i("DumplingConfirm",{attrs:{setType:t.setInfo.setType,settingStatus:t.setInfo.settingStatus,imgUrl:t.setInfo.imgUrl,headerTitle:t.setInfo.headerTitle,settingText:t.setInfo.settingText,headerText:t.setInfo.headerText,noticeText:t.setInfo.noticeText,btnText:t.setInfo.btnText},on:{btnEvent:t.btnForward,closeBox:t.btnClose}}),t.isMSF?t._e():i("DownloadNav",{attrs:{downLoadText:"让你一元吃大餐"}})],1)},s=[],a=n("cebc"),o=n("365c"),c=n("9cc1"),r=n("f501"),p=n("2f62"),l=n("608a"),u=n("4e5e"),f=n.n(u),d=n("3a93"),g=n.n(d),m=n("7701"),v=n.n(m),h=n("51e6"),b=n("4183"),x=n("4360"),T={name:"",components:{DumplingButton:c["a"],DumplingConfirm:r["a"],DownloadNav:l["a"]},data:function(){return{isMSF:h["a"].msf,btnActive:!1,pageType:4,setInfo:{setType:1,settingStatus:!1,headerTitle:"",headerText:"",settingText:"您已经选择过阵营啦！<br/>本次大战不支持更改阵营哦!",noticeText:"",btnText:["前往战场"]},campType:0}},computed:Object(a["a"])({},Object(p["d"])({userInfo:function(t){return t.user.userInfo},logged:function(t){return t.user.logged}})),created:function(){this.pageType=this.$route.query.type||4,this.initBridge()},methods:{initUser:function(){var t=this;o["a"].getUserCamp({},function(e){t.campType=e.data.camp_type,0==t.campType?t.pageType=1:t.$forward("festival/index")},function(t){})},btnEvent:function(t){if(0==this.campType){var e=1===t?g.a:v.a;this.campType=t,this.setInfo={setType:2,settingStatus:!0,headerTitle:"你选择的阵营是",imgUrl:e,settingText:"",noticeText:"",btnText:["再想想","确认"]}}else this.setInfo={setType:1,settingStatus:!0,headerTitle:"",imgUrl:f.a,settingText:"您已经选择过阵营啦！<b/>本次大战不支持更改阵营哦！",noticeText:"",btnText:["前往战场"]}},enterBtn:function(){this.$forward("/festival/index")},btnForward:function(t){var e=this;0==t.index&&1==t.type&&(this.setInfo.settingStatus=!1),0==t.index&&2==t.type&&(this.campType=0,this.pageType=1,this.setInfo.settingStatus=!1),1==t.index&&2==t.type&&o["a"].choiceCamp({camp_type:this.campType},function(t){e.pageType=2,e.setInfo.settingStatus=!1},function(t){})},goNext:function(){this.$store.state.user.userInfo.id?this.initUser():this.isMSF?b["a"].login({success:function(t){var e=t.data;x["a"].commit("SET_USERINFO",e)},fail:function(t){this.showToast("登录失败，请重试！")}}):this.$forward("login")},goback:function(t){1==t?this.$forward("/comment-list",{type:4}):this.$forward("/festival/index")},btnClose:function(){this.setInfo.settingStatus=!1,this.campType=0},initBridge:function(){this.isMSF}}},y=T,w=(n("b4f5"),n("2877")),C=Object(w["a"])(y,i,s,!1,null,"55dc3dce",null);e["default"]=C.exports},b4f5:function(t,e,n){"use strict";var i=n("52df"),s=n.n(i);s.a},b8a6:function(t,e,n){t.exports=n.p+"static/img/fight-2.b1e65cf2.png"},bfa3:function(t,e,n){},c620:function(t,e,n){},ca3c:function(t,e,n){t.exports=n.p+"static/img/fight-3.f64456ba.jpg"},ca90:function(t,e,n){"use strict";var i=n("c620"),s=n.n(i);s.a},f501:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:t.settingStatus,expression:"settingStatus"}],staticClass:"bg",on:{click:t.closeBox}},[i("div",{staticClass:"setting-box"},[i("span",{directives:[{name:"show",rawName:"v-show",value:t.headerTitle,expression:"headerTitle"}],staticClass:"header-title",domProps:{innerHTML:t._s(t.headerTitle)}}),i("span",{directives:[{name:"show",rawName:"v-show",value:t.headerNotice,expression:"headerNotice"}],staticClass:"box-title",domProps:{innerHTML:t._s(t.headerNotice)}}),i("img",{directives:[{name:"show",rawName:"v-show",value:t.imgUrl,expression:"imgUrl"}],staticClass:"img-con",attrs:{src:t.imgUrl}}),i("span",{staticClass:"box-text",class:{typeTitle:3==t.setType},domProps:{innerHTML:t._s(t.settingText)}}),i("i",{directives:[{name:"show",rawName:"v-show",value:t.noticeText,expression:"noticeText"}],staticClass:"box-notice",domProps:{innerHTML:t._s(t.noticeText)}}),i("div",{staticClass:"tab-btn"},t._l(t.btnText,function(e,n){return i("div",{key:"box"+n,staticClass:"box-btn",class:"box_btn_"+n,on:{click:function(e){return e.stopPropagation(),t.handleBox(n,t.setType)}}},[t._v("\n        "+t._s(e)+"\n      ")])}),0)]),i("img",{staticClass:"close-box",attrs:{src:n("17f2")},on:{click:function(e){return e.stopPropagation(),t.closeBox(e)}}})])},s=[],a=(n("c5f6"),{name:"invite-pop",props:{setType:{type:Number,default:1},settingStatus:{type:Boolean,default:!1},headerTitle:{type:String,default:""},headerNotice:{type:String,default:""},imgUrl:{type:String,default:""},settingText:{type:String,default:""},noticeText:{type:String,default:"需完成本页上全部信息才能领取到新手礼包哦～"},btnText:{type:Array,default:function(){return["暂时放弃","继续填写"]}}},methods:{handleBox:function(t,e){this.$emit("btnEvent",Object.assign({},{index:t},{type:e}))},closeBox:function(){this.$emit("closeBox")}}}),o=a,c=(n("ca90"),n("2877")),r=Object(c["a"])(o,i,s,!1,null,"358e831c",null);e["a"]=r.exports}}]);