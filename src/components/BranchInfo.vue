<template>
  <div class="branch-info" @click="goBranch">
    <div class="branch-logo"><img :src="branchInfo.branchLogo" /></div>
    <div class="branch-content">
      <p class="branch-name">{{ branchInfo.branchName }}</p>
      <div class="score">
        <star
          class="star-block"
          :scoreMax="50"
          :value="branchInfo.starVal"
        ></star>
        <span class="article-num">{{ branchInfo.articleNum }}篇觅食笔记</span>
      </div>
    </div>
    <div class="branch-right">
      <Icon mode="custom" type="arrow-right" style="color: #B3B3B3; "></Icon>
    </div>
  </div>
</template>
<script>
import Icon from '@/ui/Icon';
import Star from '@/components/Star';
import tongji from '@/utils/tongji';
/**
 * 数据格式
 * branchInfo: {
 *  id: 9, 门店id
 *  branchNamez: '', 门店名称
 *  articleNum: 12, 该门店拥有觅食笔记数量
 *  startObj = {  门店评分数据 组件RecommentStar使用
 *    max: 50,  评分总长度
 *    singleSize: 10,  单个评分长度
 *    select: 10,  选中长度
 *    width: 18, 评分宽度单个
 *    height: 18,  评分高度单个
 *    allowHalf: false,  是否允许小数评分 例 3.5评分，显示选中3个半
 *    normalIcon: 'article/rate-disabled.png',  未选中评分背景，可不传
 *    activeIcon: 'article/rate-disabled.png',  选中评分背景，可不传
 *  },
 * }
 */
export default {
  name: 'branch-info',
  components: {
    Icon,
    Star,
  },
  props: {
    branchInfo: {
      type: Object,
      default: () => {
        return {
          starVal: 0,
        };
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    // 进入店铺详情页
    goBranch() {
      const branchId = this.branchInfo.id || '',
        value = `value:{storeId:${branchId}}`;
      tongji.event('c_good_store', value);
      this.$forward('shop-detail', { id: branchId });
    },
  },
};
</script>
<style lang="stylus" scoped>
.branch-info {
  display: flex;
  padding: 15px 15px 15px 0;
  margin-left: 15px;
  border-bottom: 1px solid #eaeaea;
  align-items: center;
  .branch-logo {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    overflow: hidden;
    margin-right: 13px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .branch-content {
    flex: 1;
    .branch-name {
      font-weight: 500;
      font-size: 14px;
      color: #333;
      margin-bottom: 3px;
    }
    .score {
      display: flex;
      align-items: center;
      .star-block{
        display: flex;
        align-items: center;
        >>> .star-item{
          width: 16px;
          height: 13.6px;
          margin-right: 3px;
        }
      }
      .article-num {
        font-size: 12px;
        color: #999;
        margin-left: 4px;
      }
    }
  }
  .branch-right {
    align-self: center;
    line-height: 200%;
  }
}
</style>
