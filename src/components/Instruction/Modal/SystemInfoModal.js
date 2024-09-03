import React, { useState } from 'react';
import CandidateEnv from '../../../assets/icon/CandidateEnv.svg';
import './systemInfoModal.scss';

const SystemInfoModal = ({ setSubsytemInfo }) => {
  const [selectedCheckbox, setSelectedCheckbox] = useState('');

  const handleCheckboxChange = (event) => {
    setSelectedCheckbox(event.target.id); // Update the state with the ID of the selected checkbox
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
          <label
            className={selectedCheckbox === 'Debian_based' && 'bold'}
            htmlFor="Debian based OS"
          >
            <input
              id="Debian_based"
              type="checkbox"
              checked={selectedCheckbox === 'Debian_based'}
              onChange={handleCheckboxChange}
            />
            My device is Linux DEB (Ubuntu)
          </label>
          <label
            className={selectedCheckbox === 'NonDebian_based' && 'bold'}
            htmlFor="Non Debian based OS"
          >
            <input
              id="NonDebian_based"
              type="checkbox"
              checked={selectedCheckbox === 'NonDebian_based'}
              onChange={handleCheckboxChange}
            />
            My device is Linux RPM (Red Hat, Fedora, SUSE)
          </label>
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
