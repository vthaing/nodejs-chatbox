import { AuthProvider } from "@pankod/refine-core";

import axios, { AxiosInstance } from "axios";
import {API_URL, TOKEN_KEY} from "../constants";

export const authProvider = (axiosInstance: AxiosInstance): AuthProvider => {
    return {
        login: async ({
            user,
        }: {
            user: { email: string; password: string };
        }) => {
            try {
                const { data } = await axios.post(`${API_URL}/auth/login`, {
                    user,
                });

                localStorage.setItem(TOKEN_KEY, data.user.token);
            } catch (error) {
                return Promise.reject(error);
            }

            return Promise.reject();
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
            localStorage.getItem("email")
                ? Promise.resolve()
                : Promise.reject(),
        getPermissions: () => Promise.resolve(["admin"]),
        getUserIdentity: async () => {
            return Promise.resolve({
                id: 1,
                name: "Jane Doe",
                avatar: "https://unsplash.com/photos/IWLOvomUmWU/download?force=true&w=640",
            });


            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                return Promise.reject();
            }

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