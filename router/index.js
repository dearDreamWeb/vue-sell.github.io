import Vue from 'vue';
import VueRouter from 'vue-router';
import App from '../src/App.vue';
import Goods from '../src/components/goods/Goods.vue';
import Ratings from '../src/components/ratings/Ratings.vue';
import Seller from '../src/components/seller/Seller.vue';

Vue.use(VueRouter);

const routes = [{
    path:'/goods',
    name:'goods',
    component:Goods
},
{
    path:'/ratings',
    name:'ratings',
    component:Ratings
},
{
    path:'/seller',
    name:'seller',
    component:Seller
}]

const router = new VueRouter({
    linkExactActiveClass: 'active',
    routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router