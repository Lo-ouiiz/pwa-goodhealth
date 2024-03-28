import React from 'react';
import { Link } from 'react-router-dom';

import styles from './navMenu.module.css';

const NavMenu = props => {
  const linksTab = [
    { text: "Compte", icon: "/icon/userpage.png", link: "/account" },
    { text: "Accueil", icon: "/icon/homepage.png", link: "/" },
    { text: "Paramètres", icon: "/icon/settingspage.png", link: "/settings" }
  ];

  const links = linksTab.map(element => {
    return (
      <Link className={styles.link} to={element.link} key={element.text}>
        <img src={element.icon} className={styles.icon} alt={element.text}/>
      </Link>
    );
  });

  return (
    <div className={styles.root}>
      {links}
    </div>
  );
};

export default NavMenu;