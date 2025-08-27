import React from "react";

const UserList = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "client" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "client" },
  ];

  return (
    <div className="card bg-white p-4 rounded-xl shadow-md col-span-full">
      <h3 className="text-lg font-bold mb-2">Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id} className="flex justify-between p-2 border-b">
            <span>{u.name}</span>
            <span>{u.email}</span>
            <span className="px-2 py-1 rounded bg-purple-100 text-purple-800">{u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
