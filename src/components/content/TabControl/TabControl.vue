<template>
  <div class="tab-control">
   <!--如果只是文字不一样，就不用插槽了-->
    <!--在文字、样式都不一样时，页面很复杂的时候使用插槽-->
    <div v-for="(item,index) in titles"
         class="tab-control-item"
         :class="{active:index===currentIndex}"
         @click="itemClick(index)"  >
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabControl",
    props:{
      titles:{
        type:Array,
        default(){
          return[]

        }
      }
    },
    data(){
     return{
       currentIndex:0
     }
    },
    methods:{
      itemClick(index){
        this.currentIndex = index;
        this.$emit('tabClick',index)

      }
    }
  }
</script>

<style scoped>
.tab-control{
  display: flex;
  text-align: center;
  font-size: 15px;
  background-color: #fff;
}
  .tab-control-item{
    flex: 1;
    height: 40px;
    line-height: 40px;

  }
.tab-control-item span{
  padding: 5px;
}
  .active{
    color: var(--color-high-text);

  }
  .active span{
    border-bottom: 3px solid var(--color-high-text);
  }
</style>
