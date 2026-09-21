import { useState } from "react";

const tabs = {
  HTML: {
    label: "HTML",
    content:
      "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.",
  },
  CSS: {
    label: "CSS",
    content:
      "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.",
  },
  JS: {
    label: "JavaScript",
    content:
      "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.",
  },
};

export default function Tabs() {
  const [tab, setTab] = useState("");

  return (
    <div>
      <div>
        {Object.entries(tabs).map(([key, value]) => (
          <button
            key={key}
            className={tab === key ? "selected" : ""}
            onClick={() => setTab(key)}
          >
            {value.label}
          </button>
        ))}
      </div>
      <div>
        <p>{tabs[tab]?.content || "Invalid Tab, hehe"}</p>
      </div>
    </div>
  );

}
