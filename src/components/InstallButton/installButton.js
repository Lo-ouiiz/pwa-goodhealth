import React, { useState, useEffect } from 'react';
import Button from '../Button';
import styles from './installButton.module.css';

const InstallButton = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleClick = async () => {
    if (promptInstall) {
      promptInstall.prompt();
      const choiceResult = await promptInstall.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setPromptInstall(null);
    }
  };

  const rootClass = supportsPWA ? styles.root : styles.rootHidden;

  return (
    <div className={rootClass}>
      <p>Installez l'application web GoodHealth sur votre appareil dès maintenant en cliquant sur le bouton ci-dessous.</p>
      <div className={styles.button}>
        <Button text="Installer GoodHealth" priority="high" onClick={handleClick} />
      </div>
    </div>
  );
};

export default InstallButton;