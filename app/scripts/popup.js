import { fetchAndCacheScores } from "./api";
import { storageGet } from "../store";
import { checkProtocolSupport, findScoreRange, fetchBrowserIcon } from "./utils";
import gauge from "./gauge";
import { RANGE_COLORS, ERRORS, INTERNAL_BROWSER_SCHEMES, BADGE_CATEGORIES } from "../constants";
import icons from "./icons";
import Colors from "./colors";

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
      msg = "Loading Snift Scores";
      break;

    case ERRORS.unknown_error:
      msg = "The site could not be reached due to an unknown error.";
      break;

    case ERRORS.score_error:
      msg = "Unable to calculate Snift Score for the domain";
      break;

    case ERRORS.unsupported_protocol:
      msg = "Snift Scores are available only on regular websites";
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

  document.querySelector("body").style.backgroundColor = Colors.mediumGrey;
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
    [0.0, Colors.red],
    [0.3, Colors.lightRed],
    [0.4, Colors.orange],
    [0.69, Colors.lightOrange],
    [0.7, Colors.lightSpringGreen],
    [1.0, Colors.springGreen]
  ],
  strokeColor: Colors.lightGrey,
  generateGradient: true
};

const renderScoreGauge = (siteScore, disableAnimation = true) => {
  const $gaugeContainer = document.getElementById("snift-gauge");
  const scoreGauge = new Gauge($gaugeContainer).setOptions(gaugeOptions);
  scoreGauge.animationSpeed = disableAnimation ? 1 : 10;
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

const calculateBadgeScores = badgeCategories => {
  const badgeScores = {};
  badgeCategories.forEach(category => {
    if (badgeScores[category]) badgeScores[category]++;
    else badgeScores[category] = 1;
  });
  return badgeScores;
};

const renderBadges = badges => {
  const $badgeListContainer = document.getElementById("badge-list");
  const badgeScores = calculateBadgeScores(badges.map(badge => badge.category));

  Object.keys(BADGE_CATEGORIES).forEach(badgeCategory => {
    const $badgeItem = document.createElement("li");
    $badgeItem.setAttribute("class", "badge-item");

    const $badgeImage = document.createElement("div");
    $badgeImage.setAttribute("class", "badge-image");
    $badgeImage.setAttribute("alt", badgeCategory);

    const $badgeContents = document.createElement("div");
    $badgeContents.setAttribute("class", "badge-contents-container");

    const isBadgeAvailable = !!badgeScores[badgeCategory];
    const badgeNotAvailableImageSrc = `NO_${badgeCategory}`;
    const badgeImageSource = isBadgeAvailable
      ? icons.badges[badgeCategory]
      : icons.badges[badgeNotAvailableImageSrc];

    $badgeImage.style.setProperty("background-image", `url("${badgeImageSource}")`);

    const $badgeCategory = document.createElement("p");
    $badgeCategory.setAttribute("class", "badge-category");

    let badgeCategoryText = BADGE_CATEGORIES[badgeCategory];
    if (!isBadgeAvailable) {
      badgeCategoryText = `Bad ${badgeCategoryText}`;
      const regex = /Policies|Protection|Headers/;
      if (!regex.test(badgeCategoryText)) {
        badgeCategoryText = `${badgeCategoryText} Headers`;
      }
    }

    $badgeCategory.innerText = badgeCategoryText;

    $badgeContents.appendChild($badgeImage);
    $badgeContents.appendChild($badgeCategory);

    $badgeItem.appendChild($badgeContents);
    $badgeListContainer.appendChild($badgeItem);
  });
};

const render = (val, isCached = false) => {
  let siteScore, siteBadges;
  if (val && val.scores) {
    siteScore = val.scores.score * 100;
    siteBadges = val.scores.badges;
  }
  if (!siteScore || !siteBadges) {
    handlePopupError(score_error);
  } else {
    renderScoreGauge(siteScore, isCached);
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
          render(val, true);
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
