const SUPPORTED_PROTOCOLS = ["http:", "https:"];

export const isProtocolSupported = protocol => {
  return SUPPORTED_PROTOCOLS.includes(protocol);
};
