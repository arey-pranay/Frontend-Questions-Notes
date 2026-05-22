export default function listFormat(
  items: Array<string>,
  options?: {
    sorted?: boolean;
    length?: number;
    unique?: boolean;
  },
): string {

  // Pointer used for iteration
  let i = 0;

  // Remove duplicates if unique flag enabled
  if (options?.unique) {
    const s = new Set(items);
    items = Array.from(s);
  }

  // Sort items alphabetically
  if (options?.sorted) {
    items.sort();
  }

  // Determine maximum number of visible items
  // Fallback to full array length if invalid/missing
  const length =
    options?.length && options.length > 0
      ? options.length
      : items.length;

  // Stores final visible items
  const ans = new Array<string>();

  // Collect only required number of items
  while (ans.length < length && i < items.length) {

    // at() safely accesses element by index
    const item = items.at(i++);

    if (item) ans.push(item);
  }

  // If items were truncated:
  // "A, B and 2 others"
  if (options?.length && length < items.length) {

    return (
      addOthers(
        items.length - ans.length,
        ans.join(", ")
      ) || ""
    );

  } else {

    // Handle normal formatting:
    // "A, B and C"
    if (ans.length > 1) {

      // Remove last element for final "and"
      const temp = ans.pop();

      return ans.join(", ").concat(" and " + temp) || "";
    }

    // Single item case
    return ans.join("");
  }
}

function addOthers(n: number, s: string): string {

  // No hidden items
  if (n == 0) return s;

  // Singular grammar
  if (n == 1) {
    return s.concat(" and 1 other");
  }

  // Plural grammar
  else {
    return s.concat(" and " + n + " others");
  }
}

