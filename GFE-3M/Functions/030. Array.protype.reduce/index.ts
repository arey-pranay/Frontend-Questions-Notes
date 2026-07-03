interface Array<T> {
  myReduce<U>(
    callbackFn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[],
    ) => U,
    initialValue?: U,
  ): U;
}

Array.prototype.myReduce = function (callbackFn, initialValue) {
  const len = this.length;
  const noInitialValue = arguments.length <=1;

  let k=0;
  let acc:any;

  if(noInitialValue){
      while(k<len && !Object.hasOwn(this,k)) k++;
      if(k>=len) throw new TypeError('Reduce of empty array with no initial value');
      acc = this[k++];
  } else {
    acc = initialValue;
  }
  while(k<len){
    if(Object.hasOwn(this,k)){
      acc = callbackFn(acc,this[k],k,this);
    }
    k++;
  }
  return acc;
};
