import axios from "axios";

export default function request(option) {
    console.log(process.env);
    const instance = axios.create({
        baseURL: process.env.VUE_APP_BASEURL,
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