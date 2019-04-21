import isEmpty from "is-empty";
export const store = browser.storage.local;

// TODO: Remove storage cache longer than 1 week.
export const storageGet = async key => {
  const response = await store.get(key);
  return isEmpty(response) ? null : response;
};

export const storageSet = async (key, value) => {
  return await store.set({ [key]: value });
};
