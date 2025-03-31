'use client';

import "./AdminActivity.css"; // Assuming you have a CSS file for styling
import { useEffect, useState } from 'react';

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch("/api/admin/activity");
      const data = await res.json();
      setLogs(data);
    }
    fetchLogs();
  }, []);

  return (
    <div className="admin-activity-container">
      <h2>Admin Activity Log</h2>
      
      {logs.length === 0 ? (
        <p>No activity logs available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
