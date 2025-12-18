import axios from "axios";

// Base URL will be provided by individual API calls
const BASE_URL = 'https://online-code.zephyrion.workers.dev';

const makeCallApi = ({
  url = "",
  method = "GET",
  params = {},
  data = {},
  headers = {},
}) => {
  const callApi = axios.create({
    baseURL: BASE_URL,
  });

  callApi.interceptors.request.use(
    (config) => {
      if (config.headers) {
        Object.assign(config.headers, {
          "Content-Type": "application/json",
          ...headers,
        });
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  return callApi({
    url,
    method,
    params,
    data,
  });
};

// CALL METHOD
export const apiGet = (url = "", query = {}, headers = {}) =>
  makeCallApi({
    method: "GET",
    url,
    params: query,
    headers,
  });

export const apiPost = (url = "", body = {}, headers = {}) =>
  makeCallApi({
    method: "POST",
    url,
    data: body,
    headers,
  });

export const apiPut = (url = "", body = {}, headers = {}) =>
  makeCallApi({
    method: "PUT",
    url,
    data: body,
    headers,
  });

export const apiDelete = (url = "", headers = {}) =>
  makeCallApi({
    method: "DELETE",
    url,
    headers,
  });

export default makeCallApi;
