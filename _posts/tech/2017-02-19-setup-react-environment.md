---
layout: post
title: React 学习 - 开发环境搭建
category: 技术
tags: React
keywords: React
---

## 1. 安装 Yarn

包管理可以用 npm 或者 yarn，好多人推荐 yarn，我这里就用这个了

```
brew update
brew install yarn
```

## 2. 初始化项目文件夹

首先要做的是创建一个工程目录，然后在目录中执行 yarn 初始化即可

```
yarn init
```

## 3. 安装 Webpack

Webpack 可以让整个开发过程及其方便，这里只讲如何使用它来搭建 React 开发环境

安装webpack

```
yarn add webpack webpack-dev-server path
```

创建 webpack 配置文件

```
touch webpack.config.js
```

写入以下内容

```javascript
const path = require('path');

// Html webpack plugin setting
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})

// Open browser plugin setting
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style-loader!css-loader', exclude: /node_modules/ },
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new OpenBrowserPlugin({ url: 'http://localhost:8080' })
  ]
}
```

这里需要说明一下：

- entry: 整个项目的入口文件
- output: 编译好的文件输出位置
- loaders: 用来告诉loaders处理哪些文件
- plugins: 启用的webpack插件

### html-webpack-plugin

```
yarn add html-webpack-plugin
```

上面我设置了 html 插件用来帮助把编译后的文件添加到body最后面，所以bundle.js这个js不需要我自己来添加到index.html中了

### css-loader 和 style-loader

```
yarn add css-loader style-loader
```

然后在webpack.config.js中就可以使用 css-loader 和 style-loader 了

之后我们在需要使用css的时候，直接用以下方式即可

```
import "./App.css";
```

另外在写 react 应用时，也可以直接使用内敛样式，例如

```javascript
import React from 'react';

var style = {
  backgroundColor: '#EEE'
};

export default React.createClass({
  render: function () {
    return (
      <div style={style}>
        <h1>Hello world</h1>
      </div>
    )
  }
});
```

### open-browser-webpack-plugin

```
yarn add open-browser-webpack-plugin
```

这个插件的作用是编译完成以后，打开浏览器


## 设置 Babel

```
yarn add babel-loader babel-core babel-preset-es2015 babel-preset-react --dev
```

preset 是 babel 的插件，用来让 babel 帮忙转译。然后再创建一个 babel 配置文件

```
touch .babelrc
```

写入内容

```json
{
    "presets":[
        "es2015", "react"
    ]
}
```

## 4. 设置 React 环境

安装 React

```
yarn add react react-dom
```

当前目录是这个样子

```
.
├── .babelrc
├── node_modules
├── package.json
├── webpack.config.js
└── yarn.lock
```

接下来我们加入 React 需要的文件

```
.
├── client
│   ├── components
│   │   └── App.js
│   ├── index.html
│   └── index.js
├── package.json
├── webpack.config.js
└── yarn.lock
```

在 index.html 中写入

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>React App Setup</title>
  </head>
  <body>
    <div id="root">
    </div>
  </body>
</html>
```

在 index.js 中写入

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import { Router, Route, hashHistory } from 'react-router';

ReactDOM.render(
  (<Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="/about" component={App} />
  </Router>),
  document.getElementById('root')
);

```


在 App.js 中写入

```javascript
import React from 'react';

export default class App extends React.Component {
  render() {
    return (
     <div style={{textAlign: 'center'}}>
        <h1>Hello World</h1>
      </div>);
  }
}
```

## 5. 设置 React-Router

想要完成页面跳转以及一些复杂的多页面操作，可以使用 React-Router 来支持

```
yarn add react-router
```

使用例子可以看上面index.js内容

## 6. 启动 React

修改package.json，加入scripts

```json
"scripts": {
    "start": "webpack-dev-server",
    "build": "webpack --progress --colors"
    
  },
```

build 方法会把网站打包一下，然后放到之前定义好的目录里面。start 可以直接开启开发模式，并且开启预览

```
yarn start
```

## 7. start kit

这些配置不需要每次都跑一次，我自己的放在 [Github](https://github.com/suyan/react-start-kit) 上。下载下来运行

```
yarn install
yarn start
```

即可开启一个 Web App 的开发了

## Refer

[Setup a React Environment Using webpack and Babel](https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel)


