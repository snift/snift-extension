import { API_URL } from "../constants";
import { storageSet } from "../store";

export const fetchAndCacheScores = url => {
  const api = `${API_URL}?url=${url}`;
  fetch(api)
    .then(response => response.json())
    .then(json => storageSet(url, json));
};
