import React, { useEffect, useState } from "react";
import ErrorOutline from "../../assets/icon/ErrorOutline.svg";
import { CONFIGURE } from "../../util/constant";
import {
  buildGetRunningProcessWinCommand,
  buildKillRunningProcessWinCommand,
} from "../../util/helper";
import "./configureApplication.scss";

const ConfigureApplication = ({ setChecks, reverify }) => {
  const [runningProcess, setRunningProcess] = useState(new Set());
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = event => {
    setChecked(event.target.checked);
  };

  const killRunningProcess = () => {
    if (window.electron && runningProcess.size > 1 && checked) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildKillRunningProcessWinCommand(),
      };
      exec(CONFIGURE, payload, res => {
        setRunningProcess(new Set());
      });
    }
  };

  useEffect(() => {
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
        isRecurring: true,
        frequency: 7000,
        event: "CONFIGURE_APPS",
      };
      exec(CONFIGURE, payload, res => {
        console.log(res.result, "manish");
        const newData = new Set(res.result.split("\r"));
        console.log(newData, "before");
        if (newData.has('"Name"')) {
          newData.delete('"Name"');
          newData.delete("\n");
        }
        console.log(newData, "after");
        setRunningProcess(newData);
      });
    }
  }, []);

  useEffect(() => {
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
        isRecurring: false,
        frequency: 7000,
        event: "CONFIGURE_APPS",
      };
      exec(CONFIGURE, payload, res => {
        console.log(res.result, "manish");
        const newData = new Set(res.result.split("\r"));
        console.log(newData, "before");
        if (newData.has('"Name"')) {
          newData.delete('"Name"');
          newData.delete("\n");
        }
        console.log(newData, "after");
        setRunningProcess(newData);
      });
    }
  }, [reverify]);

  useEffect(() => {
    if (runningProcess.size > 1) {
      setChecks(prev => ({
        ...prev,
        restrictedAppsRunning: true,
      }));
      killRunningProcess();
    } else {
      setChecks(prev => ({
        ...prev,
        restrictedAppsRunning: false,
      }));
    }
  }, [runningProcess]);

  // if (runningProcess.size >= 1) {
  //   candidateResponse = window.confirm("some restricted process are running");
  // }

  if (runningProcess.size <= 1 && runningProcess[0].length > 0) {
    console.log(runningProcess);
    return <></>;
  }

  return (
    <div className="configure-app-container">
      <div className="title">
        <img src={ErrorOutline} />
        <span className="info-desc-container">
          <span className="info">Open Applications Detected </span>
          <p className="description">
            We've detected multiple open applications on your system. Please
            save your work and click "Re-Verify" to proceed, or click the
            checkbox for us to close them for you.
          </p>
          <div>
            <label>
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
              />
              By checking this box, I agree to allow Doselect to close all
              running applications.
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
  );
};

export default ConfigureApplication;
