import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import store from './store'
import router from './router'
import '@/assets/tailwind.css'

Vue.config.productionTip = false
// Vue.config.performance = true
// 
import Toasted from 'vue-toasted';
Vue.use(Toasted)

new Vue({
    store,
    router,
    data: () => ({
        timer: null,
    }),
    async created() {
        await this.getAllData()
        this.timer = setInterval(this.getAllData, 60000 * 3) //
    },
    methods: {
        getAllData() {
            this.$store.dispatch('getTotals')
            this.$store.dispatch('getSpanishData')
            // this.$store.dispatch('getDataFromWorldometers')
            this.$store.dispatch('getCountData')
            this.$store.dispatch('getCountDailyData')
            this.$store.dispatch('getData')
        }
    },
    beforeDestroy () {
        clearInterval(this.timer)
    },
    render: h => h(App)
}).$mount('#app')
