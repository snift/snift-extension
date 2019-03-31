import { fetchAndCacheScores } from "./api";
import { ERROR_MESSAGES } from "../constants";
import sniftycons from "./sniftycons";
import { storageGet } from "../store";
import { isProtocolSupported, fetchOrigin, findScoreRange } from "./utils";

const setDefaultIcon = () => {
  browser.browserAction.setIcon({ path: sniftycons.default });
};

const changeIconByScore = score => {
  const range = findScoreRange(score);
  browser.browserAction.setIcon({
    path: sniftycons[range]
  });
};

/**
 * tries to find scores for url from localStorage, also changes icon if score is found
 * else fetches from the api and caches them.
 * @param {*} url - origin url for which score has to be updated
 */
const findScore = async url => {
  try {
    const { origin, protocol } = new URL(url);
    if (isProtocolSupported(protocol)) {
      const data = await storageGet(origin);
      if (!data) throw new Error(ERROR_MESSAGES.data_unavailable);
      else {
        const { scores } = data[origin];
        changeIconByScore(scores.score);
      }
    } else {
      throw new Error(ERROR_MESSAGES.unsupported_protocol);
    }
  } catch (error) {
    throw error;
  }
};

// handle errors thrown by findScore
const handleScoreErrors = (err, url) => {
  const { data_unavailable, unsupported_protocol } = ERROR_MESSAGES;
  switch (err.message) {
    case data_unavailable:
      fetchAndCacheScores(url).then(json => changeIconByScore(json.scores.score));
      break;

    case unsupported_protocol:
      setDefaultIcon();
      break;

    default:
      console.error(err.message);
      break;
  }
};

// LISTENERS
// respond to async runtime event messages
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "update_icon") {
    changeIconByScore(message.value);
  }
});

// changeIcon whenever the activeTab is changed
browser.tabs.onActivated.addListener(activeInfo => {
  const activeTab = browser.tabs.get(activeInfo.tabId);
  activeTab.then(tab => {
    const url = fetchOrigin(tab.url);
    findScore(url).catch(err => handleScoreErrors(err, url));
  });
});

// recalculate score for a particular tab when the url in the tab changes or a new tab is added
browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  if (changeInfo.url) {
    const url = fetchOrigin(changeInfo.url);
    findScore(url).catch(err => handleScoreErrors(err, url));
  }
});
