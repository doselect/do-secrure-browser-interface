import React, { useEffect } from "react";
import { CONFIGURE_SHORTCUT_KEYS, CONFIGURE_TITLE } from "../../util/constant";
import { blockedShortcuts } from "../../util/helper";
import candidateEnv2 from "../../assets/icon/candidateEnv2.svg";
import Footer from "../Footer";
import Header from "../Header";
import "./configure.scss";
import ConfigureApplication from "../ConfigureApplication";
import ConfigureDisplay from "../ConfigureDisplay";
import ConfigureNotification from "../ConfigureNotification";

const Configure = () => {
  useEffect(() => {
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        blockedShortcuts,
      };
      exec(CONFIGURE_SHORTCUT_KEYS, payload, res => {
        console.log(res);
      });
    }

    if (window.electron) {
      const { listenToElectron } = window.electron;

      listenToElectron("screenCount", (event, res) => {
        if (event == "display-added") {
          window.alert("display added HDMI cable");
        }
        console.log(event);
      });
    }
  }, []);

  const startTest = () => {
    if (window.electron) {
      const { sendMsgToElectron } = window.electron;
      sendMsgToElectron("START_TEST", {}, res => {
        console.log(res);
      });

      sendMsgToElectron("STOP_KEYS", "abc.ahk", res => {
        console.log(res);
      });
    }
  };

  return (
    <>
      <Header />
      {/* <div>Checking environment......</div>
      <div>
        <h2>Running Processes:</h2>
        <ul>
          {Array.from(runningProcess).map(process => (
            <li key={process}>{process}</li>
          ))}
        </ul>
        <button onClick={startTest}>start test</button>
      </div> */}
      <div className="configure-container">
        <div className="title">{CONFIGURE_TITLE}</div>
        <div className="configure-img-container">
          <div className="configure">
            <ConfigureNotification />
            <ConfigureApplication />
            <ConfigureDisplay />
          </div>
          <div>
            <img src={candidateEnv2} alt="candidateEnv2" />
          </div>
        </div>
        <button className="start-test primary" onClick={startTest}>
          Start test
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Configure;
