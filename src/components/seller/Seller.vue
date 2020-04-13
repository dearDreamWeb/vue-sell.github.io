<template>
  <div class="seller-wrapper">
    <el-row class="seller-wrapper" ref="sellerWrapper">
      <el-row class="seller">
        <!-- 头部 -->
        <el-row class="header">
          <!-- 头部标题区 -->
          <el-row class="header-title">
            <h1 class="name">{{ seller.name }}</h1>
            <el-row class="star-wrapper">
              <Star :score="seller.score" class="star"></Star>
              <p class="ratingCount">({{ seller.ratingCount }})</p>
              <p class="sellCount">月售{{ seller.sellCount }}单</p>
            </el-row>
            <!-- 点击收藏，改变样式 -->
            <i
              class="iconfont icon-xihuanlike icon"
              :class="{ active: iconActive }"
              @click.stop="iconActive = !iconActive"
            ></i>
          </el-row>
          <!-- 头部内容区 -->
          <el-row class="header-content">
            <el-col :span="8" class="content-wrapper">
              <h1 class="title">起送价</h1>
              <p class="price">
                {{ seller.minPrice }}<span class="money">元</span>
              </p>
            </el-col>
            <el-col :span="8" class="content-wrapper">
              <h1 class="title">商家配送</h1>
              <p class="price">
                {{ seller.deliveryPrice }}<span class="money">元</span>
              </p>
            </el-col>
            <el-col :span="8" class="content-wrapper">
              <h1 class="title">平均配送时间</h1>
              <p class="price">
                {{ seller.deliveryTime }}<span class="money">元</span>
              </p>
            </el-col>
          </el-row>
        </el-row>

        <!-- Split组件 -->
        <Split></Split>

        <!-- 公告和活动 -->
        <el-row class="seller-main">
          <h1 class="title">公告与活动</h1>
          <el-row class="text">{{ seller.bulletin }}</el-row>
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
        </el-row>

        <!-- Split组件 -->
        <Split></Split>

        <!-- 商家实景 -->
        <el-row class="pics-wrapper">
          <h1 class="title">商家实景</h1>
          <el-row ref="picsWrapper" class="pics-scroll">
            <ul class="pics" ref="picsWidth">
              <li
                v-for="(item, index) in seller.pics"
                :key="index"
                class="pic-item"
              >
                <img :src="item" />
              </li>
            </ul>
          </el-row>
        </el-row>

        <!-- Split组件 -->
        <Split></Split>

        <!-- 商家信息 -->
        <el-row class="info">
          <h1 class="title">商家信息</h1>
          <ul>
            <li
              v-for="(item, index) in seller.infos"
              :key="index"
              class="info-item"
            >
              {{ item }}
            </li>
          </ul>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import Star from '../star/Star'; // 引入Star组件
import Split from '../split/Split'; // 引入Split组件
import BScroll from 'better-scroll';

export default {
  props: {
    seller: {
      type: Object,
    },
  },
  data() {
    return {
      iconActive: false,
      classList: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
    };
  },
  methods: {
    // 初始化滚动
    init() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.sellerWrapper.$el, {
            click: true,
          });
        } else {
          this.scroll.refresh();
        }

        // 商家实景部分的滚动，先判断滚动是否加载，没有加载，先算出ul的宽度再赋值进去，然后就能正常滚动，
        // 否则ul宽度始终等于屏幕的宽度
        if (!this.picScroll) {
          let picWidth = 120;
          let marginRight = 6;
          let width =
            (picWidth + marginRight) * this.seller.pics.length - marginRight;
          this.$refs.picsWidth.style.width = width + 'px'; // 给ul正确的宽度
          this.picScroll = new BScroll(this.$refs.picsWrapper.$el, {
            click: true,
            scrollX: true,
            scrollY: false,
          });
        } else {
          this.picScroll.refresh();
        }
      });
    },
  },
  created() {
    this.init();
  },
  components: {
    Star,
    Split,
  },
};
</script>

<style>
.seller-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.seller-wrapper .header {
  padding: 18px;
  background: #fff;
  color: #000;
}
/* 头部标题 */
.seller-wrapper .header .header-title {
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.seller-wrapper .header .header-title .name {
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.seller-wrapper .header .header-title .star-wrapper {
  display: flex;
  margin: 8px 0 18px 0;
}
.seller-wrapper .header .header-title .star-wrapper span {
  width: 15px;
  height: 15px;
  margin-right: 5px !important;
}
.seller-wrapper .header .header-title .star-wrapper .ratingCount,
.seller-wrapper .header .header-title .star-wrapper .sellCount {
  line-height: 18px;
  font-size: 10px;
  color: rgb(77, 85, 93);
  font-weight: 700;
}
.seller-wrapper .header .header-title .star-wrapper .ratingCount {
  margin: 0 12px 0 8px;
}
.seller-wrapper .header .header-title .icon {
  position: absolute;
  display: inline-block;
  right: 0;
  top: 0;
  line-height: 24px;
  font-size: 24px;
  color: rgba(77, 85, 93, 0.4);
}
.seller-wrapper .header .header-title .icon::after {
  position: absolute;
  display: block;
  bottom: -12px;
  line-height: 10px;
  width: 3rem;
  font-size: 10px;
  content: '收藏';
  color: rgb(77, 85, 93);
}
.seller-wrapper .header .header-title .icon.active {
  color: rgb(240, 20, 20);
}
.seller-wrapper .header .header-title .icon.active::after {
  content: '已收藏';
}

/* 头部内容区 */
.seller-wrapper .header .header-content {
  margin-top: 18px;
}
.seller-wrapper .header .header-content .content-wrapper {
  padding: 0;
  text-align: center;
  border-right: 1px solid rgba(7, 17, 27, 0.1);
}
.seller-wrapper .header .header-content :last-child {
  border: none;
}
.seller-wrapper .header .header-content .content-wrapper .title {
  margin-bottom: 4px;
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.seller-wrapper .header .header-content .content-wrapper .price {
  line-height: 24px;
  font-size: 24px;
  font-weight: 200;
  color: rgb(7, 17, 27);
}
.seller-wrapper .header .header-content .content-wrapper .price .money {
  font-size: 10px;
}

/* 公告与活动 */
.seller-wrapper .seller-main {
  padding: 18px;
}
.seller-wrapper .seller-main .title {
  margin-bottom: 8px;
  line-height: 14px;
  font-size: 14px;
  font-weight: 700;
}
.seller-wrapper .seller-main .text {
  margin-bottom: 16px;
  padding: 0 12px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 200;
  text-align: justify;
  color: rgb(240, 20, 20);
}
.seller-wrapper .seller-main .support-item {
  padding: 16px 12px;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
}
.seller-wrapper .seller-main .support-item .icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
  width: 16px;
  height: 16px;
}
.seller-wrapper .seller-main .support-item .text {
  padding: 0;
  line-height: 16px;
  font-size: 12px;
  font-weight: 200;
  color: rgb(7, 17, 27);
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

/* 商家实景 */
.seller-wrapper .pics-wrapper {
  padding: 18px 0 18px 18px;
}
.seller-wrapper .pics-wrapper .pics-scroll {
  width: 100%;
}
.seller-wrapper .pics-wrapper .title {
  margin-bottom: 12px;
  line-height: 14px;
  font-size: 14px;
  font-weight: 700;
}
.seller-wrapper .pics-wrapper .pics {
  display: flex;
}
.seller-wrapper .pics-wrapper .pics .pic-item img {
  margin-right: 6px;
  width: 120px;
  height: 90px;
}

/* 商家信息 */
.seller-wrapper .info {
  padding: 18px 18px 0 18px;
}
.seller-wrapper .info .title {
  line-height: 14px;
  font-size: 14px;
  font-weight: 700;
}
.seller-wrapper .info .info-item{
  padding:16px 12px;
  line-height: 16px;
  font-size: 12px;
  font-weight: 200;
  color:rgb(7, 17, 27);
  border-top: 1px solid rgba(7, 17, 27, 0.1);
}
</style>
