import React, { useEffect, useState } from 'react';

import styles from './modal.module.css';

const Modal = props => {
  const { title, showModal, component, closeModal } = props;

  const [rootClass, setRootClass] = useState(styles.rootHidden);
  const [modalContainerClass, setModalContainerClass] = useState(styles.containerHidden);
  const [maskClass, setMaskClass] = useState(styles.maskHidden);

  useEffect(() => {
    if (showModal) {
      setRootClass(styles.root);
      setModalContainerClass(styles.container);
      setMaskClass(styles.mask);
    } else {
      setRootClass(styles.rootHidden);
      setModalContainerClass(styles.containerHidden);
      setMaskClass(styles.maskHidden);
    }
  }, [showModal])

  return (
    <div className={rootClass}>
      <div className={modalContainerClass}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <img src="/icon/cross.png" alt="close modal" onClick={closeModal}/>
        </div>
        {component}
      </div>
      <div className={maskClass} onClick={closeModal}></div>
    </div>
  );
};

export default Modal;