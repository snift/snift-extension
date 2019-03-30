import { storageGet } from "../store";
import { allTabs } from "./tabs";
import { isProtocolSupported } from "./utils";
import { fetchAndCacheScores } from "./api";
import { ERROR_MESSAGES } from "../constants";

const changeIconByScore = score => {
  if (score < 0.55) {
    browser.browserAction.setIcon({ path: "/assets/sniftycons/sniftycon-red-sad.svg" });
  } else if (score > 0.55 && score < 0.75) {
    browser.browserAction.setIcon({ path: "/assets/sniftycons/sniftycon-neutral-orange.svg" });
  } else {
    browser.browserAction.setIcon({ path: "/assets/sniftycons/sniftycon-happy-green.svg" });
  }
};

function setDefaultIcon() {
  browser.browserAction.setIcon({ path: "/assets/images/icon.svg" });
}

/**
 * checks for origin in localStorage and changes icon based on score value, else fetches from api and stores it.
 * @param {*} url - origin url for which score has to be updated
 */
const scoreUpdater = url => {
  return new Promise((resolve, reject) => {
    const { origin, protocol } = new URL(url);
    if (isProtocolSupported(protocol)) {
      storageGet(origin).then(data => {
        if (!data) reject(new Error(ERROR_MESSAGES.data_unavailable));
        else {
          const { scores } = data[origin];
          changeIconByScore(scores.score);
        }
      });
    } else {
      reject(new Error(ERROR_MESSAGES.unsupported_protocol));
    }
  });
};

// run background job for all tabs to get information upfront
allTabs.then(tabs => {
  for (let tab of tabs) {
    if (tab.url) {
      scoreUpdater(tab.url).catch(err => {
        if (err.message === ERROR_MESSAGES.data_unavailable) {
          fetchAndCacheScores(tab.url);
        } else if (err.message === ERROR_MESSAGES.unsupported_protocol) {
        } else console.error(err);
      });
    }
  }
});

// changeIcon whenever the activeTab is changed
browser.tabs.onActivated.addListener(function(activeInfo) {
  const activeTab = browser.tabs.get(activeInfo.tabId);
  activeTab.then(tab => {
    scoreUpdater(tab.url).catch(err => {
      setDefaultIcon();
      if (err.message === ERROR_MESSAGES.data_unavailable) {
        fetchAndCacheScores(tab.url);
      } else if (err.message === ERROR_MESSAGES.unsupported_protocol) {
        // show default logo
      } else console.error(err);
    });
  });
});

// recalculate score for a particular tab when the url in the tab changes or a new tab is added
function handleUpdated(tabId, changeInfo, tabInfo) {
  if (changeInfo.url) {
    // console.log("Tab: " + tabId + " URL changed to " + changeInfo.url);
    scoreUpdater(changeInfo.url).catch(err => {
      setDefaultIcon();
      if (err.message === ERROR_MESSAGES.data_unavailable) {
        fetchAndCacheScores(changeInfo.url);
      } else if (err.message === ERROR_MESSAGES.unsupported_protocol) {
        // TODO: show default logo
      } else console.error(err);
    });
  }
}

browser.tabs.onUpdated.addListener(handleUpdated);
