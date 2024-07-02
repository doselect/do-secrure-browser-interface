import React, { useEffect } from "react";
import { CONFIGURE } from "../../util/constant";
import { buildGetRunningProcessWinCommand } from "../../util/helper";
import Footer from "../Footer";
import Header from "../Header";
import LoaderComponent from "../Loader";

const PretestConfigure = () => {
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
      exec(CONFIGURE, payload, res => {});
    }
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
        isRecurring: true,
        frequency: 7000,
        event: "CONFIGURE_APPS",
      };
      exec(CONFIGURE, payload, res => {});
    }

    if (window.electron) {
      const { sendMsgToElectron } = window.electron;
      sendMsgToElectron("START_TEST", {}, res => {});

      sendMsgToElectron("STOP_KEYS", {}, res => {});
    }
  }, []);
  return (
    <>
      <Header />
      <LoaderComponent
        title="Great! You’re all set to go!"
        subText="Taking you to Assessment..."
      />
    </>
  );
};

export default PretestConfigure;
