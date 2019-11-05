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
    NETWORK_PROTECTION: `${BADGE_PATH}/network-protection.svg`,
    NO_NETWORK_PROTECTION: `${BADGE_PATH}/no-network-protection.svg`,
    CONTENT_SECURITY: `${BADGE_PATH}/content-security.svg`,
    NO_CONTENT_SECURITY: `${BADGE_PATH}/no-content-security.svg`,
    USER_PRIVACY: `${BADGE_PATH}/user-privacy.svg`,
    NO_USER_PRIVACY: `${BADGE_PATH}/no-user-privacy.svg`,
    EAVESDROPPING_SPOOFING_PROTECTION: `${BADGE_PATH}/eavesdropping-spoofing-protection.svg`,
    NO_EAVESDROPPING_SPOOFING_PROTECTION: `${BADGE_PATH}/no-eavesdropping-spoofing-protection.svg`,

    // Network Protection
    HTTP_SECURE: `${BADGE_PATH}/https-badge.svg`,
    HTTPS_ONLY: `${BADGE_PATH}/hsts-badge.svg`,
    LATEST_HTTP: `${BADGE_PATH}/http2-badge.svg`,
    LATEST_TLS: `${BADGE_PATH}/tls-version-badge.svg`,
    // Content Security
    CSP_ENABLED: `${BADGE_PATH}/csp-badge.svg`,
    XSS_PROTECT: `${BADGE_PATH}/xss-badge.svg`,
    CLICKJACKING_PROTECT: `${BADGE_PATH}/x-frame-badge.svg`,
    // User Privacy
    NO_SNIFF: `${BADGE_PATH}/x-content-type-badge.svg`,
    ENSURE_PRIVACY: `${BADGE_PATH}/rp-badge.svg`,
    // Eavesdropping and Spoofing Protection
    PUBLIC_KEY_PINNING_ENABLED: `${BADGE_PATH}/hpkp-badge.svg`,
    EMAIL_SPOOFING_PROTECT: `${BADGE_PATH}/spf-badge.svg`
  },
  default: "/assets/logo/icon.svg"
};

export default icons;
