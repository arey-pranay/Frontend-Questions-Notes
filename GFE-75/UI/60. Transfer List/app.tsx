import { useState } from "react";
import "./styles.css";

export default function App() {
  const [list1, setList1] = useState([
    "HTML",
    "JavaScript",
    "CSS",
    "TypeScript",
  ]);

  const [list2, setList2] = useState(["React", "Angular", "Vue", "Svelte"]);

  const [l1Selected, setL1Selected] = useState<string[]>([]);
  const [l2Selected, setL2Selected] = useState<string[]>([]);

  // Common selection logic
  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((el) => el !== item) : [...prev, item],
    );
  };

  // Common move logic
  const moveItems = (
    items: string[],
    setFrom: React.Dispatch<React.SetStateAction<string[]>>,
    setTo: React.Dispatch<React.SetStateAction<string[]>>,
    clearSelection: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setFrom((prev) => prev.filter((el) => !items.includes(el)));
    setTo((prev) => [...prev, ...items]);
    clearSelection([]);
  };

  // Common list rendering
  const renderList = (
    list: string[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
    listLabel: string,
  ) => (
    <div className="list" role="group" aria-label={listLabel}>
      {list.map((item) => (
        <label key={item}>
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() => toggleSelection(item, selected, setSelected)}
          />
          {item}
        </label>
      ))}
    </div>
  );

  return (
    <div className="container">
      <div className="transfer-wrapper">
        {renderList(list1, l1Selected, setL1Selected, "Technology list 1")}

        <div className="actions">
          <button
            aria-label="Move all technologies to the left"
            disabled={!list2.length}
            onClick={() => moveItems(list2, setList2, setList1, setL2Selected)}
          >
            {"<<"}
          </button>

          <button
            aria-label="Move selected technologies to the left"
            disabled={!l2Selected.length || !!l1Selected.length}
            onClick={() =>
              moveItems(l2Selected, setList2, setList1, setL2Selected)
            }
          >
            {"<"}
          </button>

          <button
            aria-label="Move selected technologies to the right"
            disabled={!l1Selected.length || !!l2Selected.length}
            onClick={() =>
              moveItems(l1Selected, setList1, setList2, setL1Selected)
            }
          >
            {">"}
          </button>

          <button
            aria-label="Move all technologies to the right"
            disabled={!list1.length}
            onClick={() => moveItems(list1, setList1, setList2, setL1Selected)}
          >
            {">>"}
          </button>
        </div>

        {renderList(list2, l2Selected, setL2Selected, "Technology list 2")}
      </div>
    </div>
  );
}
