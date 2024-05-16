import React from "react";
import DoselectLogo from "../../assets/icon/DoselectLogo.svg";
import "./header.scss";

const Header = () => {
  return (
    <div className="header-container">
      <div className="logo-test-container">
        <img src={DoselectLogo} alt="Doselect Logo" />
        <span className="test-title">Doselect test</span>
      </div>
      <span className="help">Help</span>
    </div>
  );
};

export default Header;
