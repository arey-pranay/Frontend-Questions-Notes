# Tic-Tac-Toe — GFE Interview Notes

## 1. Mental Model

This is a two-player Tic-Tac-Toe game implemented using React state and component composition.

- Player A places `O`.
- Player B places `X`.
- Players alternate turns.
- A player wins by completing a row, column, or diagonal.
- If all nine cells are filled without a winner, the game is a draw.
- After a win or draw, the board resets after two seconds.

The main concepts are 2D array state, immutable updates, game logic, derived conditions, component composition, and asynchronous state updates.

## 2. State Management

```
const [isAPlaying, setIsAPlaying] = useState(true);
const initialBoard = [
  [" ", " ", " "],
  [" ", " ", " "],
  [" ", " ", " "],
];
const [board, setBoard] = useState<Array<Array<string>>>(initialBoard);
const [chances, setChances] = useState(0);
const [alert, setAlert] = useState("");
```

| State        | Purpose                                         |
| ------------ | ----------------------------------------------- |
| `isAPlaying` | Determines whose turn it is                     |
| `board`      | Stores the 3 × 3 game state                     |
| `chances`    | Counts the number of successful moves           |
| `alert`      | Displays invalid move, winner, or draw messages |

### 2D Array Representation

The board is represented as a matrix:

```
[
  ["O", "X", " "],
  [" ", "O", " "],
  ["X", " ", "O"],
]
```

Accessing a cell:

```
board[i][j]
```

- `i` represents the row.
- `j` represents the column.

This makes checking rows, columns, and diagonals straightforward.

## 3. Handling a Move

```
function updateBoard(i: number, j: number): void {
  if (board[i][j] != " ") {
    setAlert("invalid move");
    return;
  }

  setChances((prev) => prev + 1);

  const newBoard = board;
  const token = isAPlaying ? "O" : "X";

  newBoard[i][j] = token;
  setBoard(newBoard);
  setIsAPlaying((prev) => !prev);

  if (checkWin(i, j, token)) {
    gameOver(token + " won the game");
    return;
  }

  if (chances == 8) gameOver("Oops, both of you are equally good");
}
```

### Execution flow

1. Validate whether the selected cell is empty.
2. Determine the current player's token.
3. Place the token in the selected cell.
4. Update the board.
5. Switch the active player.
6. Check whether the move resulted in a win.
7. If there is no winner and this was the ninth move, declare a draw.

### Important bug: Mutating React state

Your code:

```
const newBoard = board;
newBoard[i][j] = token;
setBoard(newBoard);
```

This does not create a new board. It creates another reference to the same array.

Consequently, you're directly mutating React state. React may not detect the change because the reference remains identical.

Correct immutable update:

```
const newBoard = board.map((row, rowIndex) =>
  rowIndex === i
    ? row.map((cell, colIndex) => (colIndex === j ? token : cell))
    : row
);

setBoard(newBoard);
```

This creates:

- A new outer array.
- A new array for the modified row.
- Unchanged references for the other rows.

This is called a shallow immutable update with structural sharing.

## 4. Win Detection

Your implementation checks only the row, column, and diagonals passing through the most recently placed cell.

This is an optimization: you don't need to check every possible winning combination after every move.

### A. Row check

```
function checkRow(i: number, j: number, token: string): boolean {
  return board[i].every((cell) => cell === token);
}
```

`every()` returns `true` only when all cells in the selected row match the player's token.

### B. Column check

```
function checkCol(i: number, j: number, token: string): boolean {
  return board.every((row) => row[j] === token);
}
```

Iterates through every row and checks the same column index.

### C. Diagonal check

```
function checkDiag(i: number, j: number, token: string): boolean {
  const mainDiag = board.every((row, index) => row[index] === token);
  const antiDiag = board.every((row, index) => row[2 - index] === token);

  return mainDiag || antiDiag;
}
```

For a 3 × 3 board:

Main diagonal

Indices: (0,0), (1,1), (2,2)

Anti-diagonal

Indices: (0,2), (1,1), (2,0)

Important optimization: Your current `checkDiag()` checks both diagonals regardless of where the move occurred. You can avoid unnecessary checks:

```
const mainDiag =
  i === j && board.every((row, index) => row[index] === token);

const antiDiag =
  i + j === 2 &&
  board.every((row, index) => row[2 - index] === token);

return mainDiag || antiDiag;
```

A move outside both diagonals cannot possibly complete either diagonal.

## 5. Game Over and Asynchronous Updates

```
function gameOver(message: string) {
  setAlert(message);

  setTimeout(() => {
    setBoard(initialBoard);
    setChances(0);
    setAlert("");
  }, 2000);
}
```

- Displays the result.
- Waits two seconds.
- Resets the board and move counter.
- Clears the message.

### Important React concept: State updates are not immediate

You have:

```
setChances((prev) => prev + 1);

if (chances == 8) {
  gameOver("Oops, both of you are equally good");
}
```

Why does this work?

React state updates are scheduled. The `chances` variable inside the current event handler still holds its previous render's value.

Since `chances` starts at zero, the ninth successful move enters the handler with `chances === 8`.

However, this is easy to misunderstand and can introduce off-by-one errors.

A clearer approach is:

```
if (chances === 8) {
  gameOver("It's a draw!");
}
```

This works with your existing counter logic, but a more robust approach is to derive the draw condition from the updated board:

```
const isDraw = newBoard.every((row) =>
  row.every((cell) => cell !== " ")
);
```

This avoids maintaining a separate move counter entirely.

## 6. Component Composition

Your UI has three levels:

App

Owns board state and game logic

Row

Renders one row of cells

Cell

Renders an individual clickable button

### Data flows down, events flow up

```
<Row update={updateBoard} cells={row} row={i} />
```

`App` passes:

- The row's cell data.
- The row index.
- A callback for updating the board.

`Row` passes the callback and coordinates to each `Cell`.

```
onClick={() => update(row, col)}
```

The child doesn't directly modify the parent's state. It invokes a callback, and the parent handles the update.

This is the unidirectional data flow pattern in React.

### Missing React keys

Your current code:

```
{board.map((row, i) => (
  <Row update={updateBoard} cells={row} row={i} />
))}
```

And:

```
{cells.map((val, i) => (
  <Cell update={update} val={val} row={row} col={i} />
))}
```

Add keys:

```
<Row key={i} ... />
<Cell key={i} ... />
```

For this fixed-size board, indices are acceptable because rows and columns never reorder or get independently inserted or removed.

## 7. Important Improvements

| Issue                                    | Improvement                                        |
| ---------------------------------------- | -------------------------------------------------- |
| `initialBoard` declared inside component | Move it outside to avoid recreating it             |
| Direct board mutation                    | Use immutable array updates                        |
| `!=` comparisons                         | Prefer `!==`                                       |
| Missing React keys                       | Add keys to Row and Cell                           |
| No game-over guard                       | Prevent moves while the result is displayed        |
| Timeout not cleaned up                   | Store timeout ID and clear it when appropriate     |
| Unused `message`, `setMessage`           | Remove them                                        |
| `checkDiag` checks both diagonals        | Check only the diagonal containing the latest move |

One particularly important bug: After a win, the board remains clickable for two seconds. A user could make another move before the reset. Add a `gameOver` state or use the result message as a guard:

```
if (alert) return;
```

A dedicated `gameOver` boolean is cleaner because the alert message is presentation state, not game state.

Also, if the component unmounts during the two-second delay, the timeout should be cleared to avoid a delayed state update.

## 8. Complexity

For a fixed 3 × 3 board:

| Operation              | Complexity |
| ---------------------- | ---------- |
| Cell lookup            | O(1)       |
| Immutable board update | O(9)       |
| Row validation         | O(3)       |
| Column validation      | O(3)       |
| Diagonal validation    | O(3)       |
| Rendering              | O(9)       |

For an \\(N \times N\\) generalized board:

- Board update: `O(N²)` with the current full-copy approach.
- Win detection: `O(N)` for the relevant row, column, and diagonals.
- Rendering: `O(N²)`.

## Interview Takeaways

1. 2D arrays: Useful for representing grid-based games and matrix problems.
2. Immutable updates: Never mutate nested React state directly; create new references along the modified path.
3. `every()`: Checks whether all elements satisfy a condition.
4. Game logic optimization: Only check winning combinations that intersect the latest move.
5. State batching: React schedules state updates; variables in the current handler don't immediately change.
6. Component composition: Break a complex UI into smaller components with clear responsibilities.
7. Callback props: Allow child components to communicate user interactions to parent components.
8. Derived state: Prefer calculating draw conditions from the board instead of maintaining redundant counters.
9. Timer cleanup: Clear pending timeouts when the component unmounts or the timer is no longer needed.
