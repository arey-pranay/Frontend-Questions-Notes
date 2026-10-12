```
type HTMLNode = string | HTMLElementNode;

type HTMLElementNode = {
  tag: string;
  children: HTMLNode[];
};

export default function serializeHTML(root: HTMLElementNode): string {
  return traverse(root);
}

function traverse(node: HTMLNode, depth = 0): string {
  // Each level of nesting adds one tab.
  const indentation = "\t".repeat(depth);

  // Text nodes are returned as text, indented to their depth.
  if (typeof node === "string") {
    return `${indentation}${node}`;
  }

  // Convert the tag to lowercase for both opening and closing tags.
  const tag = node.tag.toLowerCase();

  return [
    `${indentation}<${tag}>`,

    // Recursively serialize every child one level deeper.
    ...node.children.map((child) => traverse(child, depth + 1)),

    `${indentation}</${tag}>`,
  ].join("\n");
}
```

Example dry run

Input:

```
const root: HTMLElementNode = {
  tag: "DIV",
  children: [
    {
      tag: "P",
      children: ["Hello"],
    },
    {
      tag: "SPAN",
      children: ["World"],
    },
  ],
};

serializeHTML(root);
```

Output:

```
<div>
	<p>
		Hello
	</p>
	<span>
		World
	</span>
</div>
```

### How recursion works

1\. Visit the root

`<div>` is emitted at depth `0`, so it has no indentation.

2\. Visit each child

The `<p>` and `<span>` elements are serialized at depth `1`, adding one tab.

3\. Visit text nodes

`"Hello"` and `"World"` are strings, so the base case returns them with two tabs of indentation.

4\. Close each element

Each recursive call adds its closing tag at the same indentation level as its opening tag.

## Important concepts

### `string | HTMLElementNode` — union type

```
type HTMLNode = string | HTMLElementNode;
```

A node can be either:

- A `string` representing text content.
- An `HTMLElementNode` representing an element with a tag and children.

This is why you check:

```
if (typeof node === "string")
```

That check narrows the TypeScript union, allowing the function to handle text separately from elements.

### `depth = 0` — default parameter

```
function traverse(node: HTMLNode, depth = 0)
```

The root starts at depth `0`. Every child is passed `depth + 1`, which controls indentation.

```
"\t".repeat(depth)
```

Examples:

| Depth | Indentation |
| ----- | ----------- |
| 0     | `""`        |
| 1     | `"\t"`      |
| 2     | `"\t\t"`    |
| 3     | `"\t\t\t"`  |

### `map()` and spread syntax

```
...node.children.map((child) => traverse(child, depth + 1))
```

`map()` recursively converts each child into a string. The spread operator inserts those strings as individual elements into the surrounding array.

Then:

```
.join("\n")
```

combines the opening tag, child strings, and closing tag with newlines.

### Complexity

Let \\(n\\) be the number of nodes and \\(L\\) the total length of the serialized output.

- Time: \\(O(n + L)\\), accounting for visiting nodes and constructing the output.
- Recursion stack: \\(O(h)\\), where \\(h\\) is the maximum tree depth.
- Output space: \\(O(L)\\).

## Interview gotchas

- The base case is the string node; without it, recursion would try to access `.tag` and `.children` on a string.
- The root's depth is `0`; recursive calls increase depth by one.
- Opening and closing tags must use the same normalized tag name.
- This is a simplified HTML serializer, not a complete implementation of HTML serialization.
- It doesn't escape text content. A string containing `<` or `&` may produce invalid or unintended HTML.
- It always emits closing tags, so it doesn't correctly handle void elements such as `<img>`, `<br>`, and `<input>` under actual HTML serialization rules.
- It assumes every element has a `children` array.

### 2-line interview revision

> Serialize a tree recursively using DFS: strings are the base case, while element nodes produce an opening tag, recursively serialized children, and a closing tag. Track nesting with a depth parameter for indentation; `map()` transforms children, spread inserts their results, and `join("\n")` builds the final string.
