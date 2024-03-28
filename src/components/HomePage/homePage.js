import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';

import SleepSection from './SleepSection';
import WeightSection from './WeightSection';
import WaterSection from './WaterSection';
import NavMenu from '../NavMenu';
import styles from './homePage.module.css';

const HomePage = () => {
  const { userInfos } = useContext(AuthContext);

  const [data, setData] = useState(
    JSON.parse(localStorage.getItem('advice')) || {}
  );

  useEffect(() => {
    const storedAdvice = localStorage.getItem('advice');
    const lastUpdated = localStorage.getItem('lastUpdated');
    const currentDate = new Date().toLocaleDateString();

    if (storedAdvice && lastUpdated) {
      const parsedAdvice = JSON.parse(storedAdvice);
      const storedDate = new Date(lastUpdated).toLocaleDateString();

      if (storedDate === currentDate) {
        // Si la date de dernière mise à jour est la même que la date du jour, utiliser les données existantes
        setData(parsedAdvice);
        return;
      }
    }

    // Si la date de dernière mise à jour est différente de la date du jour ou si les données n'existent pas
    // Faire la requête pour obtenir de nouvelles données
    const fetchData = async () => {
      const body = new FormData();
      body.append('type', "advice");
      body.append('method', "list");

      try {
        const response = await fetch(
          'https://api.louise-mendiburu.fr/api-app-portfolio/api.php',
          {
            method: 'POST',
            body: body,
          }
        );

        if (!response.ok) {
          throw new Error('Erreur.');
        }
          
        if (response.ok && response.status === 200) {
          const jsonData = await response.json();
          const adviceData = {
            ...jsonData.data[0],
            date: currentDate
          };
          setData(adviceData);
          localStorage.setItem('advice', JSON.stringify(adviceData));
          localStorage.setItem('lastUpdated', new Date().toISOString());
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const adviceTitle = data ? data.title : null;
  const adviceText = data ? data.text : null;

  return (
    <div className={styles.root}>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1>Bienvenue {userInfos.surname}!</h1>
          <p>
            Ici, vous avez un aperçu complet de votre bien-être. <br/>
            Suivez vos progrès, fixez de nouveaux objectifs et découvrez des conseils personnalisés pour améliorer votre santé et votre qualité de vie. 
          </p>
        </div>
        <div className={styles.adviceContainer}>
          <img src="/images/logo.png" alt="logo"/>
          <div>
            <h2>Le conseil GoodHealth du jour</h2>
            {adviceTitle && adviceText ? (
              <p>{adviceTitle} : {adviceText}</p>
            ) : (
              <p>Hydratation optimale : Buvez au moins 8 verres d'eau aujourd'hui pour maintenir une bonne hydratation.</p>
            )}
          </div>
        </div>
        <div className={styles.sections}>
          <SleepSection />
          <WeightSection />
          <WaterSection />
        </div>
        <NavMenu />
      </div>
    </div>
  );
};

export default HomePage;