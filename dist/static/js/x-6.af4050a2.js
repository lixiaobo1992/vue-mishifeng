(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["x-6"],{2446:function(e,t,i){"use strict";var a=i("cebc"),s=i("51e6"),n=i("4183"),r=0;t["a"]={data:function(){return{isLoading:!0,pullLoading:!1,finished:!1,imgIsLoading:!1,scrollCheck:!1,finishedTip:"没有更多数据了",loadingTip:"加载中...",listData:[],pullParamsDefault:{page_num:1,page_limit:20,need_pagination:1,page_serial:""},pullParams:{}}},methods:{initPullList:function(){this.pullParams.page_serial="",this.pullParams.page_num=1,this.finished=!1,this.pullLoading=!1},onRefresh:function(){this.initPullList(),window.scrollTo(0,10)},onScrollToLower:function(){var e=this;if(!this.pullLoading)if(this.finished)this.pullLoading=!1;else{this.pullLoading=!0;var t=r;r++,this.pullModel(Object(a["a"])({},this.pullParamsDefault,this.pullParams,{showLoading:!1}),function(i){e.$hideLoading(),e.isLoading=!1,e.pullLoading=!1,r-1>t||(s["a"].msf&&n["a"].stopRefresh(),"function"===typeof e.afterPull&&e.afterPull(i),e.dealData(i))},function(t){e.$hideLoading(),e.pullLoading=!1,s["a"].msf&&n["a"].stopRefresh()},this)}},pullModel:function(){},dealData:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=this.pullParams.page_num,i=void 0===t?1:t,a=e.data,s=void 0===a?{}:a;this.pullParams.page_serial=s.page_serial||"";var n=s.list||[],r=s.total_page>i;if(1!==i||n.length||(r=!1),1===i&&(this.listData=[]),r&&(this.pullParams.page_num+=1),this.finished=!r,"function"===typeof this.dealList&&n.length){var l=this.dealList(n)||[];if(!l)return void this.$showToast("处理数据返回格式有问题");n=l.filter(function(e){return e})}this.listData=this.listData.concat(n),"function"===typeof this.afterPullData&&this.afterPullData(e)}}}},"59bc":function(e,t,i){},"5c93":function(e,t,i){"use strict";var a=i("59bc"),s=i.n(a);s.a},c0f9:function(e,t,i){"use strict";i.r(t);var a,s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{ref:"page",staticClass:"comment-page"},[a("vue-scroll",{staticClass:"page-scroll",attrs:{finished:e.finished,listLen:e.listData.length,isLoading:e.isLoading,finishedTip:e.finishedTip,"immediate-check":e.scrollCheck},on:{onScrollToLower:e.onScrollToLower},model:{value:e.pullLoading,callback:function(t){e.pullLoading=t},expression:"pullLoading"}},[a("div",{staticClass:"comment-header"},[a("div",{staticClass:"left-icon",on:{click:function(t){return e.goProfile(e.replayObj.userId)}}},[a("Avatar",{staticClass:"avatar",attrs:{src:e.replayObj.avatar,size:40,bg:"#fff",maskColor:"#fff"}})],1),a("div",{staticClass:"comment-desc"},[a("div",{staticClass:"conent top-content"},[e._v(e._s(e.replayObj.nick_name))]),a("div",{staticClass:"times",domProps:{innerHTML:e._s(e.replayObj.created_at)}}),a("div",{staticClass:"user-desc"},[a("div",{staticClass:"user-name"},[e._v(e._s(e.replayObj.content))])]),a("div",{staticClass:"reply-detail",staticStyle:{display:"none"}},[a("span",{staticClass:"textleft"})])]),a("div",{staticClass:"cm-like-box",on:{click:function(t){return t.stopPropagation(),e.isLike(e.replayObj)}}},[a("span",{staticClass:"like-number"},[e._v(e._s(e.replayObj.likes_num))]),e.replayObj.isPraise?e._e():a("img",{staticClass:"like-ok",attrs:{src:i("965e")}}),e.replayObj.isPraise?a("img",{staticClass:"like-no",attrs:{src:i("43cb")}}):e._e()])]),a("div",{staticClass:"comments-list"},e._l(e.listData,function(t,i){return a("CommentItem",{key:i,attrs:{item:t,bgavatar:e.bgavatar,likesStatus:e.likeStatus},on:{onEnterReply:e.onEnterReply}})}),1),a("div",{staticClass:"add-comment"},[a("AddComment",{attrs:{userAvatar:e.userAvatar,articleId:e.articleId,userName:e.userName,placeholder:"写下你的想法吧",userId:e.replayObj.userId},on:{onEnter:e.onEnter}})],1)])],1)},n=[],r=(i("6762"),i("2fdb"),i("75fc")),l=i("bd86"),o=(i("7f7f"),i("b232")),u=i("d6de"),c=i("2446"),d=i("79bb"),f=i("365c"),m=i("df3a"),p=i("bc05"),h=i("7676"),_=i.n(h),v=i("e380"),g={mixins:[c["a"]],components:(a={AddComment:u["a"],CommentItem:o["a"]},Object(l["a"])(a,d["c"].name,d["c"]),Object(l["a"])(a,"Avatar",m["a"]),a),data:function(){return{userAvatar:"",comments:[],listData:[],articleId:0,userName:"",bgavatar:"#f2f2f2",replayObj:{},userinfos:{},likes_comment:[],userinfo:{},finishedTip:"",userId:0,likeStatus:!0}},methods:{refresh:function(){this.initPullList();var e=[this.$route.query.id||2,this.$route.query.pid];this.pullParams.id=e[0],this.pullParams.reply_pid=e[1],this.onScrollToLower()},pullModel:function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];f["a"].commentList.apply(this,t)},dealList:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=this.likes_comment,a=this.userinfo;return t.map(function(t){return{avatar:e.userinfos[t.user_id]?e.userinfos[t.user_id].avatar_url:_.a,userName:e.userinfos[t.user_id]?e.userinfos[t.user_id].nickname:"觅食蜂",content:t.content,time:Object(p["a"])(t.created_at),likesNum:t.likes_num,isPraise:e.isPraise(t.id,i,a),id:t.user_id,replyPid:t.id,arctileId:t.article_id,reply_to_userName:e.userinfos[t.reply_to]?e.userinfos[t.reply_to].nickname:e.replayObj.nick_name,replyStatus:e.replayObj.reply_parent_comment,userType:t.quality_user}})},afterPull:function(e){var t=e.data;if(this.userinfos=t.userinfos,t.userinfo&&t.userinfo.avatar){var i=[t.userinfo.avatar,t.userinfo.userName,t.likes_comment,t.userinfo];this.userAvatar=i[0],this.userName=i[1],this.likes_comment=i[2],this.userinfo=i[3]}var a=t.reply_parent_comment;this.replayObj={content:a.content,created_at:Object(p["a"])(a.created_at),avatar:t.userinfos[a.user_id]?t.userinfos[a.user_id].avatar_url:_.a,nick_name:t.userinfos[a.user_id]?t.userinfos[a.user_id].nickname:"觅食蜂",id:a.id,userId:a.user_id,likes_num:a.likes_num,isPraise:this.isPraise(a.id,t.likes_comment)}},onEnter:function(e){var t=this,i=Date.parse(new Date)/100,a={avatar:e.avatar,userName:e.nickname,content:e.content,time:Object(p["a"])(i)};setTimeout(function(){t.listData=[a].concat(Object(r["a"])(t.listData)),t.refresh()},1e3)},onEnterReply:function(e){var t=this;setTimeout(function(){t.refresh()},1e3)},goProfile:function(e){v["a"].event("c_user_icon","value:{primaryCommentAuthorId:".concat(e,"}")),e&&this.$forward("profile",{id:e})},isLike:function(e){var t=this,i=e.isPraise,a=e.id,s={comment_id:a};f["a"].setPraise(s,function(e){t.replayObj.isPraise=!i,t.replayObj.likes_num=e.data.likes_num},function(e){})},isPraise:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],i=arguments.length>2?arguments[2]:void 0;return!!(t.includes(e)&&i.user_id>0)}},mounted:function(){this.articleId=parseInt(this.$route.query.id),this.refresh()}},b=g,y=(i("5c93"),i("2877")),k=Object(y["a"])(b,s,n,!1,null,"564821a6",null);t["default"]=k.exports}}]);