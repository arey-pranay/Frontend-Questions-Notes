export default function debounce(func: Function, wait: number): Function {
  let timeoutId :  ReturnType<typeof setTimeout> | null = null;
  function debouncedFunc(this:any,...args: any[]){
    if(timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(()=>{func.apply(this,args)},wait)
  }
  return debouncedFunc;
}
