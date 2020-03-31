import request from "./axios";

export function login(data) {
    return request({
        url: '/login',
        params: {
            account: data.user,
            password: data.pwd
        }
    })
}

