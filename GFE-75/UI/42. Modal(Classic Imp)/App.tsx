import { useState } from "react";

import ModalDialog from "./ModalDialog";

export default function App() {
  const [title, setTitle] = useState("Modal Dialog");
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <ModalDialog title={title} isOpen={isOpen} setIsOpen={setIsOpen}>
      This is the modal Content
      </ModalDialog>
      One morning, when Gregor Samsa woke from troubled dreams, he found himself
      transformed in his bed into a horrible vermin. He lay on his armour-like
      back, and if he lifted his head a little he could see his brown belly,
      slightly domed and divided by arches into stiff sections. One morning,
      when Gregor Samsa woke from troubled dreams, he found himself transformed
      in his bed into a horrible vermin. He lay on his armour-like back, and if
      he lifted his head a little he could see his brown belly, slightly domed
      and divided by arches into stiff sections. One morning, when Gregor Samsa
      woke from troubled dreams, he found himself transformed in his bed into a
      horrible vermin. He lay on his armour-like back, and if he lifted his head
      a little he could see his brown belly, slightly domed and divided by
      arches into stiff sections. One morning, when Gregor Samsa woke from
      troubled dreams, he found himself transformed in his bed into a horrible
      vermin. He lay on his armour-like back, and if he lifted his head a little
      he could see his brown belly, slightly domed and divided by arches into
      stiff sections.
      <br />
      {!isOpen && <button onClick={() => setIsOpen(true)}>open</button>}
    </div>
  );
}
