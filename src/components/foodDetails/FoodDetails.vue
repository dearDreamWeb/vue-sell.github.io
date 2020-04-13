<template>
  <div class="wrapper">
    <transition
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutRight"
      :duration="300"
    >
      <div class="foodDetails" v-show="foodDetailsShow" ref="foodDetails">
        <el-row>
          <!-- 头部图片和·返回按钮 -->
          <el-row>
            <el-row class="image-header">
              <img :src="food.image" alt="商品图片" />
              <i class="back iconfont icon-houtui" @click="back"></i>
            </el-row>
          </el-row>
          <!-- 主要内容 -->
          <el-row class="content">
            <p class="title">{{ food.name }}</p>
            <el-row class="detail">
              <span class="sell-count">月售{{ food.sellCount }}份</span>
              <span class="rating">好评率{{ food.rating }}%</span>
            </el-row>
            <el-row class="price">
              <span class="nowPrice">￥{{ food.price }}</span>
              <span class="oldPrice">￥{{ food.oldPrice }}</span>
            </el-row>

            <!-- 加入购物车和按钮之间切换 v-if v-else -->
            <transition
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
              :duration="300"
              v-if="!food.count || food.count === 0"
            >
              <el-row
                class="addCartBtn"
                v-if="!food.count || food.count === 0"
                @click.native.stop.prevent="buy($event)"
                >加入购物车</el-row
              >
            </transition>
            <!-- 添加商品按钮  子组件 -->
            <el-row class="cartControl-wrapper" v-else>
              <cart-control :food="food" ref="use"></cart-control>
            </el-row>
          </el-row>

          <!-- Split组件  -->
          <Split v-if="food.info"></Split>
          <!-- 商品信息 -->
          <el-row class="info" v-if="food.info">
            <el-row class="title">商品信息</el-row>
            <el-row class="text">{{ food.info }}</el-row>
          </el-row>

          <!-- 商品评价 引入RatingSelect组件 -->
          <Split></Split>
          <el-row class="ratingSelect-wrapper">
            <rating-select
              :select-type="selectType"
              @change-select="change"
              :only-content="onlyContent"
              @change-onlyContent="changeOnlyContent"
              :desc="desc"
              :ratings="food.ratings"
            >
              <h1 class="title" slot="title">商品评价</h1>
            </rating-select>
          </el-row>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll'; // 引入滚动
import CartControl from '../cartControl/CartControl'; // 引入组件CartControl
import Split from '../split/Split'; // 进入Split组件
import RatingSelect from '../ratingSelect/RatingSelect'; // 引入RatingSelect组件

const POSITIVE = 0; // 满意
const NEGATIVE = 1; // 不满意
const ALL = 2; // 全部

export default {
  props: {
    // 商品详情数据
    food: {
      type: Object,
    },
  },
  data() {
    return {
      foodDetailsShow: false, //是否显示FoodDetails组件
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽',
      },
    };
  },
  methods: {
    // 显示该组件
    show() {
      this.foodDetailsShow = true;
      // 初始化数据
      this.selectType = ALL;
      this.onlyContent = true;

      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodDetails, {
            click: true,
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    // 隐藏该组件
    back() {
      this.foodDetailsShow = false;
    },
    // 点击加入购物车 添加商品进入购物车
    buy(e) {
      this.$set(this.food, 'count', 1);
    },
    change(data) {
      this.selectType = data;
    },
    changeOnlyContent(data) {
      this.onlyContent = data;
    },
  },
  components: {
    CartControl,
    Split,
    RatingSelect,
  },
};
</script>

<style>
.foodDetails {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  width: 100%;
  background: #fff;
}
/* 头部区域 */
.foodDetails .image-header {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 100%;
}
.foodDetails .image-header img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.foodDetails .image-header .back {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

/* 主体部分 */
.foodDetails .content {
  position: relative;
  padding: 18px;
  border-bottom: 1px solid rbga(7, 17, 27, 0.1);
}
.foodDetails .content .title {
  line-height: 14px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(7, 17, 27);
}
.foodDetails .content .detail {
  margin: 8px 0 18px;
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.foodDetails .content .detail .sell-count {
  margin-right: 12px;
}
.foodDetails .content .price .nowPrice {
  margin-right: 12px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(240, 20, 20);
}
.foodDetails .content .price .oldPrice {
  line-height: 24px;
  font-size: 10px;
  color: rgb(147, 153, 159);
  text-decoration: line-through;
}
.foodDetails .content .addCartBtn {
  position: absolute;
  right: 18px;
  bottom: 18px;
  line-height: 24px;
  width: 74px;
  height: 24px;
  font-size: 10px;
  text-align: center;
  color: #fff;
  background: rgb(0, 160, 220);
  border-radius: 12px;
}
.foodDetails .content .cartControl-wrapper {
  position: absolute;
  right: 18px;
  bottom: 18px;
}
/* 商品信息 */
.foodDetails .info {
  padding: 18px;
}
.foodDetails .info .title {
  font-size: 14px;
  font-weight: 200;
  color: rgb(7, 17, 27);
}
.foodDetails .info .text {
  padding: 6px 8px 0 8px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 200;
  color: rgb(77, 85, 93);
}
</style>
