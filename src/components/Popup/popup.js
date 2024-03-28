import React, { useState, useEffect } from 'react';
import styles from './popup.module.css';

const Popup = props => {
  const { showPopup, message, duration, onClose } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  var popupClass = showPopup ? `${styles.popup} ${styles.visible}` : styles.popup;

  return (
    <div className={popupClass}>
      <div className={styles.popupContent}>
        <img src="/icon/info.png" alt="info" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;