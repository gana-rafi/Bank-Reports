import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/UploadModal.module.css';

/**
 * Modal overlay for file upload.
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {File|null} props.file - Currently selected file
 * @param {boolean} props.loading - Whether upload is in progress
 * @param {string} props.type - Selected file type
 * @param {function} props.onFileChange - Handler for file selection
 * @param {function} props.onTypeChange - Handler for type selection
 * @param {function} props.onSubmit - Handler for form submission
 * @param {string} [props.title] - Modal title
 */
function UploadModal({
  isOpen,
  onClose,
  file,
  loading,
  type,
  onFileChange,
  onTypeChange,
  onSubmit,
  title = 'Upload Financial Report'
}) {
  const fileInputRef = useRef(null);

  // Automatically open file browser when modal opens
  useEffect(() => {
    if (isOpen && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            &times;
          </button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Select File:</label>
            <input type="file" onChange={onFileChange} className={styles.fileInput} ref={fileInputRef} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>File Type:</label>
            <select value={type} onChange={onTypeChange} className={styles.select}>
              <option value="poalim">Poalim</option>
              <option value="leumi">Leumi</option>
              <option value="marcentile">Marcentile</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={!file || loading} className={styles.submitButton}>
              {loading ? 'Processing...' : 'Upload & Process'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

UploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  file: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  onFileChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default UploadModal;
