const Service = require('node-windows').Service;
const PACKAGE_JSON = require('./package.json');

const svc = new Service({
    name: PACKAGE_JSON.name,
    script: require('path').join(__dirname, 'server-entry.js'),
});

svc.on('uninstall', function () {
    console.log('服务卸载完成。');
});

svc.uninstall();
