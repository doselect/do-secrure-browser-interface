import React, { useEffect, useState } from "react";
import { CONFIGURE, CONFIGURE_SHORTCUT_KEYS } from "../../util/constant";
import {
  buildGetRunningProcessWinCommand,
  buildKillRunningProcessWinCommand,
  blockedShortcuts,
} from "../../util/helper";
const Configure = () => {
  const [runningProcess, setRunningProcess] = useState(new Set());
  const [checkAgain, setCheckAgain] = useState(false);
  useEffect(() => {
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
      };
      exec(CONFIGURE, payload, res => {
        setRunningProcess(new Set(res.result.split("\r")));
      });
    }

    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        blockedShortcuts,
      };
      exec(CONFIGURE_SHORTCUT_KEYS, payload, res => {
        console.log(res);
      });
    }

    if (window.electron) {
      const cmd = `powershell -command "Get-PnpDevice -Class monitor -presentOnly"`;
      const { exec } = window.electron;
      const payload = {
        cmd,
      };
      exec(CONFIGURE, payload, res => {
        console.log("---------------");
        console.log(res.result.split("\r"));
      });
    }

    if (window.electron) {
      const { listenToElectron } = window.electron;

      listenToElectron("screenCount", (event, res) => {
        if (event == "display-added") {
          window.alert("display added HDMI cable");
        }
        console.log(event);
      });
    }

    if (window.electron) {
    }
  }, [checkAgain]);

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
  }, [runningProcess, setCheckAgain]);

  return (
    <>
      <div>Checking environment......</div>
      <div>
        <h2>Running Processes:</h2>
        <ul>
          {Array.from(runningProcess).map(process => (
            <li key={process}>{process}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Configure;
