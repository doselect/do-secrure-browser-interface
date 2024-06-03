import React, { useEffect, useState } from "react";
import ErrorOutline from "../../assets/icon/ErrorOutline.svg";
import { CONFIGURE } from "../../util/constant";
import "./configureDisplay.scss";

const ConfigureDisplay = ({ setChecks, reverify }) => {
  const [displayInfo, setDisplayInfo] = useState([]);
  useEffect(() => {
    if (window.electron) {
      const cmd = `powershell -command "Get-PnpDevice -Class monitor -presentOnly"`;
      const { exec } = window.electron;
      const payload = {
        cmd,
        isRecurring: true,
        frequency: 10000,
        event: "CONFIGURE_DISPLAY",
      };
      exec(CONFIGURE, payload, res => {
        let filteredArr = res.result.split("\r");
        console.log(filteredArr, "manish");
        // Remove all unwanted elements
        filteredArr = filteredArr.filter(
          item => item.trim() !== "" && !item.includes("------")
        );

        // Remove leading and trailing newlines from each string
        filteredArr = filteredArr.map(item => item.trim());
        filteredArr.shift();
        setDisplayInfo(filteredArr);
      });
    }
  }, []);

  useEffect(() => {
    if (window.electron) {
      const cmd = `powershell -command "Get-PnpDevice -Class monitor -presentOnly"`;
      const { exec } = window.electron;
      const payload = {
        cmd,
        isRecurring: false,
        frequency: 10000,
        event: "CONFIGURE_DISPLAY",
      };
      exec(CONFIGURE, payload, res => {
        let filteredArr = res.result.split("\r");
        console.log(filteredArr, "manish");
        // Remove all unwanted elements
        filteredArr = filteredArr.filter(
          item => item.trim() !== "" && !item.includes("------")
        );

        // Remove leading and trailing newlines from each string
        filteredArr = filteredArr.map(item => item.trim());
        filteredArr.shift();
        setDisplayInfo(filteredArr);
      });
    }
  }, [reverify]);

  useEffect(() => {
    console.log(displayInfo, "paras");
    if (displayInfo.length > 1) {
      setChecks(prev => ({
        ...prev,
        multiMonitorsPresent: true,
      }));
    } else {
      setChecks(prev => ({
        ...prev,
        multiMonitorsPresent: false,
      }));
    }
  }, [displayInfo]);

  if (displayInfo.length <= 1) {
    return <></>;
  }
  return (
    <div className="configure-display-container">
      <div className="title">
        <img src={ErrorOutline} />
        <span className="info-desc-container">
          <span className="info">Disconnect External Monitor </span>
          <p className="description">
            We have detected an external monitor connected to the desktop app
            which is not allowed. Please disconnect the external monitor(s) to
            continue to the assessment.
          </p>
        </span>
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
