import React, { useEffect } from "react";
import { CONFIGURE } from "../../util/constant";
import { buildGetRunningProcessWinCommand } from "../../util/helper";
import Footer from "../Footer";
import Header from "../Header";
import LoaderComponent from "../Loader";

const PretestConfigure = () => {
  const blockFingerGestures = () => {
    if (window.electron) {
      const cmd = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PrecisionTouchPad" /v ThreeFingerSlideEnabled /t REG_DWORD /d 0 /f && reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PrecisionTouchPad" /v FourFingerSlideEnabled /t REG_DWORD /d 0 /f && taskkill /f /im explorer.exe && start explorer.exe`;
      const { exec } = window.electron;
      const payload = {
        cmd,
        isRecurring: false,
        frequency: 0,
        event: "BLOCK_GESTURES",
      };
      exec(CONFIGURE, payload, res => {});
    }
  };
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
        console.log(res, "passes");
      });
    }
    if (window.electron) {
      const { exec } = window.electron;
      const payload = {
        cmd: buildGetRunningProcessWinCommand(),
        isRecurring: true,
        frequency: 7000,
        event: "CONFIGURE_APPS",
      };
      exec(CONFIGURE, payload, res => {
        console.log(res, "passes");
      });
    }

    if (window.electron) {
      const { sendMsgToElectron } = window.electron;
      sendMsgToElectron("START_TEST", {}, res => {
        console.log(res);
      });

      sendMsgToElectron("STOP_KEYS", {}, res => {
        console.log(res);
      });
    }
    blockFingerGestures();
  }, []);
  return (
    <>
      <Header />
      <LoaderComponent
        title="Great! You’re all set to go!"
        subText="Taking you to Assessment..."
      />
      <Footer />
    </>
  );
};

export default PretestConfigure;
