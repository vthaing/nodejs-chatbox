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
    username: string;
    email: string;
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
