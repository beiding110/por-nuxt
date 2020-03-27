export default {
    head: {
        title: 'Nuxt',
        meta: {
            description: 'Nuxt.js project'
        },
        icon: '/favicon.ico'
    },
    plugins: {
        element: true,
        vuexStorage: false,
        jquery: true,
        sentry: 'https://4efc6c77e7e64921966612b3e3cc4355@sentry.io/5171325'
    },
    proxy: {
        '/pms': {
            target: 'http://192.168.1.100:12000',
            changeOrigin:true,
        }
    }
}
