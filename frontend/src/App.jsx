import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('bank');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState(null);

  // Helper: calculate SHA256 hex digest
  async function sha256Hex(buffer) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Helper: convert ArrayBuffer to base64
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // 1. Read file as ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
      const base64Content = arrayBufferToBase64(fileBuffer);
      const sha256 = await sha256Hex(fileBuffer);

      // 2. Upload file via JSON-RPC
      const uploadPayload = {
        jsonrpc: "2.0",
        method: "upload_file",
        params: {
          filename: file.name,
          content: base64Content,
          conflict: 'replace', // or 'skip' based on your logic
          metadata: { sha256 }
        },
        id: 1,
      };

      const uploadRes = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadPayload),
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || uploadData.error) {
        throw new Error(uploadData.error?.message || 'Upload failed');
      }
      const filename = uploadData.result?.filename || file.name;

      // 3. Process file via JSON-RPC
      const processPayload = {
        jsonrpc: "2.0",
        method: "process_file",
        params: { filename, type },
        id: 1,
      };
      const processRes = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processPayload),
      });
      const processData = await processRes.json();
      if (!processRes.ok || processData.error) {
        throw new Error(processData.error?.message || 'Processing failed');
      }
      setResult(processData.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to sort array of objects
  function getSortedRows(rows, config) {
    if (!config) return rows;
    const { key, direction } = config;
    return [...rows].sort((a, b) => {
      if (a[key] === b[key]) return 0;
      if (a[key] == null) return 1;
      if (b[key] == null) return -1;
      if (typeof a[key] === "number" && typeof b[key] === "number") {
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      }
      return direction === "asc"
        ? String(a[key]).localeCompare(String(b[key]))
        : String(b[key]).localeCompare(String(a[key]));
    });
  }

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }

  // Helper: format date string to dd/mm/yy HH:MM
  function formatDateCell(value) {
    // Try to parse RFC1123/ISO date strings
    if (typeof value !== "string") return value;
    // Accepts: "Wed, 28 May 2025 00:00:00 GMT" or ISO
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    // Only format if string looks like a date
    if (!/\d{4}/.test(value) && !/GMT|T\d{2}:\d{2}/.test(value)) return value;
    const pad = n => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function renderTable(data) {
    if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== "object") {
      return null;
    }
    const columns = Object.keys(data[0]);
    const sortedRows = getSortedRows(data, sortConfig);
    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                  padding: "4px 8px",
                  background: sortConfig?.key === col ? "#e0e0e0" : undefined,
                }}
              >
                {col}
                {sortConfig?.key === col ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} style={{ padding: "4px 8px", borderBottom: "1px solid #f0f0f0" }}>
                  {typeof row[col] === "object" && row[col] !== null
                    ? JSON.stringify(row[col])
                    : formatDateCell(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div style={{ maxWidth: '75vw', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Financial Report Uploader</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <select value={type} onChange={handleTypeChange} style={{ marginLeft: 8 }}>
          <option value="bank">Bank</option>
          <option value="credit">Credit</option>
        </select>
        <button type="submit" disabled={!file || loading} style={{ marginLeft: 8 }}>
          {loading ? 'Processing...' : 'Upload & Process'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24 }}>
          <h2>Result</h2>
          {/* Render table if possible, else fallback to JSON */}
          {Array.isArray(result.report) && result.report.length > 0 && typeof result.report[0] === "object" ? (
            renderTable(result.report)
          ) : (
            <pre style={{ background: '#f4f4f4', padding: 16, borderRadius: 4 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;