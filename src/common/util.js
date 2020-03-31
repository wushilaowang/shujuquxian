export function getTimeFormat(now)  {
    let year=now.getFullYear();
    let month=now.getMonth()+1;
    let date=now.getDate();
    let hour=now.getHours();
    let minute=now.getMinutes();
    let second=now.getSeconds();
    month = month < 10 ?'0' + month: month;
    date = date < 10 ?'0' + date: date;
    hour = hour < 10 ?'0' + hour: hour;
    minute = minute < 10 ?'0' + minute: minute;

    return year+"-"+month+"-"+date+" "+hour+":"+minute;
}



function echartMethod1(data) {

    let option = {
        legend: { data:names },
        grid: { right: 170, top: 80 },
        color: colors,
        tooltip: tooltip,
        toolbox: toolbox,
        dataZoom : dataZoom,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series
    }

    let myChart = echarts.init(document.getElementById('myChart'))
    let timeFormatStr = 'yyyy-MM-dd hh:mm'
    let colors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']

    let tooltip = {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        formatter: function (params){

            let time = params[0].name
            let dateTarget = countDatas.find((item)=>{
                return item.date == time
            })

            let formated = params.map(function (param){
                let text = param.marker + param.seriesName + ' : ' + param.value
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
    }

    let countDatas = []


    let yAxis = [
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
    ]

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
                return parseInt(urlQueryData.sort) <= 500
            },
            data : [],
        },
        {
            key : "a0105",
            name:  '回瞬时流量',
            yAxisIndex : 2,
            show: function (){
                return parseInt(urlQueryData.sort) <= 500
            },
            data : [],
        },
        {
            key : "a0108",
            name:  '回温度',
            yAxisIndex : 0,
            show: function (){
                return parseInt(urlQueryData.sort) <= 500
            },
            data : [],
        },
    ]

    let dataKeysShows = []
    let series=[]
    let names = []


    let toolbox = {
        feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    }

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

    let xAxis={
        type: 'category',
        axisTick : {
            alignWithLabel: true
        },
        axisPointer: {
            tooltip : false,
            label: {
                formatter: function (params) {
                    // let dateTarget = countDatas.find((item)=>{
                    //     return item.date == params.value
                    // })

                    return params.value
                    // return params.value + '\n累计热量' + dateTarget.a0806+'GJ' + '\n累计流量'+dateTarget.a0104
                }
            }
        },
        data: []
    }


    option.title = {
        text : data.data[0].station_ch
    }

    option.xAxis.data=data.data.map(function(item){
        return dateFormat(new Date(item.writetime),timeFormatStr)
    })

    dataKeys.forEach(function(item){

        let _data = data.data.map(function(dataItem){
            return dataItem[item.key]
        })

        item.data.length = 0
        item.data.push.apply(item.data , _data)
    })

    countDatas = data.data.map((dataItem)=>{
        return {
            a0806 : dataItem.a0806 ,
            a0104 : dataItem.a0104 ,
            date : dateFormat(new Date(dataItem.writetime),timeFormatStr)
        }
    })

    myChart.setOption(option , true)
}