import axios from "axios";

export default function request(option) {
    const instance = axios.create({
        baseURL: process.env.NODE_ENV == 'development' ? '/api/api' : '/api',
        timeout: '5000'
    })

    instance.interceptors.request.use(option => {
        return option;
    },error => {
        return error
    })

    return instance(option).then(res => {
        return res
    }).catch(err => {
        return err
    })
}