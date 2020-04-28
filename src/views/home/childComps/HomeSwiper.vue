<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" @load="imageLoad">
      </a>
    </swiper-item>
</swiper>
</template>

<script>
  /*为什么要在轮播图里创建一个js，因为导入方便*/
  import {Swiper , SwiperItem} from "components/common/swiper"

  export default {
    name: "HomeSwiper",
    props:{
      banners:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data(){
      return{
        isLoad:false
      }
    },
    components:{
      Swiper,
      SwiperItem
    },
    methods:{
      imageLoad(){
        /*只需要发送一次就了，所以用一个变量记录状态*/
        if(!this.isLoad){
          this.$emit('swiperImageLoad')
          this.isLoad = true

        }

      }
    }
  }
</script>

<style scoped>

</style>
