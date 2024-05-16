import React from "react";
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

const Instruction = () => {
  const location = useLocation();
  // Extract query parameters from the location object
  const queryParams = new URLSearchParams(location.search);
  // Get the value of a specific query parameter
  const testUrl = queryParams.get("dsUrl");
  return (
    <div className="instruction-container">
      <Header />
      <div className="instruction-body">
        <div className="instruction-header">
          <img src={CandidateEnv} alt="candidateEnv" />
          <div className="title-conatiner">
            <p>Please Note:</p>
            <p>
              This assessment needs
              <span className="link-text"> Doselect Secure Browser </span> to be
              downloaded.
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
                window.open(`DoselectSB://?dsUrl=${testUrl}`);
              }}
            >
              {PROCEED_TEST_TEXT}
              <img src={Proceed} alt="proceed" />
            </button>
            <button
              className="download secondary"
              onClick={() => {
                window.open(
                  "https://drive.google.com/file/d/1PYvNrSu4nxkNW-VvsTM1Uz60h0rlriLv/view?usp=sharing"
                );
              }}
            >
              {DOWNLOAD_BROWSER_TEXT}
              <img src={FileDownload} alt="download" />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Instruction;
