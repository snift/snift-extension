import Colors from "./scripts/colors";

export const API_URL = "http://localhost.snift.io:9700";
export const TOKEN_TTL = 23; // token lives for 23 hours
export const ERRORS = {
  data_unavailable: "Unavailable data for requested origin. (Code: 4e8l)",
  unsupported_protocol: "Unsupported Protocol. (Code: 2da8)",
  server_error: "Unable to contact Server (Code: Ka9l)",
  unknown_error: "Unknown Error Occured (Code: UkNw)",
  score_error: "Unable to calculate score (Code: ScAs)"
};

export const BADGE_CATEGORIES = {
  NETWORK_PROTECTION: "Network Protection",
  USER_PRIVACY: "User Privacy",
  EAVESDROPPING_SPOOFING_PROTECTION: "Email Spoofing & MITM Protection",
  CONTENT_SECURITY: "Content Security"
};

export const RANGES = {
  poor: 0.4,
  ok: 0.7,
  good: 1.0
};
export const SUPPORTED_PROTOCOLS = ["http:", "https:"];
export const INTERNAL_BROWSER_SCHEMES = ["about:", "chrome:", "opera:"];
export const RANGE_COLORS = {
  poor: Colors.lightRed,
  ok: Colors.mediumOrange,
  good: Colors.darkSpringGreen
};
