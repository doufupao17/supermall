<template>
  <!--父组件访问自组件时讲过的-->
<div class="wrapper" ref="wrapper">
  <div class="content">
    <slot></slot>
  </div>
</div>
</template>

<script>
  import  BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props:{
      probeType:{
        type:Number,
        default:0
      },
      pullUpLoad:{
        type:Boolean,
        default: false
      }
    },

    data(){
      return{
        scroll:null,
        message:'哈哈哈'
      }
    },
    mounted() {
      //1.创建BScroll对象
    // document.querySelector('.wrapper')
    // class属性值是不唯一的，不确定拿到的是哪一个
     this.scroll = new BScroll(this.$refs.wrapper,{
       click:true,
       /*不能把 probeType写死，因为你不知道页面是否都需要监听*/
       /*这些属性都不要写死，我的界面就不需要上拉加载更多，所以利用props父传子*/
       probeType: this.probeType,
       pullUpLoad:this.pullUpLoad
     })
     //2，监听滚动的位置
      if(this.probeType==2 || this.probeType==3){
        this.scroll.on('scroll', (position) => {
          //console.log(position);
          this.$emit('scroll',position)
        })
      }
      //3.监听上拉事件
      if(this.pullUpLoad){
        this.scroll.on('pullingUp',() =>{
          this.$emit('pullingUp')
        } )
      }


      // this.scroll.refresh()
    },
    methods:{
      scrollTo(x,y,time=300){
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp(){
        this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
      },
      refresh(){
        this.scroll && this.scroll.refresh && this.scroll.refresh()
      },
      getScrollY(){
        return this.scroll ? this.scroll.y : 0
      }

    }
  }
</script>

<style scoped>

</style>
