import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
export default {
  //文件入口点
  input: "src/main.ts",
  //输出配置
  output: {
    file: "dist/bundle.cjs.js", //输出文件的路径和名称
    format: "cjs", //五种输出格式：amd/es6/iife/umd/cjs
    name: "bundleName", //当format为iife和umd时必须提供，将作为全局变量挂在window下
  },
  //插件
  plugins: [
    babel({
      //排除node_modules下的文件
      exclude: "node_modules/**",
    }),
    typescript(),
    terser(),
    postcss({
      extract: true, // 将 CSS 提取到独立文件
      minimize: true, // 压缩 CSS
    }),
  ],
};
