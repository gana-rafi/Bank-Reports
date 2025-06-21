import { useState, useEffect } from 'react';

function useTableRows(result, sortConfig) {
  const [tableRows, setTableRows] = useState([]);
  const [domainSums, setDomainSums] = useState({});

  useEffect(() => {
    if (result && Array.isArray(result.report) && result.report.length > 0 && typeof result.report[0] === "object") {
      setTableRows(getSortedRows(result.report, sortConfig));
    }
  }, [result, sortConfig]);

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
    setDomainSums(prev => {
      const updatedRows = [...tableRows];
      updatedRows[rowIdx] = { ...updatedRows[rowIdx], domain: newDomain };
      const sums = {};
      for (const row of updatedRows) {
        if (row.domain && typeof row.amount === 'number') {
          sums[row.domain] = (sums[row.domain] || 0) + row.amount;
        }
      }
      return sums;
    });
  };

  const handleDrop = (rowIdx, draggedDomain) => {
    if (draggedDomain) {
      setTableRows(prev => {
        const updated = [...prev];
        updated[rowIdx] = { ...updated[rowIdx], domain: draggedDomain };
        return updated;
      });
      setDomainSums(prev => {
        const updatedRows = [...tableRows];
        updatedRows[rowIdx] = { ...updatedRows[rowIdx], domain: draggedDomain };
        const sums = {};
        for (const row of updatedRows) {
          if (row.domain && typeof row.amount === 'number') {
            sums[row.domain] = (sums[row.domain] || 0) + row.amount;
          }
        }
        return sums;
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
