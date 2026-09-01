import { useState } from "react";
export default function Accordion() {
  const [isOpen, setIsOpen] = useState([false, false, false]);
  function toggleAccordion(i) {
    setIsOpen((prev) => {
      let arr = [...prev];
      arr[i] = !arr[i];
      return arr;
    });
  }
  return (
    <div>
      <div className="accordion-parent">
        <div onClick={() => toggleAccordion(0)} className="accordion-heading">
          HTML{" "}
          <span
            aria-hidden={true}
            className={`accordion-icon ${isOpen[0] && "accordion-icon--rotated"}`}
          />
        </div>
        <div
          className={`${isOpen[0] ? "accordion-text-open" : "accordion-text-closed"}`}
        >
          The HyperText Markup Language or HTML is the standard markup language
          for documents designed to be displayed in a web browser.
        </div>
      </div>
      <div className="accordion-parent">
        <div onClick={() => toggleAccordion(1)} className="accordion-heading">
          CSS <span aria-hidden={true} 
            className={`accordion-icon ${isOpen[1] && "accordion-icon--rotated"}`}
           />
        </div>
        <div
          className={`${isOpen[1] ? "accordion-text-open" : "accordion-text-closed"}`}
        >
          Cascading Style Sheets is a style sheet language used for describing
          the presentation of a document written in a markup language such as
          HTML or XML.
        </div>
      </div>
      <div className="accordion-parent">
        <div onClick={() => toggleAccordion(2)} className="accordion-heading">
          JavaScript <span aria-hidden={true}
            className={`accordion-icon ${isOpen[2] && "accordion-icon--rotated"}`}
           />
        </div>
        <div
          className={`${isOpen[2] ? "accordion-text-open" : "accordion-text-closed"}`}
        >
          JavaScript, often abbreviated as JS, is a programming language that is
          one of the core technologies of the World Wide Web, alongside HTML and
          CSS.
        </div>
      </div>
    </div>
  );
}
