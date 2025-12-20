import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/FileUploadForm.module.css';

/**
 * File upload form for financial report files.
 * @param {Object} props
 * @param {File|null} props.file
 * @param {boolean} props.loading
 * @param {string} props.type
 * @param {function} props.onFileChange
 * @param {function} props.onTypeChange
 * @param {function} props.onSubmit
 */
function FileUploadForm({ file, loading, type, onFileChange, onTypeChange, onSubmit }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input type="file" onChange={onFileChange} />
      <select value={type} onChange={onTypeChange} style={{ marginLeft: 8 }}>
        <option value="poalim">Poalim</option>
        <option value="leumi">Leumi</option>
        <option value="marcentile">Marcentile</option>
        <option value="credit">Credit</option>
      </select>
      <button type="submit" disabled={!file || loading} style={{ marginLeft: 8 }}>
        {loading ? 'Processing...' : 'Upload & Process'}
      </button>
    </form>
  );
}

FileUploadForm.propTypes = {
  file: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FileUploadForm;
