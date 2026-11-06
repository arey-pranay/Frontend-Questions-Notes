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
    <div>
      <p>{formatDuration(currTime)}</p>
      <div>
        <button onClick={start}>Start</button>{" "}
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
