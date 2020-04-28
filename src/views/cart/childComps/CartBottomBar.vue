<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        :is-checked="isSelectAll"
        class="check-button"
        @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算：({{checkLength}})
    </div>
  </div>

</template>

<script>
  import CheckButton from "../../../components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex'
  export default {
    name: "CartBottomBar",
    components:{
      CheckButton
    },
    computed:{
      ...mapGetters(['cartList']),
      totalPrice(){
        return ' ¥'+ this.cartList.filter(function (item) {
            return item.checked
        }).reduce(function (preValue,item) {
            return preValue+=item.price * item.count
        },0).toFixed(2)
      },
      checkLength(){
        return this.cartList.filter(function (item) {
          return item.checked
        }).length
      },
      isSelectAll(){
        /*第一种方案*/
       // return !(this.cartList.filter(function (item) {
       //          return !item.checked
       //  }).length)
       // d第二种方案
        if(this.cartList.length===0){
          return false
        }
        return ! this.cartList.find(function (item) {
          return !item.checked
        })
        //第三种方案
        // for(let item of this.cartList){
        //   if(!item.checked){
        //     return  false
        //   }
        // }
        // return true

      }

    },
    methods:{
      checkClick(){
        if(this.isSelectAll){
          this.cartList.forEach(function (item) {
              return item.checked = false
          })
        }else{
          this.cartList.forEach(function (item) {
            return item.checked = true
          })
        }
        //这里不能简化
        // this.cartList.forEach(function (item) {
        //   return item.checked = !this.isSelectAll
        // })
      },
      calcClick(){
        if(!this.isSelectAll){
          this.$toast.show('请选择购买的商品',2000)

        }
      }
    }
  }
</script>

<style scoped>
.bottom-bar{
  position: relative;
  display: flex;
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  font-size: 14px;


}
.check-content{
  display: flex;
  line-height: 40px;
  align-items: center;
  margin-left: 10px;
  width: 60px;

}
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;

  }
  .price{
    margin-left:20px;
    flex: 1;
  }
  .calculate{
   width: 90px;
    color: #fff;
    background-color: red;
    text-align: center;
  }
</style>
