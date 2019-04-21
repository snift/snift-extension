import axios from "axios";
import { API_URL, TOKEN_TTL } from "../constants";
import { storageSet, storageGet } from "../store";
import { getTokenDuration } from "./utils";

export const validateToken = token => {
  const duration = getTokenDuration(token.created_at, token.expiry);
  let isValid = duration <= TOKEN_TTL;
  return isValid;
};

export const getToken = async () => {
  browser.storage.local.clear();
  let token = await storageGet("token");
  if (!token || !token.value) {
    token = await fetchApiToken();
  }
  const isValid = validateToken(token);
  return isValid ? token : await fetchApiToken();
};

export const fetchApiToken = async () => {
  try {
    const params = {
      baseURL: API_URL
    };
    const response = await axios.get("/token", params);
    if (response.status !== 200) {
      throw new Error("Unable to fetch api token");
    }
    const tokenResponse = response.data;
    const { token, expiry_time } = tokenResponse;
    const storedToken = {
      value: token,
      expiry: expiry_time,
      created_at: Date.now()
    };
    await storageSet("token", storedToken);
    return storedToken;
  } catch (error) {
    throw error;
  }
};

export const fetchAndCacheScores = async domain => {
  try {
    const token = await getToken();
    const headers = {
      "Content-Type": "application/json",
      "X-Auth-Token": token.value
    };
    const response = await axios.post(`${API_URL}/scores`, { url: domain }, { headers: headers });
    if (response.status !== 200) {
      throw new Error("Unable to fetch scores");
    } else {
      const scores = await response.data;
      await storageSet(domain, scores);
      return scores;
    }
  } catch (error) {
    throw error;
  }
};
