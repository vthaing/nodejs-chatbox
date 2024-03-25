import { AuthProvider } from "@pankod/refine-core";

import axios, { AxiosInstance } from "axios";
import {API_URL, TOKEN_KEY} from "../constants";

export const authProvider = (axiosInstance: AxiosInstance): AuthProvider => {
    return {
        login: async (user) => {
            try {
                const { data } = await axios.post(`${API_URL}/auth/login`, user);
                localStorage.setItem(TOKEN_KEY, data.access_token);
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
                return Promise.reject("/register");
            }
            return Promise.resolve();
        },
        checkAuth: () =>
            localStorage.getItem(TOKEN_KEY)
                ? Promise.resolve()
                : Promise.reject(),
        getPermissions: () => Promise.resolve(["admin"]),
        getUserIdentity: async () => {

            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                return Promise.reject();
            }

            //TODO: should get the user data from user/{id}
            const userInfo = await axiosInstance.get(`${API_URL}/user`);

            return Promise.resolve(userInfo.data.user);
        },


        register: (params) => {
            if (params.email && params.password) {
                localStorage.setItem("email", params.email);
                return Promise.resolve();
            }
            return Promise.reject();
        },
        updatePassword: (params) => {
            if (params.newPassword) {
                //we can update password here
                return Promise.resolve();
            }
            return Promise.reject();
        },
        forgotPassword: (params) => {
            if (params.email) {
                //we can send email with forgot password link here
                return Promise.resolve();
            }
            return Promise.reject();
        },

    } as AuthProvider;
};