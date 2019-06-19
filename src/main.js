/*
 * @Author: coldlike 531595924@qq.com 
 * @Date: 2019-06-19 10:18:41 
 * @Last Modified by: coldlike 531595924@qq.com
 * @Last Modified time: 2019-06-19 10:19:26
 */
import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import loginDialog from './components/loginDialog.vue'

Vue.component('loginDialog', loginDialog)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 注册全局方法
// 复制
Vue.prototype.$copyText = function (text) {
  var tag = document.createElement("input");
  tag.setAttribute("id", "copyText");
  tag.value = text;
  document.getElementsByTagName("body")[0].appendChild(tag);
  document.getElementById("copyText").select();
  document.execCommand("copy");
  document.getElementById("copyText").remove();
  this.$message({
    message: "复制成功",
    type: "success"
  });
};

// 毫秒转 mm:ss
Vue.prototype.$duration = function (time) {
  var m = parseInt(time / 1000 / 60);
  var s = parseInt((time / 1000) % 60);
  m = m >= 10 ? m : "0" + m;
  s = s >= 10 ? s : "0" + s;
  return `${m}:${s}`;
}

// 时间戳转 年月日
Vue.prototype.$timeTransformation = function (time) {
  var date = new Date(time)
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  y = y < 10 ? '0' + y : y
  d = d < 10 ? '0' + d : d
  return `${y}-${m}-${d}`
}

// 时间戳转 年月日 时分秒
Vue.prototype.$specificdateTransformation = function (time, hours, secondes) {
  let date = new Date(time)
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  y = y < 10 ? '0' + y : y;
  d = d < 10 ? '0' + d : d;
  let text = `${y}年${m}月${d}日`;
  if(hours){
    let h = date.getHours();
    let min = date.getMinutes();
    h = h < 10 ? '0' + h : h;
    min = min < 10 ? '0' + min : min;
    text += ` ${h}:${min}`
  }
  if (secondes) {
    let s = date.getSeconds();
    s = s < 10 ? '0' + y : s;
    text += `:${s}`
  }
  return text
}

/**
 *  动画滚动到指定位置
 * @param {class} select 需要滚动的元素class
 * @param {Number} distance 滚动指定高度，默认为0
 * @param {Number} time 滚动动画时间，默认500
 */
Vue.prototype.$scrollTo = function (select, distance = 0, time = 500) {
  let el = document.querySelector(select);
  let stepNumber = 50;
  let step = (el.scrollTop - distance) / stepNumber;
  let interval = time / stepNumber;
  (function fn() {
    el.scrollTop -= step;
    stepNumber --;
    if(stepNumber > 0) {
      setTimeout(() => {
        fn();
      }, interval);
    }
  })()
}