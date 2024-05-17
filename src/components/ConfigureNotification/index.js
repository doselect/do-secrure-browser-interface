import React, { useEffect, useState } from "react";
import { CONFIGURE } from "../../util/constant";
import "./configureNotification.scss";

const ConfigureNotification = () => {
  const [notificationInfo, setNotificationInfo] = useState("");
  useEffect(() => {
    if (window.electron) {
      const cmd = `for /f "tokens=3" %A in ('reg query "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v ToastEnabled 2^>nul') do @echo %A`;
      const { exec } = window.electron;
      const payload = {
        cmd,
      };
      exec(CONFIGURE, payload, res => {
        let filteredArr = res.result.split("\r");
        // Remove all unwanted elements
        console.log(filteredArr);
        if (filteredArr.includes("0x0")) {
          setNotificationInfo("Notifications are OFF");
        } else if (filteredArr.includes("0x1")) {
          setNotificationInfo("Notifications are ON");
        }
        console.log(res.result);
      });
    }
  }, []);
  return (
    <div className="configure-notification-container">
      <div className="title">
        <li>
          Disable System Notifications - Interaction with external pop-ups can
          lead to auto-submission of the assessment.
        </li>
      </div>
      <ul className="notification-info">{notificationInfo}</ul>
    </div>
  );
};

export default ConfigureNotification;
