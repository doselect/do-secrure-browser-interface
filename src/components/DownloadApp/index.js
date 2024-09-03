import React, { useEffect } from 'react';
import { getAppDownloadLink } from '../../util/constant';
import { getOSinfo } from '../../util/helper';

const DownloadApp = () => {
  const { osType } = getOSinfo();
  const dowloadLink = getAppDownloadLink(osType);

  useEffect(() => {
    if (dowloadLink) {
      window.open(dowloadLink, '_self');
    }
  }, [dowloadLink]);

  return <></>;
};

export default DownloadApp;
