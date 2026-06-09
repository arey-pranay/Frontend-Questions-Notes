interface Function {
  myBind(this: Function, thisArg: any, ...argArray: any[]): Function;
}

Function.prototype.myBind = function (
  this: Function,
  thisArg: any,
  ...argArray: any[]
) {
  const originalFunction = this;
  return function (...parameters: any[]) {
    return originalFunction.apply(thisArg, [...argArray, ...parameters]);
  };
};
