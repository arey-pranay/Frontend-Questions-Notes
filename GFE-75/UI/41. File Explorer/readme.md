## 1. Don't start by thinking about components

Start by asking: What must the UI do?

For this file explorer, the requirements are:

1. Display a list of files and folders.
2. Show folders before files.
3. Sort each group alphabetically.
4. Allow folders to expand and collapse.
5. Show nested contents when a folder expands.
6. Support folders inside folders, at any depth.

Write those requirements down before coding. They turn one intimidating problem into six smaller ones.

## 2. Discover the three components from the UI itself

Look at the hierarchy:

FileExplorer

Receives the original data and starts the tree

FileList

Sorts a collection and renders its items

FileObject

Renders one file or folder and handles expansion

When a folder expands

`FileObject` renders another `FileList` containing that folder's children.

Here's the trick: you don't need to invent three components upfront. You discover them by assigning each responsibility a name.

- Who starts the explorer? `FileExplorer`.
- Who manages a collection of items? `FileList`.
- Who renders one item? `FileObject`.

This division is useful because a list and an individual item have different responsibilities. The recursive relationship becomes natural once you notice that an expanded folder contains another list.

## 3. Derive the recursion instead of memorizing it

Take this small example:

```
Documents/
  Word.doc
  Powerpoint.ppt
```

Ask yourself: what should happen when I expand `Documents`?

You need to render its children. But how do you render a collection of files? You already have a component that does exactly that: `FileList`.

So you write:

```
{expanded && fileChildren && (
  <FileList data={fileChildren} />
)}
```

Now consider `Downloads/Misc`. It has the exact same structure as `Documents`: a folder containing more items.

That leads to the key realization:

A folder's children should be rendered using the same component that renders the original list.

That's recursion. You don't need to think of it as an advanced algorithm. You just need to notice that the same problem repeats at a smaller scale.

The mental model is:

```
FileList
  └── FileObject (Documents)
        └── FileList
              ├── FileObject (Word.doc)
              └── FileObject (Powerpoint.ppt)
```

This pattern also appears in comments with replies, nested menus, organization charts, and tree-shaped data.

## 4. Derive the `filter()` logic from the requirement

The requirement says folders must appear before files, with each group alphabetically sorted.

Start with one question: how can you identify a folder?

Your data already gives you the answer:

```
const isDirectory = Boolean(file.children);
```

A directory has a `children` property; a regular file does not.

Now translate the requirement directly into operations:

Step 1: Separate folders

```
const directories = data.filter(
  (item) => item.children !== undefined
);
```

Step 2: Separate files

```
const files = data.filter(
  (item) => item.children === undefined
);
```

Step 3: Sort both groups

```
directories.sort((a, b) =>
  a.name.localeCompare(b.name)
);

files.sort((a, b) =>
  a.name.localeCompare(b.name)
);
```

Step 4: Combine in the required order

```
const items = [...directories, ...files];
```

Notice what happened: we didn't need to think of `filter()` as a clever trick. We translated "folders first, files second" into two groups, sorted them, and concatenated them.

One subtle point: checking `children !== undefined` explicitly expresses the data model. An empty `children: []` still represents a directory.

## 5. Your solution has a few fixable issues

These aren't failures of your reasoning. They're ordinary implementation details.

Issue 1: The `FileList` props don't match.

You destructure `data`, but your type declares `fileList`:

```
export default function FileList({
  data,
}: Readonly<{
  fileList: ReadonlyArray<FileData>;
}>) {
```

Make the type consistent:

```
export function FileList({
  data,
}: Readonly<{
  data: ReadonlyArray<FileData>;
}>) {
```

Issue 2: Multiple default exports.

If `FileExplorer`, `FileList`, and `FileObject` are in the same file, only one can be exported as `default`. Make the others named exports, or place them in separate files and import them as needed.

Issue 3: Unnecessary state.

```
const [message, setMessage] = useState("Hello world");
```

This state is never used, so remove it. Before submitting, check whether each state variable and import is necessary.

Issue 4: Prefer functional updates for toggling.

```
onClick={() => setExpanded((prev) => !prev)}
```

This makes the state transition explicitly depend on the previous value.

Your main architecture, though, is sound: one component handles a list, one handles an item, and folders reuse the list component for their children.

## 6. How to approach the next unfamiliar GFE question

Use this process every time. Don't measure yourself by how quickly you see the final solution.

1. Spend 3–5 minutes extracting requirements. Write down what the UI must display and how it should behave.
2. Identify the data shape. Is it a flat array, a tree, a graph, or a single object? Look for relationships such as `children`, `parentId`, or nested arrays.
3. Draw a tiny example. Use two or three items. Sketch what the UI should look like before writing JSX.
4. Find the repeating unit. Ask whether a section contains more sections of the same kind. If so, recursion may fit naturally.
5. Split responsibilities. Name components based on what they do, not how many components you think the interviewer expects.
6. Implement one level first. Get a basic list rendering correctly. Then add sorting, expansion, and recursion one feature at a time.
7. Test edge cases. Try an empty list, a folder with no children, deeply nested folders, and names that sort differently.

### A practical rule for when to look at solutions

If you're stuck, don't immediately read the full solution. Ask one targeted question:

- "How do I recognize recursion in this data?"
- "How can I separate folders from files?"
- "How should I structure components for nested data?"

Give yourself another 5–10 minutes to apply that one hint. If you're still stuck, study the relevant part of the solution, close it, and reconstruct it yourself.

Spending an hour wrestling with a problem can be valuable, but only if you leave with a reusable insight rather than just the finished code.

## 7. One exercise to rebuild your confidence

Try this variation without looking at your solution:

Build a nested comments component.

```
Alice: Great post!
  Bob: Thanks!
    Charlie: I agree.
  David: Same here.
```

Requirements:

- Display each comment.
- Indent replies.
- Support arbitrarily nested replies.

Start by identifying the data structure and the smallest repeating UI unit. Don't worry about styling or extra features yet.
If you recognize that each comment can contain another list of comments, you've transferred the central insight from the file explorer to a new problem.
One last thing: you're already learning React, TypeScript, state management, effects, API handling, and component design through these exercises. This question combines several concepts, so struggling with it is understandable.
Your goal isn't to solve every question immediately. It's to make each struggle teach you a pattern you can recognize next time. Today, that pattern is recursive rendering and separating responsibilities. Next time you encounter nested data, you'll have a much better starting point.
