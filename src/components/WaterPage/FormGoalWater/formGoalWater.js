import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/authContext';

import Button from '../../Button';
import styles from './formGoalWater.module.css';

const FormGoalWater = props => {
  const { initialValue, closeModal, fetchGoal } = props;

  const { userInfos } = useContext(AuthContext);

  const [goal, setGoal] = useState(initialValue.goal);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValue !== goal) {
      setGoal(initialValue.goal);
    }
  }, [initialValue]);

  const isFormValid = () => {
    return goal;
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = new FormData();
    body.append('method', "updateGoal");
    body.append('userId', userInfos.id);
    body.append('goalType', "water");
    body.append('goalValue', goal);

    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/apiUser.php', {
        method: 'POST',
        body: body
      });  

      if (!response.ok || response.status !== 200) {
        const errorData = await response.json();
  
        if (errorData.code === 500 && errorData.message === "Failed to update water goal.") {
          throw new Error('Erreur dans l\'enregistrement des données. Veuillez réessayer ultérieurement.');
        } else {
          throw new Error('Erreur.');
        }
      }
      
      if (response.ok && response.status === 200) {
        setError('');
        fetchGoal();
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
        <label htmlFor="goal">Consommation d'eau (en ml)</label>
        <input
          type="number"
          min="250"
          step="50"
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <Button text="Enregistrer" priority="high" type="submit" disabled={!isFormValid()} />
    </form>
  );
};

export default FormGoalWater;