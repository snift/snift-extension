import isEmpty from "is-empty";
export const store = browser.storage.local;

const STORAGE_TTL = 1; // in days

const isResponseExpired = ({ timestamp }) => {
  if (!timestamp) return false;
  const diff = Date.now() - timestamp;
  const differenceInDays = Math.floor(diff / 1000 / 60 / 60 / 24);
  return differenceInDays >= STORAGE_TTL;
};

// TODO: Remove storage cache longer than 1 week.
export const storageGet = async key => {
  const response = await store.get(key);
  return isEmpty(response) || isResponseExpired(response) ? null : response[key];
};

export const storageSet = async (key, value) => {
  const timestamp = Date.now();
  return await store.set({ [key]: value, timestamp });
};
