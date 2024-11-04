/* eslint-disable */
import React, { useState } from 'react';
import CandidateEnv from '../../../assets/icon/CandidateEnv.svg';
import './systemInfoModal.scss';
import { LINUX_SUB_TYPE } from '../../../util/constant';

const SystemInfoModal = ({ setSubsytemInfo }) => {
  const [selectedCheckbox, setSelectedCheckbox] = useState('');

  const handleCheckboxChange = (event) => {
    setSelectedCheckbox(event); // Update the state with the ID of the selected checkbox
  };

  const configureSubOs = () => {
    setSubsytemInfo((prev) => ({
      ...prev,
      show: false,
      info: selectedCheckbox,
    }));
  };
  return (
    <div className="system-info-modal-container">
      <div>
        <img className="candidate-env" src={CandidateEnv} alt="candidateEnv" />
      </div>
      <div className="info-container">
        <div className="title">Please identify your device configuration :</div>
        <div className="sub-title">
          <a
            href="https://doselect.freshdesk.com/support/solutions/articles/1060000089317"
            target="__blank"
          >
            How can I check my device configuration?
          </a>
        </div>
        <div className="action-container">
          <div
            id={LINUX_SUB_TYPE.DEBAIN}
            onClick={() => {
              handleCheckboxChange(LINUX_SUB_TYPE.DEBAIN);
            }}
            className="checkbox-container"
          >
            <input
              type="checkbox"
              checked={selectedCheckbox === LINUX_SUB_TYPE.DEBAIN}
            />
            <div className="custom-checkbox" />
            <label
              htmlFor="Debian based OS"
              className={selectedCheckbox === LINUX_SUB_TYPE.DEBAIN && 'bold'}
            >
              My device is Linux DEB (Ubuntu)
            </label>
          </div>

          <div
            id={LINUX_SUB_TYPE.NON_DEBIAN}
            onClick={() => {
              handleCheckboxChange(LINUX_SUB_TYPE.NON_DEBIAN);
            }}
            className="checkbox-container"
          >
            <input
              type="checkbox"
              checked={selectedCheckbox === LINUX_SUB_TYPE.NON_DEBIAN}
            />
            <div className="custom-checkbox" />
            <label
              className={
                selectedCheckbox === LINUX_SUB_TYPE.NON_DEBIAN && 'bold'
              }
              htmlFor="Non Debian based OS"
            >
              My device is Linux RPM (Red Hat, Fedora, SUSE)
            </label>
          </div>
        </div>
        <button
          type="button"
          disabled={!selectedCheckbox}
          className={`configure-sub-os ${!selectedCheckbox ? 'disable' : ''}`}
          onClick={configureSubOs}
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
};

export default SystemInfoModal;
