import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CanvasJSReact from '@canvasjs/react-charts';

import { useWaterPage } from './useWaterPage';
import Modal from '../Modal';
import Button from '../Button';
import Loader from '../Loader';
import NavMenu from '../NavMenu';
import FormAddWater from './FormAddWater';
import ListWater from './ListWater';
import FormGoalWater from './FormGoalWater';
import styles from './waterPage.module.css';

const WaterPage = () => {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const talonProps = useWaterPage();
  const { 
    fetchData,
    data,
    dataLoading,
    lastWater,
    getWaterGoal,
    goal,
    pageQty,
    addTodayWater,
    todayWater
  } = talonProps;

  useEffect(() => {
    fetchData(page);
    getWaterGoal();
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

  const initialAddFormValues = {
    date: new Date().toISOString().split('T')[0],
    water: lastWater ? lastWater : 0
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
      yValueFormatString: "#ml",
      xValueFormatString: "DD/MM",
      toolTipContent: "<strong>{x}</strong>: {y} d'eau consommée",
      dataPoints: data ? data : []
    }]
  };

  return (
    <div className={styles.root}>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <Link to="/" className={styles.backButton}>
            <img src="/icon/left-arrow.png" alt="back button"/>
            <p>Retour</p>
          </Link>
          <h1>Suivi de l'hydratation</h1>
          <p>
            Sur cette page, enregistrez votre consommation d'eau régulièrement, suivez votre progression et recevez des conseils pour atteindre vos objectifs d'hydratation quotidienne.
          </p>
        </div>
        <div>
        <div className={styles.containerLastWater}>
            <p>Ma consommation d'eau aujourd'hui</p>
            <div className={styles.containerTodayWater}>
              <button onClick={() => addTodayWater("remove")} >
                <img src="/icon/minus.png" alt="minus" />
              </button>
              {todayWater ? (
                <p className={styles.water}>{todayWater} ml</p>
              ) : (
                <p className={styles.water}>0 ml</p>
              )}
              <button onClick={() => addTodayWater("add")}>
                <img src="/icon/plus.png" alt="plus" />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.containerWaterInfos}>
          <div className={styles.containerLastWater}>
            <p>Ma dernière consommation d'eau</p>
            <div className={styles.containerWater}>
              {lastWater ? (
                <p className={styles.water}>{lastWater} ml</p>
              ) : (
                <p>Vous n'avez pas enregistré votre hydratation.</p>
              )}
            </div>
          </div>
          <div className={styles.containerLastWater}>
            <p>Mon objectif</p>
            {goal ? (
              <p className={styles.water}>{goal} ml</p>
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
          {!data && !dataLoading ? <div className={styles.mask}><p>Entrez des données pour voir votre courbe de suivi</p></div> : null}
          <CanvasJSChart options={options} />
        </div>
        <div className={styles.containerButtons}>
          <Button text="Ajouter des données" priority="high" onClick={handleShowAddModal}/>
          <Button text="Modifier/supprimer des données" priority="high" onClick={handleShowModifyModal} disabled={!data}/>
          <Button text="Modifier mon objectif" priority="high" onClick={handleShowGoalModal} />
        </div>
        <Modal 
          title="Ajouter des données"
          component={
            <FormAddWater 
              initialValues={initialAddFormValues}
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
            <ListWater
              data={data}
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
            <FormGoalWater 
              initialValue={initialGoalFormValue}
              fetchGoal={getWaterGoal} 
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

export default WaterPage;