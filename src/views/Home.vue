<template>
    <div>
        <div class="mdui-appbar">
            <div class="mdui-toolbar mdui-color-theme">
                <input v-model="site" class="mdui-textfield-input" type="text" placeholder="站点"/>
                <el-select v-model="value1" clearable placeholder="请选择时间段" @change="getTime">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                    </el-option>
                </el-select>
                <label>开始时间:</label><el-date-picker
                    v-model="startTime"
                    type="datetime"
                    placeholder="开始时间">
            </el-date-picker>
                <label>结束时间:</label>
                <el-date-picker
                        v-model="endTime"
                        type="datetime"
                        placeholder="结束时间">
                </el-date-picker>
                <button class="mdui-btn mdui-btn-icon" @click="chartQuery"><i class="mdui-icon material-icons">search</i></button>
            </div>
        </div>
        <div class="echart">

            <loading v-if="$store.state.isLoading>0"></loading>
            <Echarts v-else :chartData="chartData"></Echarts>
        </div>

    </div>
</template>

<script>
    import loading from '../components/common/loading'
    import {mapState} from 'vuex'
    import dataPicker from '../common/dataPicker'
    import Echarts from "./Echarts";
    import {queryChart} from '../network/chart'
    import {getTimeFormat} from '../common/util'
    export default {
        name: "Home",
        data() {
            return {
                options: [{
                    value: 3,
                    label: '3小时内'
                }, {
                    value: 24,
                    label: '一天内'
                }, {
                    value: 24 * 7,
                    label: '一周内'
                }, {
                    value: 30 * 24,
                    label: '一个月内'
                }, {
                    value: 90 * 24,
                    label: '三个月内'
                }, {
                    value: 365 * 24,
                    label: '一年内'
                }],
                value1: '',
                site: '',
                startTime: '',
                endTime: '',
                chartData: {},
                selectBirthDate1: {},
                selectBirthDate2: {},
            }
        },
        created() {
            this.startTime = getTimeFormat(new Date(Date.now() -3* 60*60*1000))
            this.endTime = getTimeFormat(new Date(Date.now()));
        },
        mounted() {
            console.log(this.$route.query)
            if(this.$route.query.sort) {
                this.site = this.$route.query.sort;
                this.chartQuery()
            }
        },
        computed: {
        },
        methods: {
            //左侧栏时间
            getTime(value) {
                if(!value) {
                    return
                }
              this.startTime = getTimeFormat(new Date(Date.now() - value * 60 * 60 * 1000));
              this.endTime = getTimeFormat(new Date(Date.now()));
              this.chartQuery()
                // this.$store.commit('updateLoadingStatus', value)
            },
            //查询表数据
          async chartQuery() {
              if(this.site == ''){
                    this.$alert('站点为空')
                  return
                }
                if(this.startTime > this.endTime) {
                    this.$alert('开始时间不能大于结束时间')
                    return
                }
              // let e = this.endTime.replace('', '%20')
              let param1 = {
                sort: this.site,
                startTime: this.startTime,
                endTime: this.endTime
              }
                this.$store.commit('updateLoadingStatus', 1)
              await queryChart(param1).then(res => {
                  if(res.data.data.length > 0) {
                      this.chartData = res;
                  }else {
                      this.$alert('数据加载失败')
                  }
              }).catch(err=> {
                  this.$alert('服务器无响应')
              })
              this.$store.commit('updateLoadingStatus', 0)
          }
        },
        components: {
            Echarts,
            loading
        }
    }
</script>

<style scoped>
 .mdui-appbar input {
     width: 12%;
     /*padding-bottom: 2px;*/
 }
    .echart {
        margin-top: 3%;
        display: flex;
    }
    .left-list {
        width: 12%;
    }
</style>