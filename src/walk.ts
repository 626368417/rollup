import { parse } from "acorn";
const soureCode = `
function hello(name) {
    console.log('Hello, ' + name);
}
hello('World');`;

const ast = parse(soureCode, {
  ecmaVersion: 2020, // 使用 ECMAScript 2020 版本
  sourceType: "module", // 代码类型为模块
  // plugins: { jsx: true },  // 启用 JSX 解析
  // locations: true,         // 添加位置信息
  // ranges: true             // 添加起始和结束位置
});

// ast.body语法树
ast.body.forEach((statement) => {
  console.log(statement, "statement");
  walk(statement, {
    // 进入节点
    enter(node: any) {
      if (node.type) {
        console.log(node.type + "进入");
      }
    },

    // 离开节点
    leave(node: any) {
      if (node.type) {
        console.log(node.type + "离开");
      }
    },
  });
});
/**
 *
 * @param node
 * @param parent
 * @param enter  进入节点
 * @param leave 离开节点
 */
function visit(node: any, parent: null, enter: any, leave: any) {
  // 进入节点
  if (enter) {
    enter(node, parent);
  }

  console.log(node, "node");
  let keys = Object.keys(node).filter((key) => typeof node[key] === "object");
  keys.forEach((key) => {
    let value = node[key];
    if (Array.isArray(value)) {
      value.forEach((val) => visit(val, node, enter, leave));
    } else if (value && value.type) {
      visit(value, node, enter, leave);
    }
  });

  // 离开节点
  if (leave) {
    leave(node, parent);
  }
}

/**
 *
 * @param astNode ast节点
 * @param param1
 */
function walk(astNode: any, { enter, leave }: any) {
  visit(astNode, null, enter, leave);
}

export default ast;
