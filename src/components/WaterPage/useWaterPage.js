import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';

export const useWaterPage = () => {
  const { userInfos } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [lastWater, setLastWater] = useState(null);
  const [goal, setGoal] = useState(null);
  const [pageQty, setPageQty] = useState(0);
  const [todayWater, setTodayWater] = useState(null);

  const fetchData = async (page) => {
    setDataLoading(true);

    const body = new FormData();
    body.append('type', "water");
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

          const newEntry = { x: formattedDate, y: element.water_qty };
          dataArray.push(newEntry);
        });
        setData(dataArray);

        if (dataArray.length && page === 1) {
          const firstElementWater = dataArray[0].y;
          setLastWater(firstElementWater);

          const today = new Date().toISOString().split('T')[0];
          const dateObject = dataArray[0].x;
          const formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`;

          if (formattedDate === today) {
            setTodayWater(dataArray[0].y);
          } else {
            setTodayWater(null);
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

  const getWaterGoal = async () => {
      const body = new FormData();
      body.append('method', "getGoal");
      body.append('userId', userInfos.id);
      body.append('goalType', "water");
  
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
          setGoal(jsonData.data[0].goal_water);
        }
      } catch (error) {
        console.error(error.message);
      }
  };

  const getPageQty = async () => {
    const body = new FormData();
    body.append('type', "water");
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

  const addTodayWater = async (operation) => {
    const today = new Date().toISOString().split('T')[0];

    const body = new FormData();
    body.append('type', "water");
    body.append('method', "addToday");
    body.append('userId', userInfos.id);
    body.append('date', today);
    body.append('operation', operation);

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
        fetchData(1);
      }
    } catch (error) {
      setDataLoading(false);
      console.error(error.message);
    }
  };

  return {
    fetchData,
    data,
    dataLoading,
    lastWater,
    getWaterGoal,
    goal,
    getPageQty,
    pageQty,
    addTodayWater,
    todayWater
  };
};