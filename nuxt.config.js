import config from './configs/index.js'
import path from 'path'

var initSentry;

if(config.plugins.sentry) {
    initSentry = function($config) {
        const SentryPlugin = require('@sentry/webpack-plugin')
        $config.plugins.push(new SentryPlugin({
            include: config.plugins.sentry.map.include,
            release: process.env.RELEASE_VERSION,
            configFile: 'sentry.properties',
            urlPrefix: config.plugins.sentry.map.urlPrefix
        }));
    }
};

var baseConfig = {
    plugins: [
        '~/plugins/axios',
        '~/plugins/appjs',
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        'cookie-universal-nuxt',
    ],
    axios: {
        proxy: true, // 表示开启代理
        credentials: true // 表示跨域请求时是否需要使用凭证
    },
    /*
    ** Headers of the page
    */
    head: {
        title: config.head.title,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' },
            { httpEquiv: 'X-UA-Compatible', content: 'IE=edge,chrome=1'},
            { hid: 'description', name: 'description', content: config.head.meta.description },
            { hid: 'keywords', name: 'keywords', content: config.head.meta.keywords },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: config.head.icon }
        ],
    },
    css: [
        '~/assets/css/main.css',
        '~/assets/css/iconfont.css',
        '~/assets/css/zh-common.css',
    ],
    /*
    ** Customize the progress bar color
    */
    loading: { color: '#3B8070' },
    /*
    ** Build configuration
    */
    build: {
        /*
        ** Run ESLint on save
        */
        extend (config, { isDev, isClient }) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                });
            };

            if(isClient && !isDev) {
                config.devtool = 'source-map';

                initSentry && initSentry(config);
            };

            const aliasArr = {
                '@css': path.resolve('./assets/css'),
                '@config': path.resolve('./configs'),
                '@components': path.resolve('./components'),
                '@js': path.resolve('./assets/js'),
                '@images': path.resolve('./assets/images'),
                '@layout': path.resolve('./layouts'),
                '@mixins': path.resolve('./mixins'),
                '@plugins': path.resolve('./plugins'),
                '@store': path.resolve('./store'),
            };

            Object.keys(aliasArr).forEach(key => {
                config.resolve.alias[key] = aliasArr[key];
            });
        },
        vendor: ['axios']
    },
    router: {
        extendRoutes(routes) {
            routes.forEach(route => {
                const alias = route.path.length > 1 ? `${route.path}/index.html` : '/index.html';
                route.alias = alias;
            });
        },
    },
};

if(config.plugins.element) {
    // 使用element
    baseConfig.css.push('~/assets/css/element-customize.scss');
    baseConfig.plugins.push('~/plugins/element-ui');
    baseConfig.build.vendor.push('element-ui');
}

if(config.plugins.element && config.plugins.myComs) {
    // 使用element二次封装的组件库
    baseConfig.plugins.push('~/plugins/my-components');
}

if(config.plugins.vuexStorage) {
    // 使用vuexStorage
    baseConfig.plugins.push('~/plugins/vuex-storage');
}

if(config.plugins.jquery) {
    // 使用jquery
    const webpack = require('webpack');
    baseConfig.build.plugins = baseConfig.build.plugins || [];
    baseConfig.build.plugins.push(new webpack.ProvidePlugin({
        '$' : 'jquery'
    }));
}

if(config.plugins.sentry) {
    // 使用sentry
    baseConfig.plugins.push('~/plugins/sentry');
}

baseConfig.proxy = config.proxy;

module.exports = baseConfig;
