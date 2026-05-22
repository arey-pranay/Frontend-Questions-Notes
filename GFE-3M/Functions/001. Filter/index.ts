interface Array<T> {
  myFilter(
    callbackFn: (value: T, index: number, array: Array<T>) => boolean,
    thisArg?: any,
  ): Array<T>;
}

Array.prototype.myFilter = function (callbackFn, thisArg) {
  const len = this.length;
  const ans = [];

  for(let i=0;i<len;i++){
    const val = this[i];
    if(
       Object.hasOwn(this, i) &&
       callbackFn.call(thisArg,val,i,this)
      ) ans.push(val);
  }
  return ans;
};

