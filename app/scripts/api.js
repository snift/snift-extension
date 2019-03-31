import { API_URL } from "../constants";
import { storageSet } from "../store";

export const fetchAndCacheScores = url => {
  return new Promise((resolve, reject) => {
    const api = `${API_URL}?url=${url}`;
    fetch(api)
      .then(response => response.json())
      .then(json => {
        storageSet(url, json).then(() => resolve(json));
      })
      .catch(err => reject(err));
  });
};
