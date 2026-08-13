interface Function {
  myCall(this: Function, thisArg: any, ...argArray: any[]): any;
}

Function.prototype.myCall = function (thisArg, ...argArray) {
  // it is attachedto a function prototype definition => 'this' will be a'function'
  // so I assume thisArg will be the 'this' argument for to the 'this' function
  // and ...argArray is the arguments array passed to 'this'

      return this.bind(thisArg)(...argArray)
//    return this.apply(thisArg, argArray);
//    return this.bind(thisArg, ...argArray)();

};
// bind() provides exactly that by returning a new function with the desired receiver., we can also just pass the arguments directly into bind() before invoking the returned function
// call() and apply() already differ only in how arguments are passed, which makes apply() the most direct sibling-helper implementation:
