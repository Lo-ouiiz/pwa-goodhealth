import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';

export const useSleepPage = () => {
  const { userInfos } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [lastSleep, setLastSleep] = useState(null);
  const [goal, setGoal] = useState(null);
  const [pageQty, setPageQty] = useState(0);
  const [sleepTimes, setSleepTimes] = useState(null);

  const fetchData = async (page) => {
    setDataLoading(true);

    const body = new FormData();
    body.append('type', "sleep");
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
        const sleepTimesArray = [];
        jsonData.data.forEach(element => {
          const parts = element.date.split("-");
          const formattedDate = new Date(parts[0], parts[1] - 1, parts[2]);

          const timeArray = element.sleeptime.match(/\d+/g);
          const hours = parseInt(timeArray[0], 10);
          const minutes = parseInt(timeArray[1], 10);
          const formattedSleepTime = hours + (minutes / 60);

          const newEntry = { x: formattedDate, y: formattedSleepTime };
          dataArray.push(newEntry);

          const entrySleepTimes = { bedtime: element.bedtime, waketime: element.waketime };
          sleepTimesArray.push(entrySleepTimes);
        });
        setData(dataArray);
        setSleepTimes(sleepTimesArray);

        if (dataArray.length && page === 1) {
          const firstElementTab = dataArray[0].y;

          const min = String(Math.floor((firstElementTab - Math.floor(firstElementTab)) * 60)).padStart(2, '0');
          const h = Math.floor(firstElementTab);

          const firstElementSleep = h+"h"+min;
          setLastSleep(firstElementSleep);
        }

        getPageQty();
        setDataLoading(false);
      }
    } catch (error) {
      setDataLoading(false);
      console.error(error.message);
    }
  };

  const getSleepGoal = async () => {
    const body = new FormData();
    body.append('method', "getGoal");
    body.append('userId', userInfos.id);
    body.append('goalType', "sleep");

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
        setGoal(jsonData.data[0].goal_sleep);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getPageQty = async () => {
    const body = new FormData();
    body.append('type', "sleep");
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
    lastSleep,
    getSleepGoal,
    goal,
    getPageQty,
    pageQty,
    sleepTimes
  };
};