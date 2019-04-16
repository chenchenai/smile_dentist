// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import vueX from 'vuex'
Vue.use(vueX)
import VeeValidate, {Validator} from 'vee-validate'
// 引用API文件
import api from './api/api.js'
import tool from './tooljs/Tool.js'
import VueBarcode from '@xkeshi/vue-barcode'; //导入条形码插件
//打印插件
import './toolJs/source/JsPrintSrv.css'
import './toolJs/source/dragresize.css'
import './toolJs/source/jquery-3.2.1.min.js'
import './toolJs/source/dragresize.js'
import './toolJs/source/JsPrintSrv.min.js';
//滚动条插件
import HappyScroll from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
import("babel-polyfill")


let store = new vueX.Store({
    state: {
        addMaterialInfo:{}/*供应商管理页面新建物料信息*/
    },
    mutations: {
        setData(state, newData) {
            state.addMaterialInfo = newData;
        }

    }
})


// 将API方法绑定到全局
Vue.prototype.$api = api
Vue.prototype.$tool = tool
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(HappyScroll)
Vue.component('barcode', VueBarcode);  //声明条形码组件
new Vue({
  	el: '#app',
      router,
    store,
  	components: { App},
  	template: '<App/>'
})
