import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("Hello World!");
  const [isAPlaying, setIsAPlaying] = useState(true);
  const initialBoard = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];
  const [board, setBoard] = useState<Array<Array<string>>>(initialBoard);
  const [chances, setChances] = useState(0);
  const [alert, setAlert] = useState("");
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
  function checkWin(i: number, j: number, token: string) {
    return (
      checkRow(i, j, token) || checkCol(i, j, token) || checkDiag(i, j, token)
    );
  }
  function checkRow(i: number, j: number, token: string): boolean {
    return board[i].every((cell) => cell === token);
  }

  function checkCol(i: number, j: number, token: string): boolean {
    return board.every((row) => row[j] === token);
  }

  function checkDiag(i: number, j: number, token: string): boolean {
    const mainDiag = board.every((row, index) => row[index] === token);
    const antiDiag = board.every((row, index) => row[2 - index] === token);
    return mainDiag || antiDiag;
  }

  function gameOver(message: string) {
    setAlert(message);
    setTimeout(() => {
      setBoard(initialBoard);
      setChances(0);
      setAlert("");
    }, 2000);
  }

  return (
    <div
      style={{
        // display: "grid",
        // justifyContent: "center",
        padding: "7rem",
        height: "100%",
        gap: 0,
        background: "#eeeeee",
      }}
    >
      {board.map((row, i) => (
        <Row update={updateBoard} cells={row} row={i} />
      ))}
      {alert && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 18px",
            backgroundColor: "#90f9ed",
            color: "#004588",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {alert}
          <br />
          Resetting the Board...
        </div>
      )}{" "}
    </div>
  );
}
function Row({
  update,
  cells,
  row,
}: {
  update: (i: number, j: number) => void;
  cells: Array<string>;
  row: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        margin: "auto",
      }}
    >
      {cells.map((val, i) => (
        <Cell update={update} val={val} row={row} col={i} />
      ))}
      <br />
    </div>
  );
}
function Cell({
  update,
  val,
  row,
  col,
}: {
  update: (i: number, j: number) => void;
  val: string;
  row: number;
  col: number;
}) {
  return (
    <button
      style={{
        width: "90px",
        height: "90px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        backgroundColor: val == " " ? "#ffffff" : "#454545",
        color: val === " " ? "#000000" : val === "X" ? "#2563eb" : "#e11d48",
        fontSize: "36px",
        fontWeight: "600",
        cursor: val == " " ? "pointer" : "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease",
        boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
      }}
      onClick={() => update(row, col)}
      disabled={val != " "}
    >
      {" "}
      {val}
    </button>
  );
}
