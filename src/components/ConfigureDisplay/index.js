import React, { useEffect, useState } from "react";
import { CONFIGURE } from "../../util/constant";
import "./configureDisplay.scss";

const ConfigureDisplay = () => {
  const [displayInfo, setDisplayInfo] = useState([]);
  useEffect(() => {
    if (window.electron) {
      const cmd = `powershell -command "Get-PnpDevice -Class monitor -presentOnly"`;
      const { exec } = window.electron;
      const payload = {
        cmd,
      };
      exec(CONFIGURE, payload, res => {
        let filteredArr = res.result.split("\r");
        // Remove all unwanted elements
        filteredArr = filteredArr.filter(
          item => item.trim() !== "" && !item.includes("------")
        );

        // Remove leading and trailing newlines from each string
        filteredArr = filteredArr.map(item => item.trim());
        setDisplayInfo(filteredArr);
      });
    }
  }, []);
  return (
    <div className="configure-display-container">
      <div className="title">
        <li>
          <strong>External monitor detected </strong>- We have detected an
          external monitor connected to the desktop app which is not allowed.
          Please disconnect the second monitor to continue to the test.
        </li>
      </div>
      <ul className="display-info">
        {displayInfo.map(process => (
          <li key={process}>{process}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConfigureDisplay;
