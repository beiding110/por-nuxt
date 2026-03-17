const { loadNuxt, build } = require('nuxt');
const app = require('express')();
const PACKAGE_JSON = require('./package.json');

async function start() {
    const nuxt = await loadNuxt('start');
    app.use(nuxt.render);
    app.listen(PACKAGE_JSON.config.nuxt.port); // 你的端口号
}

start();
