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
  }, []);

  return <div>{runningProcess}</div>;
};

export default Configure;
