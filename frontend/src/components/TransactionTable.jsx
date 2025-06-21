import React from 'react';
import PropTypes from 'prop-types';
import { getDomainColor, getDomainFontColor } from '../utils/color';
import styles from '../styles/TransactionTable.module.css';

/**
 * Sortable, draggable transaction table.
 */

function TransactionTable({
  data,
  tableRows,
  setTableRows,
  domains,
  handleDomainCellChange,
  handleDrop,
  draggedDomain,
  sortConfig,
  handleSort,
  formatDateCell
}) {
  if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== "object") {
    return null;
  }
  const columns = Object.keys(data[0]);
  const handleDragOver = (e) => e.preventDefault();
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              onClick={() => handleSort(col)}
              className={styles.th}
              style={{
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
        {tableRows.map((row, i) => (
          <tr key={i} onDragOver={handleDragOver} onDrop={() => handleDrop(i, draggedDomain)}>
            {columns.map((col, colIdx) => (
              <td
                key={col}
                className={styles.td}
                style={{
                  borderLeft: colIdx === 0 && row.domain ? `8px solid ${getDomainColor(row.domain)}` : undefined,
                  color: colIdx === 0 && row.domain ? getDomainFontColor(row.domain) : undefined
                }}
              >
                {col === "domain" ? (
                  <select
                    value={row[col] || ""}
                    onChange={e => handleDomainCellChange(i, e.target.value)}
                  >
                    <option value="">Select Domain</option>
                    {domains.map((domain) => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                ) : (
                  typeof row[col] === "object" && row[col] !== null
                    ? JSON.stringify(row[col])
                    : formatDateCell(row[col])
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

TransactionTable.propTypes = {
  /** The data to be displayed in the table, as an array of objects. */
  data: PropTypes.array.isRequired,
  /** The current rows to be displayed in the table, as an array of objects. */
  tableRows: PropTypes.array.isRequired,
  /** Function to update the table rows state. */
  setTableRows: PropTypes.func.isRequired,
  /** The available domains for the domain column. */
  domains: PropTypes.array.isRequired,
  /** Function to handle changes to the domain cell. */
  handleDomainCellChange: PropTypes.func.isRequired,
  /** Function to handle dropping a dragged item onto a row. */
  handleDrop: PropTypes.func.isRequired,
  /** The domain currently being dragged, if any. */
  draggedDomain: PropTypes.string,
  /** Configuration object for sorting, including the key and direction. */
  sortConfig: PropTypes.object,
  /** Function to handle sorting when a column header is clicked. */
  handleSort: PropTypes.func.isRequired,
  /** Function to format date cells for display. */
  formatDateCell: PropTypes.func.isRequired,
};

export default TransactionTable;
