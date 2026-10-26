## 1. Intuition — what `mapAsyncLimit` should do

`mapAsyncLimit` is an asynchronous version of `map()` that limits how many promises are running at the same time.

For example, suppose you have 5 URLs to fetch and a concurrency limit of `2`. Instead of starting all 5 requests simultaneously, it should:

1. Start requests 1 and 2.
2. When either request finishes, start request 3.
3. When another finishes, start request 4.
4. Continue until every item is processed.

The important distinction is that the limit controls concurrent operations, not the total number of operations.

Your current implementation processes items sequentially, one at a time. It also doesn't use the `size` parameter, and it appends results in completion order rather than guaranteeing input order.

## 2. Issues in your implementation

### Issue 1: `size` is never used

```
size?: number
```

You accept a concurrency limit but never read it. Your implementation only runs one callback at a time.

### Issue 2: The base case doesn't stop execution

```
if (index === iterable.length) resolve(results);
```

Calling `resolve()` settles the outer promise, but it doesn't stop the current function. Execution continues into:

```
return callbackFn(iterable[index]);
```

At this point, `iterable[index]` is `undefined`. You need a `return` in the base case if using recursion.

### Issue 3: Results are pushed in completion order

```
results.push(result);
```

With concurrent operations, a later input might finish first. To preserve normal `map()` behavior, store each result at its original index:

```
results[index] = result;
```

### Issue 4: The recursive promise chain isn't awaited

```
.then((result) => {
  results.push(result);
  processItem(index + 1);
})
```

The callback returns nothing from the `.then()` handler, so the current promise chain doesn't wait for the recursive call to finish. This can cause the returned promise to settle before all items are processed.

## 3. Correct implementation — worker pool

A worker pool is a clean way to solve this: create a limited number of workers, and let each worker claim the next available index.

```

export default async function mapAsyncLimit<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
  size = 1,
): Promise<Array<U>> {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("size must be a positive integer");
  }

  const results: Array<U> = new Array(iterable.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < iterable.length) {
      // Claim an index before awaiting, so workers process
      // different items.
      const index = nextIndex++;

      // Store by input index to preserve map() ordering.
      results[index] = await callbackFn(iterable[index]);
    }
  }

  // Never create more workers than there are items.
  const workerCount = Math.min(size, iterable.length);

  // Wait until every worker finishes; rejection propagates.
  await Promise.all(
    Array.from({ length: workerCount }, () => worker()),
  );

  return results;
}

```

## 4. How the worker pool works

Suppose the input has 5 items and `size = 2`.

Worker 1

Concurrent

Item 0

Item 2

Item 4

Worker 2

Concurrent

Item 1

Item 3

Each worker claims the next index only after its previous callback settles. At most 2 callbacks are in progress at once.

The key is this line:

```
const index = nextIndex++;
```

JavaScript runs this increment synchronously before the worker reaches `await`. Since each worker claims its index before yielding, two workers won't claim the same item.

And this line:

```
results[index] = await callbackFn(iterable[index]);
```

stores the result in the correct position even if items finish out of order.

## 5. Important edge cases

- Empty array: `workerCount` is `0`, `Promise.all([])` resolves immediately, and the result is `[]`.
- Rejected callback: the returned promise rejects. Other callbacks already running are not automatically cancelled.
- Synchronous exception: if `callbackFn` throws instead of returning a promise, the async worker rejects too.
- Invalid limit: this implementation rejects limits that are not positive integers.
- Input mutation: the input array isn't modified, though `callbackFn` can still mutate individual items.

### Complexity

- Time: depends on the callback durations and concurrency; for similarly timed operations, approximately \\(O(n/s)\\) batches of work, where \\(s\\) is the concurrency limit.
- Space: \\(O(n+s)\\) including the result array and worker promises, with at most \\(s\\) active workers.

## 6. Interview revision — 2-liner

Use a fixed-size worker pool sharing a `nextIndex` counter; each worker claims an item, awaits its callback, and continues until all items are processed. Store results by original index to preserve `map()` ordering, and use `Promise.all()` to wait for workers and propagate failures.
