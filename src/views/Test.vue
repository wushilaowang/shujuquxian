<template>
    <div id="cha">

    </div>
</template>

<script>
    export default {
        name: "Test",
        props: {
            chartData: {
                type: Object,
                default: {}
            }
        },
        methods: {
            getTest(e) {
                console.log(e);
            },
            draw() {
                //初始化
                let myChart = this.$echarts.init(document.getElementById("cha"));
                //x轴
                let xAxis={
                    type: 'category',
                }

                //x轴time数据
                let queryData = this.chartData.data
                console.log(queryData);
            }
        }
    }
</script>

<style scoped>

</style>