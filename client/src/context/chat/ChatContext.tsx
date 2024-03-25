import React, { createContext, useReducer } from 'react'
import {ChatAction, chatReducer, ChatState, initialChatState} from './chatReducer';
import {IUser} from "../../auth/AuthContext";


export interface IMessage {
    id: string;
    to?: string;
    conversation?: string
    senderInfo: IUser
    messageContent: string;
    from: string;
    isPinnedMessage: boolean;
    attachments?: IAttachmentInfo[];
    mediaItems?: IMediaItem[];
    createdAt?: string;
}

export interface IMessageToSave {
    to?: string;
    conversation?: string
    senderInfo: IUser
    text: string;
    from: string;
    attachments: IAttachmentInfo[]
}

export interface IServerAlert {
    message: string,
    reasons: [string],
    forceLogout: boolean,
}

export interface IConversation {
    id: string;
    name?: string;
    members: [string];
    owner?: string
}

export enum ActiveChatTypesEnum  {
    DIRECT = 'direct',
    CHANNEL = 'conversation',
}

export interface IActiveChatPayload {
    type?: ActiveChatTypesEnum;
    activeChatId?: string
}

export interface IChatContext {
    chatState: ChatState;
    dispatch: React.Dispatch<ChatAction>;
}


export interface IAttachmentInfo {
    name: string,
    type: string,
    uid: string,
    size: number
}

export interface IMediaItem {
    id: string;
    messageId: string;
    mimeType: string;
    name: string;
    size: number;
    createdAt?: string;
    updatedAt?: string;
    url: string
    userId: string;
}



const initialChatContext = {
    chatState: initialChatState,
    dispatch: (action: ChatAction) => { }
} as IChatContext;



export const ChatContext = createContext(initialChatContext);


export const ChatProvider: React.FC<{ children: JSX.Element }> = ({ children }) => {

    const [chatState, dispatch] = useReducer(chatReducer, initialChatState);

    return (
        <ChatContext.Provider value={{
            chatState,
            dispatch,
        }}>
            {children}
        </ChatContext.Provider>
    )
}
