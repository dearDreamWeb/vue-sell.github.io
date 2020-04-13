<template>
  <div class="ratingSelect">
    <slot name="title"></slot>
    <!-- 评论类型 -->
    <el-row class="rating-type">
      <span
        class="type-all"
        :class="{ active: selectType === 2 }"
        @click="select(2)"
        >{{ desc.all }} {{ ratings.length }}</span
      >
      <span
        class="type-positive"
        :class="{ active: selectType === 0 }"
        @click="select(0)"
        >{{ desc.positive }} {{ positives }}</span
      >
      <span
        class="type-negative"
        :class="{ active: selectType === 1 }"
        @click="select(1)"
        >{{ desc.negative }} {{ negatives }}</span
      >
    </el-row>

    <!-- 仅看有内容的评论 -->
    <el-row class="switch" @click.native.stop.prevent="changeOnly">
      <i class="iconfont icon-dui icon" :class="{ active: onlyContent }"></i>
      <span class="text">只看有内容的评价</span>
    </el-row>

    <!-- 评论区  默认样式是v-if的内容，如果如要改的话，用slot插入内容，前提是showComment传值传false -->
    <el-row class="ratings" v-if="showComment">
      <ul>
        <li
          v-for="(item, index) in ratings"
          :key="index"
          v-show="showContent(item.text, item.rateType)"
          class="ratings-main"
        >
          <el-row class="time">{{ localTime(item.rateTime) }}</el-row>
          <el-row class="content">
            <i
              class="iconfont"
              :class="[
                { 'icon-zhichi': item.rateType === 0 },
                { 'icon-buzhichi': item.rateType === 1 },
              ]"
            ></i>
            <span class="text">{{
              item.text ? item.text : '该用户未评论！'
            }}</span>
          </el-row>
          <el-row class="avatar">
            <span class="name">{{ item.username }}</span>
            <img class="avatar-img" :src="item.avatar" />
          </el-row>
        </li>
      </ul>
    </el-row>
    <slot name="comment" v-else ></slot>
  </div>
</template>

<script>
import moment from 'moment'; // 引入moment.js 日期处理库

const POSITIVE = 0; // 满意
const NEGATIVE = 1; // 不满意
const ALL = 2; // 全部

export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      },
    },
    selectType: {
      type: Number,
      default: ALL,
    },
    onlyContent: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: Object,
      default() {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意',
        };
      },
    },
    showComment:{
      type:Boolean,
      default:true
    }
  },
  methods: {
    select(type) {
      this.$emit('change-select', type);
    },
    changeOnly() {
      let state = !this.onlyContent;
      this.$emit('change-onlyContent', state);
    },
    // 格式化日期
    localTime(time) {
      return moment(new Date(time)).format('YYYY-MM-DD HH:mm');
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
  },
  computed: {
    // 推荐评论的数量
    positives() {
      let arr = this.ratings.filter(item => {
        return item.rateType === POSITIVE;
      });
      return arr.length;
    },
    // 吐槽评论的数量
    negatives() {
      let arr = this.ratings.filter(item => {
        return item.rateType === NEGATIVE;
      });
      return arr.length;
    },
  },
};
</script>

<style>
.ratingSelect {
  padding: 18px 18px 0 18px;
}
.ratingSelect .rating-type {
  padding: 18px 0;
  border-bottom: 1px solid rgba(77, 85, 93, 0.1);
}
.ratingSelect .rating-type span {
  display: inline-block;
  margin-right: 8px;
  padding: 8px 12px;
  line-height: 16px;
  font-size: 12px;
  border-radius: 2px;
  box-sizing: border-box;
  color: rgb(77, 85, 93);
}
.ratingSelect .rating-type .type-all {
  background-color: rgba(0, 160, 220, 0.2);
}
.ratingSelect .rating-type .type-positive {
  background-color: rgba(0, 160, 220, 0.2);
}
.ratingSelect .rating-type .type-all.active,
.ratingSelect .rating-type .type-positive.active {
  color: #fff;
  background-color: rgb(0, 160, 220);
}
.ratingSelect .rating-type .type-negative {
  background-color: rgba(77, 85, 93, 0.2);
}
.ratingSelect .rating-type .type-negative.active {
  color: #fff;
  background-color: rgba(77, 85, 93);
}

/*  仅看有内容的评论  */
.ratingSelect .switch {
  padding: 12px 0;
  border-bottom: 1px solid rgba(77, 85, 93, 0.1);
}
.ratingSelect .switch .icon {
  line-height: 24px;
  font-size: 24px;
  color: rgb(147, 153, 159);
  margin-right: 4px;
}
.ratingSelect .switch .icon.active {
  color: #00c850;
}
.ratingSelect .switch .text {
  line-height: 24px;
  font-size: 12px;
  color: rgb(147, 153, 159);
  vertical-align: top;
}
/* 评论区 */
.ratingSelect .ratings-main {
  position: relative;
  padding: 16px 0;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.ratingSelect .ratings-main .time {
  margin-bottom: 6px;
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.ratingSelect .ratings-main .content {
  padding: 0;
}
.ratingSelect .ratings-main .content .icon-zhichi {
  margin-right: 4px;
  line-height: 24px;
  font-size: 12px;
  color: rgb(0, 160, 220);
}
.ratingSelect .ratings-main .content .icon-buzhichi {
  margin-right: 4px;
  line-height: 24px;
  font-size: 12px;
  color: rgb(147, 153, 159);
}
.ratingSelect .ratings-main .content .text {
  line-height: 16px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.ratingSelect .ratings-main .avatar {
  position: absolute;
  top: 16px;
  right: 12px;
}
.ratingSelect .ratings-main .avatar .name {
  margin-right: 6px;
  line-height: 12px;
  vertical-align: middle;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.ratingSelect .ratings-main .avatar .avatar-img {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
