import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import HomePage from "./Pages/HomePage/HomePage";
import VotingPage from "./Pages/VotingPage/VotingPage";
import axios from "axios";
import { Switch, Route } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const [KpCO, setKpCO] = useState("");
  const [KpDE, setKpDE] = useState("");

  useEffect(() => {
    const CORequest = axios.get("http://localhost:5000/CO");
    const DERequest = axios.get("http://localhost:5001/DE");
    axios
      .all([CORequest, DERequest])
      .then(
        axios.spread((...responses) => {
          setKpCO(responses[0].data);
          setKpDE(responses[1].data);
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  });

  return (
    <>
      <NavBar />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route
          path="/vote/:id"
          component={(routeProps) => (
            <VotingPage KpCO={KpCO} KpDE={KpDE} {...routeProps} />
          )}
        />
      </Switch>
    </>
  );
}

export default App;
