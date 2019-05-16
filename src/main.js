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
