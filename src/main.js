import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
var BASEURL = store.state.user.BASEURL
console.log("111",BASEURL);
Vue.config._mpTrace = true
Vue.config.productionTip = false
const app = new Vue({
  store,
  ...App
})
app.$mount()
