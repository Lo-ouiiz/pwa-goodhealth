import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Button from '../Button';
import styles from './authPage.module.css';

const AuthPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleToggleForm = () => {
    setShowForm(value => !value);
    setIsRegister(false);
  };

  const handleToggleRegisterForm = () => {
    setShowForm(value => !value);
    setIsRegister(true);
  };

  const handleToggleRegister = () => {
    setIsRegister(value => !value);
  };

  const handleLogin = () => {
    navigate('/');
  };

  const forms = isRegister ? (
    <div className={styles.formContainer}>
      <Register 
        handleLogin={handleLogin}
        handleToggleRegister={handleToggleRegister}
        handleToggleForm={handleToggleForm}
      />
    </div>
  ) : (
    <div className={styles.formContainer}>
      <Login 
        handleLogin={handleLogin}
        handleToggleRegister={handleToggleRegister}
        handleToggleForm={handleToggleForm}
      />
    </div>
  );

  return (
    <div className={styles.root}>
      {showForm ? forms : (
        <div className={styles.welcomePage}>
          <div className={styles.logoContainer}>
            <img src="images/logo.png" className={styles.logo} alt="logo"/>
          </div>
          <div className={styles.welcomeContainer}>
            <h1>Bienvenue sur GoodHealth !</h1>
            <p>
              Prenez le contrôle de votre santé et de votre bien-être avec notre application innovante. <br/>
              Chez GoodHealth, nous croyons que chaque petit pas compte dans votre voyage vers une vie plus saine et plus épanouissante.
              Alors suivez vos progrès, fixez des objectifs et restez motivé. <br/> 
            </p>
            <p>Rejoignez-nous pour prendre soin de vous dès aujourd'hui !</p>
            <div className={styles.buttonsContainer}>
              <Button text="Je me connecte" priority="high" onClick={handleToggleForm} />
              <Button text="Je crée mon compte" priority="low" onClick={handleToggleRegisterForm} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;