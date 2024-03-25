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
import {ConversationEdit, ConversationList, ConversationShow} from "./pages/conversation";
import {ConversationCreate} from "./pages/conversation/create";
import {BadWordCreate} from "./pages/bad-word/create";
import {BadWordEdit, BadWordList} from "./pages/bad-word";
import {RestrictedIpCreate} from "./pages/restricted-ip/create";
import {RestrictedIpEdit, RestrictedIpList} from "./pages/restricted-ip";

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
                    name: "conversations",
                    create: ConversationCreate,
                    list: ConversationList,
                    edit: ConversationEdit,
                    show: ConversationShow,
                    canDelete: true
                },
                {
                    name: "bad-words",
                    create: BadWordCreate,
                    list: BadWordList,
                    edit: BadWordEdit,
                    canDelete: true
                },
                {
                    name: "bad-words/categories"
                },
                {
                    name: "restricted-ips",
                    create: RestrictedIpCreate,
                    list: RestrictedIpList,
                    edit: RestrictedIpEdit,
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
