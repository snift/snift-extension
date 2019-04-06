export const API_URL = "http://localhost:9700/scores";
export const ERRORS = {
  data_unavailable: "Unavailable data for requested origin. (Code: 4e8l)",
  unsupported_protocol: "Unsupported Protocol. (Code: 2da8)",
  server_error: "Unable to contact Server (Code: Ka9l)",
  unknown_error: "Unknown Error Occured (Code: UkNw)"
};
export const RANGES = {
  poor: 0.4,
  ok: 0.7,
  good: 1.0
};
export const SUPPORTED_PROTOCOLS = ["http:", "https:"];

export const RANGE_COLORS = {
  poor: "#ff5757",
  ok: "#ff7f50",
  good: "#07be53"
};
