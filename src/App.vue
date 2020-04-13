<template>
  <div id="app">
    <el-container>
      <el-header>
        <Header :seller="seller"></Header>

        <el-row class="nav border-1px">
          <el-col :span="8" v-for="(item, index) in arr" :key="index">
            <router-link :to="item.path" class="nav-item">{{
              item.name
            }}</router-link>
          </el-col>
        </el-row>
      </el-header>

      <el-main class="main">
        <router-view :seller="seller" :goods="goods"></router-view>
      </el-main>

      <!-- 对话框 -->
      <el-dialog
        class="dialog"
        title="提示"
        :visible.sync="dialogVisible"
        width="100%"
        :before-close="handleClose"
      >
        <div class="content">
          <h1 class="title">浏览方法:</h1>
          <ol>
            <li class="item">1. 用手机浏览器扫描下方二维码浏览</li>
            <li class="item">2. 用电脑浏览器F12,然后打开手机模式进行浏览</li>
          </ol>
          <div class="images">
            <img src="./assets/QR-code.png" alt="" />
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-container>

    <!-- 购物车 -->
    <ShopCart
      :selectFoods="selectFoods"
      :deliveryPrice="seller.deliveryPrice"
      :minPrice="seller.minPrice"
    ></ShopCart>
  </div>
</template>

<script>
import Header from "./components/header/Header";
import ShopCart from "./components/shopCart/ShopCart"; // ShopCart组件
import appData from "./assets/data.json"; //后端数据

const ERR_OK = 0;
export default {
  name: "app",
  data() {
    return {
      seller: appData.seller, //商家数据
      goods: appData.goods,
      dialogVisible: true,
      arr: [
        {
          path: "/goods",
          name: "商品"
        },
        {
          path: "/ratings",
          name: "评论"
        },
        {
          path: "/seller",
          name: "商家"
        }
      ]
    };
  },
  methods: {
    //初始化路由，刷新页面时默认显示商品路由
    async initRouter() {
      this.$router.push({
        path: "/goods"
      });
      // this.$alert(
      //   "该商场是移动端的，请用手机观看或者浏览器F12打开手机模式观看",
      //   "提示",
      //   {
      //     confirmButtonText: "确定"
      //   }
      // );
    },

    // 关闭对话框
    handleClose(done) {
      done();
    }
  },
  computed: {
    selectFoods() {
      let arr = [];
      this.goods.forEach(item => {
        item.foods.forEach(food => {
          food.count ? arr.push(food) : false;
        });
      });
      return arr;
    }
  },
  created() {
    this.initRouter();
  },
  components: {
    Header,
    ShopCart
  }
};
</script>

<style>
/* 修改this.$message弹窗的样式 */
.el-message-box {
  width: 350px !important;
}
.el-header {
  padding: 0 !important;
  height: 174px !important;
}

.nav {
  position: relative;
  height: 40px;
  line-height: 40px;
  text-align: center;
}

.nav::after {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
  content: " ";
}

.nav-item {
  font-size: 14px;
  color: rgb(75, 85, 93);
  line-height: 14px;
  text-decoration: none;
}

.active {
  color: rgb(240, 20, 20);
}

#app .main {
  position: absolute;
  top: 174px;
  bottom: 46px;
  padding: 0 !important;
  width: 100%;
  overflow: hidden;
}

/* 对话框 */
#app .dialog .title {
  font-size: 1.5rem;
  padding-bottom: 1.5rem;
}
#app .dialog .item {
  font-size: 1rem;
  line-height: 1.2rem;
}
#app .dialog .images {
  text-align: center;
}
</style>
