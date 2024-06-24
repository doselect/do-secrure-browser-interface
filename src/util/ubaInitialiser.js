/**
 Types of tracking:-
 UBA
 Error - called as nlogger
 HeatMap
 TNM
 */

/**
Syntax of ntrack function:
Tracking covered in nTrack- UBA
nTrack(
    {
        uba:ubaObject,   //uba Object - Already populated Object
    }
)
eg:

nTrack({
  uba:{
    pageName:'applyHistory',
    eventName:'applyHistoryView',
    keyNames:{
      actionType:"view",
      referrer: this.props.route.previous
    }
  }
});
*/

export function uba({ eventName, ubaData }) {
  try {
    window.ub.track(eventName, ubaData);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * This is a common tracking function mainly responsible to send all kind of tracking
 * like 'newMonk tracking', 'GA tracking', 'UBA tracking' to server(naukri or third party(google)).
 */
export function nTrack(obj) {
  try {
    // trigger uba
    if (obj && obj.uba) {
      uba(obj.uba);
    }
  } catch (e) {
    console.warn(e);
  }
}

/** Singleton Service for page(eg:JD) tracking for common uba parameters */
const tracking = (function () {
  let commonUbaData = {};
  let pageName;

  const init = (keyNames = {}, mainParams = {}) => {
    commonUbaData = { ...commonUbaData, ...keyNames };
    pageName = mainParams.pageName || pageName;
  };

  const populateUbaObj = (pagename, commonUbaDataObj, keyNames) => {
    /**
     * The below code is written to pass correct referrer when the user opens the app.
     * We are passing document.referrer only for 1st time in the UBA call, afterwards route.previous is getting passed
     */

    let ubaReferrer;
    if (window.referrer && window.referrer.UBA !== undefined) {
      ubaReferrer = window.referrer.UBA;
      window.referrer.UBA = undefined;
    } else if (keyNames && keyNames.referrer) {
      ubaReferrer = keyNames.referrer;
    }

    return {
      pageName: pagename,
      ...commonUbaDataObj,
      ...keyNames,
      referrer: ubaReferrer || document.referrer,
    };
  };

  const doTracking = trackingData => {
    let ubaObj;

    if (trackingData.uba && trackingData.uba.constructor === Array) {
      const ubaArr = [];
      const eventslen = trackingData.uba.length;
      trackingData.uba.forEach(obj => {
        const tempObj = {
          eventName: obj.eventName,
          ...populateUbaObj(pageName, commonUbaData, obj.keyNames),
          eventType: "bulk",
          eventslen,
        };
        ubaArr.push(tempObj);
      });
      ubaObj = {
        ubaData: ubaArr,
      };
    } else if (trackingData.uba) {
      ubaObj = {
        eventName: trackingData.uba.eventName,
        ubaData: populateUbaObj(
          pageName,
          commonUbaData,
          trackingData.uba.keyNames
        ),
      };
    }

    if (ubaObj) {
      nTrack({
        ...trackingData,
        uba: ubaObj,
      });
    } else {
      nTrack(trackingData);
    }
  };

  return { init, doTracking };
})();

window.tracking = tracking;
