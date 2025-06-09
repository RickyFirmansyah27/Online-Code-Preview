import axios from "axios";

const BASE_URL = 'https://api.groq.com/openai';
// const BASE_URL = 'http://localhost:8000';

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
      config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
        ...headers,
      };
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
