<template>
    <div>
        <div class="mdui-appbar">
            <div class="mdui-toolbar mdui-color-theme">
                <input v-model="site" class="mdui-textfield-input" type="text" placeholder="站点"/>
                <label>开始时间:</label><input type="text" v-model="startTime" class="js-date-picker1 mdui-textfield-input" >
                <label>结束时间:</label><input type="text" v-model="endTime" class="js-date-picker2 mdui-textfield-input" >
                <button class="mdui-btn mdui-btn-icon" @click="chartQuery"><i class="mdui-icon material-icons">search</i></button>
            </div>
        </div>
        <div class="echart">
            <div class="left-list">
                <ul class="mdui-list">
                    <li class="mdui-list-item" @click="getTime(3)">
                        <div class="mdui-list-item-avatar"><i class="mdui-icon material-icons">looks_one</i></div>
                        <div class="mdui-list-item-content">3小时内</div>
                    </li>
                    <li class="mdui-list-item" @click="getTime(24)">
                        <div class="mdui-list-item-avatar"><i class="mdui-icon material-icons">looks_two</i></div>
                        <div class="mdui-list-item-content">24小时内</div>
                    </li>
                    <li class="mdui-list-item" @click="getTime(24*7)">
                        <div class="mdui-list-item-avatar"><i class="mdui-icon material-icons">looks_3</i></div>
                        <div class="mdui-list-item-content">一周内</div>
                    </li>
                    <li class="mdui-list-item" @click="getTime(24*30)">
                        <div class="mdui-list-item-avatar"><i class="mdui-icon material-icons">looks_4</i></div>
                        <div class="mdui-list-item-content">一个月内</div>
                    </li>
                    <li class="mdui-list-item" @click="getTime(24*90)">
                        <div class="mdui-list-item-avatar"><i class="mdui-icon material-icons">looks_5</i></div>
                        <div class="mdui-list-item-content">三个月内</div>
                    </li>
                    <li class="mdui-list-item" @click="getTime(24 * 365)">
                        <div class="mdui-list-item-avatar"><i class="mdui-icon material-icons">looks_6</i></div>
                        <div class="mdui-list-item-content">一年内</div>
                    </li>
                </ul>
            </div>
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
                site: '',
                startTime: '',
                endTime: '',
                chartData: {},
                selectBirthDate1: {},
                selectBirthDate2: {},
            }
        },
        mounted() {
            this.BirthDateSelect1();
            this.BirthDateSelect2();
            this.startTime = getTimeFormat(new Date(Date.now() -3* 60*60*1000))
            this.endTime = getTimeFormat(new Date(Date.now()));
            if(this.$route.query.sort) {
                this.site = this.$route.query.sort;
                this.chartQuery()
            }
        },
        computed: {
        },
        methods: {
            BirthDateSelect1() {
                let calendar = new datePicker();
                calendar.init({
                    trigger: ".js-date-picker1" /*按钮选择器，用于触发弹出插件*/,
                    type:
                        "datetime" /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/,
                    minDate: "1900-1-1" /*最小日期*/,
                    maxDate: "2100-12-31" /*最大日期*/,
                    onSubmit: function() {
                        /*确认时触发事件*/
                        let theSelectData = calendar.value;
                    },
                    onClose: function() {
                        /*取消时触发事件*/
                    }
                })
            },
            BirthDateSelect2() {
                let calendar = new datePicker();
                calendar.init({
                    trigger: ".js-date-picker2" /*按钮选择器，用于触发弹出插件*/,
                    type:
                        "datetime" /*模式：date日期；datetime日期时间；time时间；ym年月；year:年*/,
                    minDate: "1900-1-1" /*最小日期*/,
                    maxDate: "2100-12-31" /*最大日期*/,
                    onSubmit: function() {
                        /*确认时触发事件*/
                        let theSelectData = calendar.value;
                    },
                    onClose: function() {
                        /*取消时触发事件*/
                    }
                })
            },
            //左侧栏时间
            getTime(value) {
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