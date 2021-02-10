import React from "react";
import styles from "./navbar.module.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src="/assets/images/logo.png" alt="" />
        </Link>
      </div>
      <nav>
        <ul>
          <li className={styles.navItem}>SECURE VOTING APP</li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
