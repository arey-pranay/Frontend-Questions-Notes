import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const array = new Array(count).fill(0);
  return (
    <div>
      {array.map((a, i) => (
        <ProgressBar key={i} />
      ))}
      <button onClick={() => setCount((prev) => prev + 1)}>Add</button>
    </div>
  );
}

function ProgressBar() {
  const [fillPercent, setFillPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFillPercent((prev) => prev + 10);
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div
        style={{
          borderRadius: "10px",
          width: "400px",
          height: "10px",
          backgroundColor: "gray",
          margin: "10px",
        }}
      >
        <div
          style={{
            borderRadius: "10px",
            width: `${Math.min(100, fillPercent)}%`,
            height: "10px",
            backgroundColor: "green",
          }}
        ></div>
      </div>
    </>
  );
}





// Dynamic timer based on index (speed)
// import { useState, useEffect } from "react";

// export default function App() {
//   const [count, setCount] = useState(0);
//   const array = new Array(count).fill(0);
//   return (
//     <div>
//       {array.map((a, i) => (
//         <ProgressBar key={i} updateInterval={i * 100} />
//       ))}
//       <button onClick={() => setCount((prev) => prev + 1)}>Add</button>
//     </div>
//   );
// }

// function ProgressBar({ updateInterval }) {
//   const [fillPercent, setFillPercent] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setFillPercent((prev) => prev + 10);
//     }, updateInterval);
//     return () => clearInterval(interval);
//   }, []);
//   return (
//     <>
//       <div
//         style={{
//           borderRadius: "10px",
//           width: "400px",
//           height: "10px",
//           backgroundColor: "gray",
//           margin: "10px",
//         }}
//       >
//         <div
//           style={{
//             borderRadius: "10px",
//             width: `${Math.min(100, fillPercent)}%`,
//             height: "10px",
//             backgroundColor: "green",
//           }}
//         ></div>
//       </div>
//     </>
//   );
// }

