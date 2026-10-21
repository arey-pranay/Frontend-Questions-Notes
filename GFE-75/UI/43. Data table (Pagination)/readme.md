# Data Table with Pagination — GFE Interview Notes

## 1. Mental Model

The table displays a subset of users per page instead of rendering the entire dataset at once.

The core logic is:

1. Track the current page and page size.
2. Calculate the starting index.
3. Extract the relevant rows using `slice()`.
4. Disable navigation buttons when the user reaches the first or last page.
5. Reset pagination when the page size changes.

## 2. State Management

```
const [pageNum, setPageNum] = useState(0);
const [perPage, setPerPage] = useState(5);
```

- `pageNum`: zero-based index of the current page.
- `perPage`: number of rows to display on each page.

Using zero-based indexing makes the starting index calculation straightforward.

## 3. Pagination Calculation

```
const totalUsers = users.length;
const begin = pageNum * perPage;
const filteredUsers = users.slice(begin, begin + perPage);
```

Despite the name `filteredUsers`, these users are paginated, not filtered by a condition. A name like `pageUsers` would be clearer.

### Example

Suppose there are 23 users and `perPage = 5`.

| Page index | Start index | `slice()` range | Rows |
| ---------- | ----------- | --------------- | ---- |
| 0          | 0           | `slice(0, 5)`   | 5    |
| 1          | 5           | `slice(5, 10)`  | 5    |
| 2          | 10          | `slice(10, 15)` | 5    |
| 3          | 15          | `slice(15, 20)` | 5    |
| 4          | 20          | `slice(20, 25)` | 3    |

Remember that `slice(start, end)` excludes the ending index and does not modify the original array.

### Total number of pages

The number of pages can be calculated as:

```
const totalPages = Math.ceil(totalUsers / perPage);
```

For 23 users and 5 rows per page:

\\[ \text{totalPages} = \lceil 23/5 \rceil = 5 \\]

## 4. Rendering Table Headers and Rows

### Dynamic headers

```
{[
  { label: "ID", key: "id" },
  { label: "Name", key: "name" },
  { label: "Age", key: "age" },
  { label: "Occupation", key: "occupation" },
].map(({ label, key }) => (
  <th key={key}>{label}</th>
))}
```

This is data-driven rendering: `map()` generates a header for each column definition.

For a more extensible table, column definitions can be stored separately and reused to render both headers and cell values.

### User rows

```
{pageUsers.map(({ id, name, age, occupation }) => (
  <tr key={id}>
    <td>{id}</td>
    <td>{name}</td>
    <td>{age}</td>
    <td>{occupation}</td>
  </tr>
))}
```

Using `key={id}` provides React with a stable identity for each row. This is preferable to using an array index when rows can change order or be removed.

## 5. Previous and Next Buttons

### Previous

```
<button
  disabled={pageNum === 0}
  onClick={() => setPageNum((prev) => prev - 1)}
>
  Prev
</button>
```

The previous button is disabled on the first page.

### Next

```
<button
  disabled={(pageNum + 1) * perPage >= totalUsers}
  onClick={() => setPageNum((prev) => prev + 1)}
>
  Next
</button>
```

Your original condition, `begin + perPage >= totalUsers`, is equivalent and correct.

Why use a functional state update?

```
setPageNum((prev) => prev + 1);
```

It calculates the next state from the previous state, avoiding reliance on a potentially stale captured value.

## 6. Changing the Page Size

```
<select
  value={perPage}
  onChange={(e) => {
    setPageNum(0);
    setPerPage(Number(e.target.value));
  }}
>
```

The select is a controlled component because its value comes from React state.

`e.target.value` is a string, even when an option's value looks numeric. `Number()` converts it into a number.

Resetting `pageNum` to zero is important. For example, switching from 5 rows per page to 20 while remaining on page 4 could produce an empty result, even though users exist.

## 7. Bugs and Improvements

### Fix the CSS typo

Your code uses:

```
justifyContent: "space-betweens"
```

The valid value is:

```
justifyContent: "space-between"
```

### Use strict equality

Prefer:

```
disabled={pageNum === 0}
```

instead of `pageNum == 0`, so the comparison does not coerce types.

### Display pagination information

A useful improvement is to show the current range:

```
const startRow = totalUsers === 0 ? 0 : begin + 1;
const endRow = Math.min(begin + perPage, totalUsers);
```

```
<p>
  Showing {startRow}–{endRow} of {totalUsers} users
</p>
```

This also handles an empty dataset correctly.

### Calculate the last page

If the dataset changes dynamically, the current page might become invalid. You can clamp the page index to the last valid page:

```
const totalPages = Math.ceil(totalUsers / perPage);
const lastPage = Math.max(0, totalPages - 1);
```

This is particularly important if users can be deleted or data can be fetched asynchronously.

## 8. Complexity

Let \\(n\\) be the total number of users and \\(k\\) be the page size.

- Pagination calculation: `O(1)`.
- `slice()`: `O(k)` time and `O(k)` extra space.
- Rendering: `O(k)` for the visible rows.
- Full dataset storage: `O(n)`.

Client-side pagination improves rendering efficiency because only the current page is rendered. However, all users are still held in memory.

For very large datasets, server-side pagination can fetch only the requested page.

## Interview Takeaways

- Zero-based indexing simplifies pagination calculations.
- `slice(start, end)` excludes `end` and does not mutate the source array.
- Disable navigation at the first and last pages.
- Reset the page when the page size changes.
- Use stable row keys and controlled form inputs.
- Client-side pagination limits rendered rows; it does not reduce the amount of data initially downloaded.
- For production tables, consider loading, empty, error, sorting, filtering, and server-side pagination states.
- 
