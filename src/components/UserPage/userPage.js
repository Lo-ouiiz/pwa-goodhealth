import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';

import NavMenu from '../NavMenu';
import Button from '../Button';
import Modal from '../Modal';
import Popup from '../Popup';
import UpdateModal from './UpdateModal';
import UpdatePasswordModal from './UpdatePasswordModal';
import DeleteModal from './DeleteModal';
import styles from './userPage.module.css';

const UserPage = () => {
  const { userInfos, logout } = useContext(AuthContext);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(false);

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleShowUpdateModal = () => {
    setShowUpdateModal(true);
  };

  const handleShowPasswordModal = () => {
    setShowPasswordModal(true);
  };
  
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowUpdateModal(false);
    setShowPasswordModal(false);
  };

  const displayPopup = message => {
    setShowPopup(true);
    setPopupMessage(message);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.root}>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1>Mon espace personnel</h1>
          <p>
            Ici, gérez facilement votre profil et vos préférences. <br />
            Mettez à jour vos informations personnelles et réinitialisez votre mot de passe.
          </p>
        </div>
        <div className={styles.userContainer}>
          <p><span className={styles.userField}>Nom&nbsp;:</span>{userInfos.surname} {userInfos.firstname}</p>
          <p><span className={styles.userField}>Adresse mail&nbsp;:</span>{userInfos.email}</p>
          <img src="/icon/edit.png" className={styles.editIcon} alt="edit" onClick={handleShowUpdateModal} />
        </div>
        <div className={styles.userContainer}>
          <p><span className={styles.userField}>Mot de passe&nbsp;:</span>********</p>
          <img src="/icon/edit.png" className={styles.editIcon} alt="edit" onClick={handleShowPasswordModal} />
        </div>
        <div className={styles.buttonsContainer}>
          <Button text="Me déconnecter" priority="high" onClick={logout} /> 
          <Button text="Supprimer mon compte" priority="low" onClick={handleShowDeleteModal} />
        </div>
        <Modal 
          title="Modifier mes informations"
          component={
            <UpdateModal 
              closeModal={handleCloseModal}
              displayPopup={() => displayPopup('Vos informations ont bien été modifiées')}
            /> 
          } 
          showModal={showUpdateModal} 
          closeModal={handleCloseModal} 
        />
        <Modal 
          title="Modifier mon mot de passe"
          component={
            <UpdatePasswordModal 
              closeModal={handleCloseModal}
              displayPopup={() => displayPopup('Votre mot de passe a bien été modifié')}
            /> 
          } 
          showModal={showPasswordModal} 
          closeModal={handleCloseModal} 
        />
        <Modal 
          title="Supprimer mon compte"
          component={
            <DeleteModal 
              closeModal={handleCloseModal}
            /> 
          } 
          showModal={showDeleteModal} 
          closeModal={handleCloseModal} 
        />
        <Popup
          showPopup={showPopup}
          message={popupMessage}
          duration={3000}
          onClose={closePopup}
        />
        <NavMenu />
      </div>
    </div>
  );
};

export default UserPage;