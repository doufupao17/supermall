import Toast from "./Toast";
const obj = {}
obj.install = function (Vue) {

  // document.body.appendChild(Toast.$el)
  //创建组件构造器
  const  toastconstructor = Vue.extend(Toast)
  //new的方式，，根据组件构造器，可以创建一组件对象
  const toast = new toastconstructor
  //将组件对象，手动挂载到某一个元素上
  toast.$mount(document.createElement('div'))
  //toast.$el对应的就是div
  document.body.appendChild(toast.$el)
  Vue.prototype.$toast = toast;
}
export  default obj
