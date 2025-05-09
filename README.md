# rollup 学习

## 1. rollup 是什么

Rollup 是一个用于 JavaScript 的模块打包工具，它将小的代码片段编译成更大、更复杂的代码。

vite 是基于 rollup 的，所以学习 rollup 是很有必要的

### **1.1 基本使用**

**安装**

```js
pnpm  install rollup
```

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

```js
"use strict";

console.log("hello");
```

### **1.2 支持 Babel**

使用 Babel 可以将 ES6+ 代码转换为向后兼容的 JavaScript 版本，以便在旧版浏览器中运行。

**安装依赖**

- @babel/core 是 babel 的核心包
- babel/preset-env 是预设
- @rollup/plugin-babel 是 babel 插件

```js
pnpm install @rollup/plugin-babel @babel/core @babel/preset-env --save-dev
```

**src\main.js**

```js
let sum = (a, b) => {
  return a + b;
};
let result = sum(12, 24);
console.log(result);
```

**.babelrc**
.babelrc 文件是 Babel 的配置文件

```js
{
  "presets": [
    [
      "@babel/env",
      {
        // "modules": false 表示不转换模块语法（比如 import 和 export）
        "modules": false
      }
    ]
  ]
}
```

**rollup.config.js**

```js
import babel from "@rollup/plugin-babel";
export default {
  //插件
  plugins: [
    babel({
      //排除node_modules下的文件
      exclude: "node_modules/**",
    }),
  ],
};
```

**打包结果**
这个就是 babel 转换后的结果

```js
"use strict";

var sum = function sum(a, b) {
  return a + b;
};
var result = sum(12, 24);
console.log(result);
```

### **1.3 tree-shaking**

- rollup 的一个核心特性是 tree-shaking，它可以在打包过程中删除未使用的代码，从而减小最终包的大小。

- rollup 只处理函数和顶层的 import/export 变量

**src\main.js**

```js
import { name, age } from "./module.js";
console.log(name);
```

**src\module.js**

```js
export const name = "张三";
export const age = 18;
```

**打包结果**

```js
"use strict";

var name = "张三";
console.log(name);
```

age 变量引入了，但是没有使用，所以打包结果中没有 age 变量

### **1.4 使用 typescript**

如果不安装 tslib，会报错
[!] (plugin typescript) RollupError: [plugin typescript] @rollup/plugin-typescript: Could not find module 'tslib', which is required by this plugin. Is it installed?

**安装依赖**

- tslib:是 TypeScript 的一个运行时库，包含了 TypeScript 编译后的辅助函数
- @rollup/plugin-typescript: 是一个 Rollup 插件，用于将 TypeScript 编译为 JavaScript
- typescript: 是 TypeScript 的核心编译器，负责将 TypeScript 代码转换为 JavaScript 代码

```js
pnpm install tslib typescript @rollup/plugin-typescript --save-dev
```

**src\main.ts**

```ts
const name1: string = "张三";
const age: number = 18;

console.log(name1, age);
```

**tsconfig.json**
tsconfig.json 文件是 TypeScript 的配置文件

```json
{
  // compilerOptions: 编译选项
  "compilerOptions": {
    "target": "es5", // 编译后的版本
    "module": "ESNext", // 模块化方案
    "strict": true, // 启用所有严格类型检查选项
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**rollup.config.js**

```js
import typescript from "@rollup/plugin-typescript";
export default {
  //插件
  plugins: [typescript()],
};
```

**打包结果**

```js
"use strict";

var name1 = "张三";
var age = 18;
console.log(name1, age);
```

### **1.4 压缩 JS **

terser 是支持 ES6 +的 JavaScript 压缩器工具包

- 压缩代码： rollup-plugin-terser 会移除 JavaScript 代码中的空格、换行、注释等不必要的字符，缩短代码并减少文件大小
- 混淆变量和函数名：通过混淆代码中的变量和函数名，使其变得难以理解，进一步减少代码的体积并增加一定的保护性（虽然这种混淆对防止代码被反向工程并不完全有效 -删除无用代码：通过使用像 dead code elimination（死代码消除）等技术，它能够删除一些冗余和未使用的代码，进一步减小代码体积

  **安装依赖**

```js
pnpm install rollup-plugin-terser --save-dev
```

**rollup.config.js**

```js
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
export default {
  //插件
  plugins: [typescript(), terser()],
};
```

**打包结果**

```js
"use strict";
console.log("张三", 18);
```

### **1.5 编译 css **

- PostCSS:是一个用 JavaScript 编写的工具，用来处理 CSS 文件。它通过插件的方式扩展了 CSS 的功能，可以用来进行自动添加浏览器前缀、压缩 CSS、支持未来的 CSS 特性等

- rollup-plugin-postcss 是一个 Rollup 插件，用于在 Rollup 构建过程中集成 PostCSS
  **安装依赖**

```js
pnpm install   postcss rollup-plugin-postcss --save-dev
```

**src\main.ts**
引入 main.css

```js
import "./main.css";
const name1: string = "张三";
const age: number = 18;

console.log(name1, age);
```

**src\main.css**

```css
body {
  background-color: green;
}
```

**rollup.config.js**

```js
import postcss from "rollup-plugin-postcss";
export default {
  //插件
  plugins: [
    postcss({
      extract: true, // 将 CSS 提取到独立文件
      minimize: true, // 压缩 CSS
    }),
  ],
};
```

**打包结果**
bundle.cjs.js

```js
"use strict";
console.log("张三", 18);
```

bundle.cjs.css

```css
body {
  background-color: green;
}
```

### **1.6 本地服务器 **

**安装依赖**

```js
pnpm install  rollup-plugin-serve  --save-dev
```

**rollup.config.js**

```js
import serve from "rollup-plugin-serve";
export default {
  //插件
  plugins: [
    serve({
      // open: true, // 自动打开浏览器
      port: 8080, // 监听端口
      contentBase: "./dist", // 静态文件目录
    }),
  ],
};
```

### **1.7 区分环境 **

- 开发环境：用于开发阶段，需要热更新、调试等功能
- 生产环境：用于部署阶段，需要压缩、混淆、优化等操作
  serve 插件只有在开发环境才需要

  **安装依赖**

- cross-env: 是一个跨平台设置环境变量的工具，可以在 Windows、Linux 和 macOS 上设置环境变量
- @rollup/plugin-replace: 是一个 Rollup 插件，用于在构建过程中替换代码中的变量

```js
pnpm install cross-env  @rollup/plugin-replace  --save-dev
```

**rollup.config.js**

```js
import replace from "@rollup/plugin-replace"; //替换
const isDevelopment = process.env.NODE_ENV === "development"; // 判断是否为开发环境
export default {
  //插件
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ), // 替换环境变量
      preventAssignment: true, // 解决警告
    }),
    // 仅在开发环境启用 serve 插件
    isDevelopment &&
      serve({
        // open: true, // 自动打开浏览器
        port: 8080, // 监听端口
        contentBase: "./dist", // 静态文件目录
      }),
  ],
};
```

**rollup.config.js**

```json
  "scripts": {
    "build": " cross-env NODE_ENV=production rollup --config",
    "dev": " cross-env NODE_ENV=development rollup --config -w"
  },
```

### **1.8 使用第三方模块 **

rollup.js 编译源码中的模块引用默认只支持 ES6+的模块方式 import/export
**安装依赖**

- plugin-node-resolve: 是一个 Rollup 插件，用于在构建过程中解析和加载 Node.js 模块
- plugin-commonjs: 是一个 Rollup 插件，用于在构建过程中将 CommonJS 模块转换为 ES6 模块
- lodash: 是一个 JavaScript 实用工具库，提供了许多有用的函数，如数组操作、对象操作、函数操作等
- @types/lodash: 是 lodash 的 TypeScript 类型定义文件，用于在 TypeScript 中使用 lodash

```js
pnpm install @rollup/plugin-node-resolve @rollup/plugin-commonjs @types/lodash lodash   --save-dev
```

**rollup.config.js**

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  //插件
  plugins: [resolve(), commonjs()],
};
```

**rollup.config.js**

```js
import _ from "lodash";
import "./main.css";
console.log(_);
const name1: string = "张三";
const age: number = 18;

console.log(name1, age);
```

**报错**
import \_ from 'lodash'; 模块 ""D:/xue/rollup/node_modules/.pnpm/@types+lodash@4.17.16/node_modules/@types/lodash/index"" 只能在使用 "allowSyntheticDefaultImports" 标志时进行默认导入 ts(1259)

tsconfig.json

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true // // 启用合成默认导入
  }
}
```
