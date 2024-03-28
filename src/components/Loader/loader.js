import React from 'react';
import styles from './loader.module.css';

const Loader = () => {
  return (
    <div className={styles.root}>
      <div className={styles.loader}> 
        <svg className={styles.svg}>
          <polyline className={styles.back} points="1 6 4 6 6 11 10 1 12 6 15 6"></polyline>
          <polyline className={styles.front} points="1 6 4 6 6 11 10 1 12 6 15 6"></polyline>
        </svg>
      </div>
      <p>En pleine recharge santé... <br/> Patientez un instant !</p>
    </div>
  );
};

export default Loader;