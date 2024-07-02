import React, { useEffect, useState } from "react";
import { UBA_EVENT_NAME } from "../../util/constant";
import { ctaClick, initTracking, pageView } from "../../util/trackingUtils";
import Footer from "../Footer";
import Header from "../Header";
import "./testAccessUrlInput.scss";

const TestAccessUrlInput = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const ubaPayload = {
      pageName: "Test Route",
    };
    initTracking(ubaPayload, {});
    pageView({}, UBA_EVENT_NAME.proctoringTracker);
  }, []);

  const handleOpenTest = () => {
    if (url) {
      ctaClick({
        eventName: UBA_EVENT_NAME.proctoringTracker,
        payload: {
          label: "Open test",
          cta: "Open test",
          source: url,
        },
      });
      if (window.electron) {
        const { sendMsgToElectron } = window.electron;
        sendMsgToElectron("SET_TEST_URL", { url: url }, res => {});
      }
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
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
          onChange={e => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-box"
        />
        <button onClick={handleOpenTest} className="open-button">
          Open Test
        </button>
      </div>
      <Footer />
    </>
  );
};

export default TestAccessUrlInput;
