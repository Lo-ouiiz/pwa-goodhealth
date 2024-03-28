import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/authContext';
import bcrypt from 'bcryptjs';

import Button from '../../Button';
import styles from './updatePasswordModal.module.css';

const SALT = '$2a$10$Ah94xWIVtMunL/V/KsSj9e';

const UpdatePasswordModal = props => {
  const { closeModal, displayPopup } = props;

  const { userInfos } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordVerif, setPasswordVerif] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const verifyPassword = password => {
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/]).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = password => {
    if (!verifyPassword(password)) {
      setErrorPassword(
        'Votre mot de passe doit contenir 8 caractères minimum, dont une majuscule, une minuscule, un chiffre et un caractère spécial (#?!@$%^&*-/).'
        );
      } else {
        setErrorPassword('');
      }
      setNewPassword(password);
  };

  const handlePasswordVerifChange = passwordVerif => {
    if (passwordVerif !== newPassword) {
        setErrorPassword('Le mot de passe ne correspond pas.');
      } else {
        setErrorPassword('');
      }
    setPasswordVerif(passwordVerif);
  };

  const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hashedOldPassword = await hashPassword(oldPassword);
    const hashedNewPassword = await hashPassword(newPassword);

    const body = new FormData();
    body.append('method', "updatePassword");
    body.append('userId', userInfos.id);
    body.append('oldPassword', hashedOldPassword);
    body.append('newPassword', hashedNewPassword);
    
    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/apiUser.php', {
        method: 'POST',
        body: body
      });  

      if (!response.ok || response.status !== 200) {
        const errorData = await response.json();
  
        if (errorData.code === 500 && errorData.message === "Failed to update user password.") {
          throw new Error('Erreur lors de la modification des données. Réessayez plus tard');
        } else if (errorData.code === 404 && errorData.message === "Oops!! Incorrect Password") {
          throw new Error('Le mot de passe actuel que vous avez rentré ne correspond pas.');
        } else {
          throw new Error('Erreur.');
        }
      }
      
      if (response.ok && response.status === 200) {
        setError('');
        setOldPassword('');
        setNewPassword('');
        setPasswordVerif('');
        setShowPassword(false);
        closeModal();
        displayPopup();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseModal = () => {
    setError('');
    setOldPassword('');
    setNewPassword('');
    setPasswordVerif('');
    setShowPassword(false);
    closeModal();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return oldPassword && newPassword && passwordVerif && !errorPassword;
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <p>Merci de saisir votre ancien mot de passe ainsi que votre nouveau mot de passe dans les champs ci-dessous.</p>
      {error && 
        <div className={styles.error}>
          <img src="/icon/warning.png" alt="error" />
          <p>{error}</p>
        </div>
      }
      <div className={styles.formInput}>
        <input
          type={showPassword ? 'text' : 'password'}
          id="oldPassword"
          placeholder="Mot de passe actuel"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
        />
        {showPassword ? (
            <img
              src="/icon/show.png"
              className={styles.pwdIcon}
              alt="show password"
              onClick={toggleShowPassword}
            />
          ) : (
            <img
              src="/icon/hide.png"
              className={styles.pwdIcon}
              alt="hide password"
              onClick={toggleShowPassword}
            />
          )}
      </div>
      <div className={styles.firstInput}>
        <div className={styles.formInput}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="newPassword"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={e => handlePasswordChange(e.target.value)}
          />
          {showPassword ? (
            <img
              src="/icon/show.png"
              className={styles.pwdIcon}
              alt="show password"
              onClick={toggleShowPassword}
            />
          ) : (
            <img
              src="/icon/hide.png"
              className={styles.pwdIcon}
              alt="hide password"
              onClick={toggleShowPassword}
            />
          )}
          {errorPassword? (
            <div className={styles.passwordError}>
              <img src="/icon/warning.png" alt="error password" />
              <p>{errorPassword}</p>
            </div>
            ) : null}
        </div>
        <div className={styles.formInput}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="passwordVerif"
            placeholder="Vérification du nouveau mot de passe"
            value={passwordVerif}
            onChange={e => handlePasswordVerifChange(e.target.value)}
          />
          {showPassword ? (
            <img
              src="/icon/show.png"
              className={styles.pwdIcon}
              alt="show password"
              onClick={toggleShowPassword}
            />
          ) : (
            <img
              src="/icon/hide.png"
              className={styles.pwdIcon}
              alt="hide password"
              onClick={toggleShowPassword}
            />
          )}
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <Button text="Enregistrer" type="submit" priority="high" disabled={!isFormValid()} />
        <Button text="Annuler" type="reset" priority="low" onClick={handleCloseModal} />
      </div>
    </form>
  );
};

export default UpdatePasswordModal;