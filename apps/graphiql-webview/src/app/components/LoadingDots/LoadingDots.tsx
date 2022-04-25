import React from 'react';

import styles from './LoadingDots.module.css';

export const LoadingDots = () => {
  return (
    <div className={styles.block}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </div>
  );
};
