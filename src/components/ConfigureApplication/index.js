import React, { useEffect, useState } from "react";
import { CONFIGURE } from "../../util/constant";
import { buildGetRunningProcessWinCommand } from "../../util/helper";
import "./configureApplication.scss";

const ConfigureApplication = () => {
  const [runningProcess, setRunningProcess] = useState(new Set());
  useEffect(() => {
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
      };
      exec(CONFIGURE, payload, res => {
        console.log(res.result, "manish");
        const newData = new Set(res.result.split("\r"));
        console.log(newData, "before");
        if (newData.has("Name")) {
          newData.delete("Name");
        }
        console.log(newData, "after");
        setRunningProcess(newData);
      });
    }
  }, []);
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
