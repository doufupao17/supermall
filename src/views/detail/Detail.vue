<template>
<div id="detail">
 <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
 <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
   <!--属性：topImages 传入值：top-images-->
<!--   <ul>-->
<!--     <li v-for="item in $store.state.cartList">{{item}}</li>-->
<!--   </ul>-->

   <detail-swiper :top-images="topImages"/>
   <detail-base-info :goods="goods"></detail-base-info>
   <detail-shop-info :shop="shop"></detail-shop-info>
   <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
   <detail-param-info :paramInfo="paramInfo" ref="params"></detail-param-info>
   <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
   <goods-list :goods="recommends" ref="recommend"></goods-list>

 </scroll>
  <back-top @click.native="backClick" v-show="isShowBackTop"/>
  <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

</div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Toast from "../../components/common/toast/Toast";
  import Scroll from "../../components/common/scroll/Scroll";
  import GoodsList from "../../components/content/goods/GoodsList";

  import {getDetail , Goods , Shop ,GoodsParam,getRecommend} from "network/detail";
  import {debounce} from "../../common/utils";
  import {itemListenerMixin,backTopMixin} from 'common/mixin'

  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    data(){
      return{
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo: {},
        paramInfo:{},
        commentInfo: {},
        recommends:[],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
        // message:'',
        // isShow:false
      }
    },
    mixins:[itemListenerMixin,backTopMixin],
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      // Toast

    },

    created() {
      /*获取商品iid*/
      this.iid = this.$route.params.iid
      //根据iid请求详细数据
      getDetail(this.iid).then(res=>{
        //console.log(res)
        const data = res.result
        this.topImages = data.itemInfo.topImages
        //获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        //3.创建店铺信息对象
        this.shop = new Shop(data.shopInfo)
        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;
        //5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        //取出评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }
        // this.$nextTick(()=>{
        //   /*使用一个回调函数，在数据渲染完毕是来回调，但是是有问题的，因为在dom被渲染完，但是图片是没有加载完的，图片没有计算在内*/
        //   /*一般情况下值不对的时候，都是因为图片没有计算在内*/
        //   this.themeTopYs = []
        //     this.themeTopYs.push(0)
        //     this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //     this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //     console.log(this.themeTopYs)
        // })

      })
      //获取推荐数据
      getRecommend().then(res=>{
       this.recommends  = res.data.list

      })
      //给getThemeTopY赋值
      this.getThemeTopY = debounce(()=>{
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs)

      })


    },
    updated() {
      /*这里是不对的，拿不到数据*/
      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // console.log(this.themeTopYs)
    },
    methods:{
      ...mapActions(['addCart']),
      imageLoad(){
        this.$refs.scroll.refresh()
        /*防抖操作*/
        this.getThemeTopY()

      },
      titleClick(index){
        /*将所有的坐标放在一个数组里，获取offsetTop*/
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],100)
      },
      contentScroll(position){
         //获取y值
        const  positionY = -position.y
        //positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        for(let i =0;i<length;i++){
         // console.log(i)//是个字符串所会出现问题
          /*会出现越界*/
            // if(positionY>this.themeTopYs[i]&&positionY<this.themeTopYs[i+1]){
            //   console.log(i);
            // }
          /*所以要做两种判断*/
          /*提高性能减少打印次数*/
         // if(this.currentIndex!==i && ((i<length-1&&positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])||
         //   (i===length-1&&positionY>=this.themeTopYs[i]))){
         //    this.currentIndex = i
         //  console.log(this.currentIndex)
         //   this.$refs.nav.currentIndex = this.currentIndex;
         // }}
          if(this.currentIndex!==i&&(positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }
        // this.isShowBackTop = (-position.y) > 1000
        this. listenShowBackTop(position)
      },
      addToCart(){
        //获取购物车需要展示的商品的信息
      const product = {}
       product.image = this.topImages[0]
       product.title = this.goods.title
        product.desc = this.detailInfo.desc
        product.price = this.goods.realPrice
        product.iid = this.iid;
      //将商品添加到购物车里
        //利用vuex
        // this.$store.commit('addCart',product)
        this.addCart(product).then( (res)=> {
          // console.log(this.$toast)
           this.$toast.show(res,2000)
        })
        // this.$store.dispatch('addCart',product).then(function (res) {
        //   this.show = true;
        //   this.message = res;
        //   setTimeout(function () {
        //     this.show = false
        //     this.message=''
        //   },1500)
        //   console.log(res)
        // })


      }

    },
    mounted() {
      /*mounted的时候可能数据都没请求过来，我们在组件中做了一个判断就是在数据没请求时，组件不会进行渲染，所以在组件的offseTop是undefined*/

      // this.themeTopYs.push(0)
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // console.log(this.themeTopYs)
    },
    destroyed() {
      //取消监听事件
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    }

  }
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content{
  height: calc(100% - 44px - 49px);
}
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

</style>
