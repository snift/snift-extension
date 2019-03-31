import { fetchAndCacheScores } from "./api";
import { storageGet } from "../store";
import { isProtocolSupported } from "./utils";

const currentTab = browser.tabs.query({
  currentWindow: true,
  active: true
});

currentTab.then(tabs => {
  const tab = tabs[0];
  const { origin, protocol } = new URL(tab.url);
  const main = document.getElementById("score");
  if (isProtocolSupported(protocol)) {
    storageGet(origin).then(val => {
      if (val) {
        main.innerHTML = val[origin].scores.score * 100;
      } else {
        fetchAndCacheScores(origin);
      }
    });
  } else {
    main.innerHTML = "Protocol not supported";
    console.log("UNSUPPORTED PROTOCOL IN ACTIVE TAB");
  }
});

console.log(`'Allo 'Allo! Popup`);
