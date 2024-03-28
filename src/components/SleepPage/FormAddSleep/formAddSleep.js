import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/authContext';

import Button from '../../Button';
import styles from './formAddSleep.module.css';

const FormAddSleep = props => {
  const { closeModal, fetchData } = props;

  const { userInfos } = useContext(AuthContext);

  const [bedtime, setBedtime] = useState();
  const [wakeTime, setWakeTime] = useState();
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 16);

  const isFormValid = () => {
    return bedtime && wakeTime;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const bedtimeDate = new Date(bedtime);
    const date = bedtimeDate.toISOString().split('T')[0];

    const body = new FormData();
    body.append('type', "sleep");
    body.append('method', "add");
    body.append('userId', userInfos.id);
    body.append('date', date);
    body.append('bedtime', bedtime);
    body.append('waketime', wakeTime);

    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/api.php', {
        method: 'POST',
        body: body
      });  

      if (!response.ok || response.status !== 200) {
        const errorData = await response.json();
  
        if (errorData.code === 400 && errorData.message === "Sleep record already exists.") {
          throw new Error('Vous avez déjà entré un temps de sommeil pour cette date.');
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
        <label htmlFor="bedtime">Coucher</label>
        <input
          type="datetime-local"
          max={today}
          id="bedtime"
          value={bedtime}
          onChange={(e) => setBedtime(e.target.value)}
        />
      </div>
      <div className={styles.formInput}>
        <label htmlFor="wakeTime">Réveil</label>
        <input
          type="datetime-local"
          max={today}
          id="wakeTime"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
        />
      </div>
      <Button text="Enregistrer" priority="high" type="submit" disabled={!isFormValid()} />
    </form>
  );
};

export default FormAddSleep;