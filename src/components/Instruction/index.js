import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';
import Warning from '../../assets/icon/Warning.svg';
import FileDownload from '../../assets/icon/FileDownload.svg';
import Proceed from '../../assets/icon/Proceed.svg';
import CandidateEnv from '../../assets/icon/CandidateEnv.svg';
import {
  DOWNLOAD_BROWSER_TEXT,
  DOWNLOAD_LINK_TEXT,
  getAppDownloadLink,
  INSTRUCTION_TEXT,
  INSTRUCTION_TEXT_SUB_PARTS,
  PROCEED_TEST_TEXT,
  UBA_EVENT_NAME,
} from '../../util/constant';
import './instruction.scss';
import LoaderComponent from '../Loader';
import { getOSinfo, removeCharsByVowelCount } from '../../util/helper';
import {
  ctaClick,
  initTracking,
  proctoringUBALogger,
} from '../../util/trackingUtils';
import SystemInfoModal from './Modal/SystemInfoModal';

const Instruction = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [subsytemInfo, setSubsytemInfo] = useState({
    show: false,
    info: '',
  });
  const location = useLocation();
  // Extract query parameters from the location object
  const queryParams = new URLSearchParams(location.search);
  // Get the value of a specific query parameter
  const testUrl = queryParams.get('dsUrl');
  const testName = queryParams.get('testName');

  const candidateEmail = queryParams.get('email');
  const { osType, deviceType } = getOSinfo();

  function decryptUrl(encryptedUrl) {
    const decrypted = removeCharsByVowelCount(encryptedUrl, candidateEmail);
    return decrypted;
  }

  console.log('ostype=', osType);
  useEffect(() => {
    if (window.electron && window.electron.listenToElectron) {
      const { listenToElectron } = window.electron;
    if (listenToElectron)
      listenToElectron('CONFIGURE-RESULT', (event) => {
        console.log(event);
      });
    }
  }, []);

  useEffect(() => {
    if (osType === 'Linux') {
      setSubsytemInfo((prev) => ({
        ...prev,
        show: true,
      }));
    }
    const ubaPayload = {
      pageName: 'Instruction Page',
    };
    const keyNames = {
      loggedinUserEmailId: candidateEmail,
      testName,
    };

    initTracking(ubaPayload, keyNames);
    console.log(osType);
    if (
      deviceType !== 'Desktop' ||
      (osType !== 'Windows' && osType !== 'Linux' && osType !== 'MacOS')
    ) {
      const decryptedUrl = decryptUrl(testUrl);
      proctoringUBALogger(
        UBA_EVENT_NAME.LOG_INFO_EVENT,
        `${decryptedUrl}- normal assessment flow`
      );
      window.open(decryptedUrl);
      // setIsLoading(false);
    } else {
      setIsLoading(false);
      proctoringUBALogger(
        UBA_EVENT_NAME.LOG_INFO_EVENT,
        `${testUrl}-secure browser assessment flow`
      );
    }
  }, []);

  useEffect(() => {
    proctoringUBALogger('LINUX_SUB_TYPE', subsytemInfo.info);
    if (subsytemInfo.info === 'NonDebian_based') {
      const decryptedUrl = decryptUrl(testUrl);
      window.open(decryptedUrl);
    }
  }, [subsytemInfo]);

  return (
    <div className="instruction-container">
      <Header />
      {isLoading ? (
        <LoaderComponent title="" subText="Checking Device Compatibility" />
      ) : (
        <>
          {subsytemInfo?.show ? (
            <SystemInfoModal setSubsytemInfo={setSubsytemInfo} />
          ) : (
            <div className="instruction-body">
              <div className="instruction-header">
                <img src={CandidateEnv} alt="candidateEnv" />
                <div className="title-conatiner">
                  <p>Please Note:</p>
                  <p>
                    This assessment needs
                    <span className="link-text">
                      {' '}
                      Doselect Secure Browser{' '}
                    </span>{' '}
                    to be downloaded.
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
                    type="button"
                    className="test-link primary"
                    onClick={() => {
                      ctaClick({
                        eventName: UBA_EVENT_NAME.proctoringTracker,
                        payload: {
                          label: candidateEmail,
                          cta: 'Download secure browser',
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
                    type="button"
                    className="download secondary"
                    onClick={() => {
                      ctaClick({
                        eventName: UBA_EVENT_NAME.proctoringTracker,
                        payload: {
                          label: candidateEmail,
                          cta: 'Download secure browser',
                          source: getAppDownloadLink(osType),
                        },
                      });
                      window.open(getAppDownloadLink(osType));
                    }}
                  >
                    {DOWNLOAD_BROWSER_TEXT}
                    <img src={FileDownload} alt="download" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default Instruction;
