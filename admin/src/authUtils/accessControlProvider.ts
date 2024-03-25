import {BaseKey, IResourceItem} from "@pankod/refine-core";
import {AUTH_USER_DATA_KEY} from "../constants";
import {IUser} from "../interfaces";
import {Roles} from "./roles";

type CanParams = {
    resource: string;
    action: string;
    params?: {
        resource?: IResourceItem;
        id?: BaseKey;
        [key: string]: any;
    };
};

type CanReturnType = {
    can: boolean;
    reason?: string;
}

const rawUserData = localStorage.getItem(AUTH_USER_DATA_KEY);
let userIdentity: IUser | null = null;
if (rawUserData) {
    userIdentity = JSON.parse(rawUserData)?.user;
}

export const accessControlProvider = {
    can: ({ resource, action, params }: CanParams): Promise<CanReturnType> => {
        console.log(userIdentity, 'userIdentity')
        console.log(resource);
        if (!userIdentity) {
            return Promise.resolve({ can: false, reason: 'Unauthorized' });
        }
        if (userIdentity.roles.includes(Roles.SUPER_ADMIN)) {
            return Promise.resolve({ can: true });
        }

        if (userIdentity.roles.includes(Roles.ADMIN) && resource === 'admin-user') {
            return Promise.resolve({ can: false, reason: 'Unauthorized' });
        }

        if ( !userIdentity.roles.includes(Roles.ADMIN)) {
            return Promise.resolve({ can: false, reason: 'Unauthorized' });
        }

        return Promise.resolve({ can: true });
    }
}