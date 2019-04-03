/**
 *
 * LeftMenuHeader
 *
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';

import styles from './styles.scss';

function LeftMenuHeader() {
  return (
    <div className={styles.leftMenuHeader}>
      <Link to='/' className={styles.leftMenuHeaderLink}>
        <span className={styles.projectName} />
      </Link>
    </div>
  );
}

export default memo(LeftMenuHeader);
