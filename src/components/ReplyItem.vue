<template>
  <span
    ><p @click.stop="goProfile(itemSub.user.user_id)">
      <b
        >{{ itemSub.user.nickname }}
        <i v-show="itemSub.user.isAuthor" class="author">(作者)</i>:
      </b>
    </p>
    <p @click.stop="goProfile(itemSub.replyTo.user_id)">
      <i class="reply">回复</i>@{{ itemSub.replyTo.nickname
      }}<i v-show="itemSub.replyTo.isAuthor" class="author">(作者)</i>:
    </p>
    {{ itemSub.user.content }}</span
  >
  <!-- </div> -->
</template>
<script>
import tongji from '@/utils/tongji';
export default {
  name: 'reply-item',
  props: {
    itemSub: Object,
  },
  methods: {
    goProfile(id) {
      if (!id) {
        console.log(id, 'id');
        return;
      }
      tongji.event('c_user_icon', `value:{primaryCommentAuthorId:${id}}`);
      this.$forward('profile', { id });
    },
  },
};
</script>
<style lang="stylus" scoped>
p {
  display :inline;
  font-family: 'PingFangSC-Light';
  color:#628db7;
}
span{
  display:-webkit-box;
  line-height:18px;
  color:#333;
  font-size:12px;
  overflow:hidden;
  text-overflow :ellipsis;
  -webkit-line-clamp :2;
  -webkit-box-orient:vertical;
  font-weight:400;
  font-family: 'PingFangSC-Light';
  b{
    color:#151515;
    font-weight:400;
    font-family: 'PingFangSC-Regular';
  }
  i{
    font-style :normal;
  }
  .reply {
    color:#151515;
  }
}
</style>
