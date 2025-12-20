import React, { useState, useEffect, useRef } from 'react';
import FileUploadForm from './components/FileUploadForm';
import ErrorMessage from './components/ErrorMessage';
import ResultPanel from './components/ResultPanel';
import DomainSidebar from './components/DomainSidebar';
import useDomains from './hooks/useDomains';
import useTableRows from './hooks/useTableRows';
import { arrayBufferToBase64 } from './utils/arrayBuffer';
import { formatDateCell } from './utils/date';
import './styles/App.module.css';

function App() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('poalim');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [draggedDomain, setDraggedDomain] = useState(null);

  const domains = useDomains();
  const {
    tableRows,
    setTableRows,
    domainSums,
    handleDomainCellChange,
    handleDrop
  } = useTableRows(result, sortConfig);

  async function sha256Hex(buffer) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
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
      const fileBuffer = await file.arrayBuffer();
      const base64Content = arrayBufferToBase64(fileBuffer);
      const sha256 = await sha256Hex(fileBuffer);
      const uploadPayload = {
        jsonrpc: "2.0",
        method: "upload_file",
        params: {
          filename: file.name,
          content: base64Content,
          conflict: 'replace',
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

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  }

  return (
    <div style={{ display: 'flex', maxWidth: '100%', margin: '2rem', fontFamily: 'sans-serif' }}>
      <DomainSidebar
        domains={domains}
        domainSums={domainSums}
        draggedDomain={draggedDomain}
        setDraggedDomain={setDraggedDomain}
      />
      <div style={{ flex: 1 }}>
        <h1>Financial Report Uploader</h1>
        <FileUploadForm
          file={file}
          loading={loading}
          type={type}
          onFileChange={handleFileChange}
          onTypeChange={handleTypeChange}
          onSubmit={handleSubmit}
        />
        <ErrorMessage error={error} />
        {result && (
          <ResultPanel
            result={result}
            tableRows={tableRows}
            setTableRows={setTableRows}
            domains={domains}
            handleDomainCellChange={handleDomainCellChange}
            handleDrop={(rowIdx) => handleDrop(rowIdx, draggedDomain)}
            draggedDomain={draggedDomain}
            sortConfig={sortConfig}
            handleSort={handleSort}
            formatDateCell={formatDateCell}
          />
        )}
      </div>
    </div>
  );
}

export default App;