// pm2 start ecosystem.config.js

const PACKAGE_JSON = require('./package.json');

module.exports = {
    //配置文件为一个数组,可配置多个项目
    apps: [
        {
            name: PACKAGE_JSON.name, //项目名称
            cwd: __dirname,
            script: './node_modules/nuxt/bin/nuxt.js', //项目的启动文件
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: PACKAGE_JSON.config.nuxt.port, // 确保这里设置了端口
                HOST: PACKAGE_JSON.config.nuxt.host,
            },

            // 应用配置
            instances: 1, // Windows下通常使用1个实例
            exec_mode: 'fork', // Windows推荐使用fork模式

            // 日志配置
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // 日志日期格式，Z 为时区
            log_file: './logs/pm2.log',
            error_file: './logs/pm2.error.log', // 错误日志目录
            out_file: './logs/pm2.access.log', // 日志目录
            merge_logs: true, // 合并日志

            // 内存和重启配置
            min_uptime: '120s', // 最小运行时间，如果程序在这个时间内退出，会被认为错误，自动重启
            max_restarts: 10, // 最大的自动重启次数
            max_memory_restart: '1G', // 重启占用最大内存

            // 监控配置
            watch: false, // 禁用文件监听，避免Windows权限问题
            ignore_watch: [
                // 忽略监听的目录
                'node_modules',
                'logs',
                'static',
            ],

            // 优雅重启配置
            kill_timeout: 5000, // 超时时间
            listen_timeout: 3000, // 监听超时

            // 自动重启延迟
            restart_delay: 4000,

            // Windows特定配置
            windowsHide: true, // 隐藏Windows命令行窗口

            cron_restart: '0 0 5 * * *', // 定时重启 （*/30 * * * *）每隔30分钟重启一次，（0 10 9 * * *） 每天9:10重启一次
            exec_interpreter: 'node', //项目的脚本类型，默认node，可选shell
            autorestart: true, // 启用/禁用 项目崩溃或退出时自动重启
            vizion: false, // 启用/禁用 vizion特性(版本控制)
        },
    ],
};
