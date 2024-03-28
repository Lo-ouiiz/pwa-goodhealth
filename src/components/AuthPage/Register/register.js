import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/authContext';
import bcrypt from 'bcryptjs';

import Button from '../../Button';
import styles from './register.module.css';

const SALT = '$2a$10$Ah94xWIVtMunL/V/KsSj9e';

const Register = props => {
  const { handleLogin, handleToggleRegister, handleToggleForm } = props;

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerif, setPasswordVerif] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

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
    setPassword(password);
  };

  const handlePasswordVerifChange = passwordVerif => {
    if (passwordVerif !== password) {
        setErrorPassword('Le mot de passe ne correspond pas.');
      } else {
        setErrorPassword('');
      }
    setPasswordVerif(passwordVerif);
  };

  const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const hashedPassword = await hashPassword(password);

    const body = new FormData();
    body.append('surname', name);
    body.append('firstname', surname);
    body.append('email', email);
    body.append('password', hashedPassword);

    try {
      const response = await fetch(
        'https://api.louise-mendiburu.fr/api-app-portfolio/register.php',
        {
          method: 'POST',
          body: body,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.code === 400 &&
          errorData.message === 'This user is already registered.'
        ) {
          throw new Error('Un compte avec cette adresse mail existe déjà.');
        }
      }

      if (response.ok && response.status === 200) {
        const data = await response.json();
        const user = data.userData;
        login(user);
        handleLogin();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return name && surname && email && password && passwordVerif && !errorPassword;
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerButtons}>
          <img src="/icon/left-arrow.png" className={styles.backButton} alt="back button" onClick={handleToggleForm}/>
          <p onClick={handleToggleRegister}>Je me connecte</p>
        </div>
        <h1 className={styles.title}>Je crée mon compte</h1>
        <p>
          Créez votre compte dès maintenant pour accéder à votre tableau de bord personnalisé. <br/>
          Entrez vos informations ci-dessous et rejoignez notre communauté dédiée à votre bien-être.
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}><p>{error}</p></div>}
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
        <div className={styles.formInput}>
          <input
            type="email"
            id="email"
            placeholder="Adresse email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Mot de passe"
            value={password}
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
            placeholder="Vérification du mot de passe"
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
        <div className={styles.formButtonContainer}>
          <Button
            text="Je crée un compte"
            type="submit"
            priority="high"
            disabled={!isFormValid()}
          />
        </div>
      </form>
    </div>
  );
};

export default Register;