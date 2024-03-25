import axios, { AxiosRequestConfig } from "axios";
import {TOKEN_KEY} from "../constants";


const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        if (request.headers) {
            request.headers["Authorization"] = `Bearer ${token}`;
        } else {
            request.headers = {
                Authorization: `Bearer ${token}`,
            };
        }
    }

    return request;
});

export {axiosInstance}