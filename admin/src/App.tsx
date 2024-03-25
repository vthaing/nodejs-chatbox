import { Refine, AuthProvider } from "@pankod/refine-core";
import {
    notificationProvider,
    Layout,
    ErrorComponent,
    AuthPage,
} from "@pankod/refine-antd";

import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router-v6";

import "@pankod/refine-antd/dist/reset.css";

import { DashboardPage } from "pages/dashboard";
import {UserEdit, UserList, UserShow} from "./pages/users";
import {API_URL} from "./constants";
import {authProvider} from "./authUtils/authProvider";
import {axiosInstance} from "./authUtils/axiosInstance";
import {ChannelEdit, ChannelList, ChannelShow} from "./pages/channel";
import {ChannelCreate} from "./pages/channel/create";
import {BadWordCreate} from "./pages/bad-word/create";
import {BadWordEdit, BadWordList} from "./pages/bad-word";

const App: React.FC = () => {

    return (
        <Refine
            authProvider={ authProvider(axiosInstance) }
            dataProvider={dataProvider(API_URL, axiosInstance)}
            routerProvider={{
                ...routerProvider,
                routes: [
                    // {
                    //     path: "/register",
                    //     element: (
                    //         <AuthPage type="register"/>
                    //     ),
                    // },
                    // {
                    //     path: "/forgot-password",
                    //     element: <AuthPage type="forgotPassword" />,
                    // },
                    // {
                    //     path: "/update-password",
                    //     element: <AuthPage type="updatePassword" />,
                    // },
                ],
            }}
            DashboardPage={DashboardPage}
            resources={[
                {
                    name: "user",
                    list: UserList,
                    // edit: UserEdit,
                    show: UserShow,
                },
                {
                    name: "channels",
                    create: ChannelCreate,
                    list: ChannelList,
                    edit: ChannelEdit,
                    show: ChannelShow,
                    canDelete: true
                },
                {
                    name: "bad-words",
                    create: BadWordCreate,
                    list: BadWordList,
                    edit: BadWordEdit,
                    canDelete: true
                },
            ]}
            notificationProvider={notificationProvider}
            LoginPage={() => (
                <AuthPage registerLink={false} rememberMe={false} forgotPasswordLink={false}/>
            )}
            Layout={Layout}
            catchAll={<ErrorComponent />}
        />
    );
};

export default App;
