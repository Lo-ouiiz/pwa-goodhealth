import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CanvasJSReact from '@canvasjs/react-charts';

import { useSleepPage } from './useSleepPage';
import Modal from '../Modal';
import Button from '../Button';
import Loader from '../Loader';
import NavMenu from '../NavMenu';
import FormAddSleep from './FormAddSleep';
import ListSleep from './ListSleep';
import FormGoalSleep from './FormGoalSleep';
import styles from './sleepPage.module.css';

const SleepPage = () => {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const talonProps = useSleepPage();
  const { 
    fetchData,
    data,
    dataLoading,
    lastSleep,
    getSleepGoal,
    goal,
    pageQty,
    sleepTimes
  } = talonProps;

  useEffect(() => {
    fetchData(page);
    getSleepGoal();
  }, []);

  const handlePrevButtonClick = async () => {
    if (page < pageQty) {
      await fetchData(page + 1);
      setPage(page + 1);
    }
  };

  const handleNextButtonClick = async () => {
    if (page !== 1) {
      await fetchData(page - 1);
      setPage(page - 1);
    }
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };
  
  const handleShowModifyModal = () => {
    setShowModifyModal(true);
  };

  const handleShowGoalModal = () => {
    setShowGoalModal(true);
  };
  
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowModifyModal(false);
    setShowGoalModal(false);
  };

  const initialGoalFormValue = {
    goal: goal ? goal : 0
  }

  const options = {
    animationEnabled: true,
    axisX: {
      labelFontFamily: "Poppins Regular",
      valueFormatString: "DD/MM",
      interval: 1,
    },
    axisY: {
      labelFontFamily: "Poppins Regular",
      gridThickness: 1,
      gridColor: "#e6e6e6",
      interval: 1,
      stripLines: goal ? [{
        value: goal,
        label: "objectif",
        color: "#000",
        thickness: 2,
        labelFontFamily: "Poppins Regular",
        labelFontColor: "#000",
        showOnTop: true  
      }] : [] 
    },
    toolTip: {
      fontFamily: "Poppins Regular",
      cornerRadius: 7
    },
    data: [{
      type: "column",
      color: "#ffc400",
      yValueFormatString: "#h",
      xValueFormatString: "DD/MM",
      toolTipContent: "<strong>{x}</strong>: {y} de sommeil",
      dataPoints: data ? data : []
    }]
  }
  
  return (
    <div className={styles.root}>
      <div className={styles.pageContainer}>

        <div className={styles.header}>
          <Link to="/" className={styles.backButton}>
            <img src="/icon/left-arrow.png" alt="back button"/>
            <p>Retour</p>
          </Link>
          <h1>Suivi du sommeil</h1>
          <p>
            Sur cette page, enregistrez votre sommeil régulièrement, suivez votre progression et recevez des conseils pour atteindre vos objectifs de sommeil.
          </p>
        </div>
        <div className={styles.containerSleepInfos}>
          <div className={styles.containerLastSleep}>
            <p>Mon dernier temps de sommeil</p>
            {lastSleep ? (
              <p className={styles.sleep}>{lastSleep}</p>
            ) : (
              <p>Vous n'avez pas enregistré de temps de sommeil.</p>
            )}
          </div>
          <div className={styles.containerLastSleep}>
            <p>Mon objectif de temps</p>
            {goal ? (
              <p className={styles.sleep}>{goal}h</p>
            ) : (
              <p>Vous n'avez pas défini d'objectif.</p>
            )}
          </div>
        </div>
        <div className={styles.containerGraph}>
          <div className={styles.headerGraph}>
            <p>Mon suivi</p>
            <div className={styles.containerGraphButtons}>
              <button className={styles.graphButton} onClick={handlePrevButtonClick}>
                <img src="/icon/left-arrow.png" alt="left arrow"/>
              </button>
              <button className={styles.graphButton} onClick={handleNextButtonClick}>
                <img src="/icon/right-arrow.png" alt="right arrow"/>
              </button>
            </div>
          </div>
          {dataLoading ? <div className={styles.loaderMask}><Loader /></div> : null}
          {!data && !dataLoading ? <div className={styles.mask}><p>Entrez des données pour voir votre suivi</p></div> : null}
          <CanvasJSChart options={options} />
        </div>
        <div className={styles.containerButtons}>
          <Button text="Ajouter des données" priority="high" onClick={handleShowAddModal} />
          <Button text="Modifier/supprimer des données" priority="high" onClick={handleShowModifyModal} disabled={!data}/>
          <Button text="Modifier mon objectif" priority="high" onClick={handleShowGoalModal} />
        </div>
        <Modal 
          title="Ajouter des données"
          component={
            <FormAddSleep
              fetchData={() => fetchData(page)} 
              closeModal={handleCloseModal}
            />
          } 
          showModal={showAddModal} 
          closeModal={handleCloseModal} 
        />
        <Modal 
          title="Modifier/supprimer des données"
          component={
            <ListSleep
              data={data}
              sleepTimes={sleepTimes}
              fetchData={() => fetchData(page)}
              handlePrev={handlePrevButtonClick}
              handleNext={handleNextButtonClick}
            />
          } 
          showModal={showModifyModal} 
          closeModal={handleCloseModal} 
        />
        <Modal 
          title="Modifier mon objectif"
          component={
            <FormGoalSleep 
              initialValue={initialGoalFormValue}
              fetchGoal={getSleepGoal} 
              closeModal={handleCloseModal}
            />
          }  
          showModal={showGoalModal} 
          closeModal={handleCloseModal} 
        />
        <NavMenu />
      </div>
    </div>
  );
};

export default SleepPage;