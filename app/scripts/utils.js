import { RANGES, SUPPORTED_PROTOCOLS } from "../constants";

export const checkProtocolSupport = protocol => {
  return SUPPORTED_PROTOCOLS.includes(protocol);
};

export const findScoreRange = score => {
  let range = "good";
  const { poor, ok } = RANGES;
  if (score < poor) {
    range = "poor";
  } else if (score >= poor && score < ok) {
    range = "ok";
  }
  return range;
};

export const fetchOrigin = url => {
  return new URL(url).origin;
};

// TODO: we should probably do this using userAgent
export const fetchBrowserIcon = protocol => {
  const modifiedProtocol = protocol.replace(":", "");
  switch (modifiedProtocol) {
    case "chrome":
      return "/assets/images/chrome.png";

    case "about":
      return "/assets/images/firefox.png";

    default:
      break;
  }
};
