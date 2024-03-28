import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CanvasJSReact from '@canvasjs/react-charts';

import { useWeightPage } from './useWeightPage';
import Modal from '../Modal';
import Button from '../Button';
import Loader from '../Loader';
import NavMenu from '../NavMenu';
import FormAddWeight from './FormAddWeight';
import ListWeight from './ListWeight';
import FormGoalWeight from './FormGoalWeight';
import styles from './weightPage.module.css';

const WeightPage = () => {
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const [page, setPage] = useState(1);
  const [weightDifferenceClass, setWeightDifferenceClass] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const talonProps = useWeightPage();
  const { 
    fetchData,
    data,
    dataLoading,
    lastWeight,
    weightDifference,
    negative,
    getWeightGoal,
    goal,
    pageQty
  } = talonProps;

  useEffect(() => {
    fetchData(page);
    getWeightGoal();
  }, []);

  useEffect(() => {
    if (weightDifference === "0") {
      setWeightDifferenceClass(styles.noWeightDiff);
    } else if (negative) {
      setWeightDifferenceClass(styles.negativeWeightDiff);
    } else {
      setWeightDifferenceClass(styles.positiveWeightDiff);
    }
  }, [negative, weightDifference]);

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
    weight: lastWeight ? Number(lastWeight.replace(',', '.')) : 0
  };

  const initialGoalFormValue = {
    goal: goal ? Number(goal.replace(',', '.')) : 0
  }

  let dataMinX = 0;
  let dataMaxX = 0;

  if (data) {
    dataMinX = Math.min(...data.map(point => point.x));
    dataMaxX = Math.max(...data.map(point => point.x)) + 10000000;
  }

  const options = {
    animationEnabled: true,
    axisX: {
      labelFontFamily: "Poppins Regular",
      valueFormatString: "DD/MM",
      interval: 1,
      minimum: dataMinX,
      maximum: dataMaxX
    },
    axisY: {
      labelFontFamily: "Poppins Regular",
      gridThickness: 1,
      gridColor: "#e6e6e6",
      interval: 1,
      stripLines: goal ? [{
        value: Number(goal.replace(',', '.')),
        label: "objectif",
        color: "#ffc400",
        thickness: 2,
        labelFontFamily: "Poppins Regular",
        labelFontColor: "#ffc400",
        showOnTop: true
      }] : [] 
    },
    toolTip: {
      fontFamily: "Poppins Regular",
      cornerRadius: 7
    },
    data: [{
      color: "#000",
      lineThickness: 2,
      lineColor: "#000",
      yValueFormatString: "##.#kg",
      xValueFormatString: "DD/MM",
      type: "spline",

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
          <h1>Suivi du poids</h1>
          <p>
            Sur cette page, enregistrez votre poids régulièrement, suivez votre progression et recevez des conseils pour atteindre vos objectifs de poids santé.
          </p>
        </div>
        <div className={styles.containerWeightInfos}>
          <div className={styles.containerLastWeight}>
            <p>Mon poids actuel</p>
            <div className={styles.containerWeight}>
              {lastWeight ? (
                <p className={styles.weight}>{lastWeight} kg</p>
              ) : (
                <p>Vous n'avez pas enregistré de poids.</p>
              )}
              {weightDifference ? (
                <div className={styles.weightDiff}>
                  <span>(</span>
                  <span className={weightDifferenceClass}>{weightDifference}</span>
                  <span>)</span>
                </div>
              ) : null}
            </div>
          </div>
          <div className={styles.containerLastWeight}>
            <p>Mon objectif</p>
            {goal ? (
              <p className={styles.weight}>{goal} kg</p>
            ) : (
              <p>Vous n'avez pas défini d'objectif.</p>
            )}
          </div>
        </div>
        <div className={styles.containerGraph}>
          <div className={styles.headerGraph}>
            <p>Ma courbe de suivi</p>
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
            <FormAddWeight 
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
            <ListWeight
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
            <FormGoalWeight 
              initialValue={initialGoalFormValue}
              fetchGoal={getWeightGoal} 
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

export default WeightPage;