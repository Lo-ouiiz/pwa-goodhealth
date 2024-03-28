import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../../context/authContext';
import { Link } from 'react-router-dom';

import styles from './waterSection.module.css';

const WaterSection = () => {
  const { userInfos } = useContext(AuthContext);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {

      const body = new FormData();
      body.append('type', "water");
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

  const waterQty = data ? data.water_qty : null;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <img src="/icon/water.png" className={styles.icon} alt="water icon"/>
        <h3>Suivi de l'hydratation</h3>
      </div>
      <div className={styles.content}>
        {waterQty ? (
          <p className={styles.data}>{waterQty} ml</p>
        ) : (
          <p className={styles.noData}>Pas de données à afficher</p>
        )}
      </div>
      <Link className={styles.link} to="/water">
        <p>Voir plus</p>
        <img src="/icon/right-arrow.png" className={styles.arrow} alt="arrow"/>
      </Link>
    </div>
  );
};

export default WaterSection;