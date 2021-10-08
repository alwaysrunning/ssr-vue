import Vue from 'vue'

import { sync } from 'vuex-router-sync'
import ElementUI from 'element-ui'

import VueLocalStorage from 'vue-ls'

import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import titleMixin from './util/title'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/all.less'

import en from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(en)
Vue.use(ElementUI);


if (prd) {
  Vue.config.devtools = false
  Vue.config.debug = false
  Vue.config.silent = true
  Vue.config.productionTip = false
}

// Vue.mixin(loggerMixins)
Vue.mixin(titleMixin)

Vue.use(VueLocalStorage, {
  namespace: 'hpa__'
})

// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// });

export function createApp () {
  const store = createStore()
  const router = createRouter()

  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    store,
    router,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
