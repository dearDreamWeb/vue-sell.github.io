<template>
  <div class="cartControl">
    <!-- 动画滑进来 滑出来-->
    <transition
      enter-active-class="animated slideInRight"
      leave-active-class="animated slideOutRight"
    >
      <el-row class="reduce" v-show="food.count">
        <!-- 动画旋转进来 旋转出来 -->
        <transition
          enter-active-class="animated rotateIn"
          leave-active-class="animated rotateOut"
        >
          <el-col
            class="iconfont icon-jian"
            @click.native.stop.prevent="reduce"
            v-show="food.count"
          ></el-col>
        </transition>
      </el-row>
    </transition>

    <el-row class="num" v-show="food.count">{{ food.count }}</el-row>
    <el-row class="add">
      <el-col
        class="iconfont icon-jia"
        @click.native.stop.prevent="add($event)"
      ></el-col>
    </el-row>
    <!-- 小球存放 -->
    <el-row class="ball-container">
      <transition
        name="drop"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
      >
        <el-row class="ball" v-show="ball.state">
          <el-row class="inner"></el-row>
        </el-row>
      </transition>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
    },
  },
  data() {
    return {
      ball: {
        state: false,
      },
    };
  },
  methods: {
    // 点击按钮，增加数量
    add(e) {
      this.food.count ? this.food.count++ : this.$set(this.food, 'count', 1);
      // 在ball添加e属性，值为点击的元素
      this.ball.state = true;
      this.$set(this.ball, 'e', e.target);
    },
    // 点击按钮，减少数量
    reduce() {
      this.food.count--;
    },
    beforeEnter(el) {
      let rect = this.ball.e.getBoundingClientRect();
      let x = rect.left - 32;
      let y = -(window.innerHeight - rect.top - 22);
      el.style.transform = `translate3d(0,${y}px,0)`;
      let inner = el.querySelector('.inner');
      inner.style.transform = `translate3d(${x}px,0,0)`;
    },
    enter(el, done) {
      el.offsetHeight;
      this.$nextTick(() => {
        el.style.transform = 'translate3d(0,0,0)';
        let inner = el.querySelector('.inner');
        inner.style.transform = 'translate3d(0,0,0)';
      });
      done();
    },
    afterEnter() {
      this.ball.state = false;
    },
  },
  computed: {},
};
</script>

<style>
.cartControl {
  display: flex;
}
.cartControl .reduce,
.cartControl .add {
  line-height: 24px;
  font-size: 24px;
  color: rgb(0, 160, 220);
  transition: all 0.5s linear;
}
.cartControl .num {
  line-height: 24px;
  width: 24px;
  font-size: 10px;
  text-align: center;
  color: rgb(147, 153, 159);
}
.cartControl .ball {
  position: fixed;
  left: 32px;
  bottom: 22px;
  z-index: 3;
  transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
}
.cartControl .ball .inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(0, 160, 220);
  transition: all 0.4s linear;
}
</style>
