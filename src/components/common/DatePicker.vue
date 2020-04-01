<template>
    <div class="block">
        <span class="demonstration">默认</span>
        <el-date-picker
                v-model="startTime"
                type="datetime"
                placeholder="选择日期时间">
        </el-date-picker>
        <span class="demonstration">默认</span>
        <el-date-picker
                v-model="endTime"
                type="datetime"
                placeholder="选择日期时间">
        </el-date-picker>
    </div>
</template>

<script>
    export default {
        name: "DatePicker",
        props: {
            startTime: {
            },
            endTime: {
            }
        },
        // data() {
        //     return {
        //         startTimeData: '',
        //         endTimeData: ''
        //     }
        // },
        // mounted() {
        //     setTimeout(() => {
        //         this.startTimeData = this.startTime;
        //         this.endTimeData = this.endTime
        //     },10)
        // },
        // methods: {
        //
        // }
    }
</script>

<style scoped>

</style>