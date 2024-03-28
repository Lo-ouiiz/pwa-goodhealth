import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/authContext';

import Button from '../../Button';
import styles from './updateModal.module.css';

const UpdateModal = props => {
  const { closeModal, displayPopup } = props;

  const { userInfos, setUserInfos } = useContext(AuthContext);

  const [name, setName] = useState(userInfos.surname);
  const [surname, setSurname] = useState(userInfos.firstname);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = new FormData();
    body.append('method', "update");
    body.append('userId', userInfos.id);
    body.append('name', name);
    body.append('surname', surname);
    
    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/apiUser.php', {
        method: 'POST',
        body: body
      });  

      if (!response.ok || response.status !== 200) {
        const errorData = await response.json();
  
        if (errorData.code === 500 && errorData.message === "Failed to update user.") {
          throw new Error('Erreur lors de la modification des données. Réessayez plus tard');
        } else {
          throw new Error('Erreur.');
        }
      }
      
      if (response.ok && response.status === 200) {
        setError('');
        const user = { id: userInfos.id, surname: name, firstname: surname, email: userInfos.email };
        setUserInfos(user);
        closeModal();
        displayPopup();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const isFormValid = () => {
    return name && surname;
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <p>Merci de saisir vos nouveaux nom et prénom dans les champs ci-dessous.</p>
      {error && 
        <div className={styles.error}>
          <img src="/icon/warning.png" alt="error" />
          <p>{error}</p>
        </div>
      }
      <div className={styles.firstInput}>
        <div className={styles.formInput}>
          <input
            type="text"
            id="name"
            placeholder="Prénom"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type="text"
            id="surname"
            placeholder="Nom"
            value={surname}
            onChange={e => setSurname(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <Button text="Enregistrer" type="submit" priority="high" disabled={!isFormValid()} />
        <Button text="Annuler" priority="low" onClick={closeModal} />
      </div>
    </form>
  );
};

export default UpdateModal;