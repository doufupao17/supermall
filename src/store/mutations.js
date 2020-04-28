import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'
export default {
  //目的就是修改state中的状态
  //每个方法都尽可能完成的事件都比较单一一点
  //现在的是一个方法做两件事，要不加一，要不加信息，做两件事情，插件无法跟踪到
  //不仅仅是异步操作要放在actions
  [ADD_COUNTER](state,payload){
    payload.count++
  },
  [ADD_TO_CART](state,payload){
    payload.checked = true
    state.cartList.push(payload)
  }
}
