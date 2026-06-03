export default function camelCaseKeys(object: unknown): unknown {
  if (Array.isArray(object)) {
    for (let i = 0; i < object.length; i++) {
      object[i] = camelCaseKeys(object[i]);
    }
  } else if (object != null && typeof object == "object") {
    const obj = object as Record<string, unknown>;
    const res = {} as Record<string, unknown>;

    for (const key in object) {
      const newKey : string = (camelCaseKeys(key) as string);
      res[newKey] = camelCaseKeys(obj[key]);
    }
    return res;
  } else if (typeof object == "string") {
    let ans = ""; let tempArr = object.split("_");
    ans += tempArr[0].toLowerCase();
    for (let i = 1; i < tempArr.length; i++) ans += (tempArr[i][0].toUpperCase() + tempArr[i].slice(1));
    return ans;
  }
  return object;
}
