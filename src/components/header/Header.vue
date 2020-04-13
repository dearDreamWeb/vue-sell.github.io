<template>
  <el-row class="header">
    <!-- 内容区域 -->
    <el-row class="content-wrapper" type="flex">
      <!-- 头像 -->
      <el-row class="avatar">
        <img width="64" height="64" :src="seller.avatar" alt="商家头像" />
      </el-row>

      <el-row class="content">
        <el-col class="title">
          <span class="brand"></span>
          <span class="name">{{ seller.name }}</span>
        </el-col>
        <!-- 多少分钟送法 -->
        <el-col class="description">
          {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
        </el-col>
        <!-- 活动 -->
        <el-col v-if="seller.supports" class="support">
          <span class="icon"></span>
          <span class="text">{{ seller.supports[0].description }}</span>
        </el-col>
      </el-row>
      <!-- 点击出现弹窗按钮 -->
      <el-row
        v-if="seller.supports"
        class="support-count"
        type="flex"
        @click.native="showDetail"
      >
        <el-col class="count">{{ seller.supports.length }}个</el-col>
        <el-col class="iconfont">
          <i class="iconfont icon-qianjin"></i>
        </el-col>
      </el-row>
    </el-row>
    <!-- 底部公告 -->
    <el-row class="bulletin-wrapper" type="flex">
      <el-row>
        <span class="bulletin-title"></span>
      </el-row>
      <el-row class="bulletin-text">{{ seller.bulletin }}</el-row>
      <el-row class="iconfont">
        <i class="iconfont icon-qianjin"></i>
      </el-row>
    </el-row>
    <!-- 背景 -->
    <el-row class="background">
      <img :src="seller.avatar" alt="背景" width="100%" height="100%" />
    </el-row>

    <!-- 弹窗详情 -->
    <transition
      enter-active-class="animated fadeIn "
      leave-active-class="animated fadeOut"
    >
      <el-row class="detail" v-show="detailShow" ref="detail">
        <el-row class="detail-wrapper" ref="detailWrapper">
          <el-row class="detail-main">
            <h1 class="name">{{ seller.name }}</h1>
            <!-- 评星组件 -->
            <el-row class="star-wrapper">
              <Star :score="seller.score"></Star>
            </el-row>
            <!-- 优惠信息标头 -->
            <el-row class="title" type="flex">
              <el-row class="line"></el-row>
              <el-row class="text">优惠信息</el-row>
              <el-row class="line"></el-row>
            </el-row>
            <!-- 优惠信息详情 -->
            <el-row>
              <ul v-if="seller.supports" class="supports">
                <li
                  class="support-item"
                  v-for="(item, index) in seller.supports"
                  :key="index"
                >
                  <span
                    class="icon"
                    :class="classList[seller.supports[index].type]"
                  ></span>
                  <span class="text">
                    {{ seller.supports[index].description }}</span
                  >
                </li>
              </ul>
            </el-row>
            <!-- 商家公告标头 -->
            <el-row class="title" type="flex">
              <el-row class="line"></el-row>
              <el-row class="text">商家公告</el-row>
              <el-row class="line"></el-row>
            </el-row>
            <!-- 商家公告详情 -->
            <el-row class="bulletin">
              <el-row class="content">{{ seller.bulletin }}</el-row>
            </el-row>
          </el-row>
          <!-- 关闭按钮 -->
          <el-row class="close" @click.native="closeWindow">
            <i class="iconfont icon-cuo"></i>
          </el-row>
        </el-row>
      </el-row>
    </transition>
  </el-row>
</template>

<script>
import Star from '../star/Star';
import BScroll from 'better-scroll';
export default {
  props: {
    seller: {
      type: Object,
    },
  },
  data() {
    return {
      detailShow: false,
      classList: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
    };
  },
  methods: {
    showDetail() {
      this.detailShow = true;
    },
    closeWindow() {
      this.detailShow = false;
    },
    initScroll() {
       this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.detail.$el, {
              scrollY:true,
              click: true,
            });
          } else {
            this.scroll.refresh();
          }
        });
    },
  },
  created() {
    this.initScroll();
  },
  components: {
    Star,
  },
};
</script>

<style>
.header {
  position: relative;
  color: #fff;
  background: rgba(7, 17, 27, 0.5);
}

.content-wrapper {
  /* position: relative; */
  padding: 24px 12px 18px 24px;
}

.content-wrapper .avatar {
  border-radius: 4px;
}

.content-wrapper .content {
  margin-left: 16px;
}

.content-wrapper .content .title {
  margin: 2px 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  line-height: 18px;
}

.content-wrapper .content .title .brand {
  margin-right: 6px;
  vertical-align: top;
  display: inline-block;
  width: 30px;
  height: 18px;
  background: url('./brand@2x.png') 100%/100%;
}

.content-wrapper .content .title .name {
  margin-left: 6px;
}

.content-wrapper .content .description {
  margin-bottom: 10px;
  line-height: 12px;
  font-size: 12px;
  font-weight: 200;
}

.content-wrapper .content .support {
  margin-bottom: 2px;
  line-height: 12px;
  font-size: 10px;
  font-weight: 200;
}

.content-wrapper .content .support .icon {
  margin-right: 4px;
  vertical-align: top;
  display: inline-block;
  width: 12px;
  height: 12px;
  background: url('./decrease_2@2x.png') 100%/100%;
}

.content-wrapper .support-count {
  position: absolute;
  right: 12px;
  bottom: 18px;
  padding: 7px 8px;
  height: 24px;
  text-align: center;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.2);
}

.content-wrapper .support-count .count {
  margin-right: 2px;
  vertical-align: top;
  font-size: 10px;
  font-weight: 200;
  white-space: nowrap;
}

.content-wrapper .support-count .iconfont {
  vertical-align: middle;
  font-size: 10px;
}

/* 底部公告 */

.bulletin-wrapper {
  position: relative;
  padding: 0 12px;
  line-height: 28px;
  height: 28px;
  background-color: rgba(7, 17, 27, 0.2);
}

.bulletin-wrapper .bulletin-title {
  line-height: 12px;
  display: inline-block;
  width: 22px;
  height: 12px;
  background: url('./bulletin@2x.png');
  background-size: 100% 100%;
}

.bulletin-wrapper .bulletin-text {
  margin: 0 4px;
  font-size: 10px;
  font-weight: 200;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bulletin-wrapper .iconfont.icon-qianjin {
  vertical-align: top;
  font-size: 10px;
}

/* 背景 */
.header .background {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  filter: blur(10px);
}

/* 弹窗详情 */
.header .detail {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.8);
  overflow: auto;
  transition: all 0.5s;
}

.header .detail .detail-wrapper {
  width: 100%;
  min-height: 100%;
}

.header .detail .detail-wrapper .detail-main {
  margin-top: 64px;
  padding-bottom: 64px;
}

.header .detail .detail-wrapper .detail-main .name {
  text-align: center;
  line-height: 16px;
  font-size: 16px;
  font-weight: 700;
}

.header .detail .detail-wrapper .detail-main .star-wrapper {
  margin: 16px 0 28px;
  height: 24px;
}

.header .detail .detail-wrapper .detail-main .title {
  width: 80%;
  margin: 28px auto 24px auto;
}

.header .detail .detail-wrapper .detail-main .title .line {
  flex-grow: 1;
  position: relative;
  top: -6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header .detail .detail-wrapper .detail-main .title .text {
  flex-grow: 0;
  padding: 0 12px;
  font-weight: 700;
  font-size: 14px;
}

.decrease {
  background: url('./decrease_2@2x.png') 100%/100%;
}

.discount {
  background: url('./discount_2@2x.png') 100%/100%;
}

.special {
  background: url('./special_2@2x.png') 100%/100%;
}

.invoice {
  background: url('./invoice_2@2x.png') 100%/100%;
}

.guarantee {
  background: url('./guarantee_2@2x.png') 100%/100%;
}

.header .detail .detail-wrapper .detail-main .supports {
  width: 80%;
  margin: 0 auto;
}

.header .detail .detail-wrapper .detail-main .supports .support-item {
  padding: 0 12px;
  margin-bottom: 12px;
}

.header
  .detail
  .detail-wrapper
  .detail-main
  .supports
  .support-item:last-child {
  margin-bottom: 0;
}

.header .detail .detail-wrapper .detail-main .supports .support-item .icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  width: 16px;
  height: 16px;
}

.header .detail .detail-wrapper .detail-main .supports .support-item .text {
  font-size: 12px;
  vertical-align: middle;
}

/* 商家公告详情 */
.header .detail .detail-wrapper .detail-main .bulletin {
  width: 80%;
  margin: 0 auto;
}

.header .detail .detail-wrapper .detail-main .bulletin .content {
  padding: 0 12px;
  margin-top: 24px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 200;
}

/* 关闭按钮 */
.header .detail .detail-wrapper .close {
  position: absolute;
  left: 50%;
  margin-left: -16px;
  bottom: 32px;
}

.header .detail .detail-wrapper .close .iconfont.icon-cuo {
  font-size: 32px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
