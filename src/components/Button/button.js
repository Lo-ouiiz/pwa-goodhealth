import React from 'react';
import styles from './button.module.css';

const Button = props => {
  const { text, type, priority, onClick, disabled } = props;

  const buttonClass = priority === 'high' ? styles.buttonHighPriority : styles.buttonLowPriority;

  return (
    <button className={buttonClass} type={type} onClick={onClick} disabled={disabled}>{text}</button>
  );
};

export default Button;