import React, { useState, Fragment, useEffect } from 'react';

import NavMenu from '../NavMenu';
import InstallButton from '../InstallButton/installButton';
import styles from './settingsPage.module.css';

const SettingsPage = () => {

  const [isOpenInstall, setIsOpenInstall] = useState(false);
  const [isOpenLegalNotice, setIsOpenLegalNotice] = useState(false);
  const [isInstallButton, setIsInstallButton] = useState(false);

  var toggleInstallClass = isOpenInstall ? `${styles.toggleContent} ${styles.toggleContentOpen}` : styles.toggleContent;
  var toggleLegalNoticeClass = isOpenLegalNotice ? `${styles.toggleContent} ${styles.toggleContentOpen}` : styles.toggleContent;

  const toggleInstallDropdown = () => {
    setIsOpenInstall(!isOpenInstall);
    setIsOpenLegalNotice(false);
  };

  const toggleLegalNoticeDropdown = () => {
    setIsOpenLegalNotice(!isOpenLegalNotice);
    setIsOpenInstall(false);
  };

  useEffect(() => {
    const isInstallPromptSupported = () => {
      return !!window.onbeforeinstallprompt;
    };

    if (isInstallPromptSupported) {
      setIsInstallButton(true);
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1>Mon application</h1>
          <p>Ici, sur cette page dédiée, vous pouvez trouver facilement les réponses à vos questions fréquentes ainsi que des informations détaillées sur l'application.</p>
        </div>
        <div className={styles.toggleContainer}>
          <div className={styles.toggleHeader} onClick={toggleInstallDropdown}>
            <p>Comment installer l'application GoodHealth ?</p>
            {isOpenInstall ? (
              <img src="/icon/chevron-up.png" alt="toggle" />
            ) : (
              <img src="/icon/chevron-down.png" alt="toggle" />
            )}
          </div>
          <div className={toggleInstallClass}>
            <p>
              L'application web GoodHealth est une PWA (Progressive Web App), offrant une expérience utilisateur fluide et intuitive depuis n'importe quel navigateur web. <br/>
              Pas besoin de téléchargement depuis un App Store : accédez simplement à GoodHealth sur votre smartphone ou votre ordinateur pour profiter de toutes ses fonctionnalités, où que vous soyez.
            </p>
            <p>Installer l'application web GoodHealth sur votre appareil est simple et rapide. Voici comment procéder :</p>     
            <ol>
              <li>Ouvrez votre navigateur web préféré sur votre smartphone ou votre ordinateur.</li>
              <li>Accédez à l'URL de GoodHealth dans la barre d'adresse.</li>
              <li>
                Une fois sur la page d'accueil de GoodHealth, recherchez l'option de menu ou d'installation. 
                Sur la plupart des navigateurs, vous pouvez trouver cette option en cliquant sur les trois points verticaux ou horizontaux dans le coin supérieur droit de votre écran.
              </li>
              <li>Dans le menu déroulant, cherchez une option comme "Installer GoodHealth" ou "Ajouter à l'écran d'accueil". Cliquez dessus.</li>
              <li>
                Suivez les instructions à l'écran pour confirmer l'installation. 
                Vous pourriez être invité à choisir un nom pour l'icône de l'application sur votre écran d'accueil.
              </li>
              <li>Une fois l'installation terminée, vous verrez l'icône de GoodHealth sur votre écran d'accueil, comme une toutes vos applications.</li>
              <li>Vous pouvez désormais ouvrir GoodHealth en un seul clic, sans avoir besoin de passer par votre navigateur chaque fois que vous souhaitez l'utiliser.</li>
            </ol>
            <p>Profitez de l'expérience optimale de GoodHealth sur votre appareil, où que vous soyez, en installant notre application web dès aujourd'hui !</p>
          </div>
        </div>

        <div className={styles.toggleContainer}>          
          <div className={styles.toggleHeader} onClick={toggleLegalNoticeDropdown}>
            <p>Mentions légales & CGU</p>
            {isOpenLegalNotice ? (
              <img src="/icon/chevron-up.png" alt="toggle" />

            ) : (
              <img src="/icon/chevron-down.png" alt="toggle" />
            )}          
          </div>
          <div className={toggleLegalNoticeClass}>
            <p className={styles.bold}>MENTIONS LÉGALES&nbsp;:</p>
            <p> GoodHealth est une application web développée et exploitée par Louise Mendiburu. Tous droits réservés. <br/><br/>
              <span className={styles.bold}>Hébergeur :</span> Infomaniak Network SA <br/>
              <span className={styles.bold}>Siège social :</span> Avenue de la Praille 26, 1227 Carouge / Genève, Suisse <br/>
              <span className={styles.bold}>Site web :</span> <a href="https://www.infomaniak.com">www.infomaniak.com</a> <br/><br/>
              <span className={styles.bold}>Directrice de la publication :</span> Louise Mendiburu <br/><br/>
            </p>
            <p className={styles.bold}>CONDITIONS D'UTILISATION GÉNÉRALES (CGU)&nbsp;:</p>
            <ol>
              <li>
                <span className={styles.bold}>Utilisation de l'application :</span> <br/>
                En utilisant l'application GoodHealth, vous acceptez de vous conformer à ces conditions générales d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.
              </li>
              <li>
                <span className={styles.bold}>Confidentialité :</span> <br/>
                Nous collectons et utilisons vos données conformément à notre politique de confidentialité. 
                En utilisant l'application, vous consentez à notre collecte, utilisation et partage de vos données personnelles comme décrit dans ladite politique.
              </li>
              <li>
                <span className={styles.bold}>Compte utilisateur :</span> <br/>
                Vous êtes responsable de la sécurité de votre compte utilisateur et de toutes les activités qui s'y produisent. 
                Vous vous engagez à ne pas partager votre mot de passe avec des tiers et à nous informer immédiatement de toute utilisation non autorisée de votre compte.
              </li>
              <li>
                <span className={styles.bold}>Propriété intellectuelle :</span> <br/>
                Tous les contenus de l'application, y compris les textes, les graphiques, les logos, les icônes, les images, les clips audio, les vidéos et les données, sont la propriété exclusive de GoodHealth ou de ses concédants de licence et sont protégés par les lois sur le droit d'auteur et autres lois applicables en matière de propriété intellectuelle.
              </li>
              <li>
                <span className={styles.bold}>Limitation de responsabilité :</span> <br/>
                GoodHealth ne peut être tenu responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs découlant de l'utilisation ou de l'incapacité d'utiliser l'application.
              </li>
            </ol>
            <p>
              En utilisant l'application GoodHealth, vous reconnaissez avoir lu, compris et accepté ces conditions générales d'utilisation. 
              Ces conditions peuvent être modifiées à tout moment sans préavis.
            </p>
          </div>
        </div>

        <NavMenu />
      </div>
    </div>
  );
};

export default SettingsPage;