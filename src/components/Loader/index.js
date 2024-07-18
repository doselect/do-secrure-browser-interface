import React from 'react';
import './loader.scss';

const LoaderComponent = ({ title, subText }) => {
  return (
    <div className="spinner-title-container">
      <h1 className="title">{title}</h1>
      <div className="spinner-container">
        <div className="spinner">
          {[...Array(8)].map((_, index) => (
            <div key={index} className={`circle circle-${index + 1}`} />
          ))}
        </div>
        <div className="spinner-text">{subText}</div>
      </div>
    </div>
  );
};

export default LoaderComponent;
