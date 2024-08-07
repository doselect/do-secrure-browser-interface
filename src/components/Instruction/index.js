import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import Warning from "../../assets/icon/Warning.svg";
import FileDownload from "../../assets/icon/FileDownload.svg";
import Proceed from "../../assets/icon/Proceed.svg";
import CandidateEnv from "../../assets/icon/CandidateEnv.svg";
import {
  DOWNLOAD_BROWSER_TEXT,
  DOWNLOAD_LINK_TEXT,
  getAppDownloadLink,
  INSTRUCTION_TEXT,
  INSTRUCTION_TEXT_SUB_PARTS,
  PROCEED_TEST_TEXT,
  UBA_EVENT_NAME,
} from "../../util/constant";
import "./instruction.scss";
import LoaderComponent from "../Loader";
import { removeCharsByVowelCount } from "../../util/helper";
import {
  ctaClick,
  initTracking,
  proctoringUBALogger,
} from "../../util/trackingUtils";

const Instruction = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  // Extract query parameters from the location object
  const queryParams = new URLSearchParams(location.search);
  // Get the value of a specific query parameter
  const testUrl = queryParams.get("dsUrl");
  const testName = queryParams.get("testName");

  const candidateEmail = queryParams.get("email");

  function decryptUrl(encryptedUrl) {
    const decrypted = removeCharsByVowelCount(encryptedUrl, candidateEmail);
    return decrypted;
  }

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const ubaPayload = {
      pageName: "Instruction Page",
    };
    const keyNames = {
      loggedinUserEmailId: candidateEmail,
      testName,
    };

    initTracking(ubaPayload, keyNames);

    let deviceType = "Unknown";
    if (/Mobi|Android/i.test(userAgent)) {
      deviceType = "Mobile";
    } else {
      deviceType = "Desktop";
    }

    let osType = "Unknown";
    if (userAgent.indexOf("Win") !== -1) osType = "Windows";
    if (userAgent.indexOf("Mac") !== -1) osType = "MacOS";
    if (userAgent.indexOf("Linux") !== -1) osType = "Linux";
    if (userAgent.indexOf("Android") !== -1) osType = "Android";
    if (userAgent.indexOf("like Mac") !== -1) osType = "iOS";

    if (deviceType !== "Desktop" || osType !== "Windows") {
      const decryptedUrl = decryptUrl(testUrl);
      proctoringUBALogger(
        UBA_EVENT_NAME.LOG_INFO_EVENT,
        decryptedUrl + "- normal assessment flow"
      );
      window.location.href = decryptedUrl;
      // setIsLoading(false);
    } else {
      setIsLoading(false);
      proctoringUBALogger(
        UBA_EVENT_NAME.LOG_INFO_EVENT,
        testUrl + "-secure browser assessment flow"
      );
    }
  }, []);

  return (
    <div className="instruction-container">
      <Header />
      {isLoading ? (
        <LoaderComponent title="" subText="Checking Device Compatibility" />
      ) : (
        <div className="instruction-body">
          <div className="instruction-header">
            <img src={CandidateEnv} alt="candidateEnv" />
            <div className="title-conatiner">
              <p>Please Note:</p>
              <p>
                This assessment needs
                <span className="link-text"> Doselect Secure Browser </span> to
                be downloaded.
              </p>
            </div>
          </div>
          <div className="candidate-instruction">
            <div className="title">
              <img src={Warning} alt="Warning" />
              <span className="instruction-text">{INSTRUCTION_TEXT}</span>
              <ul>
                {INSTRUCTION_TEXT_SUB_PARTS.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="horizontal-line" />
          <div className="download-link-container">
            <div className="title">{DOWNLOAD_LINK_TEXT}</div>
            <div className="links-container">
              <button
                className="test-link primary"
                onClick={() => {
                  ctaClick({
                    eventName: UBA_EVENT_NAME.proctoringTracker,
                    payload: {
                      label: candidateEmail,
                      cta: "Download secure browser",
                      source: `Doselect://?email=${candidateEmail}&testName=${testName}&dsUrl=${testUrl}`,
                    },
                  });
                  window.open(
                    `Doselect://?email=${candidateEmail}&testName=${testName}&dsUrl=${testUrl}`
                  );
                }}
              >
                {PROCEED_TEST_TEXT}
                <img src={Proceed} alt="proceed" />
              </button>
              <button
                className="download secondary"
                onClick={() => {
                  ctaClick({
                    eventName: UBA_EVENT_NAME.proctoringTracker,
                    payload: {
                      label: candidateEmail,
                      cta: "Download secure browser",
                      source: getAppDownloadLink(),
                    },
                  });
                  window.open(getAppDownloadLink());
                }}
              >
                {DOWNLOAD_BROWSER_TEXT}
                <img src={FileDownload} alt="download" />
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Instruction;
