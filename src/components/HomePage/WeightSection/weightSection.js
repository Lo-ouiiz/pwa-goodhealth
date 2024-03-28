import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../context/authContext';
import { Link } from 'react-router-dom';

import styles from './weightSection.module.css';

const WeightSection = () => {
  const { userInfos } = useContext(AuthContext);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {

      const body = new FormData();
      body.append('type', "weight");
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

  const weight = data ? data.weight.toLocaleString('fr-FR') : null;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <img src="/icon/weight.png" className={styles.icon} alt="weight icon"/>
        <h3>Suivi du poids</h3>
      </div>
      <div className={styles.content}>        
        {weight ? (
          <p className={styles.data}>{weight} kg</p>
        ) : (
          <p className={styles.noData}>Pas de données à afficher</p>
        )}
      </div>
      <Link className={styles.link} to="/weight">
        <p>Voir plus</p>
        <img src="/icon/right-arrow.png" className={styles.arrow} alt="arrow"/>
      </Link>
    </div>
  );
};

export default WeightSection;