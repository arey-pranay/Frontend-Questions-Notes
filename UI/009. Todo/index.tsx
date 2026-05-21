import { useState } from "react";
export default function App() {
  const [todos, setTodos] = useState([
    { id: crypto.randomUUID(), name: "Walk the dog" },
    { id: crypto.randomUUID(), name: "Water the plants" },
    { id: crypto.randomUUID(), name: "Wash the dishes" },
  ]);
  const [todo, setTodo] = useState("");

  const onAdd = () => {
    setTodos((prev) => [
      ...prev,
      {
        name: todo,
        id: crypto.randomUUID(),
      },
    ]);
    setTodo("");
  };

  const onDeleteIndex = (index) => {
    setTodos((prev) => {
      return prev.filter((t, i) => i != index);
    });
  };

  const onDeleteId = (id) => {
    setTodos((prev) => {
      return prev.filter((t) => t.id != id);
    });
  };
  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          type="text"
          placeholder="Add your task"
        />
        <div>
          <button onClick={onAdd}>Submit</button>
        </div>
      </div>
      {todos.map((todo, i) => {
        return <ToDo key={i} index={i} todo={todo} onDelete={onDeleteId} />;
      })}
    </div>
  );
}
const ToDo = ({ index, todo, onDelete }) => {
  return (
    <li>
      <span>
        {index + 1} {""} {todo.name}{" "}
      </span>
      <button
        onClick={() => {
          // onDelete(index);
          onDelete(todo.id);
        }}
      >
        Delete
      </button>
    </li>
  );
};
