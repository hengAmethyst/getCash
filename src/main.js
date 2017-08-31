import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import $ from 'n-zepto'
import index from './components/index'
import getCash from './components/getCash'
import Resource from 'vue-resource'
import getCashSucceed from './components/getCashSucceed'
import alert from './components/alert'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Resource)
Vue.use(Vuex)
//Vue.directive('title', {
//inserted: function (el, binding) {
//  document.title = el.innerText
//  el.remove()
//}
//})



Vue.component('alert',alert)

//路由
const router = new VueRouter({
	routes:[
		{path:'/',component:index},
		{path:'/getCash',component:getCash},
		{path:'/getCashSucceed',component:getCashSucceed}
	]
})

const store = new Vuex.Store({
  state: {
  	openId:'',
  	balance:null,
  	rewardHttp:'https://reward.jinghanit.com',
  	docTitle:0
  }
})


new Vue({ 
	router:router,
	store,
	render: h => h(App)
}).$mount('#app')
