<template>
<el-row class="star" type="flex" justify="center">
    <span v-for="(item,index) in classList" :key="index" :class="item" class="star-item"></span>
</el-row>
</template>

<script>
const LENGTH = 5;
const CLS_ON = "on";
const CLS_OFF = "off";
const CLS_HALF = "half";
export default {
    props: {
        score: {
            type: Number
        }
    },
    computed: {
        classList() {
            let result = [];
            let newScore = Math.floor(this.score * 2) / 2; //计算出有多少颗满星
            let isHalf = newScore % 1 !== 0;    //计算是否有半星
            let integer = Math.floor(newScore);
            //传入满星
            for (let i = 0; i < integer; i++) {
                result.push(CLS_ON);
            }
            //传入半星
            if (isHalf) {
                result.push(CLS_HALF);
            }
            //如果没满规定的LENGTH颗星，后面填充空心星
            while (result.length < LENGTH) {
                result.push(CLS_OFF);
            }
            return result;
        }
    }
}
</script>

<style>
.star {
    font-size: 0;
}

.star .star-item {
    margin-right: 22px;
    width: 20px;
    height: 20px;
    display: inline-block;
}

.star .star-item:last-child{
    margin-right: 0;
}

.star .on {
    background: url("./star48_on@2x.png")  100%/100%;
}

.star .off {
    background: url("./star48_off@2x.png")  100%/100%;
}

.star .half {
    background: url("./star48_half@2x.png")  100%/100%;
}
</style>
