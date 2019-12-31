<template>
  <div class="line1px footer-bar top">
    <AddComment
      class="footer-comment"
      :showAvatar="showAvatar"
      :placeholder="placeholder"
      :articleId="articleId"
      @onEnter="onEnter"
    ></AddComment>
    <div
      class="footer-btn"
      v-for="(item, index) in list"
      :key="index"
      @click="itemClick(item.type, index)"
    >
      <Icon class="item-icon" :type="item.iconType"></Icon>
      <sup class="sup-text" v-if="item.content">{{ item.content }}</sup>
    </div>
  </div>
</template>

<script>
import AddComment from '@/components/AddComment';
import Icon from '@/ui/Icon';

export default {
  props: {
    list: Array,
  },
  components: {
    Icon,
    AddComment,
  },
  data() {
    return {
      placeholder: '来，一起聊聊你的想法',
      showAvatar: false,
      articleId: 0,
    };
  },
  created() {
    this.articleId = Number(this.$route.query.id);
  },
  methods: {
    itemClick(type, index) {
      console.log(type);
      this.$emit('footerBarClick', type, index);
    },
    onEnter(data) {
      console.log(data, 'footbardata');
      this.$emit('addFooterComment', data);
    },
  },
};
</script>

<style>
.footer-bar {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.25);
  overflow: hidden;
  padding: 0 10px;
}
.footer-comment {
  flex: 1;
  border-radius: 5px;
  overflow: hidden;
}
.comment-input {
  display: inline-block;
  width: 100%;
  border: none;
  background: #f7f7f7;
  font-size: 13px;
  color: #999999;
  text-align: justify;
  padding: 6px 15px;
}
.footer-btn {
  align-self: center;
  margin-left: 10px;
  color: #333;
}
.item-icon {
  vertical-align: middle;
  font-size: 22px;
}
.sup-text {
  font-size: 12px;
  margin-left: 2px;
  top: -7px;
}
</style>
