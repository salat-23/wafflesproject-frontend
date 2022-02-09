module.exports = {
    devServer: {
        port: '8081',
        proxy: {
            '^/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '^/callback': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '^/login': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
}