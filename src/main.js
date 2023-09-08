import Vue from 'vue'
import App from './App.vue'
require('video.js/dist/video-js.css');
import store from './store';
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
