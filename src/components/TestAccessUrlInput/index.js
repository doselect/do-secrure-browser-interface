import React, { useEffect, useState } from 'react';
import {
  EVENTS_TO_ELECTRON,
  PAGE_ROUTE,
  UBA_EVENT_NAME,
} from '../../util/constant';
import { ctaClick, initTracking, pageView } from '../../util/trackingUtils';
import Header from '../Header';
import './testAccessUrlInput.scss';

const TestAccessUrlInput = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const ubaPayload = {
      pageName: PAGE_ROUTE.TEST_ROUTE,
    };
    initTracking(ubaPayload, {});
    pageView({}, UBA_EVENT_NAME.proctoringTracker);
  }, []);

  useEffect(() => {
    if (window.electron && window.electron.listenToElectron) {
      const { listenToElectron } = window.electron;
    if (listenToElectron)
      listenToElectron('CONFIGURE-RESULT', (event) => {
        console.log(event);
      });
    }
  }, []);

  const handleOpenTest = () => {
    if (url) {
      ctaClick({
        eventName: UBA_EVENT_NAME.proctoringTracker,
        payload: {
          label: 'Open test',
          cta: 'Open test',
          source: url,
        },
      });
      if (window.electron) {
        const { sendMsgToElectron } = window.electron;
        sendMsgToElectron(EVENTS_TO_ELECTRON.SET_TEST_URL, { url });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleOpenTest();
    }
  };

  return (
    <>
      <Header />
      <div className="input-container">
        <input
          type="text"
          placeholder="Paste test access url here...."
          value={url}
          onChange={(e) => setUrl(e?.target?.value)}
          onKeyPress={handleKeyPress}
          className="input-box"
        />
        <button type="button" onClick={handleOpenTest} className="open-button">
          Open Test
        </button>
      </div>
    </>
  );
};

export default TestAccessUrlInput;
