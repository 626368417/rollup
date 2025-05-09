# rollup 学习

## 1. rollup 是什么

Rollup 是一个用于 JavaScript 的模块打包工具，它将小的代码片段编译成更大、更复杂的代码。

vite 是基于 rollup 的，所以学习 rollup 是很有必要的

### ** 安装**

```js
pnpm  install rollup
```

### ** 基本使用**

**创建在根目录 rollup.config.js**

```js
export default {
  //文件入口点
  input: "src/main.js",
  //输出配置
  output: {
    file: "dist/bundle.cjs.js", //输出文件的路径和名称
    format: "cjs", //五种输出格式：amd/es6/iife/umd/cjs
    name: "bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
  },
};
```

**src\main.js**

```js
console.log("hello");
```

**package.json**
因为 rollup.config。使用的是 es 模块，所以需要配置 type 为 module
不然会报错

[!] RollupError: Node tried to load your configuration file as CommonJS even though it is likely an ES module. To resolve this, change the extension of your configuration to ".mjs", set "type": "module" in your package.json file or pass the "--bundleConfigAsCjs" flag.

Original error: Unexpected token 'export'

```js
{
"type": "module",
 "scripts": {
    "build": "rollup --config"
  },
}

```

**打包结果**
![Alt text](1746777117571.png)
