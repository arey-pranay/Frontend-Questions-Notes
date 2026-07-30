# ✅ Commented Solution

```ts
export default function textSearch(
  text: string,
  queries: Array<string>,
): string {

  // Empty/whitespace-only text cannot contain matches.
  if (text.trim() === "") {
    return text;
  }

  // Stores every character index that should be bolded.
  // Using a Set automatically merges overlapping matches.
  const bold = new Set<number>();

  // Search for every query independently.
  for (const query of queries) {

    // Ignore empty queries.
    if (query.trim() === "") continue;

    for (let i = 0; i < text.length;) {

      // Current substring of the same length as the query.
      const substr = text.slice(i, i + query.length);

      // Case-insensitive comparison.
      if (substr.toLowerCase() === query.toLowerCase()) {

        // Mark every character belonging to this match.
        for (let j = i; j < i + query.length; j++) {
          bold.add(j);
        }

        // Skip ahead because characters inside this match
        // cannot start another match of the SAME query.
        i += query.length;
      } else {
        i++;
      }
    }
  }

  let highlightedString = "";

  // Build the final string.
  for (let i = 0; i < text.length; i++) {

    // Opening tag only if previous character isn't bold.
    const shouldAddOpeningTag =
      bold.has(i) && !bold.has(i - 1);

    // Closing tag only if next character isn't bold.
    const shouldAddClosingTag =
      bold.has(i) && !bold.has(i + 1);

    let char = text[i];

    if (shouldAddOpeningTag) {
      char = "<b>" + char;
    }

    if (shouldAddClosingTag) {
      char += "</b>";
    }

    highlightedString += char;
  }

  return highlightedString;
}
```

---

# 📄 README — Text Search with Multiple Highlights

## Problem

Given a text and multiple search queries, return the text with all matching characters wrapped in `<b>` tags.

Rules:

* Case-insensitive matching
* Overlapping matches should merge into one `<b>` block
* Adjacent matches should also merge
* Empty queries are ignored

---

## Example

```ts
text = "The quick brown fox"
queries = ["quick", "brown"]
```

↓

```html
The <b>quick brown</b> fox
```

---

## Example

```ts
text = "aaabb"
queries = ["aaa", "abb"]
```

Matches

```text
aaa
  abb
```

↓

```html
<b>aaabb</b>
```

---

# Core Idea

The solution happens in **two passes**.

```
Search all matches

↓

Mark indices

↓

Build output
```

Instead of inserting tags immediately (which becomes difficult with overlaps), first mark every character that belongs to a match.

---

# Step 1 — Find Matches

For every query:

```
Scan text

↓

Found match?

↓

Mark indices
```

Example

```
Hello World

Query = "world"
```

Mark

```
01234567890

      XXXXX
```

---

# Step 2 — Store Indices

A `Set<number>` stores every character position to highlight.

```
0 1 2 3 4 5 6

a b c d e f g

      X X X
```

Stored as

```ts
Set {3,4,5}
```

Using a Set automatically removes duplicates.

---

# Why Set?

Suppose

```
abcdef

abc

cde
```

Character

```
c
```

belongs to both matches.

A Set stores it only once.

No manual merging required.

---

# Step 3 — Overlapping Matches

Example

```
abcdef

abcd

cdef
```

Marked indices

```
XXXXXX
```

Only one `<b>` block should appear.

---

# Step 4 — Adjacent Matches

```
abc

a

bc
```

Marked

```
XXX
```

Produces

```html
<b>abc</b>
```

not

```html
<b>a</b><b>bc</b>
```

---

# Step 5 — Generate HTML

Traverse character by character.

Insert

```
<b>
```

only when entering a bold region.

Insert

```
</b>
```

only when leaving one.

---

Example

Marked

```
F F T T T F
```

Output

```
abc<b>def</b>
```

---

# Detecting Boundaries

Opening tag

```ts
bold.has(i) &&
!bold.has(i-1)
```

Means

```
Previous

↓

Not bold

Current

↓

Bold
```

Start new block.

---

Closing tag

```ts
bold.has(i) &&
!bold.has(i+1)
```

Means

```
Current

↓

Bold

Next

↓

Not bold
```

End block.

---

# Complexity

Suppose

```
N = text length

M = number of queries
```

Worst-case

Time

```
O(M × N × L)
```

where

```
L
```

is query length because `slice()` compares up to `L` characters.

Space

```
O(N)
```

for the highlighted indices.

---

# Edge Cases

### Empty text

```ts
""
```

↓

```
""
```

---

### Empty query

Ignored.

---

### No matches

Original text returned.

---

### Multiple overlapping queries

Automatically merged.

---

### Consecutive matches

Become one `<b>` block.

---

### Case differences

```
Hello

hello
```

Still matches.

---

# JavaScript Concepts Used

## Set

```ts
const bold = new Set<number>();
```

Stores unique character indices.

Operations

```ts
add()

has()

delete()
```

Average complexity

```
O(1)
```

---

## String.slice()

```ts
text.slice(start,end)
```

Returns

```
[start,end)
```

End is excluded.

---

## Case-insensitive search

```ts
toLowerCase()
```

Normalize both strings before comparison.

---

## Boundary Detection

Instead of remembering intervals,

neighbor checks determine where tags begin/end.

Very common interview technique.

---

# 🧠 Important Interview Concepts

* Two-pass algorithms
* Set for interval merging
* Boundary detection
* Case-insensitive matching
* String traversal
* Interval union

---

# ⚡ 2-Line Revision

> Mark every matched character index using a `Set`, allowing overlapping and adjacent matches to merge naturally.
> In a second pass, insert `<b>` only when entering a highlighted region and `</b>` only when leaving it.

---

# 🔥 Important JavaScript Notes

## 1. Why not insert tags immediately?

Imagine

```
abcdef

abc

cde
```

If you insert while searching:

```
<b>abc</b><b>cde</b>
```

Incorrect.

Instead:

```
Mark first

↓

Render later
```

This separation of **processing** and **rendering** is a common interview pattern.

---

## 2. Set as an Interval Representation

Instead of storing

```
[2,5]

[4,8]
```

store

```
2 3 4 5 6 7 8
```

Membership checks become

```ts
bold.has(i)
```

This greatly simplifies overlap handling.

---

## 3. Boundary Detection Pattern

This appears in many problems.

Start boundary

```ts
current &&
!previous
```

End boundary

```ts
current &&
!next
```

Used in:

* Text highlighting
* Run-length encoding
* Connected regions
* Interval merging
* Binary array problems

---

## 4. Why skip after a match?

```ts
i += query.length;
```

For the **same query**, characters inside a successful match cannot start another valid match.

Example

```
banana

ana
```

Once `"ana"` is matched starting at index 1, indices 2 and 3 cannot begin another `"ana"` for that same scan. Skipping avoids redundant work.

---

## 5. Why `Set` instead of `boolean[]`?

Both work.

### Set

```ts
Set {2,3,4}
```

Pros

* Sparse storage
* Cleaner API
* O(1) lookup

---

### Boolean Array

```ts
[false,true,true,...]
```

Pros

* Slightly faster
* Less hashing

Interviews usually accept either.

---

## 6. Two-Pass Pattern

Many interview problems naturally split into two phases:

```
Collect information

↓

Generate answer
```

Examples:

* Prefix sums
* Interval merging
* HTML rendering
* Tree serialization
* Syntax highlighting
* Markdown parsing

---

## 7. Related Alternatives

Other approaches include:

* Interval merging (`[start, end]` ranges)
* Trie-based multi-pattern search
* Aho–Corasick (multiple string matching)
* Regular expressions (limited flexibility for overlap handling)

For interview-sized inputs, the Set-based two-pass solution is simple and effective.

---

# 🚀 Related Interview Problems

This same pattern appears in:

* Bold Words in String
* Merge Intervals
* Insert HTML Tags
* Markdown Parser
* Syntax Highlighter
* Rich Text Editor
* Search Result Highlighting

---

# 🔥 Golden Memory Rules

```
Separate searching from rendering whenever insertions complicate traversal.
```

```
A Set is an elegant way to represent highlighted positions.
```

```
Overlapping intervals merge automatically when stored as character indices.
```

```
Insert opening tags only at the start of a highlighted run.
```

```
Insert closing tags only at the end of a highlighted run.
```

```
Boundary detection often uses: current && !previous / current && !next.
```

```
Two-pass algorithms simplify many string and interval problems.
```

```
Set.has() provides average O(1) membership checks and is ideal for sparse highlights.
```
