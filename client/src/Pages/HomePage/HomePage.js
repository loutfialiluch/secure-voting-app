import React from "react";
import styles from "./homepage.module.css";
import { Link } from "react-router-dom";
import candidates from "../../candidates";

const HomePage = () => {
  return (
    <>
      <section className={styles.home}>
        <h1 className={styles.mainTitle}>Vote for the next PDG !</h1>
        <div className={styles.candidates}>
          {candidates.map((candidate) => (
            <div key={candidate.id} className={styles.candidate}>
              <div className={styles.candidateImgWrapper}>
                <img src={`/assets/images/${candidate.image}`} alt="" />
              </div>
              <h1>{candidate.fullName.split(" ")[1]}</h1>
              <Link to={`/vote/${candidate.id}`}>Vote</Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
