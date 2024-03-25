export interface ICategory {
    id: number;
    title: string;
}
export interface IPost {
    id: number;
    title: string;
    content: string;
    status: "published" | "draft" | "rejected";
    category: { id: number };
}


export interface IUser {
    id: string;
    online: boolean;
    username?: string | null;
    email: string | null;
    displayName: string;
    brand?: IBrand | null;
    brandId?: string | null;
    brandStatus: boolean;
    isBanned: boolean;
    bannedTo: string | null;
    bannedFrom: string | null;
    externalId?: string | null
    createdAt: string
    ipHistory: IUserIp []
}

export interface IUserIp {
    ip: string
    time: string
}

export interface IConversation {
    id: string;
    name?: string;
    members: [string];
    owner?: string
    memberObjects: [IUser],
    brandId?: string | null;
    brandChannelId?: string | null;
    brandRoomId?: string | null;
    createdAt: string
}

export interface IBadWord {
    id: string;
    term: string;
    categories: [string];
    categoriesLabel: [string];
    createdAt: string
}

export interface IRestrictedIp {
    id: string;
    ip: string;
    enabled: boolean;
    notes?: string;
    createdAt: string
}

export interface IBrand {
    id: string;
    name: string;
    secretKey: string;
    createdAt: string
}


export interface IUserBanRequest {
    id: string;
    userId: User | string;
    duration?: number;
    reason?: string;
    type: string;
    typeLabel: string;
    isUnbanned: boolean;
    params: {};
    createdAt: string
}

export interface IBrandChannel {
    id: string;
    name?: string;
    brandId: string;
    externalId: string;
    createdAt: string
}

export interface IBrandRoom {
    id: string;
    name?: string;
    brandId: string;
    externalId: string;
    createdAt: string
    brandChannelId: string;
    externalBrandChannelId: string;
}

export interface IMessage {
    id: string;
    to?: string;
    conversation?: string
    senderInfo: IUser
    messageContent: string;
    from: string;
    createdAt?: string;
}