import { AuthProvider } from "@pankod/refine-core";

import axios, { AxiosInstance } from "axios";
import {API_URL, AUTH_USER_DATA_KEY, TOKEN_KEY} from "../constants";

export const authProvider = (axiosInstance: AxiosInstance): AuthProvider => {
    return {
        login: async (user) => {
            try {
                const { data } = await axios.post(`${API_URL}/auth/login`, user);
                localStorage.setItem(TOKEN_KEY, data.access_token);
                localStorage.setItem(AUTH_USER_DATA_KEY, JSON.stringify(data))
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        },
        logout: (props) => {
            localStorage.removeItem(TOKEN_KEY);
            return Promise.resolve();
        },
        checkError: (error) => {
            if (error?.response?.status === 401) {
                return Promise.reject("/login");
            }
            return Promise.resolve();
        },
        checkAuth: () =>
            localStorage.getItem(TOKEN_KEY)
                ? Promise.resolve()
                : Promise.reject(),
        getPermissions: () => {
            const auth = localStorage.getItem(AUTH_USER_DATA_KEY);
            if (auth) {
                const parsedAuth = JSON.parse(auth);
                if (!parsedAuth.user) {
                    return Promise.reject();
                }
                return Promise.resolve(parsedAuth.user.roles);
            }
            return Promise.reject();
        },
        getUserIdentity: async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                return Promise.reject();
            }

            const userInfo = await axiosInstance.get(`${API_URL}/user/me`);

            return Promise.resolve({...userInfo.data, name: userInfo.data.displayName});
        },


        // register: (params) => {
        //     if (params.email && params.password) {
        //         localStorage.setItem("email", params.email);
        //         return Promise.resolve();
        //     }
        //     return Promise.reject();
        // },
        updatePassword: async (params) => {
            console.log(params);
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                return Promise.reject();
            }

            const result = await axiosInstance.patch(`${API_URL}/user/me/update-password`, {newPassword: params.password});
            if (result.statusText === 'OK') {
                return Promise.resolve('/');
            }

            return Promise.reject();
        },
        // forgotPassword: (params) => {
        //     if (params.email) {
        //         //we can send email with forgot password link here
        //         return Promise.resolve();
        //     }
        //     return Promise.reject();
        // },

    } as AuthProvider;
};