import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/authContext';

import Button from '../../Button';
import styles from './deleteModal.module.css';

const DeleteModal = props => {
  const { closeModal } = props;

  const { userInfos, logout } = useContext(AuthContext);

  const [error, setError] = useState('');

  const handleDelete = async (event) => {
    event.preventDefault();

    const body = new FormData();
    body.append('method', "delete");
    body.append('userId', userInfos.id);

    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/apiUser.php', {
        method: 'POST',
        body: body
      });  

      if (!response.ok || response.status !== 200) {
        const errorData = await response.json();
  
        if (errorData.code === 500 && errorData.message === "Failed to delete user.") {
          throw new Error('Erreur lors de la suppression du compte. Réessayez plus tard');
        } else {
          throw new Error('Erreur.');
        }
      }
      
      if (response.ok && response.status === 200) {
        setError('');
        closeModal();
        logout();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.root}>
      <p>Etes-vous sûr de vouloir supprimer votre compte GoodHealth ?</p>
      <div className={styles.important}>
        <img src="/icon/warning.png" alt="warning" />
        <p>Cette action est irréversible et toutes les données liées à votre compte seront supprimées.</p>
      </div>
      {error && 
        <div className={styles.error}>
          <img src="/icon/warning.png" alt="error" />
          <p>{error}</p>
        </div>
      }
      <div className={styles.buttonsContainer}>
        <Button text="Confirmer" priority="high" onClick={handleDelete} />
        <Button text="Annuler" priority="low" onClick={closeModal} />
      </div>
    </div>
  );
};

export default DeleteModal;