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

export const BADGE_SUBCATEGORIES = {
  NETWORK_PROTECTION: ["HTTP_SECURE", "HTTPS_ONLY", "LATEST_HTTP", "LATEST_TLS"],
  USER_PRIVACY: ["ENSURE_PRIVACY", "NO_SNIFF"],
  EAVESDROPPING_SPOOFING_PROTECTION: ["PUBLIC_KEY_PINNING_ENABLED", "EMAIL_SPOOFING_PROTECT"],
  CONTENT_SECURITY: ["CLICKJACKING_PROTECT", "CSP_ENABLED", "XSS_PROTECT"]
};

export const EXPLANATIONS = {
  HTTP_SECURE: "Encrypted HTTPS Connection",
  XSS_PROTECT: "Prevention from reflected Cross-Site Scripting (XSS) Attacks",
  CLICKJACKING_PROTECT: "Protection from Cross-Site Click Jacking Attacks",
  HTTPS_ONLY: "Enforces HTTPS-Only Site Access",
  CSP_ENABLED:
    "Protection against Cross Site Scripting (XSS), Data Injection and Packet Sniffing attacks",
  PUBLIC_KEY_PINNING_ENABLED:
    "Prevention against Man-in-the-Middle attacks(MITM) using forged certificates",
  ENSURE_PRIVACY:
    "Enforces a Referrer Policy to avoid leaking sensitive user information from being shared.",
  NO_SNIFF: "Prevention from media-type (MIME) sniffing",
  LATEST_HTTP: "Uses the latest version of the HTTP Protocol",
  LATEST_TLS: "Uses the latest version of the TLS Protocol",
  EMAIL_SPOOFING_PROTECT:
    "Prevention from Email Spoofing by having a valid Sender Policy Framework Record"
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
