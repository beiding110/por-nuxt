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
        myComs: true,
        vuexStorage: false,
        jquery: true,
        sentry: {
            dsn: 'https://4efc6c77e7e64921966612b3e3cc4355@sentry.io/5171325',
            map: {
                // 要上传的文件夹
                include: './dist',
                // ~/为网站根目录，后续路径须对应source
                urlPrefix: '~/'
            }
        }
    },
    proxy: {
        '/pms': {
            target: 'http://192.168.1.100:12000',
            changeOrigin:true,
        },
        '/platform': {
            target: 'http://www.hgchzx.com',
            changeOrigin:true,
        }
    },
    cnzz: ''
}
