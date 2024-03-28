import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/authContext';

import Button from '../../Button';
import styles from './formAddWater.module.css';

const FormAddWater = props => {
  const { initialValues, closeModal, fetchData } = props;

  const { userInfos } = useContext(AuthContext);

  const [date, setDate] = useState(initialValues.date);
  const [water, setWater] = useState(initialValues.water);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues.date !== date || initialValues.water !== water) {
      setDate(initialValues.date);
      setWater(initialValues.water);
    }
  }, [initialValues]);

  const today = new Date().toISOString().split('T')[0];

  const isFormValid = () => {
    return date && water;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = new FormData();
    body.append('type', "water");
    body.append('method', "add");
    body.append('userId', userInfos.id);
    body.append('date', date);
    body.append('water', water);

    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/api.php', {
        method: 'POST',
        body: body
      });  

      if (!response.ok || response.status !== 200) {
        const errorData = await response.json();
  
        if (errorData.code === 400 && errorData.message === "Water record already exists.") {
          throw new Error('Vous avez déjà entré une consommation d\'eau pour cette date.');
        } else {
          throw new Error('Erreur.');
        }
      }
      
      if (response.ok && response.status === 200) {
        setError('');
        fetchData();
        closeModal();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      {error && 
        <div className={styles.error}>
          <img src="/icon/warning.png" alt="error" />
          <p>{error}</p>
        </div>
      }
      <div className={styles.formInput}>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          max={today}
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className={styles.formInput}>
        <label htmlFor="water">Consommation d'eau (en ml)</label>
        <input
          type="number"
          min="50"
          step="50"
          id="water"
          value={water}
          onChange={(e) => setWater(e.target.value)}
        />
      </div>
      <Button text="Enregistrer" priority="high" type="submit" disabled={!isFormValid()} />
    </form>
  );
};

export default FormAddWater;