import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/authContext';
import bcrypt from 'bcryptjs';

import Button from '../../Button';
import Loader from '../../Loader';
import styles from './login.module.css';

const SALT = '$2a$10$Ah94xWIVtMunL/V/KsSj9e';

const Login = props => {
  const { handleLogin, handleToggleRegister, handleToggleForm } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const hashedPassword = await hashPassword(password);

    const body = new FormData();
    body.append('email', email);
    body.append('password', hashedPassword);

    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/login.php', {
        method: 'POST',
        body: body
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.code === 404 && errorData.message === "Oops!! Incorrect Login Credentials") {
          throw new Error('Ce compte n\'existe pas.');
        } else if (errorData.code === 404 && errorData.message === "Oops!! Incorrect Password") {
          throw new Error('Le mot de passe est incorrect.');
        } else {
          throw new Error('Un ou plusieurs champs sont vides.');
        }
      }
      
      if (response.ok && response.status === 200) {
        const data = await response.json();
        const user = data.userData;
        login(user);
        setLoading(false);
        handleLogin();
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = () => {
    return email && password;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerButtons}>
          <img src="/icon/left-arrow.png" className={styles.backButton} alt="back button" onClick={handleToggleForm}/>
          <p onClick={handleToggleRegister}>Je crée un compte</p>
        </div>
        <h1 className={styles.title}>Je me connecte</h1>
        <p>
          Connectez-vous pour accéder à votre tableau de bord personnalisé. <br/>
          Votre santé et votre bien-être vous attendent de l'autre côté.
        </p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && 
          <div className={styles.error}>
            <img src="/icon/warning.png" alt="error" />
            <p>{error}</p>
          </div>
        }
        <div className={styles.formInput}>
          <input
            type="email"
            id="email"
            placeholder='Addresse mail'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formInput}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder='Mot de passe'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <img src="/icon/show.png" className={styles.pwdIcon} alt="show password" onClick={toggleShowPassword}/>
          ) : (
            <img src="/icon/hide.png" className={styles.pwdIcon} alt="hide password" onClick={toggleShowPassword}/>
          )}
        </div>
        <div className={styles.formButtonContainer}>
          <Button
            text="Je me connecte"
            type="submit"
            priority="high"
            disabled={!isFormValid()}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;