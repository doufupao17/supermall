import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'
export default {
  addCart(context,payload){
    //payload新添加的商品
    // let oldproduct = null;
    // for(let item of state.cartList){
    //   if(item.iid === payload.iid){
    //     oldproduct = item
    //   }
    // }
 return new Promise(function (resolve,reject) {
   //查找之前数组中是否有该商品
     let product = context.state.cartList.find(function (item) {
       return item.iid === payload.iid
     })
     //判断porduct是否有值
     if(product){
       // product.count+=1
       context.commit(ADD_COUNTER,product)
       resolve('当前商品数量+1')
     }else{
       payload.count=1
       // context.state.cartList.push(payload)
       context.commit(ADD_TO_CART,payload)
       resolve('添加了新的产品')
     }
    })
  }
}
