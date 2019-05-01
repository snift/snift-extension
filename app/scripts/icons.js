const SNIFTYCONS_PATH = "/assets/sniftycons";
const BADGE_PATH = "/assets/images/badges";

const icons = {
  sniftycons: {
    good: `${SNIFTYCONS_PATH}/sniftycon-happy-green.svg`,
    ok: `${SNIFTYCONS_PATH}/sniftycon-neutral-orange.svg`,
    poor: `${SNIFTYCONS_PATH}/sniftycon-red-sad.svg`
  },
  popup: {
    content: {
      error: "/assets/images/error.svg",
      loading: "/assets/images/loader.gif",
      notAvailable: "/assets/images/not-available.svg"
    },
    tab: {
      loading: "/assets/images/heart.gif"
    }
  },
  badges: {
    HTTP_SECURE: `${BADGE_PATH}/https-badge.svg`,
    XSS_PROTECT: `${BADGE_PATH}/xss-badge.svg`,
    CLICKJACKING_PROTECT: `${BADGE_PATH}/x-frame-badge.svg`,
    HTTPS_ONLY: `${BADGE_PATH}/hsts-badge.svg`,
    CSP_ENABLED: `${BADGE_PATH}/csp-badge.svg`,
    PUBLIC_KEY_PINNING_ENABLED: `${BADGE_PATH}/hpkp-badge.svg`,
    ENSURE_PRIVACY: `${BADGE_PATH}/rp-badge.svg`,
    NO_SNIFF: `${BADGE_PATH}/x-content-type-badge.svg`,
    LATEST_HTTP: `${BADGE_PATH}/http2-badge.svg`,
    LATEST_TLS: `${BADGE_PATH}/tls-version-badge.svg`,
    EMAIL_SPOOFING_PROTECT: `${BADGE_PATH}/spf-badge.svg`
  },
  default: "/assets/logo/icon.svg"
};

export default icons;
