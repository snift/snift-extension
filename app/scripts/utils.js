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
