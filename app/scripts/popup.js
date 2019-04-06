import { fetchAndCacheScores } from "./api";
import { storageGet } from "../store";
import { checkProtocolSupport, findScoreRange } from "./utils";
import gauge from "./gauge";
import { RANGE_COLORS, ERRORS } from "../constants";

const { Gauge, TextRenderer } = gauge;
const { unknown_error, server_error, unsupported_protocol } = ERRORS;

const currentTab = browser.tabs.query({
  currentWindow: true,
  active: true
});

function showError(type) {
  const $siteErrorContainer = document.querySelector(".site-error");
  const $errorMessage = document.getElementById("error-message");
  const $scoreContainer = document.getElementById("score-container");
  $siteErrorContainer.style.display = "flex";
  $scoreContainer.style.display = "none";

  let msg = "";
  if (type === ERRORS.unknown_error) {
    msg = "The site could not be reached due to an unknown error.";
  } else if (type === ERRORS.unsupported_protocol) {
    msg = "snift scores are available only on regular websites";
  }
  $errorMessage.innerText = msg;
}

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

currentTab.then(tabs => {
  const tab = tabs[0];
  const { origin, protocol, hostname } = new URL(tab.url);
  const isProtocolSupported = checkProtocolSupport(protocol);
  const $siteUrl = document.getElementById("site-url");
  const $siteFavicon = document.getElementById("site-favicon");
  $siteUrl.innerText = isProtocolSupported ? hostname : origin;
  // set favicon
  const faviconUrl = tab.favIconUrl;
  const faviconSource =
    faviconUrl && faviconUrl.length > 0 ? faviconUrl : "../assets/images/icon-38.png";
  $siteFavicon.setAttribute("src", faviconSource);
  if (isProtocolSupported) {
    storageGet(origin).then(function(val) {
      if (val) {
        const siteScore = val && val[origin] ? val[origin].scores.score * 100 : -1;
        siteScore === -1 ? showError(unknown_error) : renderScoreGauge(siteScore);
      } else {
        fetchAndCacheScores(origin);
      }
    });
  } else {
    showError(unsupported_protocol);
  }
});
