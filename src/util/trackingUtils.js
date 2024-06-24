import { UBA_EVENT_NAME } from "./constant";

// Initializing the UBA
export const initTracking = (mainParams = {}, keyNames = {}) => {
  const defaultKeyNames = {};
  window.tracking.init({ ...defaultKeyNames, ...keyNames }, mainParams);
};

// Generic function for events call
export const doTracking = ubaTrackingData => {
  const payload = { uba: ubaTrackingData };
  if (!ubaTrackingData) {
    payload.uba = {
      ...ubaTrackingData,
      keyNames: {
        // fftid: 'SRP'
      },
    };
  }

  window.tracking.doTracking(payload);
};

// example of one uba util function like pageView
export const pageView = (payload = {}, eventName) => {
  const trackingData = {
    eventName,
    keyNames: {
      actionType: "Pageview",
      ...payload,
    },
  };
  doTracking(trackingData);
};

export const ctaClick = ({ payload = {}, eventName }) => {
  const trackingData = {
    eventName,
    keyNames: {
      actionType: "click",
      ...payload,
    },
  };
  doTracking(trackingData);
};

export const proctoringUBALogger = (verbose, label, keyNames) => {
  const trackingData = {
    eventName: UBA_EVENT_NAME.proctoringTracker,
    keyNames: {
      ...keyNames,
      actionType: "view",
      label,
      userType: "candidate",
      verbose,
    },
  };

  doTracking(trackingData);
};
