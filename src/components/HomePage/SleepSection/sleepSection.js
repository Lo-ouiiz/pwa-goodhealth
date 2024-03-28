import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../context/authContext';
import { Link } from 'react-router-dom';

import styles from './sleepSection.module.css';

const SleepSection = () => {
  const { userInfos } = useContext(AuthContext);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {

      const body = new FormData();
      body.append('type', "sleep");
      body.append('method', "listLastOne");
      body.append('userId', userInfos.id);

      try {
        const response = await fetch(
          'https://api.louise-mendiburu.fr/api-app-portfolio/api.php',
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
            const jsonData = await response.json();

            if (!data) {
              setData(jsonData.data[0]);
            }
          }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();

  }, [userInfos, data]);

  const timeArray = data ? data.sleeptime.match(/\d+/g) : [];
  const hours = timeArray.length ? parseInt(timeArray[0], 10) : null;
  const minutes = timeArray.length ? String(parseInt(timeArray[1], 10)).padStart(2, '0') : null;
  const sleep = hours && minutes ? hours+"h"+minutes : null;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <img src="/icon/sleep.png" className={styles.icon} alt="sleep icon"/>
        <h3>Suivi du sommeil</h3>
      </div>
      <div className={styles.content}>
        {sleep ? (
          <p className={styles.data}>{sleep}</p>
        ) : (
          <p className={styles.noData}>Pas de données à afficher</p>
        )}
      </div>
      <Link className={styles.link} to="/sleep">
        <p>Voir plus</p>
        <img src="/icon/right-arrow.png" className={styles.arrow} alt="arrow"/>
      </Link>
    </div>
  );
};

export default SleepSection;