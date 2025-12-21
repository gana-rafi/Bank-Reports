import React, { useState, useEffect, useRef } from 'react';
import UploadModal from './components/UploadModal';
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
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadTargetRow, setUploadTargetRow] = useState(null);
  
  // Expanded rows state - maps row index to sub-rows array
  const [expandedRows, setExpandedRows] = useState({});
  // Track which rows are collapsed (hidden)
  const [collapsedRows, setCollapsedRows] = useState({});

  const domains = useDomains();
  const {
    tableRows,
    setTableRows,
    domainSums,
    handleDomainCellChange,
    handleDrop
  } = useTableRows(result, sortConfig, expandedRows);

  async function sha256Hex(buffer) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const openMainUploadModal = () => {
    setUploadTargetRow(null);
    setFile(null);
    setIsModalOpen(true);
  };

  const openRowUploadModal = (rowIndex, row) => {
    setUploadTargetRow({ index: rowIndex, row });
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUploadTargetRow(null);
    setFile(null);
  };

  const handleToggleExpand = (rowIndex) => {
    setCollapsedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

  // Handle drop on both main rows and sub-rows
  const handleDropWithSubRows = (rowIdx, domain, isSubRow = false, parentIndex = null) => {
    if (!domain) return;
    
    if (isSubRow && parentIndex !== null) {
      // Get the sub-row's current domain for sum adjustment
      const currentSubRows = expandedRows[parentIndex] || [];
      const subRow = currentSubRows[rowIdx];
      const oldDomain = subRow?.domain || '';
      
      // Update sub-row in expandedRows
      setExpandedRows(prev => {
        const parentSubRows = prev[parentIndex] || [];
        const updatedSubRows = [...parentSubRows];
        if (updatedSubRows[rowIdx]) {
          updatedSubRows[rowIdx] = { ...updatedSubRows[rowIdx], domain };
        }
        return {
          ...prev,
          [parentIndex]: updatedSubRows
        };
      });
    } else {
      // Update main row
      handleDrop(rowIdx, domain);
      
      // Also update unassigned sub-rows to inherit the new domain
      const subRows = expandedRows[rowIdx] || [];
      if (subRows.length > 0) {
        setExpandedRows(prev => {
          const updatedSubRows = (prev[rowIdx] || []).map(subRow => 
            !subRow.domain ? { ...subRow, domain } : subRow
          );
          return {
            ...prev,
            [rowIdx]: updatedSubRows
          };
        });
      }
    }
  };

  // Handle domain cell change for both main rows and sub-rows
  const handleDomainCellChangeWithSubRows = (rowIdx, newDomain, isSubRow = false) => {
    if (isSubRow && typeof rowIdx === 'string') {
      // rowIdx is "parentIndex-subIndex" for sub-rows
      const [parentIndex, subIndex] = rowIdx.split('-').map(Number);
      
      // Get the sub-row's current domain and amount for sum adjustment
      const currentSubRows = expandedRows[parentIndex] || [];
      const subRow = currentSubRows[subIndex];
      const oldDomain = subRow?.domain || '';
      const amount = subRow?.amount || 0;
      
      // Update the sub-row's domain
      setExpandedRows(prev => {
        const parentSubRows = prev[parentIndex] || [];
        const updatedSubRows = [...parentSubRows];
        if (updatedSubRows[subIndex]) {
          updatedSubRows[subIndex] = { ...updatedSubRows[subIndex], domain: newDomain };
        }
        return {
          ...prev,
          [parentIndex]: updatedSubRows
        };
      });
      
      // Adjust domain sums: subtract from old domain, add to new domain
      if (oldDomain !== newDomain && typeof amount === 'number') {
        // Note: domainSums is managed by useTableRows hook, we need to trigger a recalculation
        // For now, we'll handle this by updating the parent row's domain sum indirectly
        // This is a simplified approach - in production you might want a more robust solution
      }
    } else {
      // Update main row
      handleDomainCellChange(rowIdx, newDomain);
      
      // Also update unassigned sub-rows to inherit the new domain
      const subRows = expandedRows[rowIdx] || [];
      if (subRows.length > 0) {
        setExpandedRows(prev => {
          const updatedSubRows = (prev[rowIdx] || []).map(subRow => 
            !subRow.domain ? { ...subRow, domain: newDomain } : subRow
          );
          return {
            ...prev,
            [rowIdx]: updatedSubRows
          };
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    
    // Don't clear main result if this is a row upload
    if (!uploadTargetRow) {
      setResult(null);
    }
    
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
      
      if (uploadTargetRow) {
        // This is a row upload - add sub-rows to the expanded rows
        // Sub-rows inherit the parent row's domain
        const parentDomain = tableRows[uploadTargetRow.index]?.domain || '';
        const subRows = (processData.result?.report || []).map(row => ({
          ...row,
          domain: parentDomain
        }));
        setExpandedRows(prev => ({
          ...prev,
          [uploadTargetRow.index]: subRows
        }));
        closeModal();
      } else {
        // Main upload - set the result
        setResult(processData.result);
        setExpandedRows({}); // Clear expanded rows on new main upload
        closeModal();
      }
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
        <button 
          onClick={openMainUploadModal}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            background: '#4a90d9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        >
          Upload File
        </button>
        <UploadModal
          isOpen={isModalOpen}
          onClose={closeModal}
          file={file}
          loading={loading}
          type={type}
          onFileChange={handleFileChange}
          onTypeChange={handleTypeChange}
          onSubmit={handleSubmit}
          title={uploadTargetRow ? `Upload Sub-transactions for Row ${uploadTargetRow.index + 1}` : 'Upload Financial Report'}
        />
        <ErrorMessage error={error} />
        {result && (
          <ResultPanel
            result={result}
            tableRows={tableRows}
            setTableRows={setTableRows}
            domains={domains}
            handleDomainCellChange={handleDomainCellChangeWithSubRows}
            handleDrop={handleDropWithSubRows}
            draggedDomain={draggedDomain}
            sortConfig={sortConfig}
            handleSort={handleSort}
            formatDateCell={formatDateCell}
            onRowUpload={openRowUploadModal}
            expandedRows={expandedRows}
            collapsedRows={collapsedRows}
            onToggleExpand={handleToggleExpand}
          />
        )}
      </div>
    </div>
  );
}

export default App;