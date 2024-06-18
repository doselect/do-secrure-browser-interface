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
  INSTRUCTION_TEXT,
  INSTRUCTION_TEXT_SUB_PARTS,
  PROCEED_TEST_TEXT,
} from "../../util/constant";
import "./instruction.scss";
import LoaderComponent from "../Loader";

const Instruction = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  // Extract query parameters from the location object
  const queryParams = new URLSearchParams(location.search);
  // Get the value of a specific query parameter
  const testUrl = queryParams.get("dsUrl");

  const candidateEmail = queryParams.get("email");
  console.log(testUrl, "manish");

  function caesarDecrypt(p, shift) {
    // let res = p.split("");
    // let i = 0,
    //   j = res.length - 1;

    // while (i <= j) {
    //   if (i % 2 === 0) {
    //     let t = res[i];
    //     res[i] = res[j];
    //     res[j] = t;
    //   }
    //   i++;
    //   j--;
    // }

    // res = res.join("");
    // for (let i = 0; i < encryptedText.length; i++) {
    //   decrypted += String.fromCharCode(
    //     ((encryptedText.charCodeAt(i) - shift - 32 + 95) % 95) + 32
    //   );
    // }
    return p;
  }

  function base64Decode(str) {
    str = (str + "===").slice(0, str.length + (str.length % 4));
    return decodeURIComponent(escape(atob(str)));
  }

  function caesarShift(str, shift) {
    return str
      .split("")
      .map(char => {
        let code = char.charCodeAt(0);

        // Shift letters
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char; // Non-letters remain unchanged
      })
      .join("");
  }

  function decryptUrl(encryptedUrl, key) {
    const shift = key.length % 26;
    const decodedEncrypted = base64Decode(encryptedUrl);
    const decrypted = caesarShift(decodedEncrypted, -shift);
    return decrypted;
  }

  useEffect(() => {
    const userAgent = navigator.userAgent;

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
      // const l = caesarDecrypt(testUrl, 3);
      const l = decryptUrl(testUrl, candidateEmail);
      console.log(l);
      window.location.href = l;
    } else {
      setIsLoading(false);
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
                  window.open(`Doselect://?dsUrl=${testUrl}`);
                }}
              >
                {PROCEED_TEST_TEXT}
                <img src={Proceed} alt="proceed" />
              </button>
              <button
                className="download secondary"
                onClick={() => {
                  window.open(
                    "https://dev-doselect-static.s3.ap-southeast-1.amazonaws.com/secure-browser/doselect_secure_browser_setup_1.0.1.exe"
                  );
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
