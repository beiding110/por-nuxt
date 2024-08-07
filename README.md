# por-nuxt

> Nuxt.js project

nuxt通用模板，集成了：

* `ui库`：element-ui、mint-ui、
* `工具库`：jquery、echarts、qrcode（二维码）、vue-clipboard2（剪贴板）、
* `css预处理`：~~node-sass~~、sass(dart-sass)、
* `运维及统计`：sentry、cnzz、hm-baidu、
* `nuxt插件`：axios、cookie-universal-nuxt、nuxt-winston-log、

## Build Setup

```bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:8011
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run build --standalone	// 将node_modules打包入server
$ npm start

# generate static project
$ npm run generate
```

```
# 查询当前使用的镜像源
npm get registry

# 设置为淘宝镜像源
npm config set registry https://registry.npmmirror.com/

# 还原为官方镜像源
npm config set registry https://registry.npmjs.org/
```

> 安装过程中可能发生错误

```
错误类型：
无法安装sentry-cli

错误内容：
Downloading from https://downloads.sentry-cdn.com/sentry-cli/x.xx.x/sentry-cli-Windows-x86_64.exe 
Error: Unable to download sentry-cli binary from https://downloads.sentry-cdn.com/sentry-cli/1.67.1/sentry-cli-Windows-x86_64.exe. Error code: ECONNRESET

解决方法：
npm config set sentrycli_cdnurl https://registry.npmmirror.com/sentry-cli/
```

## pm2部署

```bash

pm2 start --name pro-name start.js

```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
