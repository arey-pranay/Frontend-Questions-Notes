type Fn = (this: any, arg: string | number) => unknown;

export default function memoize(func: Fn): Fn {
  // get function arguments
  // check if we have that in the cachemap
  // cachemap is accessible through closure
  // if have then return else call and store
  const cacheMap = new Map<string | number,unknown>();

  return function memoizedFunc(this: any, arg: string | number){
    if(!cacheMap.has(arg))cacheMap.set(arg, func.call(this,arg))
    return cacheMap.get(arg)
  }
}
