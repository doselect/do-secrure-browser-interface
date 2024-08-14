export const CONFIGURE = 'CONFIGURE';
export const CONFIGURE_SHORTCUT_KEYS = 'CONFIGURE_SHORTCUT_KEYS';
export const INSTRUCTION_TEXT =
  'After clicking on “Proceed to Test”, please remember :';

export const INSTRUCTION_TEXT_SUB_PARTS = [
  'Once the test starts, you will not be allowed to move out of the browser or open any new tab in it, if you try to do so, your test will be suspended.',
  'Secure Browser will close all the currently running applications in your system. Please save your work accordingly',
];

export const DOWNLOAD_LINK_TEXT =
  'Do you have Doselect Secure Browser downloaded in your system?';
export const PROCEED_TEST_TEXT = 'Yes, Proceed to Test';

export const DOWNLOAD_BROWSER_TEXT = 'No, Download Secure Browser';
export const CONFIGURE_TITLE =
  'Please fix these issues to continue to assessment';

export const UBA_EVENT_NAME = {
  proctoringTracker: 'proctoringLog',
  LOG_INFO_EVENT: 'secure-browser-info',
  LOG_INFO_ERR: 'secure-browser-error',
};

export const PAGE_ROUTE = {
  CONFIGURE: 'configure',
  INSTRUCTION: 'instruction',
  TEST_ROUTE: 'testRoute',
  DOWNLOAD_APP: 'downloadApp',
};

export const COMMAND_STATUS = {
  RUNNING: 'running',
  NOT_EXECUTED: 'notExecuted',
  IN_PROGRESS: 'inProgress',
  SUCCESS: 'success',
};

export const getAppDownloadLink = (os) => {
  if (os === 'Linux') {
    return process.env.REACT_APP_DOWNLOAD_LINK_LINUX;
  }
  return process.env.REACT_APP_DOWNLOAD_LINK_WIN;
};
export const EVENTS_TO_ELECTRON = {
  SET_TEST_URL: 'SET_TEST_URL',
  CONFIGURE_DISPLAY: 'CONFIGURE_DISPLAY',
  BLOCK_GESTURES: 'BLOCK_GESTURES',
};
