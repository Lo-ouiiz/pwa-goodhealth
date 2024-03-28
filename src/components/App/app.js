import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../../context/authContext';

import AuthPage from '../AuthPage';
import HomePage from '../HomePage';
import UserPage from '../UserPage';
import WeightPage from '../WeightPage';
import SleepPage from '../SleepPage';
import WaterPage from '../WaterPage';
import SettingsPage from '../SettingsPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute element="home" />} />
          <Route exact path="/account" element={<PrivateRoute element="account" />} />
          <Route exact path="/weight" element={<PrivateRoute element="weight" />} />
          <Route exact path="/sleep" element={<PrivateRoute element="sleep" />} />
          <Route exact path="/water" element={<PrivateRoute element="water" />} />
          <Route exact path="/settings" element={<PrivateRoute element="settings" />} />
          <Route exact path="/login" element={<AuthPage/>} />
          <Route path="*" element={<PrivateRoute element="home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute = props => {
  const { element } = props;
  const { isLoggedIn } = useContext(AuthContext);

  if (element === "home") {
    return isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />;
  } else if (element === "account") {
    return isLoggedIn ? <UserPage /> : <Navigate to="/login" replace />;
  } else if (element === "weight") {
    return isLoggedIn ? <WeightPage /> : <Navigate to="/login" replace />;
  }else if (element === "water") {
    return isLoggedIn ? <WaterPage /> : <Navigate to="/login" replace />;
  } else if (element === "sleep") {
    return isLoggedIn ? <SleepPage /> : <Navigate to="/login" replace />;
  } else if (element === "settings") {
    return isLoggedIn ? <SettingsPage /> : <Navigate to="/login" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default App;