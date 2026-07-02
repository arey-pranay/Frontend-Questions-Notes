import submitForm from "./submitForm";
import { useState } from "react";
export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  return (
    <form
      action="https://questions.greatfrontend.com/api/questions/contact-form"
      method="POST"
      onSubmit={submitForm}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <label htmlFor="name">name </label>
      <input
        type="text"
        id="name"
        name="name"
        value={form.name}
        onChange={(e) => {
          setForm({
            ...form,
            name: e.target.value,
          });
        }}
      />
      <label htmlFor="email">email </label>
      <input
        type="email"
        id="email"
        name="email"
        value={form.email}
        onChange={(e) => {
          setForm({
            ...form,
            email: e.target.value,
          });
        }}
      />{" "}
      <label htmlFor="message">message </label>
      <textarea
        id="message"
        name="message"
        value={form.message}
        onChange={(e) => {
          setForm({
            ...form,
            message: e.target.value,
          });
        }}
      />
      <button type="submit">Submit!</button>
    </form>
  );
}
