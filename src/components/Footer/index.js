import React from 'react';

import './footer.scss';

const Footer = () => {
  return (
    <div className="footer-container">
      © {new Date().getFullYear()} Doselect. All rights reserved.
    </div>
  );
};

export default Footer;
