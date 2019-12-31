<template>
  <div class="comment-page" ref="page">
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck"
    >
      <div class="comment-header">
        <div class="left-icon" @click="goProfile(replayObj.userId)">
          <Avatar
            :src="replayObj.avatar"
            :size="40"
            bg="#fff"
            maskColor="#fff"
            class="avatar"
          >
          </Avatar>
        </div>
        <div class="comment-desc">
          <div class="conent top-content">{{ replayObj.nick_name }}</div>
          <div class="times" v-html="replayObj.created_at"></div>
          <div class="user-desc">
            <div class="user-name">{{ replayObj.content }}</div>
          </div>
          <div class="reply-detail" style="display: none;">
            <span class="textleft"></span>
          </div>
        </div>
        <div class="cm-like-box" @click.stop="isLike(replayObj)">
          <span class="like-number">{{ replayObj.likes_num }}</span>
          <img
            src="../assets/img/good-icon.png"
            v-if="!replayObj.isPraise"
            class="like-ok"
          />
          <img
            src="../assets/img/good-icon-no.png"
            v-if="replayObj.isPraise"
            class="like-no"
          />
        </div>
      </div>
      <div class="comments-list">
        <CommentItem
          v-for="(item, index) in listData"
          :key="index"
          :item="item"
          :bgavatar="bgavatar"
          @onEnterReply="onEnterReply"
          :likesStatus="likeStatus"
        ></CommentItem>
      </div>
      <div class="add-comment">
        <AddComment
          @onEnter="onEnter"
          :userAvatar="userAvatar"
          :articleId="articleId"
          :userName="userName"
          placeholder="写下你的想法吧"
          :userId="replayObj.userId"
        ></AddComment>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import CommentItem from '@/components/CommentItem';
import AddComment from '@/components/AddComment';
import PullListMixin from '@/mixins/pull-list';
import { Scroll } from '@/ui';
import api from '@/api';
import Avatar from '@/components/Avatar';
import { dateFilter } from '@/utils/base/filter-date';
import defaultAvatar from '@/assets/login/default-avatar.png';
import tongji from '@/utils/tongji';

export default {
  mixins: [PullListMixin],
  components: {
    AddComment,
    CommentItem,
    [Scroll.name]: Scroll,
    Avatar,
  },
  data() {
    return {
      userAvatar: '',
      comments: [],
      listData: [],
      articleId: 0,
      userName: '',
      bgavatar: '#f2f2f2',
      replayObj: {},
      userinfos: {},
      likes_comment: [],
      userinfo: {},
      finishedTip: '',
      userId: 0,
      likeStatus: true,
    };
  },
  methods: {
    refresh() {
      this.initPullList();
      [this.pullParams.id, this.pullParams.reply_pid] = [
        this.$route.query.id || 2,
        this.$route.query.pid,
      ];
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.commentList.apply(this, rest);
    },
    dealList(list = []) {
      const { likes_comment, userinfo } = this;
      return list.map(item => {
        return {
          avatar: this.userinfos[item.user_id]
            ? this.userinfos[item.user_id].avatar_url
            : defaultAvatar,
          userName: this.userinfos[item.user_id]
            ? this.userinfos[item.user_id].nickname
            : '觅食蜂',
          content: item.content,
          time: dateFilter(item.created_at),
          likesNum: item.likes_num, // 2.1版本需求，点赞数量
          isPraise: this.isPraise(item.id, likes_comment, userinfo), //2.1版本需求 true是显示已点赞的图片 false显示还没有点过赞的图片
          id: item.user_id,
          replyPid: item.id,
          arctileId: item.article_id,
          reply_to_userName: this.userinfos[item.reply_to]
            ? this.userinfos[item.reply_to].nickname
            : this.replayObj.nick_name,
          replyStatus: this.replayObj.reply_parent_comment,
          userType: item.quality_user,
        };
      });
      //console.log(list, 'list');
    },
    afterPull(res) {
      let data = res.data;
      this.userinfos = data.userinfos;
      if (data.userinfo && data.userinfo.avatar) {
        [this.userAvatar, this.userName, this.likes_comment, this.userinfo] = [
          data.userinfo.avatar,
          data.userinfo.userName,
          data.likes_comment,
          data.userinfo,
        ];
      }
      const parentComment = data.reply_parent_comment;
      this.replayObj = {
        content: parentComment.content,
        created_at: dateFilter(parentComment.created_at),
        avatar: data.userinfos[parentComment.user_id]
          ? data.userinfos[parentComment.user_id].avatar_url
          : defaultAvatar,
        nick_name: data.userinfos[parentComment.user_id]
          ? data.userinfos[parentComment.user_id].nickname
          : '觅食蜂',
        id: parentComment.id,
        userId: parentComment.user_id,
        likes_num: parentComment.likes_num, // 2.1版本需求，点赞数量
        isPraise: this.isPraise(parentComment.id, data.likes_comment), //2.1版本需求 true是显示已点赞的图片 false显示还没有点过赞的图片
      };
      console.log(res.data.total_cnt, 'res.data.total_cnt');
    },
    onEnter(data) {
      let time = Date.parse(new Date()) / 100;
      // const that = this;
      let comment = {
        avatar: data.avatar,
        userName: data.nickname,
        content: data.content,
        time: dateFilter(time),
      };
      console.log('onter');
      setTimeout(() => {
        this.listData = [comment, ...this.listData];
        this.refresh();
      }, 1000);
    },
    onEnterReply(data) {
      console.log(data, 'data');
      setTimeout(() => {
        this.refresh();
      }, 1000);
    },
    goProfile(id) {
      tongji.event('c_user_icon', `value:{primaryCommentAuthorId:${id}}`);
      if (!id) {
        return;
      }
      this.$forward('profile', { id });
    },
    isLike(item) {
      let { isPraise, id } = item;
      let parms = {
        comment_id: id,
      };
      api.setPraise(
        parms,
        res => {
          if (!isPraise) {
            // 没有点赞
            this.replayObj.isPraise = true;
          } else {
            // 已点赞
            this.replayObj.isPraise = false;
          }
          this.replayObj.likes_num = res.data.likes_num;
        },
        err => {
          console.log(err);
        }
      );
    },
    // 2.1版本 处理当前评论是否点赞
    isPraise(id, list = [], userinfo) {
      if (list.includes(id) && userinfo.user_id > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.articleId = parseInt(this.$route.query.id);
    this.refresh();
    console.log(this.replayObj.userId, 'this.replayObj');
  },
};
</script>

<style lang="stylus" scoped>
.comment-page {
  background-color: #f2f2f2;
  padding-bottom: 50px;
}
>>>.comment-item {
  padding-left:15px;
  padding-right: 15px;
  .user-desc {
    border-bottom:1px solid #D8D8D8;
    padding-bottom :10px;
  }
}
>>>.user-name {
  display :-webkit-box;
  -webkit-line-clamp:15;
  white-space :normal;
  -webkit-box-orient: vertical;
  word-break :break-all;
  margin-top:18px;
}
.top-content {
  height:18px;
}
.comment-header {
  padding: 10px 0;
  display: flex;
  justify-content: left;
  font-size: 14px;
  color: #231815;
  line-height: 20px;
  overflow: hidden;
  background : #fff;
  padding-left:15px;
}
.comments-list{
  background :#f2f2f2;
}
.add-comment {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  box-shadow: 0 -1px 10px #00000061;
  margin: 0 auto;
  z-index:999;
}
.comment-desc {
  text-align :justify;
  .user-name {
    margin-top:0;
  }
}
.cm-like-box{
  position: absolute;
  right: 15px;
  top: 10px;
  .like-number{
    font-size: 12px;
  }
  .like-ok{
    width: 14px;
    height: 14px;
    margin-left: 4px;
  }
  .like-no{
    width: 14px;
    height: 14px;
    margin-left: 4px;
  }
}
.left-icon {
  flex-shrink: 0;
  width: 0.4rem;
  height: 0.4rem;
  margin-right: 10px;
}
.times {
  white-space: nowrap;
  font-size: 0.12rem;
  color: #ccc;
  transform: scale(0.85);
  display: inline-block;
  line-height:16px;
}
</style>
