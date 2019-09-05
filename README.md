# freelogfe-repos
该仓库包含Freelog三大站点（console.freelog.com、www.freelog.com、[node].freelog.com）

## 基础环境

- nodejs v10+
- npm v6+

## 开发

### 切换分支
- 把分支切换到 dev

### 安装依赖

- 在项目根目录下执行，安装基础工具

```
npm install
```

- 然后执行以下命令，安装全部项目依赖
```
npx lerna bootstrap
```

### 配置并启动服务代理

- 在根目录下执行

```
npm run proxy
```
*注：需要占用**80**端口，确保不被别的程序占用*

- 切换本地 host 为以下配置

```
127.0.0.1 console.testfreelog.com 
127.0.0.1 static.testfreelog.com 
127.0.0.1 www.testfreelog.com
127.0.0.1 local.freelog.com 
127.0.0.1 local.testfreelog.com
```
*注：可以借助工具，如 [SwitchHosts](https://oldj.github.io/SwitchHosts/)*

### 项目启动

- 切换的到需要开发的项目，比如

```
cd packages/console.freelog.com
```

- 执行开发命令，启动项目服务
```
npm run dev
```

### 配置向代码仓库 push 代码的权限

- 在项目主目录下执行
```
npm run registOss
```


### 项目构建
```
cd packages/www.freelog.com
npm run build
```

### 项目部署
```
cd packages/www.freelog.com
npm run deploy
```
https://www.npmjs.com/package/xproxy
