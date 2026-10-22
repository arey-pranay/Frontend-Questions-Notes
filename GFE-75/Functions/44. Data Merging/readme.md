## 1. Intuition

The goal is to merge sessions belonging to the same user into one record.

For each user:

- `duration`: sum the durations across all their sessions.
- `equipment`: combine all equipment names, remove duplicates, and sort alphabetically.
- `user`: retain the user's ID.

A `Map<number, Session>` works well because each user ID becomes a unique key, and the map preserves the order in which users first appear.

## 2. Your code with comments

```

type Session = {
  user: number;
  duration: number;
  equipment: Array<string>;
};

export default function mergeData(
  sessions: Array<Session>,
): Array<Session> {
  // Store one merged session per unique user ID.
  const map = new Map<number, Session>();

  for (const session of sessions) {
    if (map.has(session.user)) {
      // Retrieve the existing merged record for this user.
      const existing = map.get(session.user)!;

      // Accumulate the duration.
      existing.duration += session.duration;

      // Add equipment only if it hasn't been seen for this user.
      for (const item of session.equipment) {
        if (!existing.equipment.includes(item)) {
          existing.equipment.push(item);
        }
      }

      // Keep equipment in alphabetical order.
      existing.equipment.sort();
    } else {
      // First session for this user: create a new merged record.
      // Copy the array so we don't sort or modify the input array.
      map.set(session.user, {
        user: session.user,
        duration: session.duration,
        equipment: [...session.equipment].sort(),
      });
    }
  }

  // Convert the map's values into the required output array.
  return Array.from(map.values());
}

```

## 3. Dry run

Input:

```
[
  { user: 1, duration: 30, equipment: ["Bike", "Mat"] },
  { user: 2, duration: 20, equipment: ["Dumbbell"] },
  { user: 1, duration: 45, equipment: ["Mat", "Treadmill"] }
]
```

Session 1

User `1` is new, so create a record.

Duration: 30 · Equipment: Bike, Mat

Session 2

User `2` is new, so create another record.

Duration: 20 · Equipment: Dumbbell

Session 3

User `1` already exists. Add `45` to the duration and merge the equipment, ignoring the duplicate `"Mat"`.

Duration: 30 + 45 = 75 · Equipment: Bike, Mat, Treadmill

Output:

```
[
  { user: 1, duration: 75, equipment: ["Bike", "Mat", "Treadmill"] },
  { user: 2, duration: 20, equipment: ["Dumbbell"] }
]
```

## 4. Important JavaScript and TypeScript concepts

### `Map` and object references

`map.get(session.user)` returns a reference to the existing object, not a copy. Therefore:

```
existing.duration += session.duration;
```

updates the object stored inside the map directly. You don't need to call `map.set()` again.

`Array.from(map.values())` returns a new array containing those same object references.

### Why use `!` after `map.get()`?

```
const existing = map.get(session.user)!;
```

TypeScript knows that `Map.get()` can return `undefined`, even after `map.has()`. The `!` is the non-null assertion operator: it tells TypeScript that the value is not `null` or `undefined`.

Here, the assertion is safe because the preceding `map.has(session.user)` check confirms that the key exists, assuming the map isn't modified between those operations.

### Why `[...session.equipment].sort()`?

`sort()` mutates the array it is called on.

```
session.equipment.sort();       // Mutates the input array.
[...session.equipment].sort();  // Sorts a copy instead.
```

Your code correctly copies the equipment array when creating a new record, so it doesn't mutate the original session's equipment array.

### Why use `includes()`?

```
if (!existing.equipment.includes(item)) {
  existing.equipment.push(item);
}
```

This prevents duplicate equipment names. String comparison is exact and case-sensitive, so `"Bike"` and `"bike"` count as different items.

## 5. Complexity analysis

Let:

- \\(n\\) = number of sessions
- \\(m\\) = maximum number of equipment items in a session
- \\(u\\) = number of unique users
- \\(k\\) = maximum number of unique equipment items for one user

| Operation                                   | Complexity                              |
| ------------------------------------------- | --------------------------------------- |
| Map lookup/insertion                        | \\(O(1)\\) average                      |
| `includes()` per equipment item             | \\(O(k)\\)                              |
| Sorting equipment after each merged session | \\(O(k\log k)\\)                        |
| Overall time                                | \\(O(nm(k+\log k))\\) upper-bound style |
| Auxiliary space                             | \\(O(uk)\\)                             |

The time bound is deliberately conservative: the actual cost depends on how many equipment items each session contains and how often each user's equipment list is sorted. The output storage is also \\(O(uk)\\).

Possible optimization: use a `Set<string>` per user to deduplicate equipment in average \\(O(1)\\) per insertion, then sort each user's equipment once at the end. Your current solution is perfectly reasonable when equipment lists are small.

## 6. Interview revision — 2-liner

Use a `Map` keyed by user ID to aggregate durations and merge unique equipment; `Map` preserves first-seen user order. Copy input equipment arrays, deduplicate with `includes()` and sort alphabetically; for larger datasets, use a `Set` and sort once at the end.
