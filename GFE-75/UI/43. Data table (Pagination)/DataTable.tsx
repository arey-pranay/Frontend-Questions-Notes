import { useState } from "react";
import users from "./data/users";

export default function DataTable() {
  const [pageNum, setPageNum] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const totalUsers = users.length;
  const begin = pageNum * perPage;
  const filteredUsers = users.slice(begin, begin + perPage);
  return (
    <div>
      <table>
        <thead>
          <tr>
            {[
              { label: "ID", key: "id" },
              { label: "Name", key: "name" },
              { label: "Age", key: "age" },
              { label: "Occupation", key: "occupation" },
            ].map(({ label, key }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(({ id, name, age, occupation }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{name}</td>
              <td>{age}</td>
              <td>{occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          width: "90%",
          display: "flex",
          justifyContent: "space-betweens",
          backgroundColor: "gray",
          padding: "10px",
        }}
      >
        <button
          disabled={pageNum == 0}
          onClick={() => setPageNum((prev) => prev - 1)}
        >
          Prev
        </button>
        <select
          value={perPage}
          onChange={(e) => {
            setPageNum(0);
            setPerPage(Number(e.target.value));
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={35}>35</option>
        </select>
        <button
          disabled={begin + perPage >= totalUsers}
          onClick={() => setPageNum((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
