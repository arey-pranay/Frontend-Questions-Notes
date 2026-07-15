interface PromiseFulfilledResult<T> {
  status: 'fulfilled';
  value: T;
}

interface PromiseRejectedResult {
  status: 'rejected';
  reason: any;
}

export default function promiseAllSettled<T>(
  iterable: Array<T>,
): Promise<Array<PromiseFulfilledResult<T> | PromiseRejectedResult>> {
  return new Promise((resolve) => {
    const results = new Array(iterable.length);
    let pending = iterable.length;
    if(pending == 0){resolve(results); return;}

    iterable.forEach(
      async(item,index)=>{
        try{
          const value = await item;
          results[index] = {
            status: 'fulfilled',
            value
          }
        }catch(e){
          results[index] = {
            status: 'rejected',
            reason: e
          }
        }
        pending -= 1;
        if(pending == 0) resolve(results);
      }
     
    )
  })
}
