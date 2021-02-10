import React, { useEffect, useState } from "react";
import styles from "./votingpage.module.css";
import candidates from "../../candidates";
import * as openpgp from "openpgp";
import axios from "axios";

const VotingPage = (props) => {
  const [candidate, setCandidate] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const id = props.match.params.id;

  useEffect(() => {
    setCandidate(candidates.filter((c) => c.id == id)[0]);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const idVote = firstName + "_" + lastName;
    const voteResult = candidate.fullName;
    const CO = {
      firstName,
      lastName,
      birthDate,
      idVote,
    };
    const encryptedCO = await encryptWithKey(CO, props.KpCO);
    const DE = {
      voteResult,
    };
    const encryptedDE = await encryptWithKey(DE, props.KpDE);
    const objectToEncrypt = {
      CO: encryptedCO,
      DE: encryptedDE,
    };

    const objectCO = await encryptWithKey(objectToEncrypt, props.KpCO);
    const objectDE = await encryptWithKey(objectToEncrypt, props.KpDE);

    const CORequest = axios.post("http://localhost:5000/CO", { objectCO });
    const DERequest = axios.post("http://localhost:5001/DE", { objectDE });

    axios
      .all([CORequest, DERequest])
      .then(
        axios.spread((...responses) => {
          console.log(responses);
          if (responses[0].data.success) {
            window.alert("Your vote is successful !");
          } else {
            window.alert("You already voted !");
          }
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  };

  const encryptWithKey = async (object, key) => {
    const encrypted = await openpgp.encrypt({
      message: openpgp.message.fromText(JSON.stringify(object)),
      publicKeys: (await openpgp.key.readArmored(key)).keys,
    });
    return encrypted.data;
  };

  return candidate.fullName ? (
    <>
      <h1 className={styles.mainTitle}>Voting form :</h1>
      <section className={styles.votingForm}>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={onSubmit}>
            <label htmlFor="firstName">First Name :</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="lastName">Last Name :</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="birthDate">Birth Date :</label>
            <input
              type="date"
              name="birthDate"
              id="birthDate"
              required
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <input
              type="submit"
              value={`Vote for ${candidate.fullName
                .split(" ")[1]
                .toUpperCase()} !`}
            />
          </form>
          <div className={styles.voting}>
            <img src={`/assets/images/voting.png`} alt="" />
          </div>
          <div className={styles.candidate}>
            <img src={`/assets/images/${candidate.image}`} alt="" />
          </div>
        </div>
      </section>
    </>
  ) : (
    <p>Loading...</p>
  );
};

export default VotingPage;
