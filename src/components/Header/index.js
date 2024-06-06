import React from "react";
import { useLocation } from "react-router-dom";
import DoselectLogo from "../../assets/icon/DoselectLogo.svg";
import "./header.scss";

const Header = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testName = queryParams.get("testName") || "";

  return (
    <div className="header-container">
      <div className="logo-test-container">
        <img src={DoselectLogo} alt="Doselect Logo" />
        <span className="test-title ellipsis-text">{testName}</span>
      </div>
      <span className="help">Help</span>
    </div>
  );
};

export default Header;
