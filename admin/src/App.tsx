import {Refine} from "@pankod/refine-core";
import {
    notificationProvider,
    ErrorComponent,
    AuthPage
} from "@pankod/refine-antd";
import { Layout } from "components/layout";

import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router-v6";

import "@pankod/refine-antd/dist/reset.css";

import { DashboardPage } from "pages/dashboard";
import {UserList, UserShow} from "./pages/users";
import {API_URL, AUTH_USER_DATA_KEY} from "./constants";
import {authProvider} from "./authUtils/authProvider";
import {axiosInstance} from "./authUtils/axiosInstance";
import {ConversationEdit, ConversationList, ConversationShow} from "./pages/conversation";
import {BadWordCreate} from "./pages/bad-word/create";
import {BadWordEdit, BadWordList} from "./pages/bad-word";
import {RestrictedIpCreate} from "./pages/restricted-ip/create";
import {RestrictedIpEdit, RestrictedIpList} from "./pages/restricted-ip";
import {BrandCreate} from "./pages/brand/create";
import {BrandEdit, BrandList, BrandShow} from "./pages/brand";
import {AdminUserEdit, AdminUserList, AdminUserShow} from "./pages/admin-users";
import {AdminUserCreate} from "./pages/admin-users/create";
import {accessControlProvider} from "./authUtils/accessControlProvider";

const currentUser = localStorage.getItem(AUTH_USER_DATA_KEY)
const App: React.FC = () => {

    return (
        <Refine
            authProvider={ authProvider(axiosInstance) }
            dataProvider={dataProvider(API_URL, axiosInstance)}
            accessControlProvider={accessControlProvider}
            routerProvider={{
                ...routerProvider,
                routes: [
                    {
                        path: "/update-password",
                        element: <AuthPage type="updatePassword" />,
                    },
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
                    // create: ConversationCreate,
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
                {
                    name: "brands",
                    create: BrandCreate,
                    list: BrandList,
                    edit: BrandEdit,
                    show: BrandShow
                },
                {
                    name: 'user-ban-requests'
                },
                {
                    name: "admin-user",
                    list: AdminUserList,
                    edit: AdminUserEdit,
                    show: AdminUserShow,
                    create: AdminUserCreate,
                    canDelete: true,
                },
            ]}
            notificationProvider={notificationProvider}
            LoginPage={() => (
                <AuthPage registerLink={false} rememberMe={false} forgotPasswordLink={false}/>
            )}
            Layout={Layout}
            Title={() => <></>}
            catchAll={<ErrorComponent />}
        />
    );
};

export default App;
