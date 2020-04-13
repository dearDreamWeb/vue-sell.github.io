<template>
  <el-row class="goods">
    <!-- 左侧菜单列表 -->
    <el-row class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          v-for="(item, index) in goods"
          :key="index"
          class="menu-item"
          :class="{ liActive: currentIndex === index }"
          @click="selectIndex(index)"
        >
          <span class="text border-1px">
            <i
              class="icon"
              v-if="item.type > 0"
              :class="classList[item.type]"
            ></i>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </el-row>

    <!-- 右侧食物 -->
    <el-row class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <!-- 菜单分类 -->
        <li
          class="food-list food-list-hook"
          v-for="(item, index) in goods"
          :key="index"
        >
          <el-row class="title">{{ item.name }}</el-row>
          <!-- 子分类下的所有食物 -->
          <ul>
            <li
              v-for="(food, foodIndex) in item.foods"
              :key="foodIndex"
              class="food-item border-1px"
              @click="selectFoodDetails($event, food)"
            >
              <el-row type="flex">
                <!-- 食物图片 -->
                <el-row class="icon">
                  <img :src="food.icon" width="57" height="57" />
                </el-row>
                <!-- 食物右侧数据 -->
                <el-row class="content">
                  <el-row class="name">{{ food.name }}</el-row>
                  <el-row v-show="food.description" class="desc">{{
                    food.description
                  }}</el-row>
                  <el-row class="extra">
                    <span>月售{{ food.sellCount }}份</span>
                    <span class="favorableRate">好评率{{ food.rating }}%</span>
                  </el-row>
                  <el-row class="price">
                    <span>￥{{ food.price }}</span>
                    <span v-show="food.oldPrice" class="oldPrice"
                      >￥{{ food.oldPrice }}</span
                    >
                  </el-row>
                </el-row>
                <!-- 添加商品按钮  子组件 -->
                <el-row class="cartControl-wrapper">
                  <cart-control :food="food"></cart-control>
                </el-row>
              </el-row>
            </li>
          </ul>
        </li>
      </ul>
    </el-row>

    <!-- Food组件，点开商品，弹窗商品详情 -->
    <el-row class="foodDetails-wrapper">
      <food-details :food="foodDetailsData" ref="foodDetails"></food-details>
    </el-row>
  </el-row>
</template>

<script>
import BScroll from 'better-scroll'; //引入滚动
import CartControl from '../cartControl/CartControl'; // 引入添加和减少数量的按钮
import FoodDetails from '../foodDetails/FoodDetails'; // 引入FoodDetails组件

const ERR_OK = 0;
export default {
  props: {
    seller: {
      type: Object,
    },
    goods: {
      type:Array,
    }, 
  },
  data() {
    return {  
      classList: ['decrease', 'discount', 'special', 'invoice', 'guarantee'], //图标的class类名列表
      listHeigth: [], //记录每个区域的高度
      scrollY: 0, //记录右侧区域达到滚动高度
      foodDetailsData: {}, // 传入FoodDetails组件中的商品详情数据
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeigth.length; i++) {
        let height1 = this.listHeigth[i];
        let height2 = this.listHeigth[i + 1];
        //判断当前滚动到了哪个区域
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return true;
    },
  },
  methods: {
    //初始化数据
    init() {
      this.$nextTick(() => {
        this.initScroll();
        this.clacListHeight();
      });
    },

    // 初始化滚动
    initScroll() {
      //左侧菜单滚动
      this.menuScroll = new BScroll(this.$refs.menuWrapper.$el, {
        click: true,
      });
      //右侧滚动
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper.$el, {
        click: true,
        probeType: 3,
      });

      //实时监听右侧滚动的高度
      this.foodsScroll.on('scroll', pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },

    // 计算右侧食物每个区域的高度
    // 先计算出每个区域的高度，在把每个区域所在的高度计算出来添加到listHeight数组中
    clacListHeight() {
      //用原生js获取到的dom数组是伪数组，要用Array.from()转换成真数组
      let foodList = Array.from(
        this.$refs.foodsWrapper.$el.querySelectorAll('.food-list-hook'),
      );
      let height = 0;
      this.listHeigth.push(height);
      foodList.map(item => {
        height += item.clientHeight;
        this.listHeigth.push(height);
      });
    },

    // 点击左侧菜单  右侧出现相应的食物
    selectIndex(index) {
      let foodList = Array.from(
        this.$refs.foodsWrapper.$el.querySelectorAll('.food-list-hook'),
      );
      let el = foodList[index];
      // 移动到指定的元素位置
      this.foodsScroll.scrollToElement(el, 300);
    },

    // 点击弹窗商品详情
    // 把商品详情数据给到位，再调用子组件FoodDetails组件的show()方法把弹窗显示
    selectFoodDetails(e, food) {
      this.foodDetailsData = food;
      this.$refs.foodDetails.show();
    },
  },
  mounted() {
    this.init();
  },
  components: {
    // ShopCart,
    CartControl,
    FoodDetails,
  },
};
</script>

<style>
.goods {
  display: flex;
  width: 100%;
  height: 100%;
}

.goods .menu-wrapper {
  flex: 0 0 80px;
  width: 80px;
  background: #f3f5f7;
}

.decrease {
  background: url('./decrease_3@2x.png') 100%/100%;
}

.discount {
  background: url('./discount_3@2x.png') 100%/100%;
}

.special {
  background: url('./special_3@2x.png') 100%/100%;
}

.invoice {
  background: url('./invoice_3@2x.png') 100%/100%;
}

.guarantee {
  background: url('./guarantee_3@2x.png') 100%/100%;
}

.goods .menu-wrapper .menu-item {
  display: table;
  padding: 0 12px;
  width: 56px;
  height: 54px;
}

.goods .menu-wrapper .menu-item .icon {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  height: 12px;
}

.goods .menu-wrapper .menu-item .text {
  display: table-cell;
  vertical-align: middle;
  line-height: 14px;
  width: 56px;
  font-size: 12px;
  color: rgb(240, 20, 20);
  font-weight: 200;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}

/* 选择菜单样式 */
.goods .menu-wrapper .liActive {
  /* position: relative;
    z-index: 2; */
  transition: all 0.5s ease-in-out;
  background: #fff;
}

.goods .menu-wrapper .liActive .text {
  font-weight: 700;
  border-bottom: 0px;
}

/* 右侧食物 */
.goods .foods-wrapper {
  flex: 1;
}

.goods .foods-wrapper .food-list .title {
  padding-left: 14px;
  line-height: 26px;
  height: 26px;
  font-size: 12px;
  color: rgb(147, 153, 159);
  border-left: 2px solid #d9dde1;
  background: #f3f5f7;
}

.goods .foods-wrapper .food-item {
  position: relative;
  margin: 18px;
  height: 109px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}

.goods .foods-wrapper .food-item .icon {
  flex: 0 0 57px;
}

.goods .foods-wrapper .food-item .content {
  flex: 1;
  margin-left: 10px;
}

.goods .foods-wrapper .food-item .content .name {
  margin: 2px 0 8px;
  line-height: 14px;
  height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}

.goods .foods-wrapper .food-item .content .desc,
.goods .foods-wrapper .food-item .content .extra {
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}

.goods .foods-wrapper .food-item .content .desc {
  margin-bottom: 8px;
}

.goods .foods-wrapper .food-item .content .extra .favorableRate {
  margin-left: 12px;
}

.goods .foods-wrapper .food-item .content .price {
  margin-top: 8px;
  line-height: 14px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(240, 20, 20);
}

.goods .foods-wrapper .food-item .content .price .oldPrice {
  margin-left: 8px;
  font-size: 10px;
  color: rgb(147, 153, 159);
  text-decoration: line-through;
}
.goods .foods-wrapper .food-item .cartControl-wrapper {
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
