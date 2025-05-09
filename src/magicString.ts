import MagicString from 'magic-string';

// 创建一个 MagicString 实例
const str = new MagicString('Hello, world!');

// 修改字符串（比如替换内容）
str.overwrite(7, 12, 'Universe');

// 获取修改后的字符串
console.log(str.toString());  // "Hello, Universe!"

// 创建一个 MagicString 实例
let magicString1 = new MagicString('var a = 1;');
let magicString2 = new MagicString('var b = 2;');

// 可以对每个实例进行修改操作
magicString1.append('console.log(a);');
magicString2.append('console.log(b);');

// 合并两个 MagicString 实例的字符串内容
let finalResult = magicString1.toString() + '\n' + magicString2.toString();
console.log(MagicString, 'bundle11');
console.log(finalResult, 'bundle');


export default finalResult;