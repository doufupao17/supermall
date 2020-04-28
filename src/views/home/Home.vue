<template>
 <div id="home" class="wrapper">
   <!--导航栏-->
   <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
   <tab-control :titles="['流行','新款','精选']"
                @tabClick="tabClick"
                ref="tabControl1"
                class="tab-control"
                v-show="isTabFixed"></tab-control>
   <!--为滚动设置高度-->
   <!--:probe-type="3"不加：会当成字符串-->
   <scroll class="content"
           ref="scroll"
           :probe-type="3"
           @scroll="contentScroll"
           :pull-up-load="true"
           @pullingUp="loadMore">
     <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
     <recommend-view :recommends="recommends"/>
     <feature-view/>
     <tab-control :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"
                  ref="tabControl2"/>
     <goods-list :goods="showGoods"/>
   </scroll>
   <!--div可以被监听，button可以被监听，原生组件可以被监听-->
   <!--组件是不能直接被监听-->
   <!--必须加修饰符-->
   <back-top @click.native="backClick" v-show="isShowBackTop"/>


 </div>
</template>

<script>

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/TabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";


  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {debounce} from "common/utils";
  import {itemListenerMixin,backTopMixin} from 'common/mixin'

  export default {
    name: "Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,



    },
    mixins:[itemListenerMixin,backTopMixin],
    data(){
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,

      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //保存y值
      this.saveY = this.$refs.scroll.getScrollY()
      //取消监听事件
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted() {

    },
    //将created中的方法被抽离到methods中
    methods:{
      /*网络请求的相关方法*/
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page +1
        /*让type变成动态的*/
        /*页面不应该写1*/
        /*复用这个方法应该页面加1*/
        getHomeGoods(type, page).then(res =>{
          /*局部变量*/
          //console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          //必须结束,下次才能加载更多
          //可以进行封装
         //this.$refs.scroll.scroll.finishPullUp()
           this.$refs.scroll.finishPullUp()
        })
      },
      /*事件监听方法*/
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      /*回到顶部的方法*/
      // backClick(){
      //   // this.$refs.scroll.scroll.scrollTo(0,0,500)
      //   //体现了一种封装思想
      //   this.$refs.scroll.scrollTo(0,0)
      // },
      /*监听滚动的位置并判断是否将图标进行隐藏*/
      contentScroll(position){
        //console.log(position)
        // 1.判断BackTop是否显示
        this.listenShowBackTop(position)
        // 2.决定tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      /*上拉加载*/
      loadMore(){
        //console.log('上拉')
        //请求数据
        /*直接调用数据请求的方法就行，是封装好的数据*/
        this.getHomeGoods(this.currentType)

      },
      swiperImageLoad(){
        /*主要是轮播图*/
        // console.log(this.$refs.tabControl.$el.offsetTop)
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      }



    }
  }


  //函数调用--压入函数栈（保存函数调用过程中所有的变量）
  //函数结束后，弹出函数栈（释放函数所有的变量）
  //垃圾回收机制，现在用一个变量（不会被回收）
  //res指向大量的数据，箭头函数执行之后，箭头没有了，res没有指向了，res会被回收，
  // function test() {
  //   const names = ['why','aaa']
  // }

</script>
<!--scoped作用域-->
<style scoped>

 #home{
   /*第二种设置样式*/
   /*padding-top: 44px;*/
   /*第一种：设置padding-top: 44px;，视口就没有100vh了，如果content继承高度为524,所以把它取消*/
   height: 100vh;
   position: relative;
 }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
    /*因为后期我们使用的是best-scroll所以我们不需要在设置position*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*!*设一个层级*!*/
    /*z-index: 9;*/
    /*!*脱离标准流*!*/
  }
/*.tab-control{*/
/*  !* position: sticky;不起作用了，因为我们现在使用的不是原生滚动了*!*/
/*  !*属性：在正常没有达到位置之前，默认值是sticky，当达到某个值是，浏览器会默认改为fixed，但是移动端一般都支持，浏览器需要调试*!*/
/*  position: sticky;*/
/*  top:44px;*/
/*  !*设置一个层级*!*/
/*  z-index:9;*/
/*}*/
.content{
  /*脱离文档流了，可以给它设置一个被背景颜色*/
  overflow: hidden;
  position: absolute;
  top:44px;
  bottom: 40px;
  left: 0px;
  right: 0px;

}
.tab-control{
  position: relative;
  z-index:9;

}
/*这种方式不好使*/
/*.fixed {*/
/*  position: fixed;*/
/*  left: 0px;*/
/*  right: 0px;*/
/*  top: 44px;*/
/*}*/
/*第一种有问题*/
/*.content{*/
 /*动态计算*/
/*  height:calc(100%  - 93px);*/
/*  margin-top: 44px;*/
/*  background-color: red;*/
/*  overflow: hidden;*/
/*  margin-top: 44px;*/
/*}*/
</style>


