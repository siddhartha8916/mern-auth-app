/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "./axios-instance";

interface IGet {
  params?: any;
  query?: any;
}

type QueryParams = (url: string, payload?: IGet) => Promise<AxiosResponse>;

type MutationParams = (
  url: string,
  data?: object,
  payload?: IGet,
  config?: AxiosRequestConfig
) => Promise<AxiosResponse>;

type DeleteParams = (
  url: string,
  payload?: IGet,
  config?: AxiosRequestConfig
) => Promise<AxiosResponse>;

function populateParams(url: string, params?: object) {
  if (url.includes(":") && params) {
    for (const [key, value] of Object.entries(params)) {
      if (url.includes(":" + key)) {
        url = url.replace(":" + key, value);
      }
    }
  }
  return url;
}

function populateQuery(url: string, query?: object) {
  let queryString = "?";

  if (query) {
    const entries = Object.entries(query);

    entries.forEach((entry, index) => {
      const [key, value] = entry;
      queryString += `${key}=${value}`;

      if (index !== entries.length - 1) {
        queryString += `&`;
      }
    });
  }
  if (queryString !== "?") {
    return url + queryString;
  }
  return url;
}

const DEFAULT_PAYLOAD = { params: {}, query: {} };

class ApiClient {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  get: QueryParams = async (
    url,
    payload = DEFAULT_PAYLOAD
  ): Promise<AxiosResponse> => {
    const { params, query } = payload;

    url = populateParams(url, params);
    url = populateQuery(url, query);

    return this.api.get(url);
  };

  post: MutationParams = async (
    url,
    data,
    payload = DEFAULT_PAYLOAD,
    config = {}
  ) => {
    const { params, query } = payload;

    url = populateParams(url, params);
    url = populateQuery(url, query);

    return this.api.post(url, data, config);
  };

  put: MutationParams = async (
    url,
    data,
    payload = DEFAULT_PAYLOAD
  ): Promise<AxiosResponse> => {
    const { params, query } = payload;

    url = populateParams(url, params);
    url = populateQuery(url, query);

    return this.api.put(url, data);
  };

  patch: MutationParams = async (
    url,
    data,
    payload = DEFAULT_PAYLOAD
  ): Promise<AxiosResponse> => {
    const { params, query } = payload;

    url = populateParams(url, params);
    url = populateQuery(url, query);

    return this.api.patch(url, data);
  };
  delete: DeleteParams = async (
    url,
    payload = DEFAULT_PAYLOAD,
    config = {}
  ): Promise<AxiosResponse> => {
    const { params, query } = payload;

    url = populateParams(url, params);
    url = populateQuery(url, query);

    return this.api.delete(url, config);
  };
}

export const apiClient = new ApiClient(axiosInstance);
