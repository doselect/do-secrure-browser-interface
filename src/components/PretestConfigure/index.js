import React, { useEffect } from 'react';
import { CONFIGURE } from '../../util/constant';
import {
  buildGetRunningProcessWinCommand,
  TotalDisplaysInfoCommand,
} from '../../util/helper';
import Header from '../Header';
import LoaderComponent from '../Loader';

const PretestConfigure = () => {
  useEffect(() => {
    try {
      if (window.electron) {
        const cmd = TotalDisplaysInfoCommand;
        const { exec } = window.electron;
        const payload = {
          cmd,
          isRecurring: true,
          frequency: 10000,
          event: 'CONFIGURE_DISPLAY',
        };
        exec(CONFIGURE, payload, () => {});
      }
      if (window.electron) {
        const { exec } = window.electron;
        const payload = {
          cmd: buildGetRunningProcessWinCommand(),
          isRecurring: true,
          frequency: 7000,
          event: 'CONFIGURE_APPS',
        };
        exec(CONFIGURE, payload, () => {});
      }

      if (window.electron) {
        const { sendMsgToElectron } = window.electron;
        sendMsgToElectron('START_TEST', {}, () => {});

        sendMsgToElectron('STOP_KEYS', {}, () => {});
      }
    } catch (err) {
      console.log(err);
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
