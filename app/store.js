import isEmpty from "is-empty";
export const store = browser.storage.local;

export const storageGet = async key => {
  const response = await store.get(key);
  return isEmpty(response) ? null : response;
};

export const storageSet = async (key, value) => {
  store.set({ [key]: value });
};
