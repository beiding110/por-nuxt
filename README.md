# por-nuxt

> Nuxt.js project

nuxt通用模板，集成了element-ui、jquery、axios、sentry、~~node-sass~~、sass(dart-sass)

## Build Setup

```bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:8011
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

> 安装过程中可能发生错误

```
错误类型：
无法安装sentry-cli

错误内容：
Downloading from https://downloads.sentry-cdn.com/sentry-cli/x.xx.x/sentry-cli-Windows-x86_64.exe 
Error: Unable to download sentry-cli binary from https://downloads.sentry-cdn.com/sentry-cli/1.67.1/sentry-cli-Windows-x86_64.exe. Error code: ECONNRESET

解决方法：
npm config set sentrycli_cdnurl https://npm.taobao.org/mirrors/sentry-cli/
```

## pm2部署

```bash

pm2 start --name pro-name start.js

```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
