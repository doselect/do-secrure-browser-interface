import React, { useEffect, useState } from "react";
import { CONFIGURE } from "../../util/constant";
import "./configureNotification.scss";

const ConfigureNotification = () => {
  const [notificationInfo, setNotificationInfo] = useState("");
  useEffect(() => {
    if (window.electron) {
      const cmd = `reg query "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\PushNotifications" /v ToastEnabled`;
      const { exec } = window.electron;
      const payload = {
        cmd,
      };
      exec(CONFIGURE, payload, res => {
        let filteredArr = res.result.split("\r");
        // Remove all unwanted elements
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
