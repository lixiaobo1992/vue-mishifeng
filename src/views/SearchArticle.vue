<template>
  <div class="page-search-article">
    <Search
      ref="search"
      :fixed="true"
      :placeholder="'搜索美食笔记、店铺或用户'"
      v-model="value"
      @on-submit="onSubmit"
      @on-clear="onClear"
      @on-cancel="onCancel"
    ></Search>
    <Scroll
      :isLoading="isLoading"
      :pullLoading="pullLoading"
      :finished="finished"
      :listLen="1"
      :finishedTip="''"
      @onScrollToLower="onScrollToLower"
    >
      <div class="container">
        <div class="keyword-box" v-show="showType == 1">
          <p class="title" v-show="recentList.length">最近搜过的关键字</p>
          <ul class="keyword-ul" v-show="recentList.length">
            <li
              class="keyword-li"
              v-for="(item, index) in recentList"
              :key="index"
              @click="selectValue(item, index, index)"
            >
              {{ item }}
            </li>
          </ul>
          <p class="title" v-show="hotTags.length">大家都在搜</p>
          <ul class="keyword-ul">
            <li
              class="keyword-li"
              v-for="(item, index) in hotTags"
              :key="index"
              @click="selectValue(item.name, index, item.id)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="waterfall-box" v-show="showType == 2">
          <div class="sub-title">
            <div
              class="switch-btn"
              :class="{ active: currentSubTab == 1 }"
              @click="funcSwitchTab(1)"
            >
              笔记
            </div>
            <div
              class="switch-btn"
              :class="{ active: currentSubTab == 2 }"
              @click="funcSwitchTab(2)"
            >
              用户
            </div>
            <div
              class="switch-btn"
              :class="{ active: currentSubTab == 3 }"
              @click="funcSwitchTab(3)"
            >
              店铺
            </div>
          </div>
          <div class="water-list" v-show="currentSubTab == 1">
            <water-fall ref="waterfall" @ontap="onArticleTap"></water-fall>
          </div>
          <div class="water-list" v-show="currentSubTab == 2">
            <DefaultPage
              :imgItem="imgItem"
              :fontItem="fontItem"
              v-show="!followList.length"
            ></DefaultPage>
            <FollowItem
              v-for="(item, index) in followList"
              :key="index"
              :item="item"
              @toggleFollow="toggleFollow"
            ></FollowItem>
          </div>
          <div class="water-list" v-show="currentSubTab == 3">
            <DefaultPage
              :imgItem="imgItem"
              :fontItem="fontItem"
              v-show="!branchList.length"
            ></DefaultPage>
            <branch-info
              v-for="(item, index) in branchList"
              :branchInfo="item"
              :key="index"
            ></branch-info>
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>
<script>
import api from '@/api';
import { Search, Scroll } from '@/ui';
import WaterFall from '@/components/WaterFall';
import { storage } from '@dwdjs/utils';
import FollowItem from '@/components/FollowItem';
import BranchInfo from '@/components/BranchInfo';
import tongji from '@/utils/tongji';
import defaultSearch from '@/assets/search-default.png';
import DefaultPage from '@/components/DefaultPage';
import { mapGetters, mapActions, mapState } from 'vuex';
export default {
  name: 'search-article',
  components: {
    Search,
    Scroll,
    WaterFall,
    FollowItem,
    BranchInfo,
    DefaultPage,
  },
  data() {
    return {
      value: '',
      recentList: storage.get('searcharticle') || [],
      // 1、常用标签，2、搜索结果，3、搜索模糊列表
      showType: 1,
      isLoading: false,
      pullLoading: false,
      finished: false,
      pagination: {
        page_num: 1,
        total_cnt: 0,
        total_page: 0,
        page_serial: '',
      },
      currentSubTab: 1,
      followList: [], //粉丝列表
      followPagination: {
        page_num: 1,
        total_cnt: 0,
        total_page: 0,
        page_serial: '',
      },
      branchList: [], //店铺列表
      branchPagination: {
        page_num: 1,
        total_cnt: 0,
        total_page: 0,
        page_serial: '',
      },
      branchStatus: true,
      imgItem: {
        src: defaultSearch,
        width: 250,
        height: 200,
      },
      fontItem: {
        width: 240,
        desc: '',
      },
    };
  },
  computed: {
    hotTags() {
      return this.$store.state.search.hotTags;
    },
    ...mapState({
      location: state => state.location,
    }),
    ...mapGetters(['currAddress']),
  },
  created() {
    const keyword = this.$route.query.keyword;
    if (keyword) {
      this.onSearchKeyword(keyword);
    }
    if (this.hotTags.length === 0) {
      this.$store.dispatch('GetHotTags');
    }
  },
  methods: {
    ...mapActions(['getGeo', 'setSelectCity', 'setSelectAddress']),
    //笔记列表
    getArticleList() {
      if (this.isLoading || this.finished) {
        return;
      }
      const keyword = this.value;
      const page_num = this.pagination.page_num;
      const page_serial = this.pagination.page_serial;
      this.isLoading = true;
      let type = 'push';
      if (page_num == 1) {
        this.pullLoading = false;
        type = 'reset';
      } else {
        this.pullLoading = true;
      }
      let showLoading = !this.pullLoading;
      api.articleList(
        {
          search: keyword,
          page_num,
          page_limit: 20,
          page_serial,
          need_pagination: 1,
          showLoading,
        },
        res => {
          console.log(res);
          const { data } = res,
            that = this;
          that.$refs.waterfall.setDate(data.list, type);
          that.pagination = {
            page_serial: data.page_serial,
            total_cnt: data.total_cnt,
            total_page: data.total_page,
          };
          if (page_num < data.total_page) {
            that.pagination.page_num++;
            that.finished = false;
          } else {
            that.finished = true;
          }
          that.showType = 2;
          that.isLoading = false;
          that.pullLoading = false;
        },
        err => {
          console.log(err);
          this.isLoading = false;
          this.pullLoading = false;
        }
      );
    },
    //粉丝列表
    getFollowList() {
      const keyword = this.value || '';
      const page_num = this.followPagination.page_num;
      const page_serial = this.followPagination.page_serial;
      api.followList(
        {
          nickname: keyword,
          type: 1,
          page_num,
          page_serial,
          need_pagination: 1,
        },
        res => {
          console.log(res, 'res');
          const { data } = res;
          const list = data.list;
          this.followList = list.map((item, index) => {
            return Object.assign(
              {
                avatar: item.avatar,
                followed: item.followed,
                name: item.nickname,
                article: item.article_num,
                fans: item.fans_num,
                id: item.user_id,
                quality_user: item.quality_user,
              },
              {
                index,
              }
            );
          });
          this.followPagination = {
            page_serial: data.page_serial,
            total_cnt: data.total_cnt,
            total_page: data.total_page,
          };
          if (page_num < data.total_page) {
            this.followPagination.page_num++;
            this.finished = false;
          } else {
            this.finished = true;
          }
          this.showType = 2;
          this.isLoading = false;
          this.pullLoading = false;
        },
        err => {
          console.log(err, 'res');
        }
      );
    },
    //店铺列表
    getBranchList() {
      const { geoInfo } = this.location;
      console.log(geoInfo, 'selectAddress');
      const keyword = this.value || '';
      const page_num = this.branchPagination.page_num;
      const page_serial = this.branchPagination.page_serial;
      const lng = geoInfo.lng;
      const lat = geoInfo.lat;
      api.branchList(
        {
          q: keyword,
          lng,
          lat,
          page_num,
          page_serial,
        },
        res => {
          console.log(res);
          const { data } = res;
          const list = data.list;
          this.branchList = list.map((item, index) => {
            return Object.assign(
              {
                id: item.id,
                branchLogo: item.branch_head_pic,
                branchName: item.branch_name,
                articleNum: item.article_count,
                starVal: item.star,
              },
              {
                index,
              }
            );
          });
          this.branchPagination = {
            page_serial: data.page_serial,
            total_cnt: data.total_cnt,
            total_page: data.total_page,
          };
          if (page_num < data.total_page) {
            this.branchPagination.page_num++;
            this.finished = false;
          } else {
            this.finished = true;
          }
          this.showType = 2;
          this.isLoading = false;
          this.pullLoading = false;
        },
        err => {
          console.log(err);
        }
      );
    },
    onSubmit(val) {
      // console.log(val);
      if (val) {
        this.$refs.search.setBlur();
        this.onSearchKeyword(val);
      }
    },
    onCancel() {
      this.finished = false;
      this.showType = 1;
    },
    onClear() {
      this.finished = false;
      this.showType = 1;
    },
    selectValue(val, index, id) {
      const value = `index:${index},value:{tagId:${id}}`;
      tongji.event('c_search_history', value);
      this.onSearchKeyword(val);
    },
    onArticleTap({ id, index }) {
      const value = `index:${index},value:{articleId:${id}}`;
      tongji.event('c_article', value);
      this.$forward('article', { id });
    },
    onScrollToLower() {
      // if(this.currentSubTab ==1)
      // this.getArticleList();
      switch (this.currentSubTab) {
        case 1:
          this.getArticleList();
          break;
        case 2:
          this.getFollowList();
          break;
        case 3:
          this.getBranchList();
          break;
        default:
          console.log('点击按钮');
      }
    },
    onSearchKeyword(val) {
      this.value = val;
      this.pagination = {
        page_num: 1,
        total_cnt: 0,
        total_page: 0,
        page_serial: '',
      };
      this.finished = false;
      this.getArticleList();
      this.getFollowList();
      this.getBranchList();
      this.setRecent(val);
    },
    setRecent(val) {
      const oldList = [...this.recentList];
      const len = oldList.length;
      const idx = oldList.indexOf(val);
      if (idx > 0) {
        oldList.splice(idx, 1);
        oldList.unshift(val);
      } else if (idx <= -1) {
        oldList.unshift(val);
        if (len >= 10) {
          oldList.length = 10;
        }
      }
      this.recentList = oldList;
      storage.set('searcharticle', oldList, 0);
    },
    funcSwitchTab(index) {
      this.currentSubTab = index;
      // const eventVal = ['c_list_like', 'c_list_comment', 'c_list_collect'][
      //   index - 1
      // ];
      console.log(index);
      // tongji.event(eventVal);
      switch (index) {
        case 1:
          this.getArticleList();
          break;
        case 2:
          this.getFollowList();
          break;
        case 3:
          this.getBranchList();
          break;
        default:
          console.log('点击按钮');
      }
    },
    toggleFollow(result, index) {
      let followed = result == 3 ? false : true;
      this.$set(this.listData[index], `followed`, followed);
    },
  },
};
</script>
<style lang="stylus" scoped>
>>>.cm-search-box .cm-search-bar {
  background :#fff;
}
>>>.cm-search-box .cm-search-bar:after {
  background:#fff;
  border:1px solid #ebf0f2;
}
>>>.cm-search-box .cm-search-bar .cm-search-bar-form {
  background :none;
  border:none;
}
>>>.cm-search-box .cm-search-bar .cm-search-bar-form .cm-search-input-label,
>>>.cm-search-box .cm-search-bar .cm-search-bar-form label,
>>>.cm-search-box .cm-search-bar.focusing .cm-search-bar-form:after
{
  background :#F0F0F0;
  border-radius :15px;
  border:none;
  outline :none;
}
.page-search-article{
  background :#fff;
  .container{
    position: relative;
    padding-top: 46px;
  }
  .keyword-box{
    padding: 20px 15px 0;
    .title{
      color: #333;
      font-size: 14px;
      font-weight: bold;
      height: 20px;
      line-height: 20px;
      padding-bottom: 10px;
      box-sizing: content-box;
    }
    .keyword-ul{
      list-style: none;
      padding: 10px 0 30px;
      margin: 0;
    }
    .keyword-li{
      list-style: none;
      display: inline-block;
      color:#333;
      font-size: 13px;
      white-space: nowrap;
      padding: 6px 25px;
      border-radius: 15px;
      border: 1px solid #EAEAEA;
      margin:3px;
    }
  }
  .waterfall-box{
    margin: 0 10px;
  }
}
.sub-title{
  display: flex;
  line-height: 26px;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
  margin: 0 15px 10px;
  .switch-btn{
    position: relative;
    padding: 5px 10px 0 10px;
    color:#333;
    text-align:center;
    min-width:18%;
    font-size: 14px;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 0;
      background-image: linear-gradient(90deg, #FFB500 10%, #FDE044 68%);
      border-radius: 3PX;
    }
  }
  .active {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    &::after{
      height: 4PX;
    }
  }
}
>>>.cm-search-input{
  color:#3b3b3b;
}
</style>
