import React from 'react';
import styles from './NoSchemaError.module.css';

export const NoSchemaError = () => {
  return (
    <div className={styles.block}>
      <h4>No Schema Content</h4>
      <p>
        Looks like the schema file you've selected doesn't have any typeDefs
      </p>
    </div>
  );
};
