import { useState } from "react";
export default function App() {
  const [celsius, setCelsius] = useState(0);
  const [fahrenheit, setFahrenheit] = useState(32);

  function cToF(c) {
    return c * 1.8 + 32;
  }
  function fToC(f) {
    return (f - 32) / 1.8;
  }
  return (
    <div>
      <h1>Temperature Converter</h1>
      <br />
      <label>Celsius</label>
      <input
        style={{
          backgroundColor: "#a122b142",
          margin: "1rem",
          color: "#0A0A0A",
        }}
        type="number"
        value={Math.round(celsius * 10000) / 10000}
        onChange={(e) => {
          setCelsius(e.target.value);
          setFahrenheit(cToF(e.target.value));
        }}
      ></input>
      <br />
      <label>Fahrenheit</label>
      <input
        style={{
          backgroundColor: "#a122b142",
          margin: "1rem",
          color: "#0A0A0A",
        }}
        type="number"
        value={Math.round(fahrenheit * 10000) / 10000}
        onChange={(e) => {
          setFahrenheit(e.target.value);
          setCelsius(fToC(e.target.value));
        }}
      ></input>
    </div>
  );
}
