# ✅ Commented Solution

```ts
export default function textSearch(
  text: string,
  query: string,
): string {

  // Empty or whitespace-only query:
  // return original text unchanged.
  if (!query.trim()) {
    return text;
  }

  // Perform case-insensitive matching.
  const lowerQuery = query.toLowerCase();

  let result = "";
  let i = 0;

  // Scan through the text.
  while (i < text.length) {

    // Current window of same length as query.
    const substr =
      text.slice(i, i + query.length);

    // Case-insensitive comparison.
    if (
      substr.toLowerCase() === lowerQuery
    ) {

      // Preserve original casing
      // while highlighting.
      result += `<b>${substr}</b>`;

      // Skip the matched characters.
      i += query.length;

    } else {

      // No match.
      result += text[i];
      i++;
    }
  }

  // Merge adjacent highlights.
  // Example:
  // <b>ab</b><b>ab</b>
  // ->
  // <b>abab</b>
  return result.replace(
    /<\/b><b>/g,
    ""
  );
}
```

---

# 📄 README — Text Search Highlight

## Problem

Implement a simplified search highlighter similar to:

* Browser Find (`Ctrl + F`)
* Search suggestions
* Gmail search
* VS Code search

The function should:

* Search case-insensitively
* Preserve original casing
* Wrap matching text with:

```html
<b>...</b>
```

---

## Example

```ts
textSearch(
  "Hello World",
  "hello"
);
```

↓

```html
<b>Hello</b> World
```

---

Another example

```ts
textSearch(
  "ababab",
  "ab"
);
```

↓

Intermediate:

```html
<b>ab</b><b>ab</b><b>ab</b>
```

↓

Final:

```html
<b>ababab</b>
```

---

# Core Idea

This is a classic:

```text
Sliding Window + String Traversal
```

Problem.

Instead of comparing one character,

we compare a **window of length = query.length**.

---

Visual

```
Text

HELLOWORLD

^^^^^
Hello

 ^^^^^
 elloW

  ^^^^^
   lloWo
```

Window slides one character at a time.

---

# Approach

---

## Step 1

Handle empty query.

```ts
query.trim()
```

If query contains only spaces:

```
"    "
```

Return original text.

---

## Step 2

Case-insensitive search.

Instead of changing:

```ts
text
```

only convert comparison.

```ts
substr.toLowerCase()
```

vs

```ts
query.toLowerCase()
```

This preserves:

```text
HeLLo
```

instead of returning

```text
hello
```

---

## Step 3

Traverse using index.

```ts
let i = 0;
```

---

At every position:

```ts
text.slice(
  i,
  i + query.length
)
```

creates current window.

---

Example

Text

```
HelloWorld
```

Query

```
World
```

Windows

```
Hello
elloW
lloWo
loWor
oWorl
World
```

---

## Step 4

If matched

Append

```html
<b>match</b>
```

Then skip

```ts
i += query.length
```

because entire query has already been processed.

---

## Step 5

Otherwise

Append one character.

```ts
result += text[i];
```

Move one step.

---

## Step 6

Merge adjacent tags.

Without this:

```
abab
```

Searching:

```
ab
```

gives

```html
<b>ab</b><b>ab</b>
```

Cleaner output:

```html
<b>abab</b>
```

Regex:

```ts
/<\/b><b>/g
```

simply removes touching tags.

---

# Why Preserve Original Case?

Bad

```
HELLO
```

↓

```
hello
```

User loses formatting.

Instead compare:

```ts
toLowerCase()
```

only.

Output remains

```
HELLO
```

---

# String Concepts Used

---

## slice()

```ts
str.slice(start,end)
```

Returns substring.

Does NOT modify original string.

---

Example

```ts
"abcdef".slice(2,5)
```

↓

```
cde
```

---

## Strings are Immutable

Cannot do:

```ts
text[0] = "X";
```

Must create new string.

Hence

```ts
result += ...
```

---

## Case-insensitive Search

Common approaches:

```ts
toLowerCase()
```

or

```ts
toUpperCase()
```

---

Never modify original text.

---

# Why Not indexOf()?

Could repeatedly call:

```ts
indexOf()
```

But interviewers usually want

manual traversal.

---

# Why Sliding Window?

Every comparison uses

```
query.length
```

characters.

Instead of comparing

single characters.

---

# Complexity

Let

```
N = text length
M = query length
```

---

## Time

Each position compares

```
M
```

characters.

```
O(N × M)
```

---

## Space

Output string

```
O(N)
```

---

# Edge Cases

### Empty query

```ts
""
```

Return original.

---

### Query longer than text

```
text = abc

query = abcdef
```

No match.

---

### Different casing

```
HELLO

hello
```

Still matches.

---

### Consecutive matches

```
ababab
```

↓

Merged into one bold block.

---

### Overlapping matches

Example

```
aaaaa

query = aaa
```

Current algorithm returns

```html
<b>aaa</b>aa
```

because after a match it jumps by `query.length`.

It **does not detect overlapping matches**. This is intentional in many highlight implementations, but it's a common interview follow-up.

---

# Possible Follow-Ups

### Support overlapping matches

Instead of

```ts
i += query.length;
```

advance by:

```ts
i++;
```

while keeping track of open highlight ranges.

---

### Use Regular Expressions

```ts
text.replace(...)
```

---

### Multiple queries

Highlight

```
cat
dog
bird
```

simultaneously.

---

### HTML escaping

Avoid highlighting inside HTML tags.

---

# 🧠 Important Concepts

### Strings

* immutable
* `slice()`
* `toLowerCase()`
* concatenation

### Algorithms

* sliding window
* linear traversal
* pattern matching

### Regex

* global replacement
* HTML tag merging

### Frontend

* search highlighting
* preserving formatting
* case-insensitive search

---

# ⚡ 2-Line Revision

> This solution performs a sliding-window traversal over the text, comparing fixed-length substrings case-insensitively while preserving the original text casing.
> Adjacent `<b>` tags are merged using a regular expression to produce cleaner highlighted output.

---

# 🔥 Important Interview Notes

## 1. Sliding Window

Not every sliding window problem is about numbers.

It can also be used for:

* substring search
* pattern matching
* anagrams
* text highlighting

---

## 2. Strings are Immutable

Every modification creates a new string.

This is why:

```ts
result += ...
```

is used instead of modifying `text`.

---

## 3. `slice()` vs `substring()` vs `substr()`

| Method                  | Parameters    | Negative Index | Status        |
| ----------------------- | ------------- | -------------- | ------------- |
| `slice(start, end)`     | start, end    | ✅ Yes          | ✅ Recommended |
| `substring(start, end)` | start, end    | ❌ No           | ✅ Common      |
| `substr(start, length)` | start, length | Partial        | ❌ Deprecated  |

Prefer **`slice()`** in interviews.

---

## 4. Greedy Matching

Notice:

```ts
i += query.length;
```

After finding a match, the algorithm skips the matched region.

This means it performs **non-overlapping (greedy)** matching.

---

## 5. Regex Used

```ts
/<\/b><b>/g
```

* `g` → global (replace all occurrences)
* Matches adjacent closing and opening bold tags
* Produces a single continuous highlighted region without nested tags.
