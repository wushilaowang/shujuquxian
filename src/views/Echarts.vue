<template>
    <div id="chart">

    </div>
</template>

<script>
    import {getTimeFormat} from '../common/util'
    export default {
        name: "Echarts",
        props: {
            chartData: {
                type: Object,
                default: {}
            }
        },
        watch: {
          chartData: {
              immediate: true,
              deep: true,
              handler: function (val) {
                  setTimeout(() => {
                      if(val.data) {
                          this.drawLine()
                      }
                  },10)
              }
            }
        },
        computed: {
        },
        methods: {
            //初始化echarts
          drawLine() {
              let urlQueryData = this.chartData
              let myChart = this.$echarts.init(document.getElementById("chart"));
              let colors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
              let yAxis = [//y轴
                  {
                      name : '温度',
                      min : -20,
                      max : 350,
                      position: 'left',
                      offset : 0,
                      axisLabel: {
                          formatter: '{value} °C'
                      },
                  },
                  {
                      name : '压力',
                      min : -0.5,
                      max : 1.6,
                      position: 'right',
                      offset : 0,
                      axisLabel: {
                          formatter: '{value}'
                      },
                  },
                  {
                      name : '流量',
                      min : 0,
                      max : 'dataMax',
                      position: 'right',
                      offset : 50,
                      axisLabel: {
                          formatter: '{value} '
                      },
                  },
                  {
                      name : '热量',
                      min : 0,
                      max : 'dataMax',
                      position: 'right',
                      offset : 100,
                      axisLabel: {
                          formatter: '{value} GJ/H'
                      },
                  },
              ];
              let xAxis={
                  type: 'category',//坐标轴类型。'value' 数值轴，适用于连续数据。'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据
                  axisTick : {//坐标轴刻度相关设置
                      alignWithLabel: true //类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
                  },
                  axisPointer: {
                      tooltip : false,
                      label: {
                          formatter: function (params) {
                              // var dateTarget = countDatas.find((item)=>{
                              //     return item.date == params.value
                              // })

                              return params.value
                              // return params.value + '\n累计热量' + dateTarget.a0806+'GJ' + '\n累计流量'+dateTarget.a0104
                          }
                      }
                  },
                  data: []
              };
              //工具栏
              let toolbox = {
                  feature: {
                      dataView: {show: true, readOnly: false},
                      restore: {show: true},
                      saveAsImage: {show: true}
                  }
              };
              //提示框悬浮层
              let tooltip = {
                  trigger: 'axis',
                  position: function (point, params, dom, rect, size) {
                      // 固定在中部
                      return [point[0], '40%'];
                  },
                  axisPointer: {
                      type: 'cross'
                  },
                  //格式化容器
                  formatter: function (params){

                      var time = params[0].name//x轴值
                      var dateTarget = countDatas.find((item)=>{
                          return item.date == time
                      })

                      var formated = params.map(function (param){
                          //折线颜色标记,折线名,折线值
                          var text = param.marker + param.seriesName + ' : ' + param.value
                          if( param.seriesName=="供瞬时流量" ){
                              text += "<br>" + param.marker+ "累计流量 : " + dateTarget.a0104
                          }
                          if( param.seriesName=="供瞬时热量" ){
                              text += "<br>" + param.marker+ "累计热量 : " + dateTarget.a0806 + "GJ"
                          }
                          return text
                      }).join('<br>')

                      return time + '<br>' + formated
                  }
              };
              //系列
              let dataKeys = [
                  {
                      key : "a0107",
                      name:  '供温度',
                      yAxisIndex : 0,
                      show: true,
                      data : [],
                  },
                  {
                      key : "a0101",
                      name:  '供压力',
                      yAxisIndex : 1,
                      show: true,
                      data : [],
                  },
                  {
                      key : "a0103",
                      name:  '供瞬时流量',
                      yAxisIndex : 2,
                      show: true,
                      data : [],
                  },
                  {
                      key : "a0805",
                      name:  '供瞬时热量',
                      yAxisIndex : 3,
                      show: true,
                      data : [],
                  },
                  {
                      key : "a0102",
                      name:  '回压力',
                      yAxisIndex : 1,
                      show: function (){
                          return parseInt(urlQueryData.data.data[0].sort) <= 500
                      },
                      data : [],
                  },
                  {
                      key : "a0105",
                      name:  '回瞬时流量',
                      yAxisIndex : 2,
                      show: function (){
                          return parseInt(urlQueryData.data.data[0].sort) <= 500
                      },
                      data : [],
                  },
                  {
                      key : "a0108",
                      name:  '回温度',
                      yAxisIndex : 0,
                      show: function (){
                          return parseInt(urlQueryData.data.data[0].sort) <= 500
                      },
                      data : [],
                  },
              ];
              let dataKeysShows = [];
              let countDatas = []
              let series=[];
              let names = [];
              //区域缩放控制器
              let dataZoom = [{
                  start: 90,
                  end: 100,
                  type: 'inside',
              },{
                  start: 90,
                  end: 100,
                  handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                  handleSize: '80%',
                  handleStyle: {
                      color: '#fff',
                      shadowBlur: 3,
                      shadowColor: 'rgba(0, 0, 0, 0.6)',
                      shadowOffsetX: 2,
                      shadowOffsetY: 2
                  }
              }]
              let option = {
                  legend: { data:names },
                  //网格
                  grid: { right: 170, top: 80 },
                  color: colors,
                  tooltip: tooltip,
                  toolbox: toolbox,
                  dataZoom : dataZoom,
                  xAxis: xAxis,
                  yAxis: yAxis,
                  series: series
              }

              let cData = this.chartData.data
              option.title = {text: cData.data[0].station_ch}
              //x轴时间
              option.xAxis.data=cData.data.map(item => {
                  return getTimeFormat(new Date(item.writetime))
              })
              //折线item
              dataKeys.forEach(function(item){

                  let _data = cData.data.map(dataItem => {
                      return dataItem[item.key]
                  })

                  item.data.length = 0
                  item.data.push.apply(item.data , _data)
              })
                //统计数据
              countDatas = cData.data.map((dataItem)=>{
                  return {
                      a0806 : dataItem.a0806 ,//累计热量
                      a0104 : dataItem.a0104 ,//累计流量
                      date : getTimeFormat(new Date(dataItem.writetime))
                  }
              })

              function updateShows(){
                  //筛出显示的系列
                  dataKeysShows = dataKeys.filter(function(item){
                      if(typeof item.show=='function'){
                          return item.show()
                      }
                      return item.show
                  })

                    //系列配置
                  series = dataKeysShows.map(function(item){
                      return {
                          type : 'line',//系列类型折线
                          name : item.name,//系列名
                          yAxisIndex : item.yAxisIndex,
                          data : item.data,//数据
                      }
                  })
                  names = dataKeysShows.map(function(item,index){
                      return {
                          type: scroll,
                          name : item.name,
                          icon : 'path://M508.356855 74.965891c-256.330032 0-464.132556 207.792291-464.132556 464.132556 0 256.330032 207.802524 464.132556 464.132556 464.132556 256.340266 0 464.132556-207.802524 464.132556-464.132556C972.489412 282.758182 764.697121 74.965891 508.356855 74.965891zM807.319868 367.573868c0 0-229.999101 136.679332-379.480607 385.937979-73.405275-108.137953-174.20577-201.201883-174.20577-201.201883s-3.458941-79.852413 48.107932-54.913245c0 0 41.241218 17.130967 112.466746 85.839041 208.733778-186.189261 371.948712-254.784766 371.948712-254.784766C826.211007 308.321597 807.319868 367.573868 807.319868 367.573868z',
                      }
                  })

                  option.series = series
                  //图例控制那些系列不显示
                  option.legend = { data:names }

              }

              updateShows()
              myChart.setOption(option, true);

              let startIndex = 0;
              myChart.on('click', function (param) {
                  startIndex = param.dataIndex
              })
              let zoomStart = 90;
              myChart.on('datazoom', function (pa) {
                  zoomStart = pa.start
              })
              document.onkeydown = function (e) {
                  if (e.keyCode == 37 && startIndex > 0) {
                      startIndex--;
                      myChart.dispatchAction({
                          type: 'dataZoom',
                          start: zoomStart - (90/(option.series[0].data.length-4))
                      })
                  }
                  if (e.keyCode == 39 && startIndex < option.series[0].data.length) {
                      startIndex++;
                      myChart.dispatchAction({
                          type: 'dataZoom',
                          start: zoomStart + (90/(option.series[0].data.length-4))
                      })
                  }

                  myChart.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 1,
                        dataIndex: startIndex,
                    })
              }
          }
        },
        mounted() {
            //this.drawLine();
        },
        created() {

        }
    }
</script>

<style scoped>

    #chart {
        width: 100%;
        height: 60vh;
        margin: 0 auto;
    }
</style>