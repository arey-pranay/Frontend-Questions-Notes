## 1. Commented Code 

```
type Video = {
  views: number;
  rank?: number;
};

function videoRanking(videos: Video[]): Video[] {
  // Copy each video and store its original position.
  // This avoids mutating the input objects.
  const sortedVideos = videos.map((video, index) => ({
    ...video,
    originalIndex: index,
  }));

  // Highest views gets the highest rank (rank 1).
  sortedVideos.sort((a, b) => b.views - a.views);

  // Assign ranks based on descending view count.
  sortedVideos.forEach((video, i) => {
    video.rank = i + 1;
  });

  // Restore the original input order.
  sortedVideos.sort((a, b) => a.originalIndex - b.originalIndex);

  // Remove the temporary originalIndex property.
  return sortedVideos.map(({ views, rank }) => ({
    views,
    rank,
  }));
}
```

## 2. Example dry run

Input:

```
[
  { views: 100 },
  { views: 300 },
  { views: 200 },
]
```

After sorting by views descending:

| Original index | Views | Rank |
| -------------- | ----- | ---- |
| 1              | 300   | 1    |
| 2              | 200   | 2    |
| 0              | 100   | 3    |

After restoring original order, the result is:

```
[
  { views: 100, rank: 3 },
  { views: 300, rank: 1 },
  { views: 200, rank: 2 },
]
```

## 3. Important concepts

- Decorate–sort–undecorate: attach `originalIndex`, sort and rank, then restore the original ordering.
- Spread syntax (`...video`): creates a shallow copy instead of modifying the original video object.
- Descending sort: `b.views - a.views` places higher view counts first.
- Stable ordering vs. ranking: equal view counts receive different ranks in your implementation. For example, views `[100, 100, 50]` produce ranks `[1, 2, 3]` in sorted order, with ties determined by stable sorting.
- Non-mutating input: you create new objects and sort the new array, so the original array and its video objects remain unchanged.

### Complexity

- Time: \\(O(n \log n)\\), dominated by the two sorting operations.
- Space: \\(O(n)\\), for the copied array and temporary `originalIndex` values.

## 4. One important question: how should ties work?

Your implementation uses ordinal ranking: every video gets a unique position, even when view counts are equal.

If the expected ranking is instead competition ranking, such as `1, 1, 3`, equal view counts should receive the same rank.

For example:

| Views | Your rank | Competition rank |
| ----- | --------- | ---------------- |
| 300   | 1         | 1                |
| 300   | 2         | 1                |
| 200   | 3         | 3                |
| 100   | 4         | 4                |

Check the problem statement to determine which behavior is required.

### 2-line interview revision

> Attach each item's original index, sort by the ranking metric, assign ranks, then restore original order and remove temporary fields. This is a decorate–sort–undecorate pattern; clarify whether ties require unique ordinal ranks or shared competition ranks.
