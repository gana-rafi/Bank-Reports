import React from 'react';
import PropTypes from 'prop-types';
import TransactionTable from './TransactionTable';
import styles from '../styles/ResultPanel.module.css';

/**
 * Panel to display the result table or JSON.
 * @param {Object} props
 * @param {Object} props.result
 * @param {Array} props.tableRows
 * @param {Function} props.setTableRows
 * @param {Array} props.domains
 * @param {Function} props.handleDomainCellChange
 * @param {Function} props.handleDrop
 * @param {string} props.draggedDomain
 * @param {Object} props.sortConfig
 * @param {Function} props.handleSort
 * @param {Function} props.formatDateCell
 */
function ResultPanel({
  result,
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
  return (
    <div className={styles.resultPanel}>
      <h2>Result</h2>
      {Array.isArray(result.report) && result.report.length > 0 && typeof result.report[0] === "object" ? (
        <TransactionTable
          data={result.report}
          tableRows={tableRows}
          setTableRows={setTableRows}
          domains={domains}
          handleDomainCellChange={handleDomainCellChange}
          handleDrop={handleDrop}
          draggedDomain={draggedDomain}
          sortConfig={sortConfig}
          handleSort={handleSort}
          formatDateCell={formatDateCell}
        />
      ) : (
        <pre className={styles.jsonResult}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

ResultPanel.propTypes = {
  result: PropTypes.object.isRequired,
  tableRows: PropTypes.array.isRequired,
  setTableRows: PropTypes.func.isRequired,
  domains: PropTypes.array.isRequired,
  handleDomainCellChange: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  draggedDomain: PropTypes.string,
  sortConfig: PropTypes.object,
  handleSort: PropTypes.func.isRequired,
  formatDateCell: PropTypes.func.isRequired,
};

export default ResultPanel;
