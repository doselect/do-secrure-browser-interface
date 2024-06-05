import React, { useEffect, useState } from "react";
import { CONFIGURE, CONFIGURE_TITLE } from "../../util/constant";
import {
  buildGetRunningProcessWinCommand,
  buildKillRunningProcessWinCommand,
  parseGetallProceessResult,
  parseMonitorInfo,
  parseSystemNotificationResult,
} from "../../util/helper";
import ErrorOutline from "../../assets/icon/ErrorOutline.svg";
import candidateEnv2 from "../../assets/icon/candidateEnv2.svg";

import Footer from "../Footer";
import Header from "../Header";
import "./configure.scss";
import PretestConfigure from "../PretestConfigure";

const Configure = () => {
  const [systemChecks, setSystemChecks] = useState({
    isNotificationEnable: true,
    multiMonitorsPresent: true,
    restrictedAppsRunning: true,
  });

  const [checked, setChecked] = useState(false);

  const [btntext, setbtnText] = useState("Re-Verify");
  const [reverify, setReverify] = useState(false);

  const [runningProcess, setRunningProcess] = useState(new Set());
  const [displayInfo, setDisplayInfo] = useState([]);

  const handleCheckboxChange = event => {
    setChecked(event.target.checked);
  };

  const getAllRunningApps = () => {
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
        isRecurring: false,
        frequency: 0,
        event: "CONFIGURE_APPS",
      };
      exec(CONFIGURE, payload, res => {
        console.log(res.result, "manish");
        const newData = parseGetallProceessResult(res.result);
        setRunningProcess(newData);
      });
    }
  };

  const killRunningProcess = () => {
    if (window.electron && runningProcess.size >= 1 && checked) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildKillRunningProcessWinCommand(),
      };
      exec(CONFIGURE, payload, res => {
        setRunningProcess(new Set());
        setSystemChecks(prev => ({
          ...prev,
          restrictedAppsRunning: false,
        }));
      });
    }
  };

  const getMonitorInfo = () => {
    if (window.electron) {
      const cmd = `powershell -command "Get-PnpDevice -Class monitor -presentOnly"`;
      const { exec } = window.electron;
      const payload = {
        cmd,
        isRecurring: false,
        frequency: 0,
        event: "CONFIGURE_DISPLAY",
      };
      exec(CONFIGURE, payload, res => {
        const filteredArr = parseMonitorInfo(res.result);
        setDisplayInfo(filteredArr);
      });
    }
  };

  const getSystemNotificationInfo = () => {
    if (window.electron) {
      const cmd = `reg query "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v ToastEnabled`;
      const { exec } = window.electron;
      const payload = {
        cmd,
      };
      exec(CONFIGURE, payload, res => {
        if (res.error) {
          setSystemChecks(prev => ({
            ...prev,
            isNotificationEnable: true,
          }));
          return;
        }
        const toastEnabledValue = parseSystemNotificationResult(res.result);
        console.log(toastEnabledValue, "paras");
        if (toastEnabledValue) {
          console.log(`The value of ToastEnabled is ${toastEnabledValue}`);
          if (toastEnabledValue === "0x0") {
            setSystemChecks(prev => ({
              ...prev,
              isNotificationEnable: false,
            }));
          } else if (toastEnabledValue === "0x1") {
            setSystemChecks(prev => ({
              ...prev,
              isNotificationEnable: true,
            }));
          } else {
            setSystemChecks(prev => ({
              ...prev,
              isNotificationEnable: true,
            }));
          }
        }
      });
    }
  };

  const startTest = () => {
    setReverify(prev => !prev);
  };

  useEffect(() => {
    // run command to checks apps running
    getAllRunningApps();
    // run command to check notifications enable
    getSystemNotificationInfo();
    // run command to check multimonitors detected
    getMonitorInfo();
  }, [reverify]);

  useEffect(() => {
    if (runningProcess.size >= 1) {
      setSystemChecks(prev => ({
        ...prev,
        restrictedAppsRunning: true,
      }));

      killRunningProcess();
    } else {
      setSystemChecks(prev => ({
        ...prev,
        restrictedAppsRunning: false,
      }));
    }
  }, [runningProcess]);

  useEffect(() => {
    console.log(displayInfo, "paras");
    if (displayInfo.length > 1) {
      setSystemChecks(prev => ({
        ...prev,
        multiMonitorsPresent: true,
      }));
    } else {
      setSystemChecks(prev => ({
        ...prev,
        multiMonitorsPresent: false,
      }));
    }
  }, [displayInfo]);

  if (
    !systemChecks.multiMonitorsPresent &&
    !systemChecks.restrictedAppsRunning
  ) {
    // return <PretestConfigure />;
  }

  return (
    <>
      <Header />
      <div className="configure-container">
        <div className="title">{CONFIGURE_TITLE}</div>
        <div className="configure-img-container">
          <div className="configure">
            {systemChecks.restrictedAppsRunning && (
              <div className="configure-app-container">
                <div className="title">
                  <img src={ErrorOutline} />
                  <span className="info-desc-container">
                    <span className="info">Open Applications Detected </span>
                    <p className="description">
                      We've detected multiple open applications on your system.
                      Please save your work and click "Re-Verify" to proceed, or
                      click the checkbox for us to close them for you.
                    </p>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={handleCheckboxChange}
                        />
                        By checking this box, I agree to allow Doselect to close
                        all running applications.
                      </label>
                    </div>
                  </span>
                </div>
                <ul className="app-list">
                  {Array.from(runningProcess).map(process => (
                    <li key={process}>{process}</li>
                  ))}
                </ul>
              </div>
            )}

            {systemChecks.multiMonitorsPresent && (
              <div className="configure-display-container">
                <div className="title">
                  <img src={ErrorOutline} />
                  <span className="info-desc-container">
                    <span className="info">Disconnect External Monitor </span>
                    <p className="description">
                      We have detected an external monitor connected to the
                      desktop app which is not allowed. Please disconnect the
                      external monitor(s) to continue to the assessment.
                    </p>
                  </span>
                </div>
                <ul className="display-info">
                  {displayInfo.map(process => (
                    <li key={process}>{process}</li>
                  ))}
                </ul>
              </div>
            )}
            {systemChecks.isNotificationEnable && (
              <div className="configure-notification-container">
                <div className="title">
                  <img src={ErrorOutline} />
                  <span className="info-desc-container">
                    <span className="info">Disable System Notifications </span>
                    <p className="description">
                      Interaction with external pop-ups can lead to
                      auto-submission of the assessment.
                    </p>
                  </span>
                </div>
                {/* <ul className="notification-info">{notificationInfo}</ul> */}
              </div>
            )}
          </div>
          <div>
            <img src={candidateEnv2} alt="candidateEnv2" />
          </div>
        </div>
        <button className="start-test primary" onClick={startTest}>
          {btntext}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Configure;
