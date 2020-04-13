<template>
  <div class="shopCart">
    <el-row class="content">
      <!-- 左侧 -->
      <el-row class="content-left" type="flex">
        <!-- 购物车logo -->
        <el-row class="logo-wrapper" @click.native="cartListShow">
          <el-row
            class="logo iconfont"
            :class="{ highLight: totalPrice > 0 }"
          ></el-row>
          <el-row class="num" v-if="totalCount > 0">{{ totalCount }}</el-row>
        </el-row>
        <!-- 总金额 -->
        <el-row class="price border-1px" :class="{ highLight: totalPrice > 0 }">
          ￥{{ totalPrice }}
        </el-row>
        <!-- 配送费 -->
        <el-row class="desc">另需配送费￥{{ deliveryPrice }}</el-row>
      </el-row>

      <!-- 右侧 结算 -->
      <el-row
        class="content-right"
        :class="classDesc"
        @click.native.stop.prevent="result"
      >
        <el-row class="pay">{{ payDesc }}</el-row>
      </el-row>

      <!-- 购物车列表 
          过渡动画-->
      <transition
        enter-active-class="animated slideInUp"
        leave-active-class="animated slideOutDown"
        :duration="500"
      >
        <el-row class="shopCart-list" v-show="fold">
          <el-container>
            <!-- 头部 -->
            <el-header class="list-header border-1px">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty">清空</span>
            </el-header>
            <!-- 所有列表 -->
            <el-main class="list-content" ref="listContent">
              <ul>
                <li
                  class="food"
                  v-for="(food, index) in selectFoods"
                  :key="index"
                >
                  <span class="name">{{ food.name }}</span>
                  <el-row class="price">
                    <span>￥{{ food.price * food.count }}</span>
                  </el-row>
                  <!-- 引入CartControl组件 -->
                  <el-row class="cartControl-wrapper">
                    <cart-control :food="food"></cart-control>
                  </el-row>
                </li>
              </ul>
            </el-main>
          </el-container>
        </el-row>
      </transition>
    </el-row>

    <!-- 点击购物车显示背景遮罩层 -->
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      :duration="500"
    >
    <!-- 点击背景遮罩层，关闭背景遮罩层 -->
      <el-row class="list-mark" v-show="fold" @click.native.stop.prevent="fold=false"></el-row>
    </transition>
  </div>
</template>

<script>
import CartControl from '../cartControl/CartControl';
import BScroll from 'better-scroll'; //引入滚动
export default {
  props: {
    selectFoods: { // 已经加入购物车的商品
      type: Array,
      default() {
        return [];
      },
    },
    deliveryPrice: { 
      type: Number,
    },
    minPrice: {
      type: Number,
    },
  },
  data() {
    return {
      fold: false, // 是否显示购物车列表
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(item => {
        total += item.price * item.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(item => {
        count += item.count;
      });
      return count;
    },
    // 结算区域显示的内容
    payDesc() {
      if (this.minPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差${diff}元起送`;
      } else {
        return `去结算`;
      }
    },
    // 购物车商品总金额大于配送费，class类添加一个"enough"
    classDesc() {
      return this.totalPrice < this.minPrice ? false : 'enough';
    },
    listShow() {
     return this.fold ;
    },
  },
  watch: {
    // 当购物车商品数量变化时做相应的改变，如果商品数量为0时，不显示购物车列表
    totalCount() {
      if (!this.totalCount) {
        this.fold = false;
        return false;
      }
    },
    //  一直监听fold，为了能实时的出现滚动效果
    fold() {
      let show = this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent.$el, {
              click: true,
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    },
  },
  methods: {
    // 点击购物车 显示购物车商品列表，如果购物车中没有商品则不能点开
    cartListShow() {
      if (this.totalCount > 0) {
        this.fold = !this.fold;
      } else {
        this.$message.warning('购物车没有商品');
      }
    },
    // 清空购物车 并关闭窗口
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
    },
    // 点击结算，弹窗结算
    result() {
      if (this.totalPrice < this.minPrice) {
        return;
      } else {
        this.$confirm(`总金额为${this.totalPrice},是否确定支付？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.$message.success('结算成功');
            // 结算成功，清空购物车
            this.empty();
          })
          .catch(() => {
            this.$message.info('取消结算');
          });
      }
    },
  },
  components: {
    CartControl,
  },
};
</script>

<style>
.shopCart {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 48px;
  z-index: 1;
}
.shopCart .content {
  display: flex;
  background: #141d27;
}
/* 左侧信息 */
.shopCart .content .content-left {
  flex: 1;
}

.shopCart .content .content-left .logo-wrapper {
  position: relative;
  top: -10px;
  margin: 0 12px;
  padding: 6px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #141d27;
}
.shopCart .content .content-left .logo-wrapper .num {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 16px;
  font-size: 9px;
  color: #fff;
  background: rgb(240, 20, 20);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
}
.shopCart .content .content-left .logo-wrapper .logo {
  position: relative;
  line-height: 24px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  font-size: 24px;
  color: #80858a;
  background: #2b343c;
}
.shopCart .content .content-left .logo-wrapper .logo.iconfont::before {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -12px;
  margin-top: -12px;
  content: '\e600';
}
.shopCart .content .content-left .logo-wrapper .logo.highLight {
  color: #fff;
  background: rgb(0, 160, 220);
}
.shopCart .content .content-left .price {
  margin-top: 12px;
  margin-bottom: 12px;
  padding-right: 12px;
  line-height: 24px;
  font-size: 16px;
  font-weight: 700;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
}
.shopCart .content .content-left .highLight {
  color: #fff;
}
.shopCart .content .content-left .desc {
  margin-top: 14px;
  margin-left: 12px;
  line-height: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}
/* 右侧信息，多少钱起送 */
.shopCart .content .content-right {
  flex: 0 0 105px;
  padding: 0 8px;
  width: 105px;
  color: rgba(255, 255, 255, 0.4);
  background: #2b333b;
}
.shopCart .content .content-right .pay {
  margin-top: 12px;
  line-height: 24px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}
.shopCart .content .content-right.enough {
  background: #00b43c;
  color: #fff;
}
/* 购物车列表 */
.shopCart .list-mark {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.6);
  backdrop-filter: blur(10px);
  z-index: -2;
}
.shopCart .shopCart-list {
  position: fixed;
  left: 0;
  bottom: 48px;
  width: 100%;
  z-index: -1;
}
.shopCart .shopCart-list .list-header {
  display: flex;
  position: relative;
  padding: 0 18px !important;
  line-height: 40px;
  height: 40px !important;
  background: #f3f5f7;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.shopCart .shopCart-list .list-header .title {
  font-size: 14px;
  font-weight: 200;
  color: rgb(7, 17, 27);
}
.shopCart .shopCart-list .list-header .empty {
  position: absolute;
  right: 18px;
  font-size: 12px;
  color: rgb(0, 160, 220);
}
.shopCart .shopCart-list .list-content {
  padding: 0 18px;
  max-height: 217px;
  overflow: hidden;
  background: #fff;
}
.shopCart .shopCart-list .list-content .food {
  display: flex;
  position: relative;
  padding: 12px 0 !important;
  height: 48px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.shopCart .shopCart-list .list-content .food .name {
  line-height: 24px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.shopCart .shopCart-list .list-content .food .price {
  position: absolute;
  right: 90px;
  bottom: 12px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(240, 20, 20);
}
.shopCart .shopCart-list .list-content .food .cartControl-wrapper {
  position: absolute;
  right: 0;
  bottom: 12px;
}
</style>
