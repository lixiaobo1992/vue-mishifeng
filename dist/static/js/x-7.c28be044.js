(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["x-7"],{5013:function(t,e,a){"use strict";a.r(e);var i,s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"page-message",class:{header:t.isMSF}},[t.isMSF?t._e():i("Header",{ref:"profileHeader",staticClass:"my-header",attrs:{"left-options":{showBack:!1},title:"",fixed:!0}},[i("img",{staticClass:"icon-right",attrs:{src:a("d2ff")},on:{click:function(e){return t.goback()}}}),i("span",[t._v(t._s(t.messageTitle))])]),i("vue-scroll",{staticClass:"page-scroll",attrs:{finished:t.finished,listLen:t.listData.length,isLoading:t.isLoading,finishedTip:t.finishedTip,"immediate-check":t.scrollCheck},on:{onScrollToLower:t.onScrollToLower},model:{value:t.pullLoading,callback:function(e){t.pullLoading=e},expression:"pullLoading"}},[i("div",{staticClass:"block-list",class:{"block-list-type":4==t.page.front_type}},[i("div",{staticClass:"list"},[t._l(t.listData,function(e,a){return i("MessageItem",{directives:[{name:"show",rawName:"v-show",value:t.listData,expression:"listData"}],key:a,attrs:{item:t.assignObj(e,a),queryType:t.page.front_type},on:{toggleFollow:t.toggleFollow}})})],2),t.listDataStatus?t._e():i("DefaultPage",{attrs:{imgItem:t.imgItem,fontItem:t.fontItem}})],1)])],1)},n=[],o=(a("ac6a"),a("7514"),a("cebc")),r=a("bd86"),l=(a("7f7f"),a("2f62")),c=a("4183"),f=a("51e6"),u=a("df3a"),p=a("ba45"),g=a("79bb"),d=a("2446"),h=a("365c"),m=a("7f10"),_=a("2d7f"),b=a.n(_),y=a("f29e"),v=a("7676"),w=a.n(v),k=a("e380"),D=[{type:1,title:"收藏的赞和收藏"},{type:2,title:"收到的评论"},{type:3,title:"粉丝列表"},{type:4,title:"通知消息"},{type:5,title:"关注消息"}],S={mixins:[d["a"]],components:(i={Avatar:u["a"],MessageItem:p["a"]},Object(r["a"])(i,g["c"].name,g["c"]),Object(r["a"])(i,"DefaultPage",m["a"]),Object(r["a"])(i,"Header",y["a"]),i),data:function(){return{hasMore:!0,avatar:"",imgItem:{src:b.a,width:250,height:200},fontItem:{width:240,desc:"你还没有收到任何消息哦～"},listData:[],totalPage:1,page:{page_num:1,page_limit:20,need_pagination:1,front_type:0,page_cursor:""},isMSF:f["a"].msf,messageTitle:"全部消息",listDataStatus:!0}},created:function(){this.page.front_type=parseInt(this.$route.query.type)||1,this.messageTitle=this.flterTitle(this.page.front_type)},mounted:function(){this.appConfig.unread=0,this.setAppConfig(this.appConfig),this.isMSF&&this.initBridge(),this.getMessageData()},computed:Object(o["a"])({},Object(l["d"])({appConfig:function(t){return t.app.appConfig}})),beforeDestroy:function(){this.isMSF&&(c["a"].disableRefresh(),c["a"].offPullRefresh(function(t){}),c["a"].offPageShow({}))},methods:Object(o["a"])({},Object(l["b"])(["setAppConfig"]),{flterTitle:function(t){var e=D.find(function(e){return e.type==t});return e.title||"全部消息"},getMessageData:function(){var t=this,e=this.page;h["a"].messageList(e,function(e){t.page.page_cursor=e.data.age_cursor;var a=e.data.list;if(a.length){var i=parseInt(t.page.front_type);t.totalPage=e.data.total_page;var s=[];switch(i){case 1:s=a.filter(function(t){return 2==t.type||3});break;case 2:s=a.filter(function(t){return 4==t.type||10});break;case 3:s=a.filter(function(t){return 1==t.type});break;case 4:s=a.filter(function(t){return 6==t.type||7});break;case 5:s=a.filter(function(t){return 1==t.type||5});break;default:s=a;break}if(t.isMSF){var n=t;c["a"].setNavigationBar({title:n.messageTitle,color:"#171900",success:function(t){}}),1==t.page.page_num&&(t.listData=[]),c["a"].stopRefresh()}t.listData=t.listData.concat(s),t.listData.forEach(function(t){return{type:t.type,sender_nickname:t.sender_nickname,sender_avatar:t.sender_avatar||w.a,status:t.status,title:t.title,is_followed:t.is_followed,sender_id:t.sender_id,article_id:t.article_id,created_at:t.created_at,content:t.content,system_link:t.system_link,article_title:t.article_title,quality_user:1==t.sender_quality_user}})}else t.listDataStatus=!1},function(e){t.listDataStatus=!1})},initBridge:function(){var t=this;c["a"].enableRefresh(),c["a"].onPullRefresh({success:function(e){t.onRefresh()}})},goback:function(){this.$back()},onScrollToLower:function(){var t=this;this.totalPage>this.page.page_num?(this.page.page_num++,!this.isMSF&&this.$showLoading(),setTimeout(function(){t.getMessageData()},2e3)):(this.finishedTip="没有更多数据了!",this.finished=!0)},onRefresh:function(){var t=this;this.page.page_num=1,!this.isMSF&&this.$showLoading(),setTimeout(function(){t.getMessageData()},2e3)},toggleFollow:function(t,e,a){var i=3!=t,s="value:{ followerId:".concat(this.listData[e].sender_id,"},followed:").concat(i);k["a"].event("c_notification_msg",s),this.$set(this.listData[e],"is_followed",i)},assignObj:function(t,e,a){return Object.assign(t,{index:e,listType:a})}})},T=S,M=(a("c235"),a("2877")),C=Object(M["a"])(T,s,n,!1,null,"23ded3b7",null);e["default"]=C.exports},7676:function(t,e,a){t.exports=a.p+"static/img/default-avatar.8503dae1.png"},"76e5":function(t,e,a){},c235:function(t,e,a){"use strict";var i=a("76e5"),s=a.n(i);s.a}}]);