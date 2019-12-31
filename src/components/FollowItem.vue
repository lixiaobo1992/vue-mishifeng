<template>
  <div class="item" v-show="item.avatar !== null && item.nickname !== null">
    <div class="left-icon" @click="goProfile(item.id)">
      <Avatar
        :src="item.avatar"
        :navsrc="vipsrc"
        :navSatus="item.qualityUser"
        :size="46"
        bg=""
        class="avatar"
      >
      </Avatar>
    </div>
    <div class="content" @click="goProfile(item.id)">
      <div class="level-box">
        <div class="name ellipsis">{{ item.name }}</div>
        <div
          class="level-img-box"
          v-for="(levelItem, levelIndex) in levelList"
          :key="levelIndex"
        >
          <img
            class="level-img"
            v-if="levelItem.level == item.level"
            :src="levelItem.image"
          />
        </div>
      </div>
      <div class="follow-desc ellipsis" v-show="!item.content && item.article">
        {{ item.article }}篇觅食记 {{ item.fans }}位粉丝
      </div>
      <div class="follow-desc ellipsis">
        {{ item.content }}
      </div>
    </div>
    <div
      class="btn follow"
      @click="goNext(item.id, item.index)"
      v-if="!item.followed"
    >
      <i>+</i> 关注
    </div>
    <div class="btn" @click="goNext(item.id, item.index, 2)" v-else>已关注</div>
  </div>
</template>

<script>
import api from '@/api';
import Avatar from '@/components/Avatar';
import mini from '@/utils/mini';
import tongji from '@/utils/tongji';
import vipsrc from '@/assets/img/vip.png';
// item: {
//         avatar: '', //左边的头像
//         followed: false,     //是否关注
//         name: 'aaa',  //用户昵称
//         article: 10,  //文章数
//         fans: 20,     //粉丝数
//         id: 121212  // 被关注人/粉丝ID
//       }

export default {
  name: 'FollowItem',
  components: {
    Avatar,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      vipsrc: vipsrc,
      levelList: [
        // v2.4.0等级列表
        {
          level: 1,
          image: 'https://img.mishifeng.com/FgY5XT2DOQPbe9DikpyOHsXltMcN',
        },
        {
          level: 2,
          image: 'https://img.mishifeng.com/FobnFz2hIEYX93jUsZ2vZ20Yrf_T',
        },
        {
          level: 3,
          image: 'https://img.mishifeng.com/FjMiAxVy_1QJBJ88i32P7MI-TJUb',
        },
        {
          level: 4,
          image: 'https://img.mishifeng.com/FoPcuQ2ZdOXo6f_neo3XROREd9dm',
        },
        {
          level: 5,
          image: 'https://img.mishifeng.com/Fv4AympZ5RM4f2S-GgedxnOD845C',
        },
        {
          level: 6,
          image: 'https://img.mishifeng.com/Fog7ZsXSvEaLUViwe-K3MHc7CP54',
        },
        {
          level: 7,
          image: 'https://img.mishifeng.com/FiUTqDr4AFMCFVi7tPHFVsDDVf1p',
        },
        {
          level: 8,
          image: 'https://img.mishifeng.com/FpWmuysyqR_cXUT5pSjO_kikdAMt',
        },
      ],
    };
  },
  methods: {
    goNext(id, index, type = 1) {
      const that = this;
      if (type == 2) {
        // mini.showConfirm('是否取消关注', '', res => {
        //   // 确定
        //   if (res == 'confirm') {
        //     that.follow(id, index);
        //   } else {
        //     // 取消
        //     console.log('点击取消按钮');
        //   }
        // });
        mini.showConfirm({
          title: '',
          message: '是否取消关注',
          callback(res) {
            if (res == 'confirm') {
              that.follow(id, index);
            } else {
              // 取消
              console.log('点击取消按钮');
            }
          },
        });
      } else {
        that.follow(id, index);
      }
    },
    follow(id, index) {
      api.toggleFollow(
        {
          follow_user_id: id,
        },
        res => {
          console.log(res);
          const { result } = res.data;
          if (result) {
            this.$emit('toggleFollow', result, index);
          }
        },
        err => {
          console.log(err);
          // debugger;
          if (err.errno == '91610301') {
            this.$showToast(err.errmsg);
            return true;
          }
        }
      );
    },
    goProfile(id) {
      if (!id) {
        return;
      }
      tongji.event('c_writer_icon');
      this.$forward('profile', { id });
    },
  },
};
</script>

<style lang="stylus" scoped>
.avatar{
  display: block;
}
.item{
  display: flex;
  justify-content: space-between;
  height: 68px;
  align-items: center;
}
.left-icon{
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}
.content{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 0 10px;
}
.level-box{
  display: flex;
}
.level-img{
  width: 35px;
  height: 11px;
  margin-left: 2px;
}
.name{
  font-weight: 600;
  font-size: 12px;
  color: #333;
}
.ellipsis{
  word-break: break-all;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 20px;
  -webkit-line-clamp: 1;
}
.follow-desc{
  font-size: 10px;
  color: #999;
}
.btn{
  width: 64px;
  line-height: 24px;
  text-align: center;
  border-radius: 14px;
  font-size: 11px;
  border: 1px solid #FDE044;
  color:#171900;
}
.follow{
  background: #FDE044;
  i {
    font-size:17px;
    vertical-align:-1px;
  }
}
</style>
