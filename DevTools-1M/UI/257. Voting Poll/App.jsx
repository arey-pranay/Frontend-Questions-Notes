import { OPTIONS } from "./constants";
import { useState } from "react";
const OPTIONS = [
    { id: 1, label: "React", color: "#61DBFB" },
    { id: 2, label: "Angular", color: "#b52e31" },
    { id: 3, label: "Vue", color: "#41B883" },
    { id: 4, label: "Svelte", color: "#FF3E00" },
];

export default function App() {
    // const [percentages, setPercentages]=useState(OPTIONS.map((option) =>  ({[option.label] : 0}))); // This is wrong because this places all key-value pairs on different indices of an array
    const [percentages, setPercentages] = useState(() => {
        const res = {};
        for (const option of OPTIONS) {
            res[option.label] = 0;
        }
        return res;
    });

    const [totalVotes, setTotalVotes] = useState(0);
    const handleVote = (label) => {
        setPercentages((prev) => ({
            ...prev,
            [label]: prev[label] + 1,
        }));
        setTotalVotes((prev) => prev + 1);
    };

    return (
        <main>
            <div>
                {OPTIONS.map((option) => {
                    return (
                        <div
                            key={option.id}
                            style={{
                                color: option.color,
                                display: "flex",
                                alignItems: "center",
                            }}
                            className=""
                        >
                            <label htmlFor={option.label}>
                                <input
                                    type="radio"
                                    id={option.label}
                                    value={option.label}
                                    name="option"
                                    onChange={(e) => handleVote(e.target.value)}
                                />
                                {option.label}
                            </label>
                            <div
                                style={{
                                    width: "24px",
                                    height: "10px",
                                    borderRadius: "4px",
                                    backgroundColor: "#FCFCFC",
                                }}
                            >
                                {" "}
                            </div>
                            <div
                                style={{
                                    height: "10px",
                                    width: "100%",
                                    backgroundColor: "#e0e0e0",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        width: `${((percentages[option.label] / (totalVotes == 0 ? 1 : totalVotes)) * 100).toFixed(2)}%`,
                                        backgroundColor: option.color,
                                        transition: "width 0.3s ease",
                                    }}
                                />
                            </div>
                            <p style={{ marginLeft: "12px" }}>
                                {" "}
                                {(
                                    (percentages[option.label] /
                                        (totalVotes == 0 ? 1 : totalVotes)) *
                                    100
                                ).toFixed(2)}{" "}
                                %
                            </p>
                        </div>
                    );
                })}
                <br />
                Total Votes: {totalVotes}
            </div>
        </main>
    );
}
