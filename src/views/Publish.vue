<template>
  <div class="share">
    <div class="header">
      <a class="left" @click="cancelEdit">取消</a>
      <span class="header-title">分享美食体验</span> <a></a>
    </div>
    <p class="top-border">晒出你的美食图片吧！</p>
    <div class="hello">
      <div class="upload">
        <div class="upload_warp">
          <Upload target="avatar" @complete="onComplete">
            <div class="upload_warp_left">
              <img src="~assets/publish/icon_upload@2x.png" />
            </div>
          </Upload>

          <div class="upload_warp_img" v-show="imgList.length != 0">
            <div
              class="upload_warp_img_div"
              v-for="(item, index) of imgList"
              :key="'_' + index + item.id"
            >
              <div class="upload_warp_img_div_top">
                <div class="upload_warp_img_div_text">
                  <!-- {{item.file.name}} -->
                </div>
                <img
                  src="~assets/publish/icon_delete_img@2x.png"
                  class="upload_warp_img_div_del"
                  @click="fileDel(index)"
                />
              </div>
              <img :src="item.result.pic" />
            </div>
          </div>
        </div>
        <div class="upload_warp_text">
          选中{{ imgList.length }}张文件,最多可上传9张图片
        </div>
      </div>
    </div>
    <div class="title">
      <input
        placeholder="标题:这一刻的美食心情"
        type="text"
        class="time"
        v-model="sharetitle"
      />
      <span class="fr">5-20个字</span>
    </div>
    <textarea
      placeholder="内容：分享你的美食体验，馋坏那些吃不到的人吧！"
      class="text-content"
      type="textarea"
      rows="6"
      v-model="content"
      style="backgrond:none;"
    >
    </textarea>
    <div class="score">
      <span>推荐指数:</span>
      <div class="scoreDetail">
        <span
          class="star-item"
          v-for="(star, index) in starScore"
          :key="'item_' + index + star.index"
          :class="star"
          @click="score(index)"
        ></span>
      </div>
    </div>
    <div class="addTag" @click="showTagModel">
      <p class="findyou" v-if="!selectedList.length">
        添加美食标签，让更多感兴趣的人发现你
      </p>
      <div class="fl-text" v-else>
        <span
          v-for="(item, index) in selectedList"
          :key="'item_' + index + item.id"
        >
          {{ item.name }}
        </span>
      </div>
      <img src="~assets/publish/more.png" class="right-img fr" />
    </div>
    <div
      class="foodTag"
      style="border-bottom:1px solid #E2E2E2;"
      @click="goAddress"
    >
      <img src="~assets/publish/icon_location@2x.png" class="left-img" />
      <div class="fl-text" style="width:90%;" v-if="currentAddress.address">
        <span>{{ currentAddress.address }}</span>
      </div>
      <input
        placeholder="美食坐标"
        type="text"
        class="foodlocal"
        v-model="address"
        v-else
      />
      <img
        src="~assets/publish/more.png"
        alt="左边"
        class="right-img fr mgleft"
        style="display:none"
      />
    </div>
    <button type="button" class="btnSub" @click="finishPub">发表</button>
    <div class="model-address" v-show="tagmodel == true">
      <search
        :placeholder="'添加美食标签'"
        v-model="tagValue"
        @on-change="tagSearchEvent"
        @on-submit="onSubmit"
        @on-cancel="onCancel"
      ></search>
      <scroll>
        <div class="container">
          <ul class="selected" v-show="selectedList.length">
            <li
              v-for="(item, index) in selectedList"
              :key="'item_' + index + item.id"
              @click="delSel(item)"
            >
              {{ item.name }}<i>&#120;</i>
            </li>
          </ul>
          <!-- <div class="usedtag-box">
                      <p class="title">最近用过的标签</p>
                      <ul class="used">
                          <li>下午茶</li>
                          <li>烧烤</li>
                          <li>烤肉</li>
                          <li>奶茶</li>
                          <li>DIY</li>
                      </ul>
                  </div>  -->
          <div class="usedtag-box" v-show="hotList.length">
            <p class="title">大家都在搜</p>
            <ul class="used">
              <li
                v-for="(item, index) in hotList"
                :key="'item_' + index + item.id"
                @click="tagSelect(item)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div class="usedtag-box" v-show="searchList.length">
            <p class="title">搜索结果</p>
            <ul class="used">
              <li
                v-for="(item, index) in searchList"
                :key="'item_' + index + item.id"
                @click="tagSelect(item)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <button
            type="button"
            class="btnSub"
            style="color:#fff;"
            v-show="selectedList.length"
            @click="hideModel"
          >
            选好了,确认
          </button>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import api from '@/api';
import { Search, Scroll } from '@/ui';
import Upload from '@/components/Upload';
import { storage } from '@dwdjs/utils';

export default {
  name: 'publish',
  components: {
    Search,
    Scroll,
    Upload,
  },
  data() {
    return {
      sharetitle: '', //标题,必填字段
      zone_id: '', //城市id，必填
      star: '', //推荐指数，必填
      content: '', //文章内容
      //  pic_list: [], //文章图片列表
      tag_list: [], //文章数据列表
      address: '', //地址
      imgList: [], //文章图片列表
      size: 0, //上传总图片大小
      tagValue: '', //搜索标签值
      tagmodel: false,
      searchList: [],
      selectedList: [],
      hotList: [],
      arrImg: [],
    };
  },
  computed: {
    starScore() {
      let stars = [];
      let score = Math.floor(this.star * 2) / 2; //把评分转成整数或整数+0.5（如：4.7转成4.5，4.2转成4.0）
      //  let decimalScore = score % 1 !== 0;
      let integerScore = Math.floor(score); //取整数分数（显示全星）
      for (let i = 0; i < integerScore; i++) {
        stars.push('on');
      }
      //   if (decimalScore) {
      //     stars.push('half'); //存在小数分数，添加一个半星
      //   }
      while (stars.length < 5) {
        stars.push('off'); //如果星星数不满5颗，空星填充
      }
      return stars;
    },

    ...mapState({
      location: state => state.location,
      publish: state => state.publish.storeMessage,
    }),
    ...mapGetters(['currAddress', 'defaultInfo']),
    currentAddress() {
      const { locationState, geoInfo } = this.location;
      const { code, text } = locationState;
      let address = text;
      if (code === 2) {
        address = geoInfo.address;
        // tipText = '(当前定位)';
      } else if (code === 3) {
        address = this.defaultInfo.address;
        // tipText = '(定位失败)';
      }
      return {
        address,
        //  tipText,
      };
    },
  },
  created() {
    console.log('created...');
    //storage.set('publish', '111', 600);
    console.log('publish' + storage.get('publish'));
    //storage.remove('publish');
    this.getHotData();
    console.log('pulish', this.publish);
    this.sharetitle = this.publish.title || '';
    this.content = this.publish.content || '';
    this.star = this.publish.star;
    this.imgList = this.publish.imgList || [];
    this.selectedList = this.publish.selectedList || [];
    console.log(this.title);
  },
  mounted() {
    console.log(this.star);
  },
  methods: {
    onComplete(status, result, target, index) {
      console.log(result);
      // console.log(result);
      if (status == 200) {
        //console.log("pic==>"+ pic);
        if (this.imgList.length < 9) {
          this.imgList.push({
            result,
          });
        }
        console.log('result==>' + result.pic);
        console.log('imglist==>' + this.imgList);
        const opts = {
          pic: '',
          width: '200',
          height: '200',
        };
        //let arrImg = [];
        //  let arrImg=[]
        for (var i = 0; i < this.imgList.length; i++) {
          console.log(this.imgList[i].result.pic);
          opts.pic = this.imgList[i].result.pic;
          opts.width = this.imgList[i].result.width;
          opts.height = this.imgList[i].result.height;
        }
        this.arrImg.push(opts);
        //result.pic = arrImg.pic;
        console.log(this.arrImg, opts);
      } else {
        this.$showToast('最多可上传9张图片！');
      }
    },
    score(star) {
      console.log(star + 1);
      this.star = star + 1;
    },
    ...mapActions([
      'getGeo',
      'setSelectCity',
      'setSelectAddress',
      'updatePublish',
    ]),
    // 点击当前位置
    currentLocation() {
      const {
        locationState: { code },
        geoInfo,
      } = this.location;
      if (code === 1) {
        // 定位中不做相应
      } else if (code === 2) {
        // 选择当前城市
        // 修改
        this.setSelectCity(geoInfo);
      } else if (code === 3) {
        // 定位失败从新发起定位
        // this.getGeo();
        this.setSelectCity(this.defaultInfo);
      }
      this.selectCurrentAddress({}); // 清空已选地址
    },
    fileDel(index) {
      this.imgList.splice(index, 1);
    },

    //编辑未未完成
    cancelEdit() {
      this.$showConfirm({
        title: '保留此次编辑？',
        message: '下次打开发布文章页时，可以继续编辑未发布的内容?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: '保留',
        cancelButtonText: '不保留',
        callback: res => {
          if (res == 'confirm') {
            console.log('确认confirm', res);
            console.log(this.publish);
            let valueList = {
              title: '',
              content: '',
              star: 5,
              selectedList: [],
              imgList: [],
            };
            valueList.title = this.sharetitle || '';
            valueList.content = this.content || '';
            valueList.star = this.star;
            console.log('valueList is' + valueList);
            valueList.selectedList = this.selectedList;
            valueList.imgList = this.imgList;
            this.updatePublish(valueList);
            console.log(this, 'this');
            // storage.set('publish', valueList, 600);
            this.$back();
          } else {
            console.log('取消');
            //storage.remove('publish');
            this.$back();
          }
        },
      });
    },
    showTagModel() {
      console.log('弹出层...');
      this.tagmodel = true;
    },
    hideModel() {
      this.tagmodel = false;
    },
    onCancel() {
      this.searchList = [];
    },
    //搜索标签
    onSubmit(val) {
      //确认键盘刷新
      console.log(val);
      api.getTagList(
        {
          name: val,
        },
        res => {
          this.searchList = res.data.list;
          console.log(this.searchList);
        },
        err => {
          console.log('2');
        }
      );
    },
    tagSearchEvent(res) {
      //实时刷新
      console.log(1);
    },
    tagSelect(item) {
      console.log(item);
      this.selectedList.push(item);
      console.log(this.selectedList);
      this.searchList.splice(item.index, 1);
    },
    delSel(item) {
      this.selectedList.splice(item.index, 1);
      console.log(this.selectedList);
    },
    //获取热门标签
    getHotData() {
      api.getHotTags(
        {},
        res => {
          console.log('热门==>' + res);
          this.hotList = res.data.list;
        },
        err => {
          console.log('2');
        }
      );
    },
    goAddress() {
      this.$forward('search-shop');
      window.screenTop(0);
    },
    finishPub() {
      let starData = this.star * 10;
      let picData = this.arrImg;
      console.log('pic==>' + JSON.stringify(this.imgList));
      let tagData = this.selectedList;
      if (this.sharetitle.length < 5) {
        this.$showToast('标题太短啦！至少写5个字吧！');
        return false;
      }
      if (this.content.length < 5) {
        this.$showToast('内容太短啦！至少写5个字吧！');
        return false;
      }
      api.articleCreate(
        {
          title: this.sharetitle,
          star: starData,
          content: this.content,
          pic_list: JSON.stringify(picData),
          tag_list: JSON.stringify(tagData),
        },
        res => {
          this.$showToast('发布成功');
          //storage.remove('publish');
          this.sharetitle = '';
          this.content = '';
          this.star = 5;
          this.selectedList = [];
          this.imgList = [];
          this.$back();
        },
        err => {
          console.log(err.errmsg);
        }
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
.top-border {
  border-top: 1px solid rgba(0, 0, 0, 0.25);
}

.mint-field-core {
  color: #231815;
}

.header {
  background: #fff;
  color: #030303;
  height:44px;
  line-height:44px;
  display:flex;
  flex-direction :row;
  text-align :center;
  justify-content :space-between;
  a{
    display:inline-block;
    width:72px;
    padding:0 15px;
    color: #9B9B9B;
  }
}

.text-content {
  background: none;
  border: none;
  margin: 0 14px;
  border-top: 1px solid #e2e2e2;
  padding-top: 10px;
}

.scoreDetail {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;

  .star-item {
    width: 18px;
    height: 18px;
    background-size: 18px 18px;
    background-repeat: no-repeat;
    display: inline-block;
    margin-left: 5px;
  }

  .star-item.on {
    background-image: url('~assets/publish/icon_rate_selected@2x.png');
    background-size: 20px 20px;
    height: 20px;
    width: 20px;
  }

  .star-item.off {
    background-image: url('~assets/publish/icon_rate_normal@2x.png');
  }
}

.share {
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;
  overflow-y: scroll;

  p {
    color: #9B9B9B;
    font-size: 14px;
    padding-top:6px;
  }

  .imgUpload {
    margin: 10px 14px;

    .share-icon {
      width: 64px;
      height: 64px;
      background-image: url('~assets/publish/icon_upload@2x.png');
      background-size: 64px 64px;
      background-repeat: no-repeat;
      display: block;
    }
  }

  .title {
    display: flex;
    flex-direction: row;
    margin: 0 14px;
    border-top: 1px solid #E2E2E2;
    height: 48px;
    line-height: 48px;

    .time {
      border: none;
    }

    span.fr {
      color: #9B9B9B;
      width: 180px;
      text-align: right;
    }
  }

  .score {
    display: flex;
    flex-direction: row;
    border-top: 1px solid #E2E2E2;
    margin: 0 14px;
    padding: 14px 0;

    span {
      color: #212121;
      font-size: 14px;
    }

    .scoreDetail {
      height: 18px;

      i {
        width: 18px;
        height: 18px;
        background-image: url('~assets/publish/icon_rate_normal@2x.png');
        background-size: 18px 18px;
        background-repeat: no-repeat;
        display: inline-block;
        margin-left: 5px;
      }

      .Rate {
        margin-top: -10px;

        .Rate__star {
          padding-left: 4px;
        }
      }
    }
  }

  .addTag, .foodTag {
    display: flex;
    flex-direction: row;
    margin: 0 14px;
    padding: 14px 0;
    border-top: 1px solid #E2E2E2;

    .fl-text {
      width: 92%;

      span {
        padding: 5px 10px 5px 0;
      }
    }

    .findyou, .foodlocal {
      border: none;
      width: 90%;
    }

    .right-img {
      width: 15px;
      height: 15px;
      display: inline-block;
      margin-top: 5px;
    }

    .left-img {
      width: 11px;
      height: 14px;
      margin-right: 5px;
      margin-top: 3px;
    }

    .mgleft {
      margin-left: -10px;
    }
  }

  .btnSub {
    width: 100%;
    border: none;
    -webkit-appearance: none;
    background: #FDCC02;
    position: fixed;
    bottom: 0;
    height: 36px;
    line-height: 36px;
    font-size: 17px;
    text-align: center;
    color: #231815;
    font-weight: normal;
  }
}

.upload_warp_img_div_del {
  position: absolute;
  top: -12px;
  width: 28px;
  left: -12px;
}

.upload_warp_img_div_top {
  position: absolute;
  top: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: left;
  color: #fff;
  font-size: 12px;
  text-indent: 4px;
}

.upload_warp_img_div_text {
  white-space: nowrap;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload_warp_img_div img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}

.upload_warp_img_div {
  position: relative;
  height: 65px;
  width: 65px;
  border: 1px solid #ccc;
  margin: -10px 10px 10px 0;
  float: left;
  line-height: 65px;
  display: table-cell;
  text-align: center;
  background-color: #eee;
  cursor: pointer;
}

.upload_warp_img {
  padding: 20px 14px 0 14px;
  overflow: hidden;
}

.upload_warp_text {
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 10px;
  text-indent: 14px;
  font-size: 14px;
  color: #D0021B;
}

.upload_warp_right {
  float: left;
  width: 40%;
  margin-left: 2%;
  height: 65px;
  border: 1px dashed #999;
  border-radius: 4px;
  line-height: 65px;
  color: #999;
}

.upload_warp_left img {
  margin-top: 10px;
  height: 60px;
  width: 60px;
}

r.mo-upload {
  display: inline;
}

.upload_warp_left {
  float: left;
  height: 65px;
  border-radius: 4px;
  cursor: pointer;
}

.upload_warp {
  margin: 0 14px;
  min-height: 65px;
  display: flex;
  flex-direction: row;
}

.upload {
  background-color: #fff;
  width: 420px;
  border-radius: 4px;
}

.hello {
  width: 650px;
  text-align: center;
}

.model-address {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: #fff;
  height: 100%;
}

.container {
  margin-top: 20px;

  .selected {
    display: flex;
    flex-direction: row;
    list-style: none;
    flex-wrap: wrap;
    padding-left: 15px;

    li {
      border-radius: 4px;
      padding: 6px;
      font-size: 14px;
      color: #231815;
      text-align: center;
      margin: 4px;
      background-color: #FDCC02;

      i {
        display: inline-block;
        padding-left: 6px;
      }
    }
  }

  .usedtag-box {
    padding: 10px 15px 0;

    .title {
      color: #4a4a4a;
      text-align: left;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid #979797;
      padding-bottom: 10px;
      margin-left: 0;
    }

    .used {
      display: flex;
      flex-direction: row;
      list-style: none;
      flex-wrap: wrap;
      padding-left: 0;

      li {
        border-radius: 4px;
        padding: 6px;
        font-size: 14px;
        color: #231815;
        text-align: center;
        margin: 4px;
        border: 1px solid #FDCC02;

        i {
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
