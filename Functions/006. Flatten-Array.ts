type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  console.log(value);
  const ans:Array<any> =  new Array();
  for(const v of value){
    if(Array.isArray(v)) ans.push(...flatten(v));
    else ans.push(v);
  }
  return ans;
  throw 'Not implemented!';
}
