import React from 'react';
import PropTypes from 'prop-types';
import { getDomainColor, getDomainFontColor } from '../utils/color';
import styles from '../styles/TransactionTable.module.css';

/**
 * Sortable, draggable transaction table with expandable sub-rows.
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
  formatDateCell,
  onRowUpload,
  expandedRows = {},
  collapsedRows = {},
  onToggleExpand
}) {
  if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== "object") {
    return null;
  }
  const columns = Object.keys(data[0]);
  const handleDragOver = (e) => e.preventDefault();

  const renderRow = (row, rowIndex, isSubRow = false, parentIndex = null) => {
    const actualIndex = isSubRow ? `${parentIndex}-${rowIndex}` : rowIndex;
    const hasSubRows = expandedRows[rowIndex] && expandedRows[rowIndex].length > 0;
    const isCollapsed = collapsedRows[rowIndex];

    return (
      <React.Fragment key={actualIndex}>
        <tr
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(isSubRow ? rowIndex : rowIndex, draggedDomain, isSubRow, parentIndex)}
          className={isSubRow ? styles.subRow : styles.mainRow}
        >
          {/* Actions column */}
          <td className={`${styles.td} ${styles.actionsCell}`}>
            {!isSubRow && (
              <div className={styles.rowActions}>
                {hasSubRows && (
                  <button
                    className={styles.expandButton}
                    onClick={() => onToggleExpand(rowIndex)}
                    title={isCollapsed ? "Expand sub-rows" : "Collapse sub-rows"}
                    type="button"
                  >
                    {isCollapsed ? '+' : '−'}
                  </button>
                )}
                <button
                  className={styles.uploadButton}
                  onClick={() => onRowUpload(rowIndex, row)}
                  title="Upload sub-transactions"
                  type="button"
                >
                  <i className="fa-solid fa-upload"></i>
                </button>
              </div>
            )}
            {isSubRow && <span className={styles.subRowIndicator}>↳</span>}
          </td>
          {columns.map((col, colIdx) => (
            <td
              key={col}
              className={`${styles.td} ${isSubRow ? styles.subRowCell : ''}`}
              style={{
                borderLeft: colIdx === 0 && row.domain ? `8px solid ${getDomainColor(row.domain)}` : undefined,
                paddingLeft: isSubRow && colIdx === 0 ? '24px' : undefined,
              }}
            >
              {col === "domain" ? (
                <select
                  value={row[col] || ""}
                  onChange={e => handleDomainCellChange(isSubRow ? actualIndex : rowIndex, e.target.value, isSubRow)}
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
              {col === "action" && isSubRow && (
              <div className={styles.subRowInfo}>
                {row.buisness && <span className={styles.businessName}>{row.buisness}</span>}
              </div>
            )}
            </td>
          ))}
        </tr>
        {/* Render sub-rows if expanded and not collapsed */}
        {!isSubRow && hasSubRows && !isCollapsed && expandedRows[rowIndex].map((subRow, subIndex) =>
          renderRow(subRow, subIndex, true, rowIndex)
        )}
      </React.Fragment>
    );
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th} style={{ width: '60px' }}>Actions</th>
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
        {tableRows.map((row, i) => renderRow(row, i))}
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
  /** Function to handle dropping a dragged item onto a row. Receives (rowIdx, domain, isSubRow, parentIndex). */
  handleDrop: PropTypes.func.isRequired,
  /** The domain currently being dragged, if any. */
  draggedDomain: PropTypes.string,
  /** Configuration object for sorting, including the key and direction. */
  sortConfig: PropTypes.object,
  /** Function to handle sorting when a column header is clicked. */
  handleSort: PropTypes.func.isRequired,
  /** Function to format date cells for display. */
  formatDateCell: PropTypes.func.isRequired,
  /** Function to handle upload button click for a row. */
  onRowUpload: PropTypes.func.isRequired,
  /** Object containing expanded sub-rows indexed by parent row index. */
  expandedRows: PropTypes.object,
  /** Object tracking which rows are collapsed. */
  collapsedRows: PropTypes.object,
  /** Function to toggle expanded state of a row. */
  onToggleExpand: PropTypes.func.isRequired,
};

export default TransactionTable;
