import { fetchAndCacheScores } from "./api";
import { ERRORS } from "../constants";
import icons from "./icons";
import { storageGet } from "../store";
import { checkProtocolSupport, fetchOrigin, findScoreRange } from "./utils";

export const setDefaultIcon = () => {
  browser.browserAction.setIcon({ path: icons.default });
};

const notify = action => {
  // ignore notifier errors when popup isnt open
  browser.runtime.sendMessage({ ...action }).catch(() => browser.runtime.lastError);
};

const changeIconByScore = score => {
  const range = findScoreRange(score);
  browser.browserAction.setIcon({
    path: icons.sniftycons[range]
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
    if (checkProtocolSupport(protocol)) {
      const data = await storageGet(origin);
      if (!data) throw new Error(ERRORS.data_unavailable);
      else {
        const { score } = data.scores;
        changeIconByScore(score);
      }
    } else {
      throw new Error(ERRORS.unsupported_protocol);
    }
  } catch (error) {
    throw error;
  }
};

// handle errors thrown by findScore
const handleScoreErrors = (err, url) => {
  switch (err.message) {
    case ERRORS.data_unavailable:
      fetchAndCacheScores(url).then(json => changeIconByScore(json.scores.score));
      break;

    default:
      setDefaultIcon();
      console.error(err.message);
      break;
  }
};

// LISTENERS

// changeIcon whenever the activeTab is changed
browser.tabs.onActivated.addListener(activeInfo => {
  const activeTab = browser.tabs.get(activeInfo.tabId);
  activeTab.then(tab => {
    const url = fetchOrigin(tab.url);
    // browser returns a "null" string value when origin is unavailable
    if (!url || url !== "null") {
      findScore(url).catch(err => handleScoreErrors(err, url));
    } else {
      setDefaultIcon();
    }
  });
});

// recalculate score for a particular tab when the url in the tab changes or a new tab is added
browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  // set site-favicon once available
  if (changeInfo.favIconUrl) {
    notify({ action: "set_favicon", faviconUrl: changeInfo.favIconUrl });
  }

  if (changeInfo.url) {
    const url = fetchOrigin(changeInfo.url);
    if (!url || url !== "null") {
      findScore(url).catch(err => handleScoreErrors(err, url));
    } else {
      setDefaultIcon();
    }
  }
});
