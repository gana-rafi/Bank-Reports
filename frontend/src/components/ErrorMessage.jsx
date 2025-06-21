import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/ErrorMessage.module.css';

function ErrorMessage({ error }) {
  if (!error) return null;
  return <div className={styles.error}>{error}</div>;
}

ErrorMessage.propTypes = {
  error: PropTypes.string,
};

export default ErrorMessage;
