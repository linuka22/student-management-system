"use client";

import { useEffect, useState } from "react";

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/admin/activity");
      const data = await res.json();
      setLogs(data);
    };

    fetchLogs();
  }, []);

  return (
    <div className="activity-container">
      <h2>Admin Activity</h2>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>
            {log.action} - {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
