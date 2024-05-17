import React, { useEffect, useState } from "react";
import { CONFIGURE } from "../../util/constant";
import "./configureNotification.scss";

const ConfigureNotification = () => {
  const [notificationInfo, setNotificationInfo] = useState("");
  useEffect(() => {
    if (window.electron) {
      const cmd = `reg query "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v ToastEnabled`;
      const { exec } = window.electron;
      const payload = {
        cmd,
      };
      exec(CONFIGURE, payload, res => {
        if (res.error) {
          setNotificationInfo(
            "THERE'S SOMETHING ISSUE WITH RUNNING THE COMMAND"
          );
          // return;
        }
        // let arr = res.result.split("\r");
        const arr = [
          "",
          "\nHKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PushNotifications",
          "\n    ToastEnabled    REG_DWORD    0x1",
          "\n",
          "\n",
        ];

        let toastEnabledValue = null;

        // Iterate through the array to find the ToastEnabled value
        for (let item of arr) {
          if (item.includes("ToastEnabled")) {
            // Split the item by spaces and get the last part which is the value
            const parts = item.trim().split(/\s+/);
            toastEnabledValue = parts[parts.length - 1];
            break;
          }
        }

        if (toastEnabledValue) {
          console.log(`The value of ToastEnabled is ${toastEnabledValue}`);
          if (toastEnabledValue === "0x0") {
            console.log("Toast notifications are disabled.");
          } else if (toastEnabledValue === "0x1") {
            console.log("Toast notifications are enabled.");
          } else {
            console.log(
              `The value of ToastEnabled is ${toastEnabledValue}, which is unexpected.`
            );
          }
        } else {
          console.log("The value of ToastEnabled could not be found.");
        }

        // Remove all unwanted elements

        console.log(res.result);
        console.log(res);
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
