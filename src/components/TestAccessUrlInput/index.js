import React, { useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import "./testAccessUrlInput.scss";

const TestAccessUrlInput = () => {
  const [url, setUrl] = useState("");

  const handleOpenTest = () => {
    if (url) {
      window.location.href = url;
    } else {
      alert("Please enter a URL");
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
