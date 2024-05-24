import React, { useEffect, useState } from "react";
import { CONFIGURE } from "../../util/constant";
import {
  buildGetRunningProcessWinCommand,
  buildKillRunningProcessWinCommand,
} from "../../util/helper";
import "./configureApplication.scss";

const ConfigureApplication = () => {
  const [runningProcess, setRunningProcess] = useState(new Set());
  const [checkAgain, setCheckAgain] = useState(false);
  useEffect(() => {
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
        isRecurring: true,
        frequency: 5000,
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
    console.log(runningProcess.size);
    let candidateResponse = false;
    if (runningProcess.size > 2) {
      candidateResponse = window.confirm("some restricted process are running");
    }
    if (window.electron && candidateResponse) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildKillRunningProcessWinCommand(),
      };
      exec(CONFIGURE, payload, res => {
        console.log(res);
        setCheckAgain(prev => !prev);
      });
    }
  }, [runningProcess]);
  return (
    <div className="configure-app-container">
      <div className="title">
        <li>Following applications should be closed to start the test</li>
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
