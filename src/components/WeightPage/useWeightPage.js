import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';

export const useWeightPage = () => {
  const { userInfos } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [lastWeight, setLastWeight] = useState(null);
  const [weightDifference, setWeightDifference] = useState(null);
  const [negative, setNegative] = useState(false);
  const [goal, setGoal] = useState(null);
  const [pageQty, setPageQty] = useState(0);

  const fetchData = async (page) => {
    setDataLoading(true);

    const body = new FormData();
    body.append('type', "weight");
    body.append('method', "list");
    body.append('userId', userInfos.id);
    body.append('page', page);

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
          errorData.code === 404 &&
          errorData.message === 'No records to display'
        ) {
          throw new Error('Il n\'y a pas de données disponibles.');
        }
      }

      if (response.ok && response.status === 200) {
        const jsonData = await response.json();

        const dataArray = [];
        jsonData.data.forEach(element => {
          const parts = element.date.split("-");
          const formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);

          const newEntry = { x: formattedDate, y: element.weight };
          dataArray.push(newEntry);
        });
        setData(dataArray);

        if (dataArray.length && page === 1) {
          const firstElementWeight = dataArray[0].y.toLocaleString('fr-FR');
          setLastWeight(firstElementWeight);

          const diff = dataArray.length > 1 ? (dataArray[0].y - dataArray[1].y).toFixed(1) : null;
          const weightDiff = diff ? Math.abs(diff).toLocaleString('fr-FR') : null;
          setWeightDifference(weightDiff);

          const negative = diff ? Math.sign(diff) === -1 : false;
          if (negative) {
            setNegative(true);
          }
        }
        
        getPageQty();
        setDataLoading(false);
      }
    } catch (error) {
      setDataLoading(false);
      console.error(error.message);
    }
  };

  const getWeightGoal = async () => {
      const body = new FormData();
      body.append('method', "getGoal");
      body.append('userId', userInfos.id);
      body.append('goalType', "weight");
  
      try {
        const response = await fetch(
          'https://api.louise-mendiburu.fr/api-app-portfolio/apiUser.php',
          {
            method: 'POST',
            body: body,
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          if (
            errorData.code === 404 &&
            errorData.message === 'No records to display'
          ) {
            throw new Error('Il n\'y a pas de données disponibles.');
          }
        }
  
        if (response.ok && response.status === 200) {
          const jsonData = await response.json();
          setGoal(jsonData.data[0].goal_weight.toLocaleString('fr-FR'));
        }
      } catch (error) {
        console.error(error.message);
      }
  };

  const getPageQty = async () => {
    const body = new FormData();
    body.append('type', "weight");
    body.append('method', "getPageQuantity");
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
          errorData.code === 404 &&
          errorData.message === 'No records to display'
        ) {
          throw new Error('Il n\'y a pas de données disponibles.');
        }
      }

      if (response.ok && response.status === 200) {
        const jsonData = await response.json();
        setPageQty(jsonData.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    fetchData,
    data,
    dataLoading,
    lastWeight,
    weightDifference,
    negative,
    getWeightGoal,
    goal,
    getPageQty,
    pageQty
  };
};