<template>
    <div class="flex w-full xl:w-1/2 lg:pl-2 xl:pr-4 mb-8 xl:mb-0">
        <div class="flex w-full h-full shadow-lg bg-gray-800 rounded-lg p-4 relative">
            <div class="right-0 top-0 absolute p-2 z-20  text-sm cursor-pointer">
                <div class="relative">
                    <div class="shadow-lg bg-gray-900 px-2" v-on:click="changeType">
                        <template v-if="type == 'map'">
                            Ver listado
                        </template>
                        <template v-else>
                            Ver mapa
                        </template>
                    </div>
                </div>
            </div>
            <div v-if="!show" class="w-full h-full flex justify-center items-center">
                <vue-loaders name="ball-scale" color="#90CDF4" scale="1.2" />
            </div>
            <template v-if="show">
                <template v-if="type == 'list'">
                    <list :rows="spanishData"></list>
                </template>
                <template v-else>
                    <spain-map :spain="spain"></spain-map>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

// import spain from "../plugins/spain.js"
import { mapState } from 'vuex'


import List from './List'
import SpainMap from './SpainMap'
import spainRegions from '../plugins/spainRegions.js'

export default {
    name: 'Spain',

    components: {
        List,
        SpainMap
    },

    props: {
        iso: {
            required: false,
            default: 'all'
        }
    },

    data: () => ({
        show: false,
        type: 'map',
        colors: {
            low: '#FEFCBF',
            normal: '#FAF089',
            high: '#ED8936',
            danger: '#E53E3E'
        },
    }),

    computed:{
        ...mapState({
            spain: state => state.spain
        }),

        series() {
            return _.map(this.spain, (item) => ({
                name: item.name,
                value: item.confirmed,
                color: this.getHeatColor(item.confirmed)
            }))
        },

        spanishData() {
            let provinces = []
            if (this.spain) {
                this.spain.forEach((item) => {
                    let comunity = spainRegions(item.name, true)

                    let name = item.name
                    if (comunity) {
                        name = comunity.code  
                    }

                    provinces.push({
                        name: name,
                        total: item.total,
                        color: this.getHeatColor(item.confirmed)
                    })
                })
            }
            return _.sortBy(provinces, 'total').reverse();
        }
    },

    watch: {

        // series(value) {
        //     if (value) {
        //         this.$nextTick(() => {
        //             this.createMap()
        //         })	
        //     }
        // },


    },

    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.show = true    
            }, 500)
        })
    },

    methods: {
        changeType() {
            this.type = (this.type == 'map') ? 'list' : 'map'
        },

        getHeatColor(value) {
            if (value >= 2000) {
                return this.colors.danger
            }

            if (value >= 1000) {
                return this.colors.high
            }

            if (value >= 500) {
                return this.colors.normal
            }

            return this.colors.low
        },
    }
}
</script>
<style scoped>
    .map {
      min-height: 500px;
    }
 </style>