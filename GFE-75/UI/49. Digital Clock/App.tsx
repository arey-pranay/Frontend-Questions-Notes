import { useState, useEffect } from "react";
export default function Clock() {
  const [time, setTime] = useState<number>(Date.now());
  useEffect(() => {
    const timerUpdate = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(timerUpdate);
  }, []);
  const readableTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(time);
  const hh = readableTime.split(":")[0];
  const mm = readableTime.split(":")[1];
  const ss = readableTime.split(":")[2];

  // each digit needs 7 segments
  // let's number from 0 to 6
  // 0 top, 1 2 l r, 3 mid, 4 5 l r, 6 bottom
  // every digit can be represented as a string

  return (
    <div
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        width: "20rem",
        display: "flex",
        justifyContent: "center",
        padding: "1rem",
        border: "solid",
        borderWidth: "7px",
        borderColor: "#999999",
        fontSize: "20px",
      }}
    >
      <Digit digit={Number(hh[0])} />
      <Digit digit={Number(hh[1])} />
      <Colon />
      <Digit digit={Number(mm[0])} />
      <Digit digit={Number(mm[1])} />
      <Colon />
      <Digit digit={Number(ss[0])} />
      <Digit digit={Number(ss[1])} />
    </div>
  );
}
function Digit({ digit }: { digit: number }) {
  const digitToString: Record<number, string> = {
    0: "1110111",
    1: "0010010",
    2: "1011101",
    3: "1011011",
    4: "0111010",
    5: "1101011",
    6: "1101111",
    7: "1010010",
    8: "1111111",
    9: "1111011",
  };

  const code: string = digitToString[digit];
  const segments = ["t", "tl", "tr", "m", "bl", "br", "b"];

  const positions = {
    t: { top: 0, left: "25%" },
    tl: { top: "5%", left: 0 },
    tr: { top: "5%", right: 0 },
    m: { top: "47.5%", left: "25%" },
    bl: { bottom: "5%", left: 0 },
    br: { bottom: "5%", right: 0 },
    b: { bottom: 0, left: "25%" },
  };
  return (
    <div
      style={{ position: "relative", width: 60, height: 100, margin: "10px" }}
    >
      {segments.map((s, i) => (
        <div
          key={s}
          style={{
            position: "absolute",
            ...positions[s as keyof typeof positions],
            width: ["t", "m", "b"].includes(s) ? "50%" : "10%",
            height: ["t", "m", "b"].includes(s) ? "6%" : "35%",
            background: code[i] === "1" ? "white" : "black",
          }}
        />
      ))}
    </div>
  );
}
function Colon() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          background: "white",
          borderRadius: "100%",
        }}
      ></div>
      <div
        style={{
          width: "20px",
          height: "20px",
          background: "white",
          borderRadius: "100%",
        }}
      ></div>
    </div>
  );
}
