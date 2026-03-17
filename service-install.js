const Service = require('node-windows').Service;
const path = require('path');
const PACKAGE_JSON = require('./package.json');

// 创建一个新的服务对象
const svc = new Service({
    name: PACKAGE_JSON.name, // 服务名称
    description: PACKAGE_JSON.description, // 服务描述
    // 指向你的启动脚本（见下方第3步说明）
    script: path.join(__dirname, 'server-entry.js'),
});

// 监听安装事件
svc.on('install', function () {
    console.log('服务安装成功！正在启动...');
    svc.start();
});

// 监听安装失败
svc.on('alreadyinstalled', function () {
    console.log('服务已经安装过了。');
});

svc.install();
