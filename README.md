# vickze-auth-ui

使用ant-design-pro开发，权限控制前端，后端工程 [https://github.com/vickze/vickze-cloud-admin](https://github.com/vickze/vickze-cloud-admin)


### 准备

node环境 yarn 或者 npm 

#### 启动方式

```
yarn install #安装
yarn start #启动
yarn sso-start #启动单点，单点前端默认为http://localhost:8001/，可在package.json里修改
```
或者

```
npm install #安装
npm start #启动
npm run sso-start #启动单点，单点前端默认为http://localhost:8001/，可在package.json里修改
```

下载慢可以使用国内镜像，如淘宝

```
yarn config set registry https://registry.npm.taobao.org/
yarn config set puppeteer_download_host https://npm.taobao.org/mirrors

npm config set registry https://registry.npm.taobao.org/
npm config set puppeteer_download_host https://npm.taobao.org/mirrors
```
