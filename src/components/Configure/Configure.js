import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  COMMAND_STATUS,
  CONFIGURE,
  CONFIGURE_TITLE,
  EVENTS_TO_ELECTRON,
  PAGE_ROUTE,
  UBA_EVENT_NAME,
} from '../../util/constant';
import {
  buildGetRunningProcessWinCommand,
  buildKillRunningProcessWinCommand,
  FingerGesturesCommand,
  NotificationInfoCommand,
  parseGetallProceessResult,
  parseMonitorInfo,
  parseSystemNotificationResult,
  TotalDisplaysInfoCommand,
} from '../../util/helper';
import ErrorOutline from '../../assets/icon/ErrorOutline.svg';
import candidateEnv2 from '../../assets/icon/candidateEnv2.svg';

import Footer from '../Footer';
import Header from '../Header';
import './configure.scss';
import PretestConfigure from '../PretestConfigure';
import LoaderComponent from '../Loader';
import {
  ctaClick,
  initTracking,
  pageView,
  proctoringUBALogger,
} from '../../util/trackingUtils';

const Configure = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const testName = queryParams.get('testName');

  const candidateEmail = queryParams.get('email');

  const [systemChecks, setSystemChecks] = useState({
    isNotificationEnable: null,
    multiMonitorsPresent: null,
    restrictedAppsRunning: null,
  });

  const [commandStatus, setCommandStatus] = useState({
    runningApps: COMMAND_STATUS.NOT_EXECUTED,
    notification: COMMAND_STATUS.NOT_EXECUTED,
    monitor: COMMAND_STATUS.NOT_EXECUTED,
  });

  const [checked, setChecked] = useState(false);

  const btntext = 'Re-Verify';
  const [reverify, setReverify] = useState(false);

  const [runningProcess, setRunningProcess] = useState(new Set());
  const [displayInfo, setDisplayInfo] = useState([]);

  const isCommandsInProgress = Object.values(commandStatus).includes(
    COMMAND_STATUS.IN_PROGRESS
  );

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  const getAllRunningApps = () => {
    if (window.electron) {
      setCommandStatus((prev) => ({
        ...prev,
        runningApps: COMMAND_STATUS.IN_PROGRESS,
      }));
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
        isRecurring: false,
        frequency: 0,
        event: 'CONFIGURE_APPS',
      };
      exec(CONFIGURE, payload, (res) => {
        const newData = parseGetallProceessResult(res.result);

        setRunningProcess(newData);
        setCommandStatus((prev) => ({
          ...prev,
          runningApps: COMMAND_STATUS.SUCCESS,
        }));

        setSystemChecks((prev) => ({
          ...prev,
          restrictedAppsRunning: newData.length >= 1,
        }));
      });
    }
  };

  const killRunningProcess = () => {
    if (window.electron && runningProcess.size >= 1 && checked) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildKillRunningProcessWinCommand(),
      };
      exec(CONFIGURE, payload, () => {
        setRunningProcess(new Set());
        setSystemChecks((prev) => ({
          ...prev,
          restrictedAppsRunning: false,
        }));
      });
    }
  };

  const getMonitorInfo = () => {
    if (window.electron) {
      setCommandStatus((prev) => ({
        ...prev,
        monitor: COMMAND_STATUS.IN_PROGRESS,
      }));
      const cmd = TotalDisplaysInfoCommand;
      const { exec } = window.electron;
      const payload = {
        cmd,
        isRecurring: false,
        frequency: 0,
        event: EVENTS_TO_ELECTRON.CONFIGURE_DISPLAY,
      };
      exec(CONFIGURE, payload, (res) => {
        const filteredArr = parseMonitorInfo(res.result);
        setDisplayInfo(filteredArr);
        setCommandStatus((prev) => ({
          ...prev,
          monitor: COMMAND_STATUS.SUCCESS,
        }));
      });
    }
  };

  const getSystemNotificationInfo = () => {
    if (window.electron) {
      setCommandStatus((prev) => ({
        ...prev,
        notification: COMMAND_STATUS.IN_PROGRESS,
      }));
      const cmd = NotificationInfoCommand;
      const { exec } = window.electron;
      const payload = {
        cmd,
      };
      exec(CONFIGURE, payload, (res) => {
        if (res.error) {
          setCommandStatus((prev) => ({ ...prev, notification: 'error' }));
          setSystemChecks((prev) => ({
            ...prev,
            isNotificationEnable: true,
          }));
          return;
        }
        const toastEnabledValue = parseSystemNotificationResult(res.result);
        if (toastEnabledValue) {
          if (toastEnabledValue === '0x0') {
            setSystemChecks((prev) => ({
              ...prev,
              isNotificationEnable: false,
            }));
          } else if (toastEnabledValue === '0x1') {
            setSystemChecks((prev) => ({
              ...prev,
              isNotificationEnable: true,
            }));
          } else {
            setSystemChecks((prev) => ({
              ...prev,
              isNotificationEnable: true,
            }));
          }
          setCommandStatus((prev) => ({
            ...prev,
            notification: COMMAND_STATUS.SUCCESS,
          }));
        }
      });
    }
  };

  const blockFingerGestures = () => {
    if (window.electron) {
      const cmd = FingerGesturesCommand;
      const { exec } = window.electron;
      const payload = {
        cmd,
        isRecurring: false,
        frequency: 0,
        event: EVENTS_TO_ELECTRON.BLOCK_GESTURES,
      };
      exec(CONFIGURE, payload, () => {});
    }
  };

  useEffect(() => {
    const ubaPayload = {
      pageName: PAGE_ROUTE.CONFIGURE,
    };
    const keyNames = {
      loggedinUserEmailId: candidateEmail,
      testName,
    };
    initTracking(ubaPayload, keyNames);
    pageView({}, UBA_EVENT_NAME.proctoringTracker);

    // block finger gewstures

    try {
      blockFingerGestures();
    } catch (err) {
      proctoringUBALogger(UBA_EVENT_NAME.LOG_INFO_ERR, err.message);
    }
  }, []);

  const startTest = () => {
    setSystemChecks({
      isNotificationEnable: null,
      multiMonitorsPresent: null,
      restrictedAppsRunning: null,
    });

    setCommandStatus({
      runningApps: 'notExecuted',
      notification: 'notExecuted',
      monitor: 'notExecuted',
    });

    setReverify((prev) => !prev);
  };

  useEffect(() => {
    try {
      // run command to checks apps running
      getAllRunningApps();
      // run command to check notifications enable
      getSystemNotificationInfo();
      // run command to check multimonitors detected
      getMonitorInfo();
      ctaClick({
        eventName: UBA_EVENT_NAME.proctoringTracker,
        payload: {
          label: candidateEmail,
          cta: 'Reverify',
          source: testName,
        },
      });
    } catch (err) {
      proctoringUBALogger(UBA_EVENT_NAME.LOG_INFO_ERR, err.message);
    }
  }, [reverify]);

  useEffect(() => {
    if (runningProcess.size >= 1) {
      setSystemChecks((prev) => ({
        ...prev,
        restrictedAppsRunning: true,
      }));

      killRunningProcess();
    } else {
      setSystemChecks((prev) => ({
        ...prev,
        restrictedAppsRunning:
          prev.restrictedAppsRunning === null ? null : false,
      }));
    }
  }, [runningProcess]);

  useEffect(() => {
    if (displayInfo.length === 1) {
      setSystemChecks((prev) => ({
        ...prev,
        multiMonitorsPresent: false,
      }));
    } else {
      setSystemChecks((prev) => ({
        ...prev,
        multiMonitorsPresent: true,
      }));
    }
  }, [displayInfo]);

  if (
    systemChecks.multiMonitorsPresent === false &&
    systemChecks.restrictedAppsRunning === false
  ) {
    return <PretestConfigure />;
  }

  if (isCommandsInProgress) {
    return <LoaderComponent title="" subText="" />;
  }

  return (
    <>
      <Header />
      <div className="configure-container">
        <div className="title">{CONFIGURE_TITLE}</div>
        <div className="configure-img-container">
          <div className="configure">
            {systemChecks.multiMonitorsPresent && (
              <div className="configure-display-container">
                <div className="title">
                  <img alt="error-outline" src={ErrorOutline} />
                  <span className="info-desc-container">
                    <span className="info">Disconnect External Monitor </span>
                    <p className="description">
                      We have detected an external monitor connected to the
                      desktop app which is not allowed. Please disconnect the
                      external monitor(s) to continue to the assessment.
                    </p>
                  </span>
                </div>
                {/* <ul className="display-info">
                  {displayInfo.map(process => (
                    <li key={process}>{process}</li>
                  ))}
                </ul> */}
              </div>
            )}
            {systemChecks.isNotificationEnable && (
              <div className="configure-notification-container">
                <div className="title">
                  <img alt="error-outline" src={ErrorOutline} />
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
            {systemChecks.restrictedAppsRunning && (
              <div className="configure-app-container">
                <div className="title">
                  <img alt="error-outline" src={ErrorOutline} />
                  <span className="info-desc-container">
                    <span className="info">Open Applications Detected </span>
                    <p className="description">
                      We&apos;ve detected multiple open applications on your
                      system. Please save your work and click
                      &quot;Re-Verify&quot; to proceed, or click the checkbox
                      for us to close them for you.
                    </p>
                    <div>
                      <label htmlFor="teram-condition">
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
                {/* <ul className="app-list">
                  {Array.from(runningProcess).map(process => (
                    <li key={process}>{process}</li>
                  ))}
                </ul> */}
              </div>
            )}
          </div>
          <div>
            <img alt="candidate-env" src={candidateEnv2} />
          </div>
        </div>
        <div className="instruction-footer">
          {/* <span className="help-container">
            If you need any more help, please{" "}
            <a
              href="https://help.doselect.com/support/solutions/folders/1060000320545"
              className="help-link"
              target="__blank"
            >
              click here
            </a>
          </span> */}
          <button
            type="button"
            disabled={isCommandsInProgress}
            className={`start-test primary ${
              isCommandsInProgress ? 'disable' : ''
            }`}
            onClick={startTest}
          >
            {btntext}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Configure;
