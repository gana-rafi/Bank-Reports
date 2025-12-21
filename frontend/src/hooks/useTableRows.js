import { useState, useEffect } from 'react';

function useTableRows(result, sortConfig, expandedRows = {}) {
  const [tableRows, setTableRows] = useState([]);
  const [domainSums, setDomainSums] = useState({});

  useEffect(() => {
    if (result && Array.isArray(result.report) && result.report.length > 0 && typeof result.report[0] === "object") {
      setTableRows(getSortedRows(result.report, sortConfig));
    }
  }, [result, sortConfig]);

  // Recalculate domain sums when tableRows or expandedRows change
  useEffect(() => {
    const sums = {};
    
    // Calculate sums from main rows
    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      const subRows = expandedRows[i] || [];
      
      if (subRows.length > 0) {
        // If row has sub-rows, use sub-row domains for sums (not parent domain)
        for (const subRow of subRows) {
          if (subRow.domain && typeof subRow.amount === 'number') {
            sums[subRow.domain] = (sums[subRow.domain] || 0) + subRow.amount;
          }
        }
      } else {
        // No sub-rows, use the row's own domain
        if (row.domain && typeof row.amount === 'number') {
          sums[row.domain] = (sums[row.domain] || 0) + row.amount;
        }
      }
    }
    
    setDomainSums(sums);
  }, [tableRows, expandedRows]);

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

  const handleDomainCellChange = (rowIdx, newDomain) => {
    setTableRows(prev => {
      const updated = [...prev];
      updated[rowIdx] = { ...updated[rowIdx], domain: newDomain };
      return updated;
    });
  };

  const handleDrop = (rowIdx, draggedDomain) => {
    if (draggedDomain) {
      setTableRows(prev => {
        const updated = [...prev];
        updated[rowIdx] = { ...updated[rowIdx], domain: draggedDomain };
        return updated;
      });
    }
  };

  return {
    tableRows,
    setTableRows,
    domainSums,
    handleDomainCellChange,
    handleDrop
  };
}

export default useTableRows;
