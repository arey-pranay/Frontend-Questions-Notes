import { useState, useEffect } from "react";
export default function TrafficLight() {
  type t_lightColor = "red" | "yellow" | "green";
  type t_lightConfig = { color: t_lightColor; duration: number };
  const lights: t_lightConfig[] = [
    //increased the duration so that the timer is more useful etc. kept ratio same
    { color: "green", duration: 4500 },
    { color: "yellow", duration: 750 },
    { color: "red", duration: 6000 },
  ];
  const [active, setActive] = useState<t_lightConfig>(lights[0]);
  const [timeLeft, setTimeLeft] = useState(lights[0].duration);
  useEffect(() => {
    const endTime = Date.now() + active.duration;

    setTimeLeft(active.duration);

    const timer = setTimeout(() => {
      const nextIndex =
        (lights.findIndex((light) => light.color === active.color) + 1) %
        lights.length;
      setActive(lights[nextIndex]);
    }, active.duration);

    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, endTime - Date.now()));
    }, 1);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [active]);

  return (
    <div
      style={{
        width: "full",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "75px",
          height: "75px",
          borderRadius: "75px",
          backgroundColor: active.color,
        }}
      />
      <h1>Color : {active.color}</h1>
      <h3>
        Time Left <br />
        {Math.floor(timeLeft / 1000)}. {timeLeft % 1000} sec
      </h3>
    </div>
  );
}
