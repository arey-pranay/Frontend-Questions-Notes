export default function squashObject(obj: Object): Object {
  const ans: Record<string, any> = {};

  const func = (currentObj: any, path: string): void => {
    if (!(currentObj instanceof Object)) {
      ans[path] = currentObj;
      return;
    }
    for (const entry of Object.entries(currentObj)) {
      let key = entry[0];
      let value = entry[1];
      const newKey = key === "" ? path : path === "" ? key : `${path}.${key}`;
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          func(value[i], `${newKey}.${i}`);
        }
      } else if (value instanceof Object) {
        func(value, newKey);
      } else ans[newKey] = value;
    }
  };
  func(obj, "");
  return ans;
}
