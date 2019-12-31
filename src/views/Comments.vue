<template>
  <div class="comment-page" ref="page">
    <vue-scroll
      class="page-scroll"
      v-model="pullLoading"
      :finished="finished"
      :listLen="listData.length"
      :isLoading="isLoading"
      :imgIsLoading="imgIsLoading"
      @onScrollToLower="onScrollToLower"
      :finishedTip="finishedTip"
      :immediate-check="scrollCheck"
    >
      <div class="comments-list">
        <CommentItem
          v-for="(item, index) in listData"
          :key="index"
          :item="item"
          :likesStatus="likeStatus"
          @onEnterReply="onEnterReply"
        ></CommentItem>
      </div>
      <div class="add-comment">
        <AddComment
          @onEnter="onEnter"
          :userAvatar="userAvatar"
          :articleId="articleId"
          :userType="userType"
          :replyPid="replyPid"
          :userId="userId"
          :placeholder="placeholderString"
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
import defaultAvatar from '@/assets/login/default-avatar.png';
import { dateFilter } from '@/utils/base/filter-date';
export default {
  mixins: [PullListMixin],
  components: {
    AddComment,
    CommentItem,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      userAvatar: '',
      comments: [],
      listData: [],
      articleId: 0,
      userId: 0,
      userType: false,
      userinfos: {},
      article_info: {},
      finishedTip: '',
      imgIsLoading: true,
      likes_comment: [],
      userinfo: {},
      likeStatus: true,
      placeholderString: '写下你的想法吧',
      replyPid: 0, // 第一级评论id
    };
  },
  methods: {
    refresh() {
      this.initPullList();
      this.pullParams.id = this.$route.query.id || 2;
      this.onScrollToLower();
    },
    // 列表接口
    pullModel(...rest) {
      api.commentList.apply(this, rest);
    },
    dealList(list = []) {
      const { userinfos, likes_comment, userinfo } = this;
      return list.map(item => {
        return {
          avatar: userinfos[item.user_id]
            ? userinfos[item.user_id].avatar_url
            : defaultAvatar,
          userName: userinfos[item.user_id]
            ? userinfos[item.user_id].nickname
            : '觅食蜂',
          content: item.content,
          time: dateFilter(item.created_at),
          id: item.user_id,
          likesNum: item.likes_num, // 2.1版本需求，点赞数量
          isPraise: this.isPraise(item.id, likes_comment, userinfo), //2.1版本需求 true是显示已点赞的图片 false显示还没有点过赞的图片
          replyPid: item.id,
          arctileId: item.article_id,
          replayList:
            item.sub_comment.list.map(replayItem => {
              return {
                // 回复人
                user: {
                  user_id: replayItem.user_id,
                  nickname:
                    (userinfos[replayItem.user_id] || {}).nickname || '觅食蜂',
                  isAuthor: replayItem.user_id == this.article_info.user_id,
                  content: replayItem.content, //内容
                },
                // 被回复人
                replyTo: {
                  user_id: replayItem.reply_to,
                  nickname:
                    (userinfos[replayItem.reply_to] || {}).nickname || '觅食蜂',
                  isAuthor: replayItem.reply_to == this.article_info.user_id,
                },
                // userType: item.quality_user == 1 ? true : false,
              };
            }) || [],
          count: item.sub_comment.total_cnt,
          userType: userinfos[item.user_id].quality_user == 1 ? true : false,
        };
      });
    },
    afterPull(res) {
      let data = res.data,
        that = this;
      if (data.userinfo && data.userinfo.avatar) {
        [
          that.userAvatar,
          that.userinfos,
          that.article_info,
          that.likes_comment,
          that.userinfo,
        ] = [
          data.userinfo.avatar,
          data.userinfos,
          data.article_info,
          data.likes_comment,
          data.userinfo,
        ];
        that.userType = data.quality_user == 1 ? true : false;
      }
      //this.userId = res.data.reply_parent_comment.user_id;
    },
    onEnter(data) {
      this.placeholderString = data.placeholder;
      this.userId = data.userId;
      if (data.type) {
        this.refresh();
      } else {
        let time = Date.parse(new Date()) / 1000;
        let comment = {
          avatar: data.avatar,
          userName: data.nickname,
          content: data.content,
          time: dateFilter(time),
        };
        this.listData = [comment, ...this.listData];
      }
    },
    onEnterReply(data) {
      if (data.type == 1) {
        this.placeholderString = data.placeholder;
        this.userId = data.user_id || 0;
        this.replyPid = data.reply_pid || 0;
      } else {
        setTimeout(() => {
          this.refresh();
        }, 1000);
      }
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
  created() {
    this.articleId = parseInt(this.$route.query.id);
    this.refresh();
  },
};
</script>

<style lang="stylus" scoped>
.comment-page {
  background-color: #fff;
  padding-bottom: 50px;
}

.comments-list{
  padding: 0 15px;
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
>>>.reply-detail span{
  -webkit-line-clamp:15;
}
>>>.user-name{
  display :-webkit-box;
  -webkit-line-clamp:15;
  white-space :normal;
  -webkit-box-orient: vertical;
  word-break :break-all;
}
</style>
