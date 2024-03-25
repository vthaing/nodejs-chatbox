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
    createdAt: string
}

export interface IConversation {
    id: string;
    name?: string;
    members: [string];
    owner?: string
    memberObjects: [IUser],
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
    brand?: IBrand | null
}
