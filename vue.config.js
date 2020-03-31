module.exports = {
    publicPath: './',
    devServer: { // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
         open: false,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {
            '/api': {
                target: 'http://www.81482456.cn', // 你接口的域名
                secure: false, // 如果是https接口，需要配置这个参数为true
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置为true
                pathRewrite: {
                    '^/api': 'http://www.81482456'
                }
            }
        }
    }
}

