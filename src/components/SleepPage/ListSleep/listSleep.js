import React, { useState, useContext, Fragment } from 'react';
import { AuthContext } from '../../../context/authContext';

import Button from '../../Button';
import styles from './listSleep.module.css';

const ListSleep = props => {
  const { fetchData, data, sleepTimes, handlePrev, handleNext } = props;

  const { userInfos } = useContext(AuthContext);

  const [bedtime, setBedtime] = useState();
  const [wakeTime, setWakeTime] = useState();
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editElement, setEditElement] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteElement, setDeleteElement] = useState(null);

  const isFormValid = () => {
    return bedtime && wakeTime;
  };

  const handleEditForm = (element, index) => {
    const sleepTimesElement = sleepTimes[index];

    setEditElement(element);
    setBedtime(sleepTimesElement.bedtime);
    setWakeTime(sleepTimesElement.waketime);
    setShowEditForm(true);
  };

  const handleConfirmDelete = (element) => {
    setDeleteElement(element);
    setShowConfirmDelete(true);
  };

  const handleEdit = async (element, index) => {
    const localDate = new Date(element.x.getTime() - (element.x.getTimezoneOffset() * 60000));
    const formattedDate = localDate.toISOString().split('T')[0];

    const body = new FormData();
    body.append('type', "sleep");
    body.append('method', "update");
    body.append('userId', userInfos.id);
    body.append('date', formattedDate);
    body.append('bedtime', bedtime);
    body.append('waketime', wakeTime);

    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/api.php', {
        method: 'POST',
        body: body
      });  

      if (!response.ok || response.status !== 200) {
        const errorData = await response.json();
  
        if (errorData.code === 500 && errorData.message === "Failed to update sleep record.") {
          throw new Error('Erreur pendant la modification. Réessayez plus tard.');
        } else {
          throw new Error('Erreur.');
        }
      }
      
      if (response.ok && response.status === 200) {
        setError('');
        setShowEditForm(false);
        fetchData();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (element) => {
    const localDate = new Date(element.x.getTime() - (element.x.getTimezoneOffset() * 60000));
    const formattedDate = localDate.toISOString().split('T')[0];

    const body = new FormData();
    body.append('type', "sleep");
    body.append('method', "delete");
    body.append('userId', userInfos.id);
    body.append('date', formattedDate);

    try {
      const response = await fetch('https://api.louise-mendiburu.fr/api-app-portfolio/api.php', {
        method: 'POST',
        body: body
      });  

      if (!response.ok || response.status !== 200) {
        const errorData = await response.json();
  
        if (errorData.code === 500 && errorData.message === "Failed to delete sleep record.") {
          throw new Error('Erreur pendant la suppression. Réessayez plus tard.');
        } else {
          throw new Error('Erreur.');
        }
      }
      
      if (response.ok && response.status === 200) {
        setError('');
        setShowConfirmDelete(false);
        fetchData();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const list = data ? data.map((element, index) => {  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = element.x.toLocaleDateString('fr-FR', options);

    const min = String(Math.floor((element.y - Math.floor(element.y)) * 60)).padStart(2, '0');
    const h = Math.floor(element.y);
    const elementSleep = h+"h"+min;

    return (
      <div className={styles.listElement}  key={index}>
        <div>
          <p className={styles.date}>{dateString} : </p>
          <p>{elementSleep}</p>
        </div>
        <div>
          <button onClick={() => handleEditForm(element, index)}>
            <img src="/icon/edit.png" alt="edit"/>
          </button>
          <button onClick={() => handleConfirmDelete(element)}>
            <img src="/icon/trash.png" alt="delete"/>
          </button>
        </div>
      </div>
    );
  }) : null;

  if (showEditForm) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = editElement.x.toLocaleDateString('fr-FR', options);

    return (
      <div className={styles.confirmDelete}>
        <p>Modification du temps de sommeil pour le <span className={styles.date}>{dateString}</span></p>
        <div className={styles.formInput}>
        <label htmlFor="bedtime">Coucher</label>
        <input
          type="datetime-local"
          id="bedtime"
          value={bedtime}
          onChange={(e) => setBedtime(e.target.value)}
        />
      </div>
      <div className={styles.formInput}>
        <label htmlFor="wakeTime">Réveil</label>
        <input
          type="datetime-local"
          id="wakeTime"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
        />
      </div>
        <div className={styles.editModalButtons}>
          <Button text="Enregistrer" priority="high" onClick={() => handleEdit(editElement)} disabled={!isFormValid} />
          <Button text="Annuler" priority="low" onClick={() => setShowEditForm(false)} />
        </div>
      </div>
    );
  }

  if (showConfirmDelete) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = deleteElement.x.toLocaleDateString('fr-FR', options);

    const min = String(Math.floor((deleteElement.y - Math.floor(deleteElement.y)) * 60)).padStart(2, '0');
    const h = Math.floor(deleteElement.y);
    const elementSleep = h+"h"+min;

    return (
      <div className={styles.confirmDelete}>
        <p>Etes-vous sûr de vouloir supprimer ces données ?</p>
        <div>
          <p className={styles.date}>{dateString} : </p>
          <p>{elementSleep}</p>
        </div>
        <div className={styles.confirmDeleteButtons}>
          <Button text="Oui" priority="high" onClick={() => handleDelete(deleteElement)} />
          <Button text="Non" priority="low" onClick={() => setShowConfirmDelete(false)} />
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className={styles.list}>{list}</div>
      <div className={styles.containerArrowButtons}>
        <button className={styles.arrowButton} onClick={handlePrev}>
          <img src="/icon/left-arrow.png" alt="left arrow"/>
          <p>Précédent</p>
        </button>
        <button className={styles.arrowButton} onClick={handleNext}>
          <p>Suivant</p>
          <img src="/icon/right-arrow.png" alt="right arrow"/>
        </button>
      </div>
    </Fragment>
  );
};

export default ListSleep;