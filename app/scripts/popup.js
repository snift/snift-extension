import { fetchAndCacheScores } from "./api";
import { storageGet } from "../store";
import { checkProtocolSupport, findScoreRange, fetchBrowserIcon } from "./utils";
import gauge from "./gauge";
import { RANGE_COLORS, ERRORS, INTERNAL_BROWSER_SCHEMES } from "../constants";
import icons from "./icons";

const { Gauge, TextRenderer } = gauge;
const { score_error, unsupported_protocol, data_unavailable } = ERRORS;

function handleNotification(notification, sender, sendResponse) {
  if (notification.action === "set_favicon") {
    const $siteFavicon = document.getElementById("site-favicon");
    const currentFavicon = $siteFavicon.getAttribute("src");
    const nextFavicon = notification.faviconUrl;
    // set favicon if its different.
    if (nextFavicon !== currentFavicon) {
      $siteFavicon.setAttribute("src", notification.faviconUrl);
    }
  }
}

browser.runtime.onMessage.addListener(handleNotification);

const handlePopupError = type => {
  const $siteErrorContainer = document.querySelector(".site-error");
  const $errorMessage = document.getElementById("error-message");
  const $scoreContainer = document.getElementById("score-container");
  const $badgeContainer = document.getElementById("badge-container");

  const $errorImage = document.getElementById("error-image");
  $siteErrorContainer.style.display = "flex";
  $scoreContainer.style.display = "none";
  $badgeContainer.style.visibility = "hidden";

  let isLoading = false;
  let msg = "";

  switch (type) {
    case ERRORS.data_unavailable:
      isLoading = true;
      msg = "loading snift scores";
      break;

    case ERRORS.unknown_error:
      msg = "The site could not be reached due to an unknown error.";
      break;

    case ERRORS.score_error:
      msg = "Unable to calculate score for the domain";
      break;

    case ERRORS.unsupported_protocol:
      msg = "snift scores are available only on regular websites";
      break;

    default:
      msg = "Sorry! An unknown error occured.";
      break;
  }
  $errorMessage.innerText = msg;
  const popupIcons = icons.popup;
  const errorImageSource = isLoading ? popupIcons.content.loading : popupIcons.content.error;
  $errorImage.setAttribute("src", errorImageSource);
  // disable popup interaction
  const $mainContainer = document.querySelector(".main");
  $mainContainer.classList.add("disable");
};

// TODO: move colors into theme file
const gaugeOptions = {
  lines: 10,
  angle: 0,
  lineWidth: 0.15,
  // hiding the pointer
  pointer: {
    length: 0,
    strokeWidth: 0,
    color: "transparent"
  },
  limitMin: false,
  limitMax: true,
  percentColors: [
    [0.0, "#ff0000"],
    [0.3, "#ff5757"],
    [0.4, "#ff6a33"],
    [0.69, "#ff895e"],
    [0.7, "#3edd80"],
    [1.0, "#00d370"]
  ], // !!!!
  strokeColor: "#ebebeb",
  generateGradient: true
};

const renderScoreGauge = siteScore => {
  const $gaugeContainer = document.getElementById("snift-gauge");
  const scoreGauge = new Gauge($gaugeContainer).setOptions(gaugeOptions);
  scoreGauge.animationSpeed = 10;
  scoreGauge.setMinValue(0);
  scoreGauge.maxValue = 100;

  const $scoreLabel = document.getElementById("score-label");
  // observe score and change color
  const sniftScoreRenderer = new TextRenderer(document.getElementById("snift-score"));
  sniftScoreRenderer.render = function(gauge) {
    const score = Math.floor(gauge.displayedValue);
    if (this) {
      this.el.innerHTML = score;
      const range = findScoreRange(score / 100);
      const currentColor = this.el.style.color;
      const rangeColor = RANGE_COLORS[range];
      if (currentColor !== rangeColor) {
        this.el.style.color = rangeColor;
        $scoreLabel.style.color = rangeColor;
      }
    }
  };
  scoreGauge.setTextField(sniftScoreRenderer);
  scoreGauge.set(siteScore);
};


const rangeToCssFilter = range => {
  switch (range) {
    // #3edd80
    case "good":
      return "invert(73%) sepia(74%) saturate(447%) hue-rotate(82deg) brightness(60%) contrast(80%)";

    // #ff6a33
    case "ok":
      return "invert(56%) sepia(66%) saturate(2908%) hue-rotate(337deg) brightness(90%) contrast(120%)";

    // #ff5757
    case "poor":
      return "invert(53%) sepia(88%) saturate(1718%) hue-rotate(323deg) brightness(97%) contrast(107%)";

    default:
      break;
  }
};

const rangeToBackground = range => {
  switch (range) {
    // #3edd80
    case "good":
      return "rgb(200, 255, 223)";

    // #ff6a33
    case "ok":
      return "rgb(255, 226, 216)";

    // #ff5757
    case "poor":
      return "rgb(255, 204, 204)";

    default:
      break;
  }
};

const renderBadges = badges => {
  const $badgeListContainer = document.getElementById("badge-list");
  const badgeBackgroundColor = rangeToBackground("good");
  const badgeImageColor = rangeToCssFilter("good");
  // const { badgeColor, badgeBackground } = getBadgeColors(score);
  badges.forEach(badge => {
    const badgeId = badge.name;
    const $badgeItem = document.createElement("li");
    $badgeItem.setAttribute("class", "badge-item");
    $badgeItem.style.setProperty("background-color", badgeBackgroundColor);
    // $badgeItem.innerText = badge.name;
    const $badgeImage = document.createElement("img");
    $badgeImage.setAttribute("class", "badge-image");
    $badgeImage.setAttribute("src", icons.badges[badgeId]);

    $badgeImage.style.setProperty("filter", badgeImageColor);
    $badgeItem.appendChild($badgeImage);
    $badgeListContainer.appendChild($badgeItem);
  });
};

const render = val => {
  let siteScore, siteBadges;
  if (val && val.scores) {
    siteScore = val.scores.score * 100;
    siteBadges = val.scores.badges;
  }
  if (!siteScore || !siteBadges) {
    handlePopupError(score_error);
  } else {
    renderScoreGauge(siteScore);
    renderBadges(siteBadges, siteScore);
  }
};

const currentTab = browser.tabs.query({
  currentWindow: true,
  active: true
});

currentTab.then(tabs => {
  for (let tab of tabs) {
    const { origin, protocol, hostname } = new URL(tab.url);
    const isProtocolSupported = checkProtocolSupport(protocol);
    const isBrowserScheme = INTERNAL_BROWSER_SCHEMES.includes(protocol);
    const $siteUrl = document.getElementById("site-url");
    const $siteFavicon = document.getElementById("site-favicon");
    const $scoreContainer = document.getElementById("score-container");
    const $siteErrorContainer = document.querySelector(".site-error");
    // disable popup interaction
    const $mainContainer = document.querySelector(".main");
    $siteUrl.innerText = isProtocolSupported && !isBrowserScheme ? hostname : tab.url;
    // set favicon
    const faviconUrl = tab.favIconUrl;
    let faviconSource = faviconUrl && faviconUrl.length > 0 ? faviconUrl : icons.popup.tab.loading;
    if (isBrowserScheme) {
      faviconSource = fetchBrowserIcon(protocol);
    }
    $siteFavicon.setAttribute("src", faviconSource);
    if (isProtocolSupported) {
      storageGet(origin).then(function(val) {
        if (val) {
          if ($siteErrorContainer.style.display !== "none") {
            $siteErrorContainer.style.display = "none";
          }
          render(val);
        } else {
          handlePopupError(data_unavailable);
          fetchAndCacheScores(origin)
            .then(json => {
              $siteErrorContainer.style.display = "none";
              $scoreContainer.style.display = "flex";
              $mainContainer.classList.remove("disable");
              renderScoreGauge(json.scores.score * 100);
            })
            .catch(err => {
              if (err) {
                handlePopupError(score_error);
              }
            });
        }
      });
    } else {
      handlePopupError(unsupported_protocol);
    }
  }
});
