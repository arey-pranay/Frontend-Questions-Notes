type SumResult = (value?: number) => number | SumResult;

export default function sum(initValue: number): SumResult {
  return function func(num?: number): number|SumResult {
    if(num===undefined) return initValue;
    return sum(initValue+num);
  };
}
// function temp = sum(1);
// let ans = temp();
// console.log(ans) //1
