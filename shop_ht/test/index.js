function currying(fn, ...args) {
  const length = fn.length;
  let argArray = [...args];
  const res = function (...args2) {
    argArray = [...argArray, ...args2];
    //长度相等或者大于fn所需参数就返回执行结果
    if (argArray.length >= length) {
      return fn(...argArray);
    } else {
      //长度不相等继续返回函数
      return res;
    }
  };
  return res;
}
const add = (a, b, c) => a + b + c;
const a = currying(add, 1);
console.log(a(2, 3)); //output: 6
