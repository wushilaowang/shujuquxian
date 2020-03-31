import request from "./axios";

export function queryChart(data) {
    return request({
        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
        url: 'HistoryData',
        params: {
            sort: data.sort,
            StartTime: data.startTime,
            EndTime: data.endTime
        }
    })

}