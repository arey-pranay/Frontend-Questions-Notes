export default function listFormat(
  items: Array<string>,
  options?: { sorted?: boolean; length?: number; unique?: boolean },
): string {
  let i = 0;
  if (options?.unique) {
    const s = new Set(items);
    items = Array.from(s);
  }
  if (options?.sorted) items.sort();
  const length =
    options?.length && options.length > 0 ? options.length : items.length;
  const ans = new Array<string>();
  while (ans.length < length && i < items.length) {
    const item = items.at(i++);
    if (item) ans.push(item);
  }
  if (options?.length && length < items.length)
    return addOthers(items.length - ans.length, ans.join(", ")) || "";
  else {
    if (ans.length > 1) {
      const temp = ans.pop();
      return ans.join(", ").concat(" and " + temp) || "";
    }
    return ans.join("");
  }
}
function addOthers(n: number, s: string): string {
  if (n == 0) return s;
  if (n == 1) return s.concat(" and 1 other");
  else return s.concat(" and " + n + " others");
}
