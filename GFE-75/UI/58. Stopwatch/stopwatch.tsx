import { useState, useEffect } from "react";

export default function Stopwatch() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currTime, setCurrTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setCurrTime(performance.now() - startTime!);
    }, 10);

    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);

  function start() {
    if (!isRunning) {
      setStartTime(performance.now() - currTime);
      setIsRunning(true);
    }
  }

  function reset() {
    setIsRunning(false);
    setStartTime(null);
    setCurrTime(0);
  }

  function formatDuration(ms: number): string {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "#1e293b",
        color: "white",
        width: "fit-content",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <p
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          fontVariantNumeric: "tabular-nums",
          margin: 0,
        }}
      >
        {formatDuration(currTime)}
      </p>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={start}
          disabled={isRunning}
          style={{
            padding: "10px 24px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {isRunning ? "Running" : "Start"}
        </button>

        <button
          onClick={reset}
          style={{
            padding: "10px 24px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
