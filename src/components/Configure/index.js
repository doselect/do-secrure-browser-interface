import React, { useEffect, useState } from "react";
import { CONFIGURE } from "../../util/constant";
import { buildGetRunningProcessWinCommand } from "../../util/helper";
const Configure = () => {
  const [runningProcess, setRunningProcess] = useState("");
  useEffect(() => {
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
      };
      exec(CONFIGURE, payload, res => {
        setRunningProcess(res.result);
      });
    }

    if (window.electron) {
      const { listenToElectron } = window.electron;
      listenToElectron("test", (event, res) => {
        console.log(event);
      });
      listenToElectron("screenCount", (event, res) => {
        if (event == "display-added") {
          window.alert("display added HDMI cable");
        }
        console.log(event);
      });
    }
  }, []);

  return <div>{runningProcess}</div>;
};

export default Configure;
