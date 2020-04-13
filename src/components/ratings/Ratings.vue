<template>
  <div class="ratings-wrapper">
    <el-row ref="ratings" class="ratingsScroll">
      <el-row class="ratings">
        <!-- 头部 -->
        <el-row class="header">
          <!-- 头部左侧 -->
          <el-row class="header-left">
            <p class="score">{{ seller.score }}</p>
            <p class="title">综合评价</p>
            <p class="rank">高于周边商家{{ seller.rankRate }}%</p>
          </el-row>
          <!-- 头部右侧 -->
          <el-row class="header-right">
            <!-- 服务态度 -->
            <el-row class="serviceScore" type="flex">
              <span class="title">服务态度</span>
              <Star :score="seller.serviceScore" class="star"></Star>
              <span class="score">{{ seller.serviceScore }}</span>
            </el-row>
            <!-- 美食评价 -->
            <el-row class="foodScore" type="flex">
              <span class="title">美食评价</span>
              <Star :score="seller.foodScore" class="star"></Star>
              <span class="score">{{ seller.foodScore }}</span>
            </el-row>
            <!-- 送达时间 -->
            <el-row class="time" type="flex">
              <span class="title">送达时间</span>
              <span class="deliveryTime">{{ seller.deliveryTime }}分钟</span>
            </el-row>
          </el-row>
        </el-row>

        <!-- 分割线Split组件 -->
        <Split></Split>

        <!-- 评论区 -->
        <el-row class="main">
          <!-- 商品评价 引入RatingSelect组件 -->
          <rating-select
            :select-type="selectType"
            @change-select="change"
            :only-content="onlyContent"
            @change-onlyContent="changeOnlyContent"
            :desc="desc"
            :ratings="ratings"
            :showComment="false"
          >
            <!-- 在RatingSelect组件中用slot插入数据 -->
            <el-row slot="comment" class="comment">
              <ul>
                <li
                  v-for="(item, index) in ratings"
                  :key="index"
                  v-show="showContent(item.text, item.rateType)"
                  class="comment-item"
                >
                  <!-- 头像 -->
                  <img :src="item.avatar" class="avatar" />
                  <!-- 用户名 -->
                  <p class="userName">{{ item.username }}</p>
                  <!-- 评分和送达时间 -->
                  <el-row class="star-wrapper">
                    <Star :score="item.score" class="star"></Star>
                    <p class="deliveryTime">{{ item.deliveryTime }}分钟送达</p>
                  </el-row>
                  <!-- 评论的内容 -->
                  <p class="text">
                    {{ item.text ? item.text : "该用户未评论！" }}
                  </p>
                  <!-- 评论的时间 -->
                  <el-row class="time">{{ date(item.rateTime) }}</el-row>
                  <!-- 用户给的好还是不好，以及给食物的标签 -->
                  <el-row class="footer">
                    <i
                      class="iconfont"
                      :class="{
                        'icon-zhichi': item.rateType === 0,
                        'icon-buzhichi': item.rateType === 1,
                      }"
                    ></i>
                    <span
                      v-for="(mark, i) in item.recommend"
                      :key="i"
                      class="recommend"
                    >
                      {{ mark }}
                    </span>
                  </el-row>
                </li>
              </ul>
            </el-row>
          </rating-select>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import Star from "../star/Star"; // 引入评分组件 Star
import Split from "../split/Split"; // 引入Split组件
import RatingSelect from "../ratingSelect/RatingSelect"; // 引入RatingSelect组件
import BScroll from "better-scroll"; // 引入滚动
import Moment from "moment"; // 日期处理库
import appData from "../../assets/data.json"; //后端数据

const POSITIVE = 0; // 满意
const NEGATIVE = 1; // 不满意
const ALL = 2; // 全部
const ERR_OK = 0;

export default {
  props: {
    seller: {
      type: Object,
    },
  },
  data() {
    return {
      ratings: appData.ratings, // 评论
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "推荐",
        negative: "吐槽",
      },
      goods: [], // 商品
    };
  },
  methods: {
    // 初始化ratings数据
    initRatings() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.ratings.$el, {
            click: true,
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    date(date) {
      return Moment(new Date(date)).format("YYYY-MM-DD HH:mm");
    },
    change(data) {
      this.selectType = data;
    },
    // 是否显示有内容评论的判断条件
    // 判断当前的选中的selectType 是不是rateType或者ALL，因为rateType只有两个值0或1,所以还要判断是不是等于ALL
    // 是的话再根据onlyContent判断
    showContent(text, rateType) {
      if (this.selectType === rateType || this.selectType === ALL) {
        return this.onlyContent ? text : true;
      } else {
        return false;
      }
    },
    // 仅显示有内容的评价
    changeOnlyContent(data) {
      this.onlyContent = data;
    },
  },
  created() {
    this.initRatings();
  },
  components: {
    Star,
    Split,
    RatingSelect,
  },
};
</script>

<style>
.ratings-wrapper,
.ratings-wrapper .ratingsScroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.ratings-wrapper .ratings .header {
  display: flex;
  padding: 18px 0;
  color: #000;
  background: #fff;
}
.ratings-wrapper .ratings .header .header-left {
  flex: 0 0 140px;
  padding: 0 24px;
  width: 140px;
  text-align: center;
  border-right: 1px solid rgba(7, 17, 27, 0.1);
}
.ratings-wrapper .ratings .header .header-left .score {
  line-height: 28px;
  font-size: 24px;
  color: rgb(255, 153, 0);
}
.ratings-wrapper .ratings .header .header-left .title {
  margin: 6px 0 0 0;
  line-height: 12px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.ratings-wrapper .ratings .header .header-left .rank {
  padding-bottom: 8px;
  padding-top: 8px;
  line-height: 10px;
  font-size: 10px;
  color: rgba(7, 17, 27, 0.4);
}
/* 头部右侧 */
.ratings-wrapper .ratings .header .header-right {
  flex: 1;
  padding-left: 24px;
}
.ratings-wrapper .ratings .header .header-right .serviceScore,
.ratings-wrapper .ratings .header .header-right .foodScore {
  margin-bottom: 8px;
}
.ratings-wrapper .ratings .header .header-right .serviceScore .title,
.ratings-wrapper .ratings .header .header-right .foodScore .title,
.ratings-wrapper .ratings .header .header-right .time .title {
  line-height: 18px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.ratings-wrapper .ratings .header .header-right .serviceScore .star span,
.ratings-wrapper .ratings .header .header-right .foodScore .star span {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.ratings-wrapper .ratings .header .header-right .serviceScore .star,
.ratings-wrapper .ratings .header .header-right .foodScore .star,
.ratings-wrapper .ratings .header .header-right .time .deliveryTime {
  margin: 0 12px;
}
.ratings-wrapper .ratings .header .header-right .time .deliveryTime {
  line-height: 18px;
  font-size: 12px;
  color: rgb(147, 153, 159);
}
.ratings-wrapper .ratings .header .header-right .serviceScore .score,
.ratings-wrapper .ratings .header .header-right .foodScore .score {
  line-height: 18px;
  font-size: 12px;
  color: rgb(255, 153, 0);
}
@media screen and (max-device-width: 320px) {
  .ratings-wrapper .ratings .header .header-left {
    flex: 0 0 100px;
    padding: 0 2px;
    width: 100px;
  }
  .ratings-wrapper .ratings .header .header-right {
    padding-left: 5px;
  }
}

/* 评论区 */
.ratings-wrapper .main {
  position: relative !important;
  top: 0 !important;
  bottom: 0 !important;
}
.ratings-wrapper .main .comment-item {
  position: relative;
  padding: 18px 18px 18px 58px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1) !important;
}
.ratings-wrapper .main .comment-item .avatar {
  position: absolute;
  top: 18px;
  left: 18px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
}
.ratings-wrapper .main .comment-item .userName {
  margin-bottom: 4px;
  line-height: 12px;
  font-size: 10px;
  color: rgb(7, 17, 27);
}
.ratings-wrapper .main .comment-item .time {
  position: absolute;
  top: 18px;
  right: 18px;
  line-height: 12px;
  font-size: 10px;
  font-weight: 200;
  color: rgb(147, 153, 159);
}
.ratings-wrapper .main .comment-item .star-wrapper {
  display: flex;
  margin-bottom: 6px;
  align-items: flex-end;
}
.ratings-wrapper .main .comment-item .star-wrapper .star span {
  width: 15px;
  height: 15px;
  margin-right: 2px;
}
.ratings-wrapper .main .comment-item .star-wrapper .deliveryTime {
  margin-left: 6px;
  line-height: 12px;
  font-size: 10px;
  font-weight: 200;
  color: rgb(147, 153, 159);
}
.ratings-wrapper .main .comment-item .text {
  margin-bottom: 8px;
  line-height: 18px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.ratings-wrapper .main .comment-item .footer {
  display: flex;
  flex-wrap: wrap;
}
.ratings-wrapper .main .comment-item .footer .icon-zhichi {
  line-height: 16px;
  font-size: 12px;
  color: rgb(0, 160, 220);
}
.ratings-wrapper .main .comment-item .footer .icon-buzhichi {
  line-height: 16px;
  font-size: 12px;
}
.ratings-wrapper .main .comment-item .footer .recommend {
  display: inline-block;
  margin-left: 8px;
  margin-bottom: 3px;
  padding: 0 6px;
  line-height: 16px;
  font-size: 9px;
  color: rgb(147, 153, 159);
  border: 1px solid rgba(7, 17, 27, 0.1);
  border-radius: 2px;
  background-color: #fff;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}
</style>
