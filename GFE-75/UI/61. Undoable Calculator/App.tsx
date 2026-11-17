import { useState } from "react";
type T_ops = "/2" | "-1" | "+1" | "*2";
type T_buttonData<T, X> = {
  name: T;
  onClick: () => X;
  disable?: boolean;
};
type T_stackElement = { op: T_ops; old: number; new: number };
export default function App() {
  const [currNum, setCurrNum] = useState(0);
  const getNewStack = () => new Stack<T_stackElement>();
  const [history, setHistory] = useState(getNewStack());
  const [future, setFuture] = useState(getNewStack());
  const move = (
    src: Stack<T_stackElement>,
    dest: Stack<T_stackElement>,
    isUndo: boolean,
  ) => {
    if (src.isEmpty()) return;
    const op = src.pop()!;
    dest.push(op);
    setHistory(Object.assign(getNewStack(), { items: [...history.items] }));
    setFuture(Object.assign(getNewStack(), { items: [...future.items] }));
    setCurrNum(isUndo ? op.old : op.new);
  };
  const undo = () => move(history, future, true);
  const redo = () => move(future, history, false);

  const reset = () => {
    setHistory(getNewStack());
    setFuture(getNewStack());
    setCurrNum(0);
  };
  const commandButtons: Array<T_buttonData<string, void>> = [
    { name: "Undo", onClick: undo, disable: history.isEmpty() },
    { name: "Redo", onClick: redo, disable: future.isEmpty() },
    { name: "Reset", onClick: reset, disable: false },
  ];
  const opsButtons: Array<T_buttonData<T_ops, number>> = [
    { name: "/2", onClick: () => currNum / 2 },
    { name: "-1", onClick: () => currNum - 1 },
    { name: "+1", onClick: () => currNum + 1 },
    { name: "*2", onClick: () => currNum * 2 },
  ];
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.display}>{currNum}</div>

        <div style={styles.commandContainer}>
          {commandButtons.map((btn) => (
            <button
              key={btn.name}
              disabled={btn.disable!}
              onClick={btn.onClick}
              style={{
                ...styles.commandButton,
                background: btn.disable ? "#e2e8f0" : "#334155",
                color: btn.disable ? "#94a3b8" : "white",
                cursor: btn.disable ? "not-allowed" : "pointer",
              }}
            >
              {btn.name}
            </button>
          ))}
        </div>

        <div style={styles.operationContainer}>
          {opsButtons.map((btn) => (
            <button
              key={btn.name}
              onClick={() => {
                const newVal = btn.onClick();
                history.push({ op: btn.name, old: currNum, new: newVal });
                setCurrNum(newVal);
                setFuture(getNewStack());
              }}
              style={styles.operationButton}
            >
              {btn.name}
            </button>
          ))}
        </div>

        <h3 style={styles.heading}>Operation History</h3>

        <div style={styles.historyContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                {["Operation", "Old", "New"].map((heading) => (
                  <th key={heading} style={styles.tableCell}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {history.items.map((row, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ ...styles.tableCell, fontWeight: "600" }}>
                    {row.op}
                  </td>
                  <td style={{ ...styles.tableCell, color: "#64748b" }}>
                    {row.old}
                  </td>
                  <td
                    style={{
                      ...styles.tableCell,
                      color: "#059669",
                      fontWeight: "600",
                    }}
                  >
                    {row.new}
                  </td>
                </tr>
              ))}

              {history.isEmpty() && (
                <tr>
                  <td colSpan={3} style={styles.emptyMessage}>
                    No operations yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



// --------           ---------------             ---------  //

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
    padding: "20px",
  },
  card: {
    background: "white",
    width: "100%",
    maxWidth: "420px",
    padding: "28px",
    borderRadius: "20px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },
  display: {
    background: "#0f172a",
    color: "#38bdf8",
    padding: "25px",
    borderRadius: "14px",
    textAlign: "center",
    fontSize: "42px",
    fontWeight: "bold",
    marginBottom: "22px",
  },
  commandContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  commandButton: {
    flex: 1,
    padding: "11px",
    border: "none",
    borderRadius: "9px",
    fontWeight: "600",
  },
  operationContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginBottom: "25px",
  },
  operationButton: {
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    background: "#e0f2fe",
    color: "#0369a1",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  heading: {
    color: "#334155",
    fontSize: "16px",
  },
  historyContainer: {
    maxHeight: "200px",
    overflowY: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    fontSize: "14px",
  },
  tableHeader: {
    background: "#f1f5f9",
    color: "#475569",
  },
  tableCell: {
    padding: "12px",
  },
  emptyMessage: {
    padding: "20px",
    color: "#94a3b8",
  },
};

class Stack<T> {
  public items: T[] = [];
  push(element: T): void {
    this.items.push(element);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  size(): number {
    return this.items.length;
  }
  clear(): void {
    this.items = [];
  }
}
