import React from 'react';
import PropTypes from 'prop-types';
import { getDomainColor, getDomainFontColor } from '../utils/color';
import styles from '../styles/DomainSidebar.module.css';

/**
 * Sidebar listing all domains, with drag-and-drop and sum display.
 */
function DomainSidebar({ domains, domainSums, draggedDomain, setDraggedDomain }) {
  const handleDragStart = (domain) => {
    setDraggedDomain(domain);
  };
  return (
    <div className={styles.sidebar}>
      <h3>Domains</h3>
      <ul className={styles.domainList}>
        {domains.map(domain => (
          <li
            key={domain}
            draggable
            onDragStart={() => handleDragStart(domain)}
            className={styles.domainItem}
            style={{
              background: getDomainColor(domain),
              color: getDomainFontColor(domain),
              boxShadow: draggedDomain === domain ? '0 0 0 2px #000' : undefined,
            }}
          >
            <span>{domain}</span>
            <span style={{ marginLeft: 8, fontWeight: 'normal' }}>
              {domainSums[domain] !== undefined ? Number(domainSums[domain]).toFixed(2) : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

DomainSidebar.propTypes = {
  /**
   * Array of domain names to display.
   */
  domains: PropTypes.array.isRequired,

  /**
   * Object containing the sum associated with each domain.
   */
  domainSums: PropTypes.object.isRequired,

  /**
   * Currently dragged domain.
   */
  draggedDomain: PropTypes.string,

  /**
   * Function to set the dragged domain.
   */
  setDraggedDomain: PropTypes.func.isRequired,
};

export default DomainSidebar;
